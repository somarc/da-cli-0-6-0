/* eslint-disable no-console, import/no-extraneous-dependencies, no-use-before-define, max-len, no-restricted-syntax, no-await-in-loop, no-nested-ternary, object-curly-newline, no-shadow */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const configPath = join(root, 'dogfood', 'provenance-config.json');
const manifestPath = join(root, 'dogfood', 'provenance.json');
const schemaPath = join(root, 'dogfood', 'provenance.schema.json');
const canonicalPath = join(root, 'dogfood', 'canonical-pages.txt');
const livenessPath = join(root, 'dogfood', 'evidence', 'provenance', 'liveness.json');
const write = process.argv.includes('--write');
const live = process.argv.includes('--live');
const strictFreeze = process.argv.includes('--strict-freeze');

const config = await readJson(configPath);
const canonicalPaths = await readLines(canonicalPath);
const manifest = await generateManifest(config, canonicalPaths);
const schema = await readJson(schemaPath);
validateSchema(schema, manifest);
await validateSemantics(manifest, canonicalPaths, { strictFreeze });

if (write) {
  await writeJson(manifestPath, manifest);
  console.log(`wrote ${relative(manifestPath)} (${manifest.artifacts.length} artifacts)`);
} else {
  const checked = await readJson(manifestPath);
  if (stableJson(checked) !== stableJson(manifest)) {
    throw new Error('dogfood/provenance.json is stale; run `npm run provenance:write` and review the diff');
  }
  console.log(`provenance check passed: ${canonicalPaths.length} canonical paths, ${manifest.artifacts.length} total artifacts`);
}

if (live) {
  const report = await checkLiveness(manifest);
  if (write) await writeJson(livenessPath, report);
  report.checks.forEach((row) => console.log(`${row.status} ${row.tier} ${row.path} -> ${row.finalUrl}`));
  if (!report.ok) throw new Error(`provenance liveness failed:\n${report.errors.join('\n')}`);
  console.log(`provenance liveness passed: ${report.checks.length} public URLs`);
}

async function generateManifest(input, pages) {
  const pipelineEntries = await Promise.all(Object.entries(input.pipelines).map(async ([name, pipeline]) => {
    const evidence = await Promise.all(pipeline.evidence.map(evidenceRef));
    return [name, {
      path: pipeline.path,
      sha256: await fileSha(pipeline.path),
      runId: pipeline.runId,
      cliSha: pipeline.cliSha,
      evidence,
    }];
  }));
  const pipelines = Object.fromEntries(pipelineEntries);
  const canonicalEvidence = uniqueEvidence([
    ...pipelines.certification.evidence,
    ...pipelines.promotion.evidence,
  ]);
  const artifacts = pages.map((pagePath) => canonicalPage(pagePath, input, pipelines, canonicalEvidence));
  for (const supporting of input.supportingArtifacts) {
    artifacts.push(await supportingArtifact(supporting, input, pipelines));
  }
  return {
    schemaVersion: 'da-cli.dogfood-provenance.v1',
    release: input.release,
    site: input.site,
    contentAuthority: input.contentAuthority,
    candidate: input.candidate,
    freeze: input.freeze,
    pipelines,
    canonicalManifest: {
      path: 'dogfood/canonical-pages.txt',
      sha256: await fileSha('dogfood/canonical-pages.txt'),
      count: pages.length,
    },
    artifacts,
    historicalEvidence: input.historicalEvidence,
  };
}

function canonicalPage(pagePath, input, pipelines, evidence) {
  const stem = pagePath.replace(/\.html$/, '');
  const id = `da-page:${stem.replace(/^\//, '').replace(/[^a-z0-9]+/g, '-')}`;
  return {
    id,
    path: pagePath,
    kind: 'da-document',
    ownership: 'da-source',
    releaseScope: 'canonical',
    source: {
      uri: `da://${input.contentAuthority.org}/${input.contentAuthority.repo}${pagePath}`,
      contentType: 'text/html',
    },
    commands: [
      commandBinding('certification', ['preview-da-tree', 'freshness-gate'], pipelines),
      commandBinding('promotion', ['publish-canonical-pages', 'live-freshness'], pipelines),
    ],
    evidence,
    delivery: {
      mode: 'byte-parity',
      requireParity: true,
      urls: ['preview', 'live'].map((tier) => ({
        tier,
        url: publicUrl(input, tier, `${stem}.plain.html`),
        expectedStatus: 200,
        contentTypePattern: 'text/html',
      })),
    },
    status: 'candidate',
  };
}

