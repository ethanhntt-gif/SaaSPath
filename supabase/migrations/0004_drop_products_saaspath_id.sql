-- ============================================================================
-- SaaSPath: drop products.saaspath_id
-- ============================================================================
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
--
-- Why:
--   `products.saaspath_id` stored the *catalog* id of the process (the short id
--   from lib/paths.ts, e.g. "vs7ssu"), NOT the primary key of a row in
--   public.saaspath (which looks like "sp_vs7ssu_0f3811").
--
--   Having the same name `saaspath_id` in both tables was misleading, and the
--   column was redundant:
--     * the product <-> process link already lives in public.saaspath_products;
--     * the process is identified by `saaspath_slug`, which is enough for the
--       trigger to find or create the process row.
--
--   So we drop the column entirely and rebuild the trigger without it.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Drop the redundant column
-- ----------------------------------------------------------------------------
alter table public.products
  drop column if exists saaspath_id;

-- ----------------------------------------------------------------------------
-- 2. Recreate the trigger function without the dropped column
-- ----------------------------------------------------------------------------
-- The process PK is now generated from the slug only:
--   'sp_' || <slug> || '_' || <random>
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
