import { NextResponse } from 'next/server';

const BOOKING_API_URL = 'https://onrmaojjvcbqbgwuhzwq.supabase.co/functions/v1/joelma-booking';

export async function GET() {
  const [catalogResponse, configResponse] = await Promise.all([
    fetch(`${BOOKING_API_URL}?action=catalog`, { cache: 'no-store' }),
    fetch(`${BOOKING_API_URL}?action=public-config`, { cache: 'no-store' }),
  ]);

  const catalog = await catalogResponse.json().catch(() => ({}));
  const config = await configResponse.json().catch(() => ({}));

  return NextResponse.json(
    {
      ok: catalogResponse.ok && catalog?.ok === true && configResponse.ok && config?.ok === true,
      catalogStatus: catalogResponse.status,
      services: Array.isArray(catalog?.services) ? catalog.services.length : 0,
      configStatus: configResponse.status,
      pixConfigured: Boolean(config?.pix?.key),
      pixTypeConfigured: Boolean(config?.pix?.type),
    },
    { status: catalogResponse.ok && configResponse.ok ? 200 : 502 },
  );
}
