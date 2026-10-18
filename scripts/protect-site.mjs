import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { encrypt } from 'pagecrypt';

const envFiles = ['.env.local', '.env'];

function readLocalPassword() {
  for (const envFile of envFiles) {
    const path = resolve(envFile);
    if (!existsSync(path)) continue;
    const line = readFileSync(path, 'utf8').split(/\r?\n/).find((entry) => {
      const value = entry.trim();
      return value && !value.startsWith('#') && value.startsWith('SITE_PASSWORD=');
    });
    if (!line) continue;
    const value = line.slice('SITE_PASSWORD='.length).trim();
    return (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))
      ? value.slice(1, -1)
      : value;
  }
  return '';
}

const password = process.env.SITE_PASSWORD || readLocalPassword();
if (!password) {
  console.error('SITE_PASSWORD is required. Set it in the environment or a local .env file.');
  process.exit(1);
}

const inputPath = resolve('dist/index.html');
const encryptedPath = resolve('dist/index.encrypted.html');
if (!existsSync(inputPath)) {
  console.error('dist/index.html is missing. Build the site before protecting it.');
  process.exit(1);
}

await encrypt(inputPath, encryptedPath, password);
writeFileSync(inputPath, readFileSync(encryptedPath));
unlinkSync(encryptedPath);
console.log('Protected dist/index.html with PageCrypt.');
