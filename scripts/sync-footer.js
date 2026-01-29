#!/usr/bin/env node
/**
 * Footer Sync Script
 *
 * Takes the footer from /en/index.html and applies it to ALL pages.
 * Automatically adjusts relative paths based on file depth.
 *
 * Usage: node scripts/sync-footer.js
 */

const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, '..');
const MASTER_FILE = path.join(WEBSITE_DIR, 'en', 'index.html');

const FOOTER_REGEX = /<footer class="footer">[\s\S]*?<\/footer>/;

function findHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !['scripts', 'assets'].includes(entry.name)) {
      findHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getDepth(filePath) {
  const rel = path.relative(WEBSITE_DIR, path.dirname(filePath));
  return rel.split(path.sep).filter(p => p).length;
}

function adjustPaths(html, targetDepth) {
  // Master is at depth 1 (/en/index.html), uses ../
  // Adjust to target depth
  const targetPrefix = targetDepth === 0 ? './' : '../'.repeat(targetDepth);

  return html
    .replace(/src="\.\.\/assets\//g, `src="${targetPrefix}assets/`)
    .replace(/href="\.\.\/assets\//g, `href="${targetPrefix}assets/`);
}

// Main
console.log('🔄 Footer Sync\n');

const masterContent = fs.readFileSync(MASTER_FILE, 'utf8');
const masterFooter = masterContent.match(FOOTER_REGEX)?.[0];

if (!masterFooter) {
  console.error('❌ No footer found in en/index.html');
  process.exit(1);
}

console.log('📋 Master footer from: en/index.html\n');

const allFiles = findHtmlFiles(WEBSITE_DIR);
let updated = 0;

for (const filePath of allFiles) {
  if (filePath === MASTER_FILE) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  if (!FOOTER_REGEX.test(content)) continue;

  const depth = getDepth(filePath);
  const adjustedFooter = adjustPaths(masterFooter, depth);
  const newContent = content.replace(FOOTER_REGEX, adjustedFooter);

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${path.relative(WEBSITE_DIR, filePath)}`);
    updated++;
  }
}

console.log(`\n✨ Done! Updated ${updated} files.`);
