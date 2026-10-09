import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceDirectory = join(process.cwd(), 'studio-src');
const packagePath = join(sourceDirectory, 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

if (packageJson.name !== 'streamplay-studio' || !packageJson.build) {
  throw new Error('Unexpected Studio package configuration.');
}

if (process.env.STUDIO_RELEASE_VERSION) {
  if (!/^\d+\.\d+\.\d+$/.test(process.env.STUDIO_RELEASE_VERSION)) {
    throw new Error('STUDIO_RELEASE_VERSION must be a stable x.y.z version.');
  }
  packageJson.version = process.env.STUDIO_RELEASE_VERSION;
}

packageJson.build.publish = [{
  provider: 'github',
  owner: '1363306384',
  repo: 'streamplay-studio'
}];

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

const backendConfigPath = join(sourceDirectory, 'src/lib/server/backend-config.ts');
const backendConfig = readFileSync(backendConfigPath, 'utf8');
const backendUrlSetting = /^const STUDIO_BACKEND_URL = '[^']*';$/gm;
const matches = [...backendConfig.matchAll(backendUrlSetting)];
if (matches.length !== 1) {
  throw new Error('Expected exactly one active Studio backend URL. Review the source before publishing.');
}
writeFileSync(
  backendConfigPath,
  backendConfig.replace(backendUrlSetting, "const STUDIO_BACKEND_URL = 'https://api.the3.tv';")
);

// The source repository intentionally ignores .env. The packaged app uses its
// built-in backend URL, so an empty file satisfies electron-builder's resource
// entry without putting a production secret into a public installer.
const envPath = join(sourceDirectory, '.env');
if (!existsSync(envPath)) writeFileSync(envPath, '');

console.log(`Prepared Streamplay Studio ${packageJson.version} with the production backend and GitHub Releases updates.`);
