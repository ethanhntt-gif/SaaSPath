-- ============================================================================
-- SaaSPath: saaspath + saaspath_products tables
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
--
-- Model:
--   public.products         -> every product created by users (existing table).
--   public.saaspath         -> a process (workflow) built from those products.
--   public.saaspath_products-> many-to-many link between a process and its
--                              products, with the step order inside the process.
--
-- A product can be reused across several processes, so the link lives in its
-- own table instead of a foreign key on products.
--
-- Access model:
--   * SELECT  -> public (anon + authenticated): processes are visible to all.
--   * INSERT  -> authenticated only, and only with your own user_id.
--   * UPDATE  -> authenticated owner only.
--   * DELETE  -> authenticated owner only.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SAASPATH  (a process built from products)
-- ----------------------------------------------------------------------------
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

-- Fast lookups by owner, slug and creation time.
create index if not exists saaspath_user_id_idx    on public.saaspath (user_id);
create index if not exists saaspath_slug_idx       on public.saaspath (saaspath_slug);
create index if not exists saaspath_created_at_idx on public.saaspath (created_at desc);

alter table public.saaspath enable row level security;

-- Anyone (including anonymous visitors) can read all processes.
drop policy if exists "Saaspaths are publicly readable" on public.saaspath;
create policy "Saaspaths are publicly readable"
  on public.saaspath
  for select
  using (true);

-- Signed-in users can insert processes, but only as themselves.
drop policy if exists "Users can insert their own saaspaths" on public.saaspath;
create policy "Users can insert their own saaspaths"
  on public.saaspath
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Owners can update their own processes.
drop policy if exists "Users can update their own saaspaths" on public.saaspath;
create policy "Users can update their own saaspaths"
  on public.saaspath
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Owners can delete their own processes.
drop policy if exists "Users can delete their own saaspaths" on public.saaspath;
create policy "Users can delete their own saaspaths"
  on public.saaspath
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 2. SAASPATH_PRODUCTS  (many-to-many link with step order)
-- ----------------------------------------------------------------------------
create table if not exists public.saaspath_products (
  saaspath_id  text not null references public.saaspath (saaspath_id) on delete cascade,
  product_id   text not null references public.products (product_id) on delete cascade,
  step_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  primary key (saaspath_id, product_id)
);

-- Fast lookups by process and by product.
create index if not exists saaspath_products_saaspath_id_idx
  on public.saaspath_products (saaspath_id, step_order);
create index if not exists saaspath_products_product_id_idx
  on public.saaspath_products (product_id);

alter table public.saaspath_products enable row level security;

-- Anyone can read the links so processes render for all visitors.
drop policy if exists "Saaspath products are publicly readable" on public.saaspath_products;
create policy "Saaspath products are publicly readable"
  on public.saaspath_products
  for select
  using (true);

-- Owners of the process can attach products to it.
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

-- Owners of the process can reorder / update the links.
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

-- Owners of the process can detach products from it.
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

-- ----------------------------------------------------------------------------
-- 3. AUTO-SYNC: keep saaspath in sync with products
-- ----------------------------------------------------------------------------
-- Whenever a product is inserted, make sure a process (saaspath) exists for its
-- saaspath_slug and attach the product to it through saaspath_products.
--
-- The process is shared per saaspath_slug: the first product for a given path
-- creates the process, and every later product for the same path is attached to
-- the same process. SECURITY DEFINER lets the trigger write to both tables
-- regardless of RLS, so products from different users land in one process.
--
-- The process name comes from `products.saaspath_name`, which the submission
-- form fills with the catalog name (e.g. "Steps For Organic Video Content
-- Factory").
-- ----------------------------------------------------------------------------

-- Store the catalog name of the process on each product so the trigger can use
-- it as the process name instead of the product name.
alter table public.products
  add column if not exists saaspath_name text not null default '';

-- Store a URL-safe slug generated from the product name, used in the
-- /products/<slug>-<id> address.
alter table public.products
  add column if not exists product_slug text not null default '';

-- Backfill slugs for products created before the column existed.
update public.products
set product_slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
where product_slug = '';

update public.products
set product_slug = 'product'
where product_slug = '';

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
