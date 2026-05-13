import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

function authorized(password: string | null) {
  return Boolean(process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);
}

async function withSignedDocUrls<T extends { license_doc_url: string | null }>(items: T[]) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return items.map((item) => ({ ...item, license_doc_signed_url: null }));

  return Promise.all(
    items.map(async (item) => {
      if (!item.license_doc_url) return { ...item, license_doc_signed_url: null };
      const { data } = await supabase.storage.from('license-docs').createSignedUrl(item.license_doc_url, 60 * 10);
      return { ...item, license_doc_signed_url: data?.signedUrl ?? null };
    }),
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!authorized(url.searchParams.get('password'))) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service role credentials are missing.' }, { status: 503 });
  }

  const { data, error } = await supabase.from('surveyors').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ surveyors: await withSignedDocUrls(data ?? []) });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  if (!authorized(body.password)) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service role credentials are missing.' }, { status: 503 });
  }

  const status = body.status === 'approved' ? 'approved' : 'rejected';
  const { data, error } = await supabase
    .from('surveyors')
    .update({
      status,
      admin_approved: status === 'approved',
    })
    .eq('id', body.id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const [surveyor] = await withSignedDocUrls([data]);
  return NextResponse.json({ surveyor });
}
