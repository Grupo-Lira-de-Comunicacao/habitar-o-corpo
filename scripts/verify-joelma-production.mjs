import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const root = fs.readFileSync('app.js', 'utf8');
const publicApp = fs.readFileSync('public/app.js', 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(root === publicApp, 'app.js e public/app.js precisam permanecer sincronizados');
assert(!publicApp.includes('11987080279'), 'Pix provisório ainda está hardcoded');
assert(!publicApp.includes('dQw4w9WgXcQ'), 'Vídeo VIP de demonstração ainda existe');
assert(!publicApp.includes('images.unsplash.com/photo-1596178060810'), 'Imagem VIP de demonstração ainda existe');
assert(publicApp.includes('Conteúdo exclusivo em preparação'), 'Estado vazio VIP de produção ausente');
assert(publicApp.includes('return state.services || [];'), 'Serviços ainda não usam estado vindo do backend');
assert(publicApp.includes('return state.vipContents || [];'), 'VIP ainda não usa estado vindo do backend');
assert(publicApp.includes('apiRequest("upsert-service"'), 'CRUD de serviços não está ligado ao backend');
assert(publicApp.includes('apiRequest("upsert-vip-content"'), 'CRUD VIP não está ligado ao backend');
assert(publicApp.includes('apiRequest("archive-vip-content"'), 'Arquivamento VIP não está ligado ao backend');
assert(publicApp.includes('function renderPrivacy()'), 'Política de Privacidade não foi adicionada');
assert(publicApp.includes('privacidade: renderPrivacy'), 'Rota de privacidade não foi registrada');
assert(publicApp.includes('/service-worker.js?v=20260818-production-v1'), 'Cache do service worker não foi versionado');

const syntax = spawnSync(process.execPath, ['--check', 'public/app.js'], { encoding: 'utf8' });
if (syntax.status !== 0) {
  throw new Error(`Falha de sintaxe em public/app.js:\n${syntax.stderr || syntax.stdout}`);
}

console.log('Joelma production frontend invariants: OK');
