-- Grammar Tales — Supabase setup
-- Paste everything into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.

-- 0) Who counts as a teacher ---------------------------------------------
-- Only emails listed here can read results, even if someone else creates an account.
create table if not exists public.teachers (email text primary key);
alter table public.teachers enable row level security;   -- no policies: nobody can read/edit it from the website

insert into public.teachers (email) values ('duonghuynhhuyenvi2803@gmail.com')
on conflict do nothing;
-- To add another teacher later:  insert into public.teachers (email) values ('ten@email.com');

create or replace function public.is_teacher() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.teachers where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

-- 1) Table of practice attempts ------------------------------------------
create table if not exists public.attempts (
  id          uuid primary key,
  created_at  timestamptz not null default now(),
  student     text not null check (char_length(student) between 1 and 60),
  class_code  text not null default '' check (char_length(class_code) <= 30),
  lesson_id   text not null check (char_length(lesson_id) <= 40),
  unit        int,
  sit_id      text not null check (char_length(sit_id) <= 40),
  sit_title   text check (char_length(sit_title) <= 120),
  role        text check (char_length(role) <= 4),
  mode        text check (mode in ('model', 'free')),
  total       int check (total between 0 and 100),
  clarity     int check (clarity between 0 and 100),
  pron        int check (pron between 0 and 100),
  word_use    int check (word_use between 0 and 100),
  turns       jsonb not null default '[]'::jsonb check (pg_column_size(turns) < 30000)
);
create index if not exists attempts_class_idx on public.attempts (class_code, created_at desc);

alter table public.attempts enable row level security;

-- Students (not signed in) may only ADD results. Only a signed-in teacher (listed above) may read or delete.
drop policy if exists "students can submit" on public.attempts;
create policy "students can submit" on public.attempts
  for insert to anon, authenticated with check (true);

drop policy if exists "teachers can read" on public.attempts;
create policy "teachers can read" on public.attempts
  for select to authenticated using (public.is_teacher());

drop policy if exists "teachers can delete" on public.attempts;
create policy "teachers can delete" on public.attempts
  for delete to authenticated using (public.is_teacher());

grant insert on public.attempts to anon;
grant select, insert, delete on public.attempts to authenticated;

-- 2) Private bucket for voice recordings (max 2 MB per file) -------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recordings', 'recordings', false, 2097152,
        array['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/mpeg', 'audio/wav'])
on conflict (id) do nothing;

drop policy if exists "students upload recordings" on storage.objects;
create policy "students upload recordings" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'recordings');

drop policy if exists "teachers listen recordings" on storage.objects;
create policy "teachers listen recordings" on storage.objects
  for select to authenticated using (bucket_id = 'recordings' and public.is_teacher());

drop policy if exists "teachers delete recordings" on storage.objects;
create policy "teachers delete recordings" on storage.objects
  for delete to authenticated using (bucket_id = 'recordings' and public.is_teacher());
