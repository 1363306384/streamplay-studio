import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceDirectory = join(process.cwd(), 'studio-src');
const packagePath = join(sourceDirectory, 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

if (packageJson.name !== 'streamplay-studio' || !packageJson.build) {
  throw new Error('Unexpected Studio package configuration.');
}

packageJson.build.publish = [{
  provider: 'github',
  owner: '1363306384',
  repo: 'streamplay-studio'
}];

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

// The source repository intentionally ignores .env. The packaged app uses its
// built-in backend URL, so an empty file satisfies electron-builder's resource
// entry without putting a production secret into a public installer.
const envPath = join(sourceDirectory, '.env');
if (!existsSync(envPath)) writeFileSync(envPath, '');

console.log(`Prepared Streamplay Studio ${packageJson.version} for GitHub Releases updates.`);
