-- ============================================================================
-- SaaSPath: FULL RESET (drop everything created by setup.sql)
-- ============================================================================
-- Supabase Dashboard -> SQL Editor -> New query -> paste everything -> Run.
--
-- This script removes EVERYTHING created by supabase/setup.sql so you can start
-- from scratch:
--   * triggers on auth.users and public.products
--   * functions  handle_new_user(), sync_product_to_saaspath()
--   * tables     saaspath_products, saaspath, profiles, products
--
-- Order matters: child tables (with foreign keys) are dropped before parents.
-- "if exists" + "cascade" make the script safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Triggers (must go before the functions they call)
-- ----------------------------------------------------------------------------
drop trigger if exists on_product_created_sync_saaspath on public.products;
drop trigger if exists on_auth_user_created on auth.users;

-- ----------------------------------------------------------------------------
-- 2. Functions
-- ----------------------------------------------------------------------------
drop function if exists public.sync_product_to_saaspath() cascade;
drop function if exists public.handle_new_user() cascade;

-- ----------------------------------------------------------------------------
-- 3. Tables (children first, then parents)
-- ----------------------------------------------------------------------------
-- saaspath_products references both saaspath and products.
drop table if exists public.saaspath_products cascade;
drop table if exists public.saaspath cascade;
drop table if exists public.profiles cascade;
drop table if exists public.products cascade;

-- ----------------------------------------------------------------------------
-- 4. Verify: this should return zero rows.
-- ----------------------------------------------------------------------------
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('products', 'profiles', 'saaspath', 'saaspath_products');
