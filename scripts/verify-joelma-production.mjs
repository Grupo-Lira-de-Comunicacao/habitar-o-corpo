import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

const requiredFiles = [
  'public/index.html',
  'public/app.js',
  'public/styles.css',
  'public/manifest.json',
  'public/service-worker.js',
  'public/assets/hero-joelma.jpg',
  'public/icons/icon.svg',
  'public/icons/icon-192.png',
  'public/icons/icon-512.png',
  'public/icons/icon-512-maskable.png',
  'public/icons/favicon.png',
  'public/icons/apple-touch-icon.png',
  'supabase/functions/joelma-auth/index.ts',
  'supabase/functions/joelma-booking/index.ts',
  'docs/AUTH_V2.md',
];

for (const file of requiredFiles) {
  assert(fs.existsSync(file), `Arquivo obrigatório ausente: ${file}`);
}

const forbiddenLegacyPaths = [
  '.env.example',
  '.eslintrc.json',
  '.prettierignore',
  '.prettierrc',
  'app.js',
  'assets',
  'booking-automation.js',
  'icons',
  'index.html',
  'manifest.json',
  'next-env.d.ts',
  'next.config.ts',
  'postcss.config.mjs',
  'public/booking-automation.js',
  'src',
  'styles.css',
  'supabase.schema.md',
  'tailwind.config.ts',
  'teste-f2ef49-inscricao.css',
  'teste-f2ef49-inscricao.html',
  'teste-landing.css',
  'teste-landing.html',
  'tsconfig.json',
];

for (const legacyPath of forbiddenLegacyPaths) {
  assert(!fs.existsSync(legacyPath), `Legado ainda presente: ${legacyPath}`);
}

const app = read('public/app.js');
const index = read('public/index.html');
const serviceWorker = read('public/service-worker.js');
const manifest = JSON.parse(read('public/manifest.json'));

assert(manifest.name === 'Habitar o Corpo', 'Manifesto PWA com nome incorreto');
assert(manifest.short_name === 'Joelma Souza', 'Manifesto PWA com short_name incorreto');
assert(manifest.theme_color === '#1F3A33', 'Manifesto PWA com cor de tema incorreta');
assert(index.includes('<title>Habitar o Corpo | Joelma Souza</title>'), 'Título oficial ausente');
assert(index.includes('/app.js'), 'app.js não está carregado pelo index');
assert(!index.includes('booking-automation.js'), 'Index ainda carrega automação legada');

const bottomNav = index.match(/<nav class="bottom-nav"[\s\S]*?<\/nav>/)?.[0] || '';
assert(bottomNav.includes('href="#admin" data-nav="admin">Admin</a>'), 'Menu móvel não expõe o painel Admin para a administradora');
assert(!bottomNav.includes('href="#clientes"'), 'Menu móvel não deve expor Clientes como atalho administrativo separado');
assert(app.includes('normalizeEmail(client.email) !== normalizeEmail(state.admin?.email)'), 'Lista administrativa ainda inclui o próprio perfil da administradora como cliente');

assert(app.includes('/functions/v1/joelma-booking'), 'Frontend não está ligado ao backend de agendamento');
assert(app.includes('/functions/v1/joelma-auth'), 'Frontend não está ligado ao backend de autenticação');
assert(app.includes('Authorization: `Bearer ${state.authSession.access_token}`'), 'Agendamento autenticado não está preservado');
assert(app.includes('function renderPrivacy()'), 'Política de Privacidade não foi preservada');
assert(app.includes('privacidade: renderPrivacy'), 'Rota de privacidade não foi preservada');
assert(app.includes('apiRequest("upsert-service"'), 'CRUD de serviços não está ligado ao backend');
assert(app.includes('apiRequest("upsert-vip-content"'), 'CRUD VIP não está ligado ao backend');
assert(app.includes('apiRequest("archive-vip-content"'), 'Arquivamento VIP não está ligado ao backend');
assert(!app.includes('11987080279'), 'Pix provisório ainda está hardcoded');
assert(!app.includes('dQw4w9WgXcQ'), 'Vídeo VIP de demonstração ainda existe');
assert(!app.includes('images.unsplash.com/photo-1596178060810'), 'Imagem VIP de demonstração ainda existe');
assert(serviceWorker.includes('habitar-o-corpo-pwa-'), 'Service worker oficial não identificado');

const syntax = spawnSync(process.execPath, ['--check', 'public/app.js'], { encoding: 'utf8' });
if (syntax.status !== 0) {
  throw new Error(`Falha de sintaxe em public/app.js:\n${syntax.stderr || syntax.stdout}`);
}

function scanTextFiles(dir, findings = []) {
  if (!fs.existsSync(dir)) return findings;
  const legacyBrand = ['ATTUAL', 'ONE'].join(' ');
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanTextFiles(full, findings);
      continue;
    }
    if (!/\.(?:md|json|js|mjs|ts|html|css|sql)$/i.test(entry.name)) continue;
    const text = read(full);
    if (text.toUpperCase().includes(legacyBrand)) findings.push(full);
  }
  return findings;
}

const staleBrandFiles = scanTextFiles('.');
assert(staleBrandFiles.length === 0, `Referências de marca legada ainda presentes: ${staleBrandFiles.join(', ')}`);

console.log('Habitar o Corpo cleanup invariants: OK');
