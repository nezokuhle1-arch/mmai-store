-- ============================================================
-- MMAI — AUTH LINKAGE, PREFERENCES, MEMBERSHIP TIER, AND RLS
-- Run this in the Supabase SQL editor, AFTER 001_customers_and_barcode.sql
-- has already been run. This does not replace that file — it extends it.
-- ============================================================

-- 1. Link customers to Supabase's built-in auth.users table
alter table customers
  add column if not exists user_id uuid unique references auth.users(id) on delete cascade;

-- 2. New preference fields (collected in "Step 2 / Preferences")
alter table customers
  add column if not exists date_of_birth date,
  add column if not exists shopping_preference text check (shopping_preference in ('him', 'her', 'both')),
  add column if not exists interests text[] default '{}',
  add column if not exists size_preference text;

comment on column customers.shopping_preference is
  'Persistent, account-level preference — distinct from the anonymous 
   session-only gender filter used in DrawerMenu/CategoryGrid for 
   non-logged-in browsing. This does NOT filter product visibility, 
   only personalizes the logged-in experience.';

comment on column customers.membership_tier is
  'SELF | MAISON DU SELF — chosen by the customer at sign-up via the 
   tier toggle on the account creation page. Both tiers are fully 
   available at launch (no "coming soon" gating). Currently drives 
   cosmetic/perks-level UI only (account badge, personalized copy, 
   tier-specific card color) — does NOT filter product catalog 
   visibility. Tier-based product gating is an explicit Phase 4 
   item, to be built once real Shopify inventory/tagging exists, 
   not against the current 4-item mock catalog.';

-- ============================================================
-- 3. Auto-create the customers row when someone signs up,
--    now also capturing their chosen membership_tier
-- ============================================================
-- The client passes BOTH preferred_name and membership_tier via 
-- supabase.auth.signUp()'s options.data — e.g.:
--   supabase.auth.signUp({
--     email, password,
--     options: { 
--       data: { 
--         preferred_name: 'Khanyisa',
--         membership_tier: 'MAISON DU SELF'  // or 'SELF'
--       } 
--     }
--   })

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.customers (user_id, preferred_name, membership_tier)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'preferred_name', 'Member'),
    coalesce(new.raw_user_meta_data->>'membership_tier', 'SELF')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- Note: inserting into `customers` here automatically fires the 
-- EXISTING `set_barcode_id` trigger from 001_customers_and_barcode.sql, 
-- so the barcode_id is generated identically regardless of tier — 
-- confirmed no tier-based barcode format variation, per decision.

-- ============================================================
-- 4. Row Level Security — customers can only see/edit their OWN row
-- ============================================================

alter table customers enable row level security;

drop policy if exists "Users can view own customer row" on customers;
create policy "Users can view own customer row"
  on customers for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own customer row" on customers;
create policy "Users can update own customer row"
  on customers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- No public INSERT policy needed — rows are only ever created by 
-- the handle_new_user() trigger above (security definer), not by 
-- direct client inserts.

-- ============================================================
-- 5. "Forgot your barcode?" — secure lookup function
-- ============================================================
-- Returns only a boolean (account exists or not) — never the barcode 
-- directly, to prevent account enumeration. Actually EMAILING the 
-- barcode requires a Supabase Edge Function wired to an email provider 
-- (Resend, Postmark, etc.) — separate follow-up infrastructure, not 
-- covered here.

create or replace function request_barcode_recovery(lookup_email text)
returns boolean as $$
declare
  found_user_id uuid;
begin
  select id into found_user_id
  from auth.users
  where email = lookup_email;

  return found_user_id is not null;
end;
$$ language plpgsql security definer;

-- ============================================================
-- USAGE EXAMPLES
-- ============================================================

-- Sign up with tier choice (from client):
--   supabase.auth.signUp({
--     email: 'khanyisa@example.com',
--     password: '...',
--     options: { 
--       data: { 
--         preferred_name: 'Khanyisa',
--         membership_tier: 'MAISON DU SELF'
--       } 
--     }
--   })
--   → auth.users row created → trigger fires → customers row created 
--     with barcode_id 'MMAI-Khanyisa-001' AND membership_tier 
--     'MAISON DU SELF'

-- Fetch own profile, including tier (after sign-in, from client):
--   supabase.from('customers')
--     .select('*')  // includes membership_tier
--     .eq('user_id', session.user.id)
--     .single()

-- Update preferences (Step 2 of account creation, or later edits):
--   supabase.from('customers').update({
--     date_of_birth: '1999-05-16',
--     shopping_preference: 'her',
--     interests: ['hoodies', 'coats'],
--     size_preference: 'M'
--   }).eq('user_id', session.user.id)

-- Forgot barcode (from client, unauthenticated):
--   supabase.rpc('request_barcode_recovery', { lookup_email: 'khanyisa@example.com' })