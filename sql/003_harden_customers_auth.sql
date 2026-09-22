-- ============================================================
-- MMAI — HARDEN CUSTOMERS AUTH, GRANTS, AND BARCODE RECOVERY
-- Run this in the Supabase SQL editor AFTER 002_auth_preferences_and_tier.sql.
-- ============================================================

-- 1. Membership tier can only be one of the two launch tiers.
update public.customers
set membership_tier = 'SELF'
where membership_tier is null
   or membership_tier not in ('SELF', 'MAISON DU SELF');

alter table public.customers
  alter column membership_tier set default 'SELF',
  alter column membership_tier set not null;

alter table public.customers
  drop constraint if exists customers_membership_tier_check;

alter table public.customers
  add constraint customers_membership_tier_check
  check (membership_tier in ('SELF', 'MAISON DU SELF'));

-- 2. Signup trigger: ignore an invalid tier, and keep the function
--    callable only by the auth service that inserts users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen_tier text;
begin
  chosen_tier := new.raw_user_meta_data->>'membership_tier';

  if chosen_tier is null or chosen_tier not in ('SELF', 'MAISON DU SELF') then
    chosen_tier := 'SELF';
  end if;

  insert into public.customers (user_id, preferred_name, membership_tier)
  values (
    new.id,
    coalesce(nullif(pg_catalog.btrim(new.raw_user_meta_data->>'preferred_name'), ''), 'Member'),
    chosen_tier
  );

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

-- 3. Barcode trigger: fixed search path, not callable from the API.
--    service_role keeps execute so a server-side insert still generates a barcode.
create or replace function public.generate_barcode_id()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  clean_name text;
begin
  clean_name := pg_catalog.initcap(
    pg_catalog.regexp_replace(new.preferred_name, '[^a-zA-Z]', '', 'g')
  );

  if clean_name = '' then
    clean_name := 'Member';
  end if;

  new.customer_number := pg_catalog.nextval('public.customer_number_seq'::regclass);
  new.barcode_id := 'MMAI-' || clean_name || '-' || pg_catalog.lpad(new.customer_number::text, 3, '0');

  return new;
end;
$$;

revoke all on function public.generate_barcode_id() from public, anon, authenticated;
grant execute on function public.generate_barcode_id() to service_role;

-- 4. Forgot-barcode queue. Clients cannot read it.
--    A later edge function reads this table and emails the barcode.
create table if not exists public.barcode_recovery_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requested_at timestamptz not null default pg_catalog.now()
);

create index if not exists barcode_recovery_requests_user_requested_idx
  on public.barcode_recovery_requests (user_id, requested_at desc);

alter table public.barcode_recovery_requests enable row level security;

revoke all on table public.barcode_recovery_requests from public, anon, authenticated, service_role;
grant select, delete on table public.barcode_recovery_requests to service_role;

-- Return type changes from boolean to void, so replace the function outright.
drop function if exists public.request_barcode_recovery(text);

create function public.request_barcode_recovery(lookup_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  found_user_id uuid;
begin
  if lookup_email is null or pg_catalog.btrim(lookup_email) = '' then
    return;
  end if;

  select id into found_user_id
  from auth.users
  where pg_catalog.lower(email) = pg_catalog.lower(pg_catalog.btrim(lookup_email));

  if found_user_id is not null
     and not exists (
       select 1
       from public.barcode_recovery_requests
       where user_id = found_user_id
         and requested_at > pg_catalog.now() - interval '15 minutes'
     )
  then
    insert into public.barcode_recovery_requests (user_id)
    values (found_user_id);
  end if;
end;
$$;

comment on function public.request_barcode_recovery(text) is
  'Records a forgot-barcode request without revealing whether the email exists. Does not return or email the barcode.';

revoke all on function public.request_barcode_recovery(text) from public;
grant execute on function public.request_barcode_recovery(text) to anon, authenticated;

-- 5. A customer can read their own row and edit profile preferences only.
drop policy if exists "Users can view own customer row" on public.customers;
create policy "Users can view own customer row"
  on public.customers
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can update own customer row" on public.customers;
create policy "Users can update own customer row"
  on public.customers
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.customers from public, anon, authenticated, service_role;
grant select on table public.customers to authenticated;
grant update (
  preferred_name,
  date_of_birth,
  shopping_preference,
  interests,
  size_preference
) on table public.customers to authenticated;
grant select, insert, update, delete on table public.customers to service_role;
