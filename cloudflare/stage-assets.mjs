import { execFileSync } from "node:child_process";
import { copyFile, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cloudflareDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(cloudflareDirectory);
const outputDirectory = path.join(repositoryRoot, ".cloudflare-assets");
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

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  cwd: repositoryRoot,
  encoding: "utf8",
}).split("\0").filter(Boolean);

await rm(outputDirectory, { recursive: true, force: true });

const stagedFiles = [];
let fileCount = 0;
let byteCount = 0;
for (const relativePath of trackedFiles) {
  if (!isPublicRuntimeFile(relativePath)) continue;
  if (relativePath.startsWith("/") || relativePath.includes("..")) throw new Error(`Unsafe asset path: ${relativePath}`);

  const sourcePath = path.join(repositoryRoot, relativePath);
  const destinationPath = path.join(outputDirectory, relativePath);
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
  const metadata = await stat(sourcePath);
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
