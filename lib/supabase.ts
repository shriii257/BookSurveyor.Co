import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabasePublicEnv = Boolean(supabaseUrl && supabaseAnonKey);
export const hasSupabaseAdminEnv = Boolean(supabaseUrl && supabaseServiceKey);

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!hasSupabasePublicEnv) return null;
  return createClient(supabaseUrl!, supabaseAnonKey!);
}

export function getSupabasePublicClient(): SupabaseClient | null {
  if (!hasSupabasePublicEnv) return null;
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
    },
  });
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!hasSupabaseAdminEnv) return null;
  return createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      persistSession: false,
    },
  });
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function isValidPhone(value: string) {
  return /^91\d{10}$/.test(normalizePhone(value));
}

export function storagePath(prefix: string, name: string) {
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  return `${prefix}/${Date.now()}-${safeName}`;
}
