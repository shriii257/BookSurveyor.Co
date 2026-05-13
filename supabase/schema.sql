create extension if not exists "pgcrypto";

create table if not exists public.surveyors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null unique,
  whatsapp text not null,
  profile_photo_url text,
  license_number text not null,
  years_experience integer not null,
  equipment text[] not null default '{}',
  districts_served text[] not null default '{}',
  bio text,
  license_doc_url text,
  admin_approved boolean not null default false,
  available boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

alter table public.surveyors enable row level security;

drop policy if exists "Public can view approved available surveyors" on public.surveyors;
create policy "Public can view approved available surveyors"
on public.surveyors for select
using (admin_approved = true and available = true and status = 'approved');

drop policy if exists "Public can register surveyors" on public.surveyors;
create policy "Public can register surveyors"
on public.surveyors for insert
with check (admin_approved = false and status = 'pending');

drop policy if exists "Surveyors can view own row by phone" on public.surveyors;
create policy "Surveyors can view own row by phone"
on public.surveyors for select
to authenticated
using (phone = regexp_replace(coalesce(auth.jwt() ->> 'phone', ''), '\D', '', 'g'));

drop policy if exists "Surveyors can update own row by phone" on public.surveyors;
create policy "Surveyors can update own row by phone"
on public.surveyors for update
to authenticated
using (phone = regexp_replace(coalesce(auth.jwt() ->> 'phone', ''), '\D', '', 'g'))
with check (phone = regexp_replace(coalesce(auth.jwt() ->> 'phone', ''), '\D', '', 'g'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-photos', 'profile-photos', true, 2097152, array['image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('license-docs', 'license-docs', false, 5242880, array['image/jpeg', 'image/png', 'application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can upload profile photos" on storage.objects;
create policy "Public can upload profile photos"
on storage.objects for insert
with check (bucket_id = 'profile-photos');

drop policy if exists "Public can read profile photos" on storage.objects;
create policy "Public can read profile photos"
on storage.objects for select
using (bucket_id = 'profile-photos');

drop policy if exists "Authenticated can upload license docs" on storage.objects;
create policy "Authenticated can upload license docs"
on storage.objects for insert
to authenticated
with check (bucket_id = 'license-docs');
