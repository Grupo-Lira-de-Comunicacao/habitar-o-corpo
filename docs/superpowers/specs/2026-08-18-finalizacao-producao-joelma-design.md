# Habitar o Corpo — desenho final de produção

Data: 2026-08-18
Status: aprovado em conversa por Lira para implementação no projeto Habitar o Corpo.

## Objetivo

Finalizar o app/PWA Habitar o Corpo para uso real preservando o fluxo de produção já validado:

Cadastro → confirmação por e-mail → login → agendamento → Supabase → WhatsApp → Google Calendar.

A implementação deve ser incremental, reversível e compatível com o ambiente atual. O fluxo crítico validado não deve ser reestruturado sem necessidade.

## Escopo aprovado

### 1. Pagamento/Pix

- Substituir a chave Pix provisória pela chave Pix oficial informada por Lira.
- A chave é do tipo CPF.
- Não registrar o número completo em documentação ou logs desnecessários.
- Exibir apenas quando o fluxo de pagamento exigir.
- Não realizar qualquer movimentação financeira automática.

### 2. Área VIP

- Remover conteúdo de demonstração, incluindo vídeo placeholder e imagens genéricas usadas apenas como exemplo.
- A área VIP deve permanecer funcional, porém sem conteúdo fictício.
- Quando não houver conteúdo real publicado, exibir mensagem profissional de estado vazio: “Conteúdo exclusivo em preparação”.
- O acesso VIP continuará determinado no backend pelo perfil do usuário (`is_vip`).

### 3. Persistência real no Supabase

- Serviços administráveis e conteúdos VIP não devem depender de `localStorage` como fonte autoritativa.
- Criar persistência no Supabase para conteúdos VIP e, quando necessário, para dados administrativos de serviços.
- O frontend pode manter cache local apenas como otimização, nunca como fonte de verdade para dados administrativos.
- Acesso de escrita deve ser restrito a administradores autenticados.
- Clientes devem receber apenas conteúdo autorizado e compatível com seu nível de acesso.

### 4. Rastreabilidade do Google Calendar

- O evento do Google Calendar já é criado corretamente pelo n8n.
- Ajustar o fluxo para gravar o ID do evento do Calendar em `joelma_bookings.calendar_event_id`.
- A gravação deve usar o `bookingId` já existente como chave de correlação.
- Falha ao gravar o ID não deve duplicar a reserva nem o evento; deve ser observável por log/estado técnico.

### 5. LGPD e privacidade

- Disponibilizar Política de Privacidade em linguagem clara dentro do app.
- Informar finalidade de cadastro, autenticação, agendamento, comunicação operacional, registro de atendimento e métricas de uso.
- Separar dados operacionais/estatísticos de quaisquer dados sensíveis.
- Aplicar minimização de dados e acesso administrativo restrito.
- Não expor dados de clientes em logs, respostas públicas ou frontend de outros usuários.
- Preservar o consentimento de termos já coletado no cadastro e registrar sua data quando disponível.

### 6. Segurança

- Manter autenticação Supabase como fonte de identidade.
- Manter agendamento protegido por usuário autenticado no backend.
- Manter funções administrativas protegidas por verificação de administrador no backend.
- Remover dependências de credenciais/sessões legadas armazenadas em `localStorage`.
- Não incluir segredos, service role, senha SMTP, senha de app Google ou tokens em código ou commits.
- Revisar alertas de segurança aplicáveis ao projeto sem alterar componentes compartilhados do ecossistema ATLAS sem necessidade.

### 7. Limpeza de produção

- Remover referências de demonstração alcançáveis no app de produção.
- Remover ou neutralizar código legado de sessão/clientes locais apenas quando houver substituição backend comprovada.
- Não apagar arquivos ou componentes potencialmente necessários ao build sem validação prévia.
- A remoção destrutiva de arquivos importantes fica fora deste escopo automático e segue a governança ATLAS.

## Arquitetura proposta

### Frontend

O frontend continua sendo a PWA estática atual servida em produção. Mudanças devem ser concentradas no fluxo existente, evitando migração estrutural para o scaffold Next.js não relacionado presente em `src/`.

Responsabilidades:

