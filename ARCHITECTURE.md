# Arquitetura — Habitar o Corpo

## Visão geral

O projeto usa uma arquitetura deliberadamente simples para reduzir dependências e evitar duplicação de código.

### Frontend

A aplicação é uma PWA estática. A única fonte do frontend é a pasta `public/`.

Arquivos principais:

- `public/index.html`: shell da aplicação, navegação, gate 18+ e entrada do frontend.
- `public/app.js`: regras de interface, autenticação, conta, agendamento, VIP e painel administrativo.
- `public/styles.css`: identidade visual e responsividade.
- `public/manifest.json`: metadados da PWA.
- `public/service-worker.js`: cache do app shell.

O build não transpila nem gera uma segunda aplicação. Ele valida os arquivos e copia `public/` para `dist/`, que é o diretório publicado pela Vercel.

### Backend

O backend operacional fica no Supabase:

- Supabase Auth para cadastro, login, confirmação e recuperação de senha.
- `joelma-auth` para ações complementares de autenticação e telemetria mínima.
- `joelma-booking` para catálogo, disponibilidade, conta, administração e confirmação de agendamentos.
- PostgreSQL para clientes, serviços, horários, agendamentos, conteúdos VIP e eventos mínimos de uso.

### Automação

Após um agendamento confirmado, a automação externa em n8n cuida das integrações operacionais, incluindo WhatsApp e Google Calendar.

## Regras de manutenção

- Não manter cópias duplicadas do frontend fora de `public/`.
- Não adicionar frameworks de frontend sem necessidade comprovada.
- Toda alteração de produção deve passar por `npm run verify`.
- Mudanças devem ser testadas em preview antes de chegar à branch principal.
- Segredos nunca entram no repositório.
- Dados pessoais e sensíveis devem ter acesso mínimo necessário.