async function supportingArtifact(item, input, pipelines) {
  const definitions = item.commands ?? [{ pipeline: item.pipeline, steps: item.steps }];
  const commands = definitions.map((definition) => commandBinding(definition.pipeline, definition.steps, pipelines));
  const evidence = uniqueEvidence(commands.flatMap((command) => pipelines[command.pipeline].evidence));
  const source = item.ownership === 'da-source'
    ? { uri: `da://${input.contentAuthority.org}/${input.contentAuthority.repo}${item.path}`, contentType: item.sourceContentType }
    : item.ownership === 'codebus'
      ? {
        uri: `git://github.com/${input.site.org}/${input.site.repo}@${input.site.codeCommit}${item.path}`,
        contentType: item.sourceContentType,
        ...(await localCodeSha(item.path) ? { sha256: await localCodeSha(item.path) } : {}),
      }
      : { uri: `derived://${item.id.replace(/^derived:/, '')}`, contentType: item.sourceContentType, inputs: item.inputs };
  const expectedStatus = item.expectedStatus ?? 200;
  return {
    id: item.id,
    path: item.path,
    kind: item.kind,
    ownership: item.ownership,
    releaseScope: 'supporting',
    source,
    commands,
    evidence,
    delivery: {
      mode: item.mode,
      ...(item.requireParity ? { requireParity: true } : {}),
      urls: item.tiers.map((tier) => ({
        tier,
        url: publicUrl(input, tier, item.path),
        expectedStatus,
        ...(expectedStatus === 200 ? { contentTypePattern: contentTypePattern(item.sourceContentType) } : {}),
      })),
    },
    status: item.status,
    ...(item.notes ? { notes: item.notes } : {}),
  };
}

function commandBinding(pipeline, steps, pipelines) {
  const binding = pipelines[pipeline];
  if (!binding) throw new Error(`unknown pipeline ${pipeline}`);
  return { pipeline, steps, runId: binding.runId, cliSha: binding.cliSha };
}

