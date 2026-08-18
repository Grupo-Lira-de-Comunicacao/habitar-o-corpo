-- Expõe à Edge Function apenas configurações explicitamente públicas.

create or replace function public.joelma_public_config()
returns jsonb
language sql
stable
security definer
set search_path = private, public, pg_temp
as $$
  select jsonb_build_object(
    'pixKey', coalesce((select value from private.joelma_app_settings where key = 'pix_key'), ''),
    'pixType', coalesce((select value from private.joelma_app_settings where key = 'pix_type'), '')
  );
$$;

revoke all on function public.joelma_public_config() from public, anon, authenticated;
grant execute on function public.joelma_public_config() to service_role;
