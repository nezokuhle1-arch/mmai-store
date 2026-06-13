-- ============================================================
-- MMAI — CUSTOMERS TABLE & BARCODE ID GENERATION
-- Run this in the Supabase SQL editor (Project > SQL Editor)
--
-- Barcode format: MMAI-<PreferredName>-<3-digit sequence>
-- e.g. first signup "Sanele" -> "MMAI-Sanele-001"
--
-- The sequence number is the source of uniqueness — guarantees
-- no collisions even if two people sign up simultaneously or
-- share the same preferred name.
-- ============================================================

-- 1. A counter that only ever increments, atomically
create sequence if not exists customer_number_seq start 1;

-- 2. The customers table — identity layer (links to Shopify via
--    shopify_customer_id once an order/account is created there)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  preferred_name text not null,
  customer_number int not null,
  barcode_id text unique not null,
  shopify_customer_id text,
  membership_tier text default 'SELF',  -- 'SELF' | 'MAISON DU SELF'
  created_at timestamptz default now()
);

-- 3. Trigger function: builds the barcode_id on every insert
create or replace function generate_barcode_id()
returns trigger as $$
declare
  clean_name text;
begin
  -- strip anything that isn't a letter, title-case it
  -- e.g. "sanele " -> "Sanele", "Sa-nele!" -> "Sanele"
  clean_name := initcap(regexp_replace(NEW.preferred_name, '[^a-zA-Z]', '', 'g'));

  if clean_name = '' then
    clean_name := 'Member';
  end if;

  -- grab the next number atomically (race-condition safe)
  NEW.customer_number := nextval('customer_number_seq');

  -- build the final barcode, zero-padded to 3 digits
  -- (e.g. 1 -> 001, 47 -> 047, 1000 -> 1000)
  NEW.barcode_id := 'MMAI-' || clean_name || '-' || lpad(NEW.customer_number::text, 3, '0');

  return NEW;
end;
$$ language plpgsql;

-- 4. Attach the trigger
drop trigger if exists set_barcode_id on customers;
create trigger set_barcode_id
before insert on customers
for each row
execute function generate_barcode_id();

-- ============================================================
-- USAGE EXAMPLES
-- ============================================================

-- Signup (insert) — barcode_id is generated automatically:
--   insert into customers (preferred_name) values ('Sanele')
--   returning barcode_id;
--   => 'MMAI-Sanele-001'

-- Login (lookup by barcode):
--   select * from customers where barcode_id = 'MMAI-Sanele-001';

-- ============================================================
-- ROW LEVEL SECURITY (recommended before going live)
-- ============================================================
-- alter table customers enable row level security;
--
-- -- Allow anyone to insert (signup)
-- create policy "Allow signup" on customers
--   for insert with check (true);
--
-- -- Allow a customer to read only their own record
-- -- (requires linking auth.uid() to a customer once Supabase Auth
-- --  is wired up — placeholder for Phase 2)
-- create policy "Allow self read" on customers
--   for select using (true); -- tighten in Phase 2
