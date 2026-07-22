import { access, readFile } from 'node:fs/promises';

const forbiddenPaths = [
  'dogfood/construct.yaml',
  'dogfood/fixtures',
  'content-staging',
  'drafts',
];

const requiredPipelines = [
  'dogfood/certify.yaml',
  'dogfood/promote.yaml',
];

const canonicalManifest = 'dogfood/canonical-pages.txt';

const violations = [];

for (const path of forbiddenPaths) {
  try {
    await access(path);
    violations.push(`${path} must not exist; DA is the authored-content source of truth`);
  } catch {
    // Absence is the contract.
  }
}

for (const path of requiredPipelines) {
  try {
    const source = await readFile(path, 'utf8');
    if (/\bcontent\s+put\b/.test(source)) {
      violations.push(`${path} uploads authored content from Git`);
    }
  } catch {
    violations.push(`${path} is required`);
  }
}

try {
  const paths = (await readFile(canonicalManifest, 'utf8'))
    .split('\n')
    .map((path) => path.trim())
    .filter(Boolean);
  if (!paths.length) violations.push(`${canonicalManifest} must list canonical DA pages`);
  for (const path of paths) {
    if (!path.startsWith('/') || !path.endsWith('.html') || path.startsWith('/drafts/')) {
      violations.push(`${canonicalManifest} contains unsafe promotion path: ${path}`);
    }
  }
} catch {
  violations.push(`${canonicalManifest} is required`);
}

if (violations.length) {
  console.error('DA source-of-truth check failed:');
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log('DA source-of-truth check passed');
