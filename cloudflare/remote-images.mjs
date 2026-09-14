import { createHash } from 'node:crypto';
import { existsSync, readFileSync, mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const digest = data => createHash('sha256').update(data).digest('hex');

export function loadImageManifest() {
  const manifest = JSON.parse(readFileSync(new URL('./image-manifest.json', import.meta.url), 'utf8'));
  if (manifest.version !== 1 || manifest.origin !== 'https://kanjidon.com') throw Error('Invalid image manifest');
  const paths = new Set();
  for (const image of manifest.images) {
    for (const path of [image.path, image.sourcePath]) {
      if (!path || path.startsWith('/') || path.includes('..') || path.includes('\\')) throw Error(`Unsafe image path: ${path}`);
    }
    if (paths.has(image.path) || !/^[a-f0-9]{64}$/.test(image.sha256) || !Number.isInteger(image.bytes) || image.bytes <= 0) throw Error(`Invalid image: ${image.path}`);
    paths.add(image.path);
  }
  return manifest;
}

export async function fetchImage(image, manifest, request = fetch) {
  let error;
  for (const origin of [...new Set([manifest.origin, manifest.archiveOrigin].filter(Boolean))]) {
    try {
      const response = await request(`${origin}/${image.path}`, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Kanjidon-Asset-Build/1.0' } });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      const data = Buffer.from(await response.arrayBuffer());
      if (data.length !== image.bytes || digest(data) !== image.sha256) throw Error('Content hash mismatch');
      return data;
    } catch (failure) { error = failure; }
  }
  throw Error(`Cannot recover ${image.path}: ${error?.message}`);
}

export async function fetchImages(manifest = loadImageManifest(), request = fetch) {
  const images = new Map();
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(6, manifest.images.length) }, async () => {
    while (index < manifest.images.length) {
      const image = manifest.images[index++];
      images.set(image.path, await fetchImage(image, manifest, request));
    }
  }));
  return images;
}

export function hydrateImages(root, kind, manifest, images) {
  // Validate every existing file before writing any temporary working copy.
  for (const image of manifest.images) {
    const path = join(root, kind === 'source' ? image.sourcePath : image.path);
    if (existsSync(path) && digest(readFileSync(path)) !== image.sha256) throw Error(`Unpublished image must be preserved: ${path}`);
  }
  for (const image of manifest.images) {
    const path = join(root, kind === 'source' ? image.sourcePath : image.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, images.get(image.path));
  }
}

export function removeWorkingImages(locations, manifest) {
  const files = new Set();
  for (const { root, kind } of locations) {
    for (const image of manifest.images) {
      const path = join(root, kind === 'source' ? image.sourcePath : image.path);
      if (existsSync(path)) {
        if (digest(readFileSync(path)) !== image.sha256) throw Error(`Changed image retained for recovery: ${path}`);
        files.add(path);
      }
    }
  }
  for (const path of files) unlinkSync(path);
  return files.size;
}

export function configureImageCommands(root) {
  const path = join(root, 'package.json');
  const config = JSON.parse(readFileSync(path, 'utf8'));
  Object.assign(config.scripts, {
    'cf:build': 'node ./cloudflare/stage-assets.mjs',
    'cf:check': 'node ./cloudflare/with-assets.mjs check',
    'cf:upload': 'node ./cloudflare/with-assets.mjs upload',
    'cf:dev': 'node ./cloudflare/with-assets.mjs dev',
    'cf:deploy': 'wrangler versions deploy',
  });
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
}
