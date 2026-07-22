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

if (violations.length) {
  console.error('DA source-of-truth check failed:');
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log('DA source-of-truth check passed');
