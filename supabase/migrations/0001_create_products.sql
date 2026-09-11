-- ============================================================================
-- SaaSPath: products table
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
--
-- Access model:
--   * SELECT  -> public (anon + authenticated): every created process/product
--                is visible to everyone on the home page and process pages.
--   * INSERT  -> authenticated only, and only with your own user_id.
--   * UPDATE  -> authenticated owner only.
--   * DELETE  -> authenticated owner only.
-- ============================================================================

create table if not exists public.products (
  product_id       text primary key,
  user_id          uuid not null references auth.users (id) on delete cascade,
  saaspath_slug    text not null,
  saaspath_name    text not null default '',
  step_id         text not null,
  name            text not null default '',
  product_slug    text not null default '',
  url             text not null default '',
  description     text not null default '',
  selected_tools  jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

-- Fast lookups by process (saaspath) and by owner.
create index if not exists products_saaspath_slug_idx on public.products (saaspath_slug);
create index if not exists products_user_id_idx       on public.products (user_id);
create index if not exists products_created_at_idx    on public.products (created_at desc);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;

-- Anyone (including anonymous visitors) can read all products.
drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products
  for select
  using (true);

-- Signed-in users can insert products, but only as themselves.
drop policy if exists "Users can insert their own products" on public.products;
create policy "Users can insert their own products"
  on public.products
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Owners can update their own products.
drop policy if exists "Users can update their own products" on public.products;
create policy "Users can update their own products"
  on public.products
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Owners can delete their own products.
drop policy if exists "Users can delete their own products" on public.products;
create policy "Users can delete their own products"
  on public.products
  for delete
  to authenticated
  using (auth.uid() = user_id);
