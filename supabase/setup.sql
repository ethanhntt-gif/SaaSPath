-- ============================================================================
-- SaaSPath: DATABASE SETUP
-- ============================================================================
-- Supabase Dashboard -> SQL Editor -> New query -> paste everything -> Run.
--
-- Creates FOUR tables:
--   public.products          -> user submissions (private to their author, public read)
--   public.profiles          -> every registered user (public read)
--   public.saaspath          -> processes built from products (public read)
--   public.saaspath_products -> many-to-many link between a process and its products
--
-- Safe to re-run: tables use "if not exists" and policies are dropped and
-- recreated before being created again.
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

-- Existing installs: add the columns if the table was created before they existed.
alter table public.products
  add column if not exists saaspath_name text not null default '';
alter table public.products
  add column if not exists product_slug text not null default '';

-- Backfill slugs for products created before the column existed.
update public.products
set product_slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
where product_slug = '';

update public.products
set product_slug = 'product'
where product_slug = '';

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


-- ============================================================================
-- 2. PROFILES  (every registered user)
-- ============================================================================
-- One row per auth user. A trigger keeps this table in sync automatically:
-- whenever someone signs up (e.g. via Google), a profile row is created.
--
-- Access model:
--   * SELECT -> public: the list of registered users is visible to everyone.
--   * INSERT -> handled by the trigger (security definer), not by clients.
--   * UPDATE -> authenticated owner only (e.g. change display name).
-- ============================================================================

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  full_name    text,
  avatar_url   text,
  provider     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

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
-- Auto-create a profile whenever a new user signs up.
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
-- Backfill profiles for users who signed up before this table existed.
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


-- ============================================================================
-- 3. SAASPATH  (a process built from products)
-- ============================================================================
-- A process (workflow) is a named collection of products. The products
-- themselves live in public.products; the link between a process and its
-- products is stored in public.saaspath_products so a product can be reused
-- across several processes.
--
-- Access model:
--   * SELECT -> public: processes are visible to everyone.
--   * INSERT -> authenticated owner only.
--   * UPDATE -> authenticated owner only.
--   * DELETE -> authenticated owner only.
-- ============================================================================

