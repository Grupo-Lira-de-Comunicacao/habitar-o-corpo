# Autenticação v2 — Habitar o Corpo

## Objetivo

Cadastro único com nome, WhatsApp, e-mail e senha. Login normal por WhatsApp + senha, com e-mail também aceito como identificador alternativo. E-mail permanece como canal de confirmação de cadastro e recuperação de senha.

## Segurança

- A senha fica exclusivamente no Supabase Auth.
- O app nunca grava senha em localStorage nem em tabelas próprias.
- Login por WhatsApp é resolvido server-side pela Edge Function `joelma-auth`; o e-mail real não é exposto na resposta.
- Recuperação usa `resetPasswordForEmail` e `updateUser({ password })`.
- Agendamento continua público para consulta de disponibilidade, mas a confirmação exige sessão autenticada.
- Eventos de CRM são mínimos e separados de qualquer conteúdo íntimo/sensível. `customer_events` não guarda mensagens, observações, tokens ou senhas.

## Compatibilidade

Usuários criados anteriormente por magic link continuam válidos. Para o primeiro acesso pelo novo modelo, usam “Esqueci minha senha” no e-mail já cadastrado e definem uma senha; depois entram normalmente por WhatsApp + senha.

O painel administrativo permanece com magic link nesta etapa para não interromper o acesso da Joelma enquanto o login de clientes é migrado.
