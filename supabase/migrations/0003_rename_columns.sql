-- ============================================================================
-- 0003_rename_columns.sql
--
-- Variant A naming: every column is prefixed with the entity it belongs to.
--
--   products:
--     id        -> product_id       (PK)
--     slug      -> product_slug
--     path_slug -> saaspath_slug
--     path_id   -> saaspath_id
--     path_name -> saaspath_name
--
--   saaspath:
--     id        -> saaspath_id      (PK)
--     slug      -> saaspath_slug
--
--   saaspath_products already uses saaspath_id / product_id — no change.
--
-- PostgreSQL updates foreign keys and dependent objects automatically when a
-- column is renamed, so `saaspath_products.product_id` keeps pointing at the
-- renamed `products.product_id`.
--
-- This migration is IDEMPOTENT: each rename runs only when the old column
-- still exists, so it is safe to run again on an already-migrated database.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. products
-- ----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'id'
  ) then
    alter table public.products rename column id to product_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'slug'
  ) then
    alter table public.products rename column slug to product_slug;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'path_slug'
  ) then
    alter table public.products rename column path_slug to saaspath_slug;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'path_id'
  ) then
    alter table public.products rename column path_id to saaspath_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'path_name'
  ) then
    alter table public.products rename column path_name to saaspath_name;
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 2. saaspath
-- ----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'saaspath' and column_name = 'id'
  ) then
    alter table public.saaspath rename column id to saaspath_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'saaspath' and column_name = 'slug'
  ) then
    alter table public.saaspath rename column slug to saaspath_slug;
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 3. Recreate indexes with names that match the new columns
-- ----------------------------------------------------------------------------
drop index if exists public.products_path_slug_idx;
create index if not exists products_saaspath_slug_idx on public.products (saaspath_slug);

drop index if exists public.saaspath_slug_idx;
create index if not exists saaspath_slug_idx on public.saaspath (saaspath_slug);

-- ----------------------------------------------------------------------------
-- 4. Recreate the auto-sync trigger function with the new column names
-- ----------------------------------------------------------------------------
-- NOTE: at this point in the migration history `products.saaspath_id` still
-- exists (it is dropped later in 0004), so the generated process id can use it.
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
  -- Prefer the catalog name, then the product name, then the process slug.
  v_name := coalesce(
    nullif(new.saaspath_name, ''),
    nullif(new.name, ''),
    new.saaspath_slug
  );

  -- Reuse an existing process for this slug, otherwise create one.
  select saaspath_id
    into v_saaspath_id
    from public.saaspath
   where saaspath_slug = new.saaspath_slug
   order by created_at asc
   limit 1;

  if v_saaspath_id is null then
    v_saaspath_id := 'sp_' || new.saaspath_slug || '_' || substr(md5(random()::text), 1, 6);

    insert into public.saaspath (saaspath_id, user_id, name, saaspath_slug, description, category)
    values (v_saaspath_id, new.user_id, v_name, new.saaspath_slug, new.description, '');
  end if;

  -- Append the product to the end of the process.
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

-- The trigger itself is unchanged; recreate it so it picks up the new function.
drop trigger if exists on_product_created_sync_saaspath on public.products;
create trigger on_product_created_sync_saaspath
  after insert on public.products
  for each row
  execute function public.sync_product_to_saaspath();