- autenticação e sessão via Supabase Auth;
- leitura dos dados públicos/cliente via Edge Functions;
- painel administrativo usando ações autenticadas do backend;
- estado vazio VIP quando não houver conteúdo;
- política de privacidade e consentimentos;
- Pix oficial no ponto apropriado da experiência.

### Backend Supabase

`joelma-booking` permanece o backend operacional principal para reservas, conta e administração.

Novas responsabilidades necessárias:

- leitura segura de conteúdos VIP para cliente autorizado;
- CRUD administrativo de conteúdos VIP;
- leitura/gestão de serviços pelo backend caso o frontend ainda use `localStorage` como fonte autoritativa;
- atualização segura de `calendar_event_id` a partir da automação.

### Banco de dados

Criar estruturas mínimas e explícitas para conteúdo VIP, e adaptar serviços somente se necessário para eliminar fonte autoritativa local.

Requisitos:

- chave primária estável;
- `status`/ativo;
- ordenação;
- timestamps;
- tipo/categoria;
- conteúdo textual e/ou URL de mídia;
- acesso restrito;
- escrita administrativa somente via backend/service role;
- leitura pública direta bloqueada quando não for necessária.

### n8n

Preservar o workflow ativo de agendamento.

Após a criação do evento do Google Calendar:

1. obter o ID real retornado pelo nó do Calendar;
2. chamar o backend de Joelma com `bookingId` + `calendarEventId` por uma ação autenticada de automação/token técnico já controlado pelo fluxo;
3. gravar o ID na reserva correspondente;
4. manter comportamento idempotente.

Não recriar o workflow do zero se uma alteração incremental resolver.

## Fluxos de erro

- Conteúdo VIP indisponível: mostrar estado vazio/indisponível sem vazar erro técnico.
- Falha de leitura administrativa: manter dados não editáveis e informar falha ao administrador.
- Falha ao gravar `calendar_event_id`: reserva e evento permanecem válidos; registrar falha técnica para correção posterior.
- Falha do WhatsApp: não cancelar reserva automaticamente; manter estado de notificação para reprocessamento/diagnóstico.
- Falha do Calendar: não criar segunda reserva; expor o estado técnico no backend/admin.

## Testes obrigatórios

### Build e regressão

- build de produção concluído;
- `/` abre a PWA correta;
- mobile e desktop sem regressão crítica;
- Entrar/Sair continua visível e funcional;
- Service Worker/PWA não prende versão antiga após deploy.

### Autenticação

- cadastro;
- confirmação de e-mail;
- login por e-mail/senha;
- login por WhatsApp/senha;
- recuperação e redefinição de senha;
- logout.

### Agendamento

- disponibilidade real;
- reserva autenticada;
- duração 1h30;
- WhatsApp enviado;
- Google Calendar criado;
- `calendar_event_id` persistido no Supabase;
- reserva visível em Minha Conta e no admin.

### VIP/Admin

- cliente não VIP não acessa conteúdo VIP;
- cliente VIP acessa conteúdo publicado;
- sem conteúdo publicado aparece “Conteúdo exclusivo em preparação”;
- admin consegue listar e administrar conteúdo persistido;
- refresh em outro navegador/dispositivo preserva dados por estarem no servidor.

### Privacidade

- Política de Privacidade acessível;
- nenhum segredo exposto no frontend;
- nenhum dado sensível de um cliente aparece para outro;
- logs técnicos não registram senha, token ou conteúdo sensível desnecessário.

## Critério de conclusão

A finalização será considerada concluída quando:

1. o fluxo já validado de cadastro/agendamento continuar funcionando;
2. Pix provisório tiver sido substituído pela chave oficial;
3. conteúdo VIP fictício não estiver mais em produção;
4. VIP/serviços administrativos essenciais tiverem fonte de verdade no Supabase;
5. `calendar_event_id` estiver sendo gravado nas novas reservas;
6. Política de Privacidade/LGPD estiver disponível;
7. build e testes de regressão passarem;
8. produção estiver estável após o deploy.

## Fora de escopo imediato

- contratação ou upgrade de serviços pagos;
- cobrança automática;
- prontuário clínico ou armazenamento de conteúdo íntimo/sensível;
- migração completa da PWA para o scaffold Next.js legado;
- exclusão destrutiva ampla do repositório ou de dados históricos.