create table if not exists public.saaspath (
  saaspath_id    text primary key,
  user_id        uuid not null references auth.users (id) on delete cascade,
  name           text not null default '',
  saaspath_slug  text not null default '',
  description    text not null default '',
  category       text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists saaspath_user_id_idx    on public.saaspath (user_id);
create index if not exists saaspath_slug_idx       on public.saaspath (saaspath_slug);
create index if not exists saaspath_created_at_idx on public.saaspath (created_at desc);

alter table public.saaspath enable row level security;

drop policy if exists "Saaspaths are publicly readable" on public.saaspath;
create policy "Saaspaths are publicly readable"
  on public.saaspath
  for select
  using (true);

drop policy if exists "Users can insert their own saaspaths" on public.saaspath;
create policy "Users can insert their own saaspaths"
  on public.saaspath
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own saaspaths" on public.saaspath;
create policy "Users can update their own saaspaths"
  on public.saaspath
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own saaspaths" on public.saaspath;
create policy "Users can delete their own saaspaths"
  on public.saaspath
  for delete
  to authenticated
  using (auth.uid() = user_id);


-- ============================================================================
-- 4. SAASPATH_PRODUCTS  (many-to-many link with step order)
-- ============================================================================
create table if not exists public.saaspath_products (
  saaspath_id  text not null references public.saaspath (saaspath_id) on delete cascade,
  product_id   text not null references public.products (product_id) on delete cascade,
  step_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  primary key (saaspath_id, product_id)
);

create index if not exists saaspath_products_saaspath_id_idx
  on public.saaspath_products (saaspath_id, step_order);
create index if not exists saaspath_products_product_id_idx
  on public.saaspath_products (product_id);

alter table public.saaspath_products enable row level security;

drop policy if exists "Saaspath products are publicly readable" on public.saaspath_products;
create policy "Saaspath products are publicly readable"
  on public.saaspath_products
  for select
  using (true);

drop policy if exists "Users can insert products into their own saaspaths" on public.saaspath_products;
create policy "Users can insert products into their own saaspaths"
  on public.saaspath_products
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.saaspath s
      where s.saaspath_id = saaspath_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update products in their own saaspaths" on public.saaspath_products;
create policy "Users can update products in their own saaspaths"
  on public.saaspath_products
  for update
  to authenticated
  using (
    exists (
      select 1 from public.saaspath s
      where s.saaspath_id = saaspath_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.saaspath s
      where s.saaspath_id = saaspath_id and s.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete products from their own saaspaths" on public.saaspath_products;
create policy "Users can delete products from their own saaspaths"
  on public.saaspath_products
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.saaspath s
      where s.saaspath_id = saaspath_id and s.user_id = auth.uid()
    )
  );


-- ============================================================================
-- 5. AUTO-SYNC: keep saaspath in sync with products
-- ============================================================================
-- Whenever a product is inserted, make sure a process (saaspath) exists for its
-- saaspath_slug and attach the product to it through saaspath_products.
--
-- The process is shared per saaspath_slug: the first product for a given path
-- creates the process, and every later product for the same path is attached to
-- the same process. SECURITY DEFINER lets the trigger write to both tables
-- regardless of RLS, so products from different users land in one process.
--
-- The process name comes from `products.saaspath_name`, which the submission
-- form fills with the catalog name (e.g. "Steps For Organic Video Content Factory").
-- ============================================================================
create or replace function public.sync_product_to_saaspath()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_saaspath_id text;
  v_next_order  integer;
  v_name        text;
begin
  -- Prefer the catalog process name, then the product name, then the slug.
  v_name := coalesce(
    nullif(new.saaspath_name, ''),
    nullif(new.name, ''),
    new.saaspath_slug
  );

  -- Find an existing process for this saaspath_slug, or create one.
  select saaspath_id
    into v_saaspath_id
    from public.saaspath
   where saaspath_slug = new.saaspath_slug
   order by created_at asc
   limit 1;

  if v_saaspath_id is null then
    v_saaspath_id := 'sp_' || new.saaspath_slug || '_' || substr(md5(random()::text), 1, 6);

    insert into public.saaspath (saaspath_id, user_id, name, saaspath_slug, description, category)
    values (
      v_saaspath_id,
      new.user_id,
      v_name,
      new.saaspath_slug,
      new.description,
      ''
    );
  end if;

  -- Append the product at the end of the process.
  select coalesce(max(step_order), -1) + 1
    into v_next_order
    from public.saaspath_products
   where saaspath_id = v_saaspath_id;

  insert into public.saaspath_products (saaspath_id, product_id, step_order)
  values (v_saaspath_id, new.product_id, v_next_order)
  on conflict (saaspath_id, product_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_product_created_sync_saaspath on public.products;
create trigger on_product_created_sync_saaspath
  after insert on public.products
  for each row
  execute function public.sync_product_to_saaspath();

-- ----------------------------------------------------------------------------
-- Backfill: create processes and links for products that already exist.
-- ----------------------------------------------------------------------------
-- One process per saaspath_slug, using the earliest product as the source of the
-- process name/description/owner.
insert into public.saaspath (saaspath_id, user_id, name, saaspath_slug, description, category)
select distinct on (p.saaspath_slug)
  'sp_' || p.saaspath_slug || '_' || substr(md5(random()::text), 1, 6),
  p.user_id,
  coalesce(nullif(p.saaspath_name, ''), nullif(p.name, ''), p.saaspath_slug),
  p.saaspath_slug,
  p.description,
  ''
from public.products p
where not exists (
  select 1 from public.saaspath s where s.saaspath_slug = p.saaspath_slug
)
order by p.saaspath_slug, p.created_at asc;

insert into public.saaspath_products (saaspath_id, product_id, step_order)
select
  s.saaspath_id,
  p.product_id,
  row_number() over (partition by s.saaspath_id order by p.created_at asc) - 1
from public.products p
join public.saaspath s on s.saaspath_slug = p.saaspath_slug
on conflict (saaspath_id, product_id) do nothing;
