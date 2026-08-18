# Habitar o Corpo — Joelma Souza

Aplicação/PWA de Joelma Souza para apresentação de serviços, cadastro seguro, autenticação, agendamentos, área VIP e administração.

## Produção

- Domínio: `https://app.joelmasouzaoficial.com.br`
- Frontend: PWA estática publicada pela Vercel.
- Backend: Supabase Auth, banco e Edge Functions.
- Automação: n8n para WhatsApp e Google Calendar.

## Estrutura atual

- `public/`: única fonte do frontend publicado (`index.html`, `app.js`, `styles.css`, manifesto, service worker, ícones e imagens).
- `supabase/functions/`: Edge Functions `joelma-auth` e `joelma-booking`.
- `supabase/migrations/`: migrations do projeto.
- `docs/`: documentação operacional atual.
- `scripts/verify-joelma-production.mjs`: valida os invariantes necessários antes de cada build.

## Build

```bash
npm run build
```

O build primeiro executa as verificações de produção e depois copia `public/` para `dist/`. A Vercel publica somente `dist/`.

## Segurança

- Senhas ficam no Supabase Auth e não devem ser gravadas no repositório nem em `localStorage`.
- Segredos, tokens e credenciais nunca devem ser commitados.
- A chave pública do Supabase usada pelo navegador é uma chave publicável; operações sensíveis permanecem protegidas no backend.
- Dados pessoais devem seguir coleta mínima e as regras de privacidade/LGPD descritas no aplicativo.
