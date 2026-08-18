-- Habitar o Corpo — produção: catálogo enriquecido, VIP, configuração e rastreabilidade do Calendar

create schema if not exists private;

alter table public.joelma_services
  add column if not exists description text not null default '',
  add column if not exists benefits jsonb not null default '[]'::jsonb,
  add column if not exists sort_order integer not null default 0;

alter table public.joelma_services enable row level security;

update public.joelma_services set
  description = case id
    when 'terapia-tantrica-integrativa' then 'Atendimento integrativo com foco em presença, consciência corporal, acolhimento e reconexão consigo.'
    when 'curso-vip-massagem-integrativa-tantrica' then 'Experiência individual de aprendizado com orientação personalizada, ética e linguagem profissional.'
    when 'epilacao-cera-hidrossoluvel-depilacao' then 'Serviço de cuidado corporal com técnica, higiene e atendimento reservado.'
    when 'vivencia-erotismo-mistico' then 'Vivência reservada para autoconhecimento, presença e consciência corporal, conduzida com respeito e ética.'
    when 'massagem-pedras-quentes' then 'Massagem relaxante com pedras aquecidas para conforto, descanso e bem-estar corporal.'
    when 'vivencia-massagem-nuru' then 'Vivência corporal reservada, conduzida com cuidado, consentimento e ambiente preparado.'
    when 'massagem-relaxante-terapeutica' then 'Técnicas terapêuticas para relaxamento, alívio de tensões e bem-estar.'
    when 'terapia-massagem-tantrica-homens' then 'Atendimento individual para homens com foco em consciência corporal, respiração e presença.'
    when 'terapia-massagem-tantrica-mulheres' then 'Atendimento individual para mulheres com foco em cuidado, reconexão e acolhimento.'
    when 'atendimento-online' then 'Sessão online para orientação, escuta e acompanhamento integrativo.'
    when 'atendimento-externo' then 'Atendimento fora do espaço principal, mediante consulta prévia de disponibilidade e deslocamento.'
    else description
  end,
  benefits = case id
    when 'terapia-tantrica-integrativa' then '["Presença corporal","Autoconhecimento","Acolhimento individual"]'::jsonb
    when 'curso-vip-massagem-integrativa-tantrica' then '["Orientação personalizada","Prática guiada","Conteúdo reservado"]'::jsonb
    when 'epilacao-cera-hidrossoluvel-depilacao' then '["Cuidado estético","Ambiente reservado","Atendimento profissional"]'::jsonb
    when 'vivencia-erotismo-mistico' then '["Autoconhecimento","Presença","Cuidado reservado"]'::jsonb
    when 'massagem-pedras-quentes' then '["Relaxamento","Conforto térmico","Alívio de tensões"]'::jsonb
    when 'vivencia-massagem-nuru' then '["Consciência corporal","Presença","Ambiente reservado"]'::jsonb
    when 'massagem-relaxante-terapeutica' then '["Bem-estar","Relaxamento profundo","Cuidado humanizado"]'::jsonb
    when 'terapia-massagem-tantrica-homens' then '["Respiração","Presença corporal","Acolhimento"]'::jsonb
    when 'terapia-massagem-tantrica-mulheres' then '["Reconexão","Acolhimento","Autoconhecimento"]'::jsonb
    when 'atendimento-online' then '["Acesso remoto","Orientação individual","Praticidade"]'::jsonb
    when 'atendimento-externo' then '["Flexibilidade","Consulta prévia","Atendimento personalizado"]'::jsonb
    else benefits
  end,
  sort_order = case id
    when 'terapia-tantrica-integrativa' then 10
    when 'curso-vip-massagem-integrativa-tantrica' then 20
    when 'epilacao-cera-hidrossoluvel-depilacao' then 30
    when 'vivencia-erotismo-mistico' then 40
    when 'massagem-pedras-quentes' then 50
    when 'vivencia-massagem-nuru' then 60
    when 'massagem-relaxante-terapeutica' then 70
    when 'terapia-massagem-tantrica-homens' then 80
    when 'terapia-massagem-tantrica-mulheres' then 90
    when 'atendimento-online' then 100
    when 'atendimento-externo' then 110
    else sort_order
  end,
  updated_at = now();

create table if not exists public.joelma_vip_contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  content_type text not null check (content_type in ('video','photo','text','pdf','link')),
  category text not null default 'Conteúdo',
  media_url text not null default '',
  text_content text not null default '',
  thumbnail_url text not null default '',
  status text not null default 'draft' check (status in ('draft','active','archived')),
  access_level text not null default 'VIP' check (access_level in ('VIP')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.joelma_vip_contents enable row level security;

create table if not exists private.joelma_app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

revoke all on table private.joelma_app_settings from anon, authenticated;

create or replace function public.joelma_mark_calendar_event(
  p_booking_id uuid,
  p_notification_token text,
  p_calendar_event_id text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_updated uuid;
begin
  if length(coalesce(p_notification_token, '')) <> 64
     or p_notification_token !~ '^[0-9a-fA-F]{64}$'
     or length(trim(coalesce(p_calendar_event_id, ''))) < 3
     or length(trim(coalesce(p_calendar_event_id, ''))) > 255 then
    return false;
  end if;

  update public.joelma_bookings
     set calendar_event_id = trim(p_calendar_event_id),
         updated_at = now()
   where id = p_booking_id
     and notification_token = lower(p_notification_token)
     and (calendar_event_id is null or calendar_event_id = trim(p_calendar_event_id))
  returning id into v_updated;

  return v_updated is not null;
end;
$$;

revoke all on function public.joelma_mark_calendar_event(uuid,text,text) from public, anon, authenticated;
grant execute on function public.joelma_mark_calendar_event(uuid,text,text) to service_role;
