import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = 'scripts/joelma-production-patch.mjs';
let source = fs.readFileSync(sourcePath, 'utf8');
const needle = '${BOOKING_API_URL}';
if (!source.includes(needle)) throw new Error('Interpolação esperada do BOOKING_API_URL não encontrada no patch');
source = source.replace(needle, '\\${BOOKING_API_URL}');
const tempPath = path.join(os.tmpdir(), `joelma-production-patch-${process.pid}.mjs`);
fs.writeFileSync(tempPath, source);
try {
  await import(pathToFileURL(tempPath).href);
} finally {
  fs.rmSync(tempPath, { force: true });
}
