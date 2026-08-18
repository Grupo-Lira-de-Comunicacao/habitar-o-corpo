# Habitar o Corpo Finalização de Produção Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finalizar o app Habitar o Corpo em produção sem quebrar o fluxo validado de autenticação/agendamento, removendo demos, levando dados administrativos ao Supabase, registrando o ID do Calendar e disponibilizando privacidade/LGPD.

**Architecture:** A PWA estática existente continua sendo a interface de produção. O Supabase/Edge Function `joelma-booking` passa a ser fonte autoritativa para catálogo, conteúdo VIP e configurações operacionais; o n8n permanece responsável por WhatsApp/Google Calendar e correlaciona o evento ao `bookingId`.

**Tech Stack:** JavaScript PWA, Supabase Auth/Postgres/Edge Functions, n8n, Google Calendar, WhatsApp/Evolution, Vercel, GitHub.

**Spec:** `docs/superpowers/specs/2026-08-18-finalizacao-producao-joelma-design.md`

## Global Constraints

- Preservar o fluxo validado: Cadastro → confirmação por e-mail → login → agendamento → Supabase → WhatsApp → Google Calendar.
- Não expor segredos, senha SMTP, senha de app Google, service role ou tokens em código/commits.
- Pix oficial é CPF; não registrar o número completo em documentação ou logs desnecessários.
- Sem movimentação financeira automática.
- Não migrar a PWA para o scaffold Next.js legado de `src/` nesta fase.
- Alterações incrementais, testáveis e reversíveis.
- Dados administrativos persistidos no Supabase; `localStorage` não é fonte de verdade.

---

### Task 1: Banco — catálogo, VIP, configurações e rastreabilidade

**Files:**
- Create: `supabase/migrations/20260818_joelma_production_content.sql`

**Interfaces:**
- Produces: `public.joelma_services`, `public.joelma_vip_contents`, `private.joelma_app_settings`, RPC `joelma_mark_calendar_event(uuid,text,text)`.

- [ ] **Step 1: Escrever a migração**

Criar tabelas com RLS habilitado e sem políticas públicas de escrita. `joelma_services` contém `id text primary key`, `name`, `description`, `duration_minutes`, `price_cents`, `benefits jsonb`, `active`, `sort_order`, timestamps. `joelma_vip_contents` contém `id uuid`, `title`, `description`, `content_type`, `category`, `media_url`, `text_content`, `thumbnail_url`, `status`, `access_level`, `sort_order`, timestamps. `private.joelma_app_settings` contém `key text primary key`, `value text`, timestamps. A RPC `joelma_mark_calendar_event` valida `notification_token`, limita `calendar_event_id` a 255 chars e atualiza apenas a reserva correspondente.

- [ ] **Step 2: Validar sintaxe/estrutura**

Executar a migração em Supabase via `apply_migration` e consultar `information_schema.columns` + `pg_proc` para confirmar as estruturas.

- [ ] **Step 3: Popular catálogo e Pix fora do código**

Inserir os 11 serviços atuais via SQL idempotente. Inserir a chave Pix oficial em `private.joelma_app_settings` por SQL operacional, sem gravar seu valor na migration/documentação.

- [ ] **Step 4: Verificar proteção**

Confirmar `relrowsecurity=true` nas tabelas públicas novas e ausência de policies de escrita para `anon`/`authenticated`.

- [ ] **Step 5: Commit**

Commit: `feat: add production content schema`

---

### Task 2: Backend — catálogo, VIP, config e calendar event

**Files:**
- Modify: `supabase/functions/joelma-booking/index.ts`

**Interfaces:**
- Consumes: tabelas/RPC da Task 1.
- Produces ações `catalog`, `vip-content`, `admin-content`, `upsert-vip-content`, `upsert-service`, `calendar-event-result`, e `public-config`.

- [ ] **Step 1: Definir comportamento esperado**

`catalog` retorna apenas serviços ativos ordenados. `public-config` retorna apenas configuração segura de apresentação (Pix tipo/valor quando necessário). `vip-content` exige sessão e `profile.is_vip=true` ou admin; retorna somente conteúdo `active`. Escritas exigem admin autenticado. `calendar-event-result` exige `bookingId`, `notificationToken` e `calendarEventId` válidos e chama `joelma_mark_calendar_event`.

- [ ] **Step 2: Implementar ações com validação e mínimo privilégio**

Reutilizar `authenticatedUser`, `isAdminEmail`, `cleanText` e `validUuid`. Não devolver dados de outros clientes nas novas rotas.

- [ ] **Step 3: Implantar nova versão da Edge Function**

Preservar `verify_jwt=false`, pois disponibilidade pública e callbacks técnicos já dependem da autenticação customizada no corpo da função.

- [ ] **Step 4: Testar endpoints**