async function validateSemantics(manifest, canonicalPaths, { strictFreeze: strict }) {
  const errors = [];
  const ids = duplicateValues(manifest.artifacts.map((artifact) => artifact.id));
  const paths = duplicateValues(manifest.artifacts.map((artifact) => artifact.path));
  if (ids.length) errors.push(`duplicate artifact ids: ${ids.join(', ')}`);
  if (paths.length) errors.push(`duplicate artifact paths: ${paths.join(', ')}`);
  const canonical = new Set(canonicalPaths);
  const mapped = new Set(manifest.artifacts.filter((artifact) => artifact.releaseScope === 'canonical').map((artifact) => artifact.path));
  const missing = canonicalPaths.filter((pathName) => !mapped.has(pathName));
  const extra = [...mapped].filter((pathName) => !canonical.has(pathName));
  if (missing.length) errors.push(`missing canonical provenance: ${missing.join(', ')}`);
  if (extra.length) errors.push(`extra canonical provenance: ${extra.join(', ')}`);
  if (manifest.canonicalManifest.count !== canonicalPaths.length) errors.push('canonical count mismatch');
  if (manifest.canonicalManifest.sha256 !== await fileSha(manifest.canonicalManifest.path)) errors.push('canonical manifest hash mismatch');

  for (const [name, pipeline] of Object.entries(manifest.pipelines)) {
    if (pipeline.sha256 !== await fileSha(pipeline.path)) errors.push(`${name} pipeline hash mismatch`);
    const run = await readJson(pipeline.evidence[0].path);
    if (run.data?.runId !== pipeline.runId || run.data?.status !== 'completed') errors.push(`${name} run binding is not completed`);
    const stepIds = new Set(Object.keys(run.data?.steps ?? {}));
    for (const artifact of manifest.artifacts) {
      for (const command of artifact.commands.filter((entry) => entry.pipeline === name)) {
        if (command.runId !== pipeline.runId || command.cliSha !== pipeline.cliSha) errors.push(`${artifact.id}: ${name} run binding mismatch`);
        const unknown = command.steps.filter((step) => !stepIds.has(step));
        if (unknown.length) errors.push(`${artifact.id}: unknown ${name} steps ${unknown.join(', ')}`);
      }
    }
    for (const ref of pipeline.evidence) await checkEvidenceRef(ref, errors, `pipeline ${name}`);
  }

  for (const artifact of manifest.artifacts) {
    if (artifact.ownership === 'da-source' && !artifact.source.uri.startsWith(`da://${manifest.contentAuthority.org}/${manifest.contentAuthority.repo}/`)) {
      errors.push(`${artifact.id}: invalid DA source ownership`);
    }
    if (artifact.ownership === 'codebus' && !artifact.source.uri.startsWith(`git://github.com/${manifest.site.org}/${manifest.site.repo}@${manifest.site.codeCommit}/`)) {
      errors.push(`${artifact.id}: invalid codebus ownership`);
    }
    if (artifact.ownership === 'derived' && !artifact.source.inputs?.length) errors.push(`${artifact.id}: derived artifact has no declared inputs`);
    for (const ref of artifact.evidence) await checkEvidenceRef(ref, errors, `artifact ${artifact.id}`);
  }

  if (strict) {
    if (manifest.freeze.status !== 'frozen') errors.push('strict freeze requires freeze.status=frozen');
    if (manifest.freeze.releaseTag !== manifest.freeze.expectedReleaseTag) errors.push('strict freeze requires the CLI release tag');
    if (manifest.freeze.proofTag !== manifest.freeze.expectedProofTag) errors.push('strict freeze requires the proof-site tag');
    if (!manifest.freeze.daSnapshotSha256) errors.push('strict freeze requires a DA snapshot digest');
    for (const artifact of manifest.artifacts.filter((entry) => entry.ownership === 'da-source' && entry.status === 'verified')) {
      if (!artifact.source.sha256) errors.push(`strict freeze requires source digest for ${artifact.id}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

async function checkLiveness(manifest) {
  const jobs = manifest.artifacts.flatMap((artifact) => artifact.delivery.urls.map((delivery) => ({ artifact, delivery })));
  const checks = [];
  await mapBounded(jobs, 8, async ({ artifact, delivery }) => {
    let response;
    let body = Buffer.alloc(0);
    let error;
    let attempts = 0;
    for (; attempts < 3; attempts += 1) {
      try {
        response = await fetch(delivery.url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
        body = Buffer.from(await response.arrayBuffer());
        if (response.status === delivery.expectedStatus) break;
      } catch (err) {
        error = err.message;
      }
      await new Promise((resolveDelay) => { setTimeout(resolveDelay, 1000); });
    }
    const contentType = response?.headers.get('content-type') ?? null;
    const ok = !error
      && response?.status === delivery.expectedStatus
      && (delivery.expectedStatus !== 200 || (body.length > 0 && typeMatches(delivery.contentTypePattern, contentType)));
    checks.push({
      artifactId: artifact.id,
      path: artifact.path,
      tier: delivery.tier,
      requestedUrl: delivery.url,
      finalUrl: response?.url ?? delivery.url,
      status: response?.status ?? 0,
      contentType,
      bytes: body.length,
      sha256: body.length ? sha256(body) : null,
      attempts: Math.max(1, attempts + 1),
      ok,
      ...(error ? { error } : {}),
    });
  });
  const errors = checks.filter((row) => !row.ok).map((row) => `${row.artifactId} ${row.tier}: expected delivery contract, got HTTP ${row.status} ${row.contentType ?? ''}`);
  for (const artifact of manifest.artifacts.filter((entry) => entry.delivery.requireParity)) {
    const rows = checks.filter((row) => row.artifactId === artifact.id);
    const preview = rows.find((row) => row.tier === 'preview');
    const liveRow = rows.find((row) => row.tier === 'live');
    if (!preview?.ok || !liveRow?.ok || preview.sha256 !== liveRow.sha256) errors.push(`${artifact.id}: preview/live byte parity failed`);
  }
  return {
    schemaVersion: 'da-cli.provenance-liveness.v1',
    generatedAt: new Date().toISOString(),
    manifestSha256: sha256(Buffer.from(JSON.stringify(manifest))),
    ok: errors.length === 0,
    summary: { artifacts: manifest.artifacts.length, urls: checks.length, passed: checks.filter((row) => row.ok).length, failed: errors.length },
    checks: checks.sort((a, b) => `${a.artifactId}:${a.tier}`.localeCompare(`${b.artifactId}:${b.tier}`)),
    errors,
  };
}

function validateSchema(schema, value) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(value)) throw new Error(`provenance schema failed:\n${ajv.errorsText(validate.errors, { separator: '\n' })}`);
}

async function evidenceRef(file) {
  return { path: file, sha256: await fileSha(file) };
}

async function checkEvidenceRef(ref, errors, owner) {
  try {
    if (ref.sha256 !== await fileSha(ref.path)) errors.push(`${owner}: evidence hash mismatch ${ref.path}`);
  } catch (err) {
    errors.push(`${owner}: evidence unavailable ${ref.path} (${err.code ?? err.message})`);
  }
}

async function localCodeSha(urlPath) {
  const file = resolve(root, urlPath.replace(/^\//, ''));
  try { return sha256(await readFile(file)); } catch { return null; }
}

function publicUrl(input, tier, routePath) {
  const domain = tier === 'live' ? 'aem.live' : 'aem.page';
  return `https://${input.site.branch}--${input.site.repo}--${input.site.org}.${domain}${routePath}`;
}

function contentTypePattern(contentType) {
  if (contentType.includes('json')) return 'json';
  if (contentType.includes('css')) return 'text/css';
  if (contentType.includes('xml')) return 'xml';
  if (contentType.includes('image')) return 'image/';
  return contentType;
}

function typeMatches(pattern, value) {
  return !pattern || new RegExp(pattern, 'i').test(value ?? '');
}

function uniqueEvidence(refs) {
  return [...new Map(refs.map((ref) => [ref.path, ref])).values()];
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  values.forEach((value) => { if (seen.has(value)) duplicates.add(value); seen.add(value); });
  return [...duplicates];
}

async function mapBounded(items, concurrency, worker) {
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const current = items[cursor];
      cursor += 1;
      await worker(current);
    }
  }));
}

async function readJson(file) {
  const resolved = file.startsWith('/') ? file : resolve(root, file);
  return JSON.parse(await readFile(resolved, 'utf8'));
}

async function readLines(file) {
  return (await readFile(file, 'utf8')).split('\n').map((line) => line.trim()).filter(Boolean);
}

async function fileSha(file) {
  return sha256(await readFile(resolve(root, file)));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

async function writeJson(file, value) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

function relative(file) {
  return file.replace(`${root}/`, '');
}

function fail(error) {
  console.error(error?.message ?? String(error));
  process.exit(1);
}
