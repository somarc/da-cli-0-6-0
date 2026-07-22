/* eslint-disable no-console */

const baseUrl = new URL(process.env.RELEASE_SITE_URL
  || 'https://main--da-cli-0-6-0--somarc.aem.live');

const requiredRoutes = [
  { path: '/', markers: ['f001–f039', 'Wave 6', 'in progress'] },
  { path: '/frontier', markers: ['Frontier lab'] },
  { path: '/sheets', markers: ['Sheets', 'indexes'] },
  {
    path: '/learnings/f037-put-blind-missing-media',
    markers: ['f037', 'missing DA media reference'],
  },
  { path: '/waves/1-foundation', markers: ['Wave 1', 'Foundation and core loop'] },
  { path: '/waves/4-durability', markers: ['Wave 4', 'Coordination, durability, migration'] },
  { path: '/waves/5-failure-recovery', markers: ['Wave 5', 'Failure and recovery injection'] },
];

const failures = [];
const maxAttempts = Number.parseInt(process.env.RELEASE_AUDIT_ATTEMPTS || '3', 10);
const retryDelayMs = Number.parseInt(process.env.RELEASE_AUDIT_RETRY_MS || '2000', 10);

function normalizePath(pathname) {
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
}

function delay(duration) {
  return new Promise((resolve) => { setTimeout(resolve, duration); });
}

async function fetchRoute(route, attempt = 1) {
  const url = new URL(route.path, baseUrl);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    if (response.status !== 200 && attempt < maxAttempts) {
      await delay(retryDelayMs);
      return fetchRoute(route, attempt + 1);
    }
    const text = await response.text();
    return {
      ...route,
      status: response.status,
      url: response.url,
      text,
    };
  } catch (error) {
    if (attempt < maxAttempts) {
      await delay(retryDelayMs);
      return fetchRoute(route, attempt + 1);
    }
    return {
      ...route,
      status: 0,
      url: url.href,
      text: '',
      error: error.message,
    };
  }
}

function validateRoute(result) {
  const finalUrl = new URL(result.url);
  if (result.status !== 200) {
    failures.push(`${result.path}: expected 200, received ${result.status}${result.error ? ` (${result.error})` : ''}`);
  }
  if (finalUrl.origin !== baseUrl.origin
    || normalizePath(finalUrl.pathname) !== normalizePath(result.path)) {
    failures.push(`${result.path}: redirected unexpectedly to ${result.url}`);
  }
  result.markers
    .filter((marker) => !result.text.includes(marker))
    .forEach((marker) => failures.push(
      `${result.path}: missing route marker ${JSON.stringify(marker)}`,
    ));
  return {
    path: result.path,
    status: result.status,
    url: result.url,
  };
}

const results = await Promise.all(requiredRoutes.map(fetchRoute));
const summaries = results.map(validateRoute);
const homepage = results.find(({ path }) => path === '/')?.text || '';

if (homepage.includes('Wave 6 <strong>not started</strong>')) {
  failures.push('/: stale Wave 6 "not started" marker remains');
}

summaries.forEach((result) => {
  console.log(`${result.status} ${result.path} -> ${result.url}`);
});

if (failures.length) {
  console.error('\nRelease audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`\nRelease audit passed for ${results.length} canonical live routes.`);
}