Validar catálogo público; confirmar que VIP sem token retorna 401; confirmar que ação admin sem privilégio retorna 403; validar atualização do `calendar_event_id` com dados de teste controlados apenas quando houver token de notificação válido.

- [ ] **Step 5: Commit**

Commit: `feat: serve production content from backend`

---

### Task 3: Frontend — remover demos/localStorage autoritativo e atualizar Pix

**Files:**
- Modify: `app.js`
- Modify: `public/app.js`

**Interfaces:**
- Consumes: `catalog`, `public-config`, `vip-content` da Task 2.

- [ ] **Step 1: Remover demos VIP alcançáveis**

Eliminar o vídeo placeholder e imagens/textos de demonstração de `initialVipContents`. Estado sem conteúdo deve renderizar exatamente `Conteúdo exclusivo em preparação`.

- [ ] **Step 2: Carregar catálogo do backend**

Adicionar estado `services` carregado por `catalog`. `getServices()` passa a usar o estado carregado; em falha, mostrar indisponibilidade sem usar dados administrativos locais como fonte autoritativa.

- [ ] **Step 3: Carregar conteúdo VIP do backend**

Ao abrir VIP, solicitar `vip-content` com bearer token. Não persistir conteúdo VIP autoritativo em `localStorage`.

- [ ] **Step 4: Carregar Pix por config segura**

Remover a chave provisória hardcoded. Buscar valor pelo backend quando a interface precisar exibi-lo; não imprimir a chave em console/log.

- [ ] **Step 5: Sincronizar raiz/public**

Manter `app.js` e `public/app.js` idênticos para o modelo atual de deploy.

- [ ] **Step 6: Commit**

Commit: `feat: use backend content in production app`

---

### Task 4: Privacidade/LGPD e acabamento

**Files:**
- Modify: `app.js`
- Modify: `public/app.js`
- Optionally Modify: `styles.css`, `public/styles.css`

**Interfaces:**
- Produces rota/seção acessível `privacidade`.

- [ ] **Step 1: Adicionar política em linguagem clara**

Informar controlador/contato, finalidades de cadastro/autenticação/agendamento/comunicação/métricas, categorias de dados, base de consentimento/execução do serviço conforme aplicável, retenção mínima necessária, direitos do titular e canal de contato. Não prometer práticas que o sistema não implementa.

- [ ] **Step 2: Tornar acessível no cadastro e rodapé/menu**

Adicionar link visível para Política de Privacidade sem bloquear o fluxo atual.

- [ ] **Step 3: Revisar dados sensíveis**

Confirmar que nenhum campo íntimo/clínico novo foi criado e que notas continuam limitadas a operação de agendamento.

- [ ] **Step 4: Commit**

Commit: `feat: add privacy and lgpd notice`

---

### Task 5: n8n — persistir Google Calendar event ID

**Files:**
- No repository file is authoritative for the active workflow; update workflow `4AnOuKU9MiMp_sEG3Hkf8` incrementally if control access is available.

**Interfaces:**
- Consumes: `calendar-event-result` da Task 2.

- [ ] **Step 1: Inspecionar o workflow ativo**

Localizar o nó Google Calendar que cria o evento e o campo real de ID retornado.

- [ ] **Step 2: Adicionar callback após criação do evento**

Enviar `action=calendar-event-result`, `bookingId`, `notificationToken`, `calendarEventId` para `joelma-booking`.

- [ ] **Step 3: Preservar idempotência**

A atualização do ID não pode criar outro evento nem outra reserva; retry só atualiza o mesmo booking.

- [ ] **Step 4: Teste real controlado**

Criar uma reserva de teste futura, confirmar WhatsApp + Calendar e consultar `joelma_bookings.calendar_event_id` não nulo.

---

### Task 6: Regressão, deploy e validação final

**Files:**
- Potentially Modify: `service-worker.js`, `public/service-worker.js` somente se cache impedir atualização.

- [ ] **Step 1: Verificar diff contra main**

Confirmar que nenhuma credencial foi adicionada e que o scaffold Next.js não foi alterado sem necessidade.

- [ ] **Step 2: Validar produção/preview**

Verificar abertura mobile/desktop, Entrar/Sair, cadastro, login, recuperação, disponibilidade, Minha Conta, admin e VIP vazio.

- [ ] **Step 3: Testar agendamento ponta a ponta**

Confirmar duração 1h30, registro Supabase, WhatsApp, evento Calendar e `calendar_event_id` persistido.

- [ ] **Step 4: Confirmar segurança**

Verificar logs recentes de Auth/Edge Function sem novos erros relevantes e nenhum segredo no frontend.

- [ ] **Step 5: Promover versão validada**

Somente depois dos testes, integrar a branch validada à linha de produção seguindo o mecanismo disponível de GitHub/Vercel.

- [ ] **Step 6: Relatório final**

Registrar commits/deploy, testes que passaram, pendências não bloqueantes e estado final do app.
