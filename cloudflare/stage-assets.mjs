import { execFileSync } from "node:child_process";
import { copyFile, mkdir, rm, stat, writeFile, mkdtemp } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { loadImageManifest, fetchImages } from "./remote-images.mjs";

const cloudflareDirectory = path.dirname(fileURLToPath(import.meta.url));
const excludedFiles = new Set([
  ".gitignore",
  "_headers",
  "_redirects",
  "CLOUDFLARE.md",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "wrangler.jsonc",
]);
const excludedDirectories = ["cloudflare/", "legacy-redirect/", "scripts/", "templates/"];

function isPublicRuntimeFile(relativePath) {
  if (excludedFiles.has(relativePath)) return false;
  if (excludedDirectories.some((prefix) => relativePath.startsWith(prefix))) return false;
  if (relativePath.endsWith(".bak")) return false;

  // Root blog JSON files are generator inputs, not public runtime assets.
  // Localized article pages live under /<locale>/blog/ and are unaffected.
  if (relativePath.startsWith("blog/")) {
    return relativePath === "blog/index.html"
      || /^blog\/[^/]+\/index\.html$/.test(relativePath);
  }

  return true;
}

export async function stageAssets(repositoryRoot, outputDirectory) {
  const manifest = loadImageManifest();
  const images = await fetchImages(manifest);
  const trackedFiles = [...new Set([...execFileSync("git", ["ls-files", "-z"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).split("\0").filter(Boolean), ...images.keys()])];

  const stagedFiles = [];
  let fileCount = 0;
  let byteCount = 0;
  for (const relativePath of trackedFiles) {
    if (!isPublicRuntimeFile(relativePath)) continue;
    if (relativePath.startsWith("/") || relativePath.includes("..")) throw new Error(`Unsafe asset path: ${relativePath}`);

    const sourcePath = path.join(repositoryRoot, relativePath);
    const destinationPath = path.join(outputDirectory, relativePath);
    await mkdir(path.dirname(destinationPath), { recursive: true });
    if (images.has(relativePath)) await writeFile(destinationPath, images.get(relativePath));
    else {
      if (/\.(?:png|jpe?g|webp|svg|ico|gif|avif)$/i.test(relativePath)) throw Error(`Image missing from Cloudflare manifest: ${relativePath}`);
      await copyFile(sourcePath, destinationPath);
    }
    const metadata = await stat(destinationPath);
    stagedFiles.push(relativePath);
    fileCount += 1;
    byteCount += metadata.size;
  }

  const unsafeBlogAssets = stagedFiles.filter((relativePath) => (
    relativePath.endsWith(".bak")
    || (/^blog\/[^/]+$/.test(relativePath) && relativePath !== "blog/index.html")
  ));
  if (unsafeBlogAssets.length) {
    throw new Error(`Source-only blog files entered the public asset bundle: ${unsafeBlogAssets.join(", ")}`);
  }

  for (const requiredFile of ["index.html", "404.html", "robots.txt", "sitemap.xml"]) {
    await stat(path.join(outputDirectory, requiredFile));
  }

  console.log(`Staged ${fileCount} public files (${(byteCount / 1024 / 1024).toFixed(1)} MiB).`);
  return { fileCount, byteCount };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = await mkdtemp(path.join(tmpdir(), 'kanjidon-assets-check-'));
  try { await stageAssets(path.dirname(cloudflareDirectory), directory); }
  finally { await rm(directory, { recursive: true, force: true }); }
  console.log('Verified asset bundle; temporary files removed. Use pnpm cf:upload to publish a preview.');
}
