-- ============================================================================
-- SaaSPath: PROFILES  (all registered users)
-- ============================================================================
-- Supabase Dashboard -> SQL Editor -> New query -> paste everything -> Run.
--
-- Creates ONE table:
--   public.profiles -> every registered user (public read)
--
-- A trigger on auth.users keeps this table in sync automatically: whenever
-- someone signs up (e.g. via Google OAuth), a profile row is created or updated.
--
-- Access model:
--   * SELECT -> public: the list of registered users is visible to everyone.
--   * INSERT -> handled by the trigger (security definer), not by clients.
--   * UPDATE -> authenticated owner only (e.g. change display name).
--   * DELETE -> not allowed for clients (rows are removed with the auth user).
--
-- Safe to re-run: the table uses "if not exists", the function is replaced,
-- and the trigger/policies are dropped before being recreated.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Table
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  full_name    text,
  avatar_url   text,
  provider     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Existing installs: add columns if the table was created before they existed.
alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists provider   text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- Newest users first.
create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

-- ----------------------------------------------------------------------------
-- 2. Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Anyone can read the list of registered users.
drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles
  for select
  using (true);

-- Users can update their own profile.
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 3. Auto-create / update a profile whenever a user signs up or changes.
-- SECURITY DEFINER lets the trigger write to public.profiles regardless of RLS.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_app_meta_data ->> 'provider'
  )
  on conflict (id) do update set
    email      = excluded.email,
    full_name  = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    provider   = coalesce(excluded.provider, public.profiles.provider),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row
  execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. Backfill profiles for users who signed up before this table existed.
-- ----------------------------------------------------------------------------
insert into public.profiles (id, email, full_name, avatar_url, provider)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  u.raw_user_meta_data ->> 'avatar_url',
  u.raw_app_meta_data ->> 'provider'
from auth.users u
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 5. Verify: list the registered users.
-- ----------------------------------------------------------------------------
select id, email, full_name, provider, created_at
from public.profiles
order by created_at desc;
