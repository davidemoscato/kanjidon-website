import { mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stageAssets } from './stage-assets.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const [mode, ...args] = process.argv.slice(2);
const commands = { check: ['deploy', '--dry-run'], upload: ['versions', 'upload'], dev: ['dev'] };
if (!commands[mode]) throw Error('Use check, upload or dev');
const directory = await mkdtemp(join(tmpdir(), 'kanjidon-assets-'));
let status = 1;
let child;
let interrupted;
const interrupt = signal => { interrupted = signal; child?.kill(signal); };
const onInt = () => interrupt('SIGINT'); const onTerm = () => interrupt('SIGTERM');
process.on('SIGINT', onInt); process.on('SIGTERM', onTerm);
try {
  await stageAssets(root, directory);
  if (interrupted) throw Error(`Asset build interrupted by ${interrupted}`);
  child = spawn(process.execPath, [join(root, 'node_modules/wrangler/bin/wrangler.js'), ...commands[mode], '--assets', directory, ...args], { cwd: root, stdio: 'inherit', env: process.env });
  status = await new Promise((resolveStatus, reject) => {
    child.on('error', reject);
    child.on('exit', (code, signal) => resolveStatus(code ?? (signal === 'SIGINT' ? 130 : 143)));
  });
} finally {
  await rm(directory, { recursive: true, force: true });
  process.off('SIGINT', onInt); process.off('SIGTERM', onTerm);
}
process.exitCode = status;
