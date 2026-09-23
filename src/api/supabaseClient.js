import { createClient } from '@supabase/supabase-js';

/* ============================================================
   MMAI — SUPABASE CLIENT
   Handles customer identity, barcode IDs, and membership tiers.
   Shopify remains the commerce backend (products, cart, orders);
   Supabase is the identity layer (signup, login, barcode IDs).

   Required .env vars:
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
   ============================================================ */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabaseClient.js] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Auth/identity features will not work until these are set in .env'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

/* ---------- IDENTITY HELPERS ---------- */

/**
 * Sign up a new customer via Supabase Auth. The `handle_new_user`
 * database trigger auto-creates the customers row (with barcode_id)
 * from options.data (raw_user_meta_data) once the auth user exists.
 *
 * @param {{ email: string, password: string, preferredName: string, membershipTier?: 'SELF' | 'MAISON DU SELF' }} params
 */
export async function signUp({ email, password, preferredName, membershipTier = 'SELF' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        preferred_name: preferredName,
        membership_tier: membershipTier,
      },
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in an existing customer.
 *
 * @param {{ email: string, password: string }} params
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out the current customer.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current session (null if not signed in).
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Fetch the current customer's full profile from the customers table,
 * including their barcode_id, membership_tier, and preferences.
 * Requires an active session (RLS enforces this).
 */
export async function getCustomerProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update the current customer's preferences (Step 2 of account creation,
 * or later profile edits). Only these columns are grantable per RLS:
 * preferred_name, date_of_birth, shopping_preference, interests, size_preference
 */
export async function updateCustomerPreferences({
  preferredName,
  dateOfBirth,
  shoppingPreference,
  interests,
  sizePreference,
}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('customers')
    .update({
      ...(preferredName && { preferred_name: preferredName }),
      ...(dateOfBirth && { date_of_birth: dateOfBirth }),
      ...(shoppingPreference && { shopping_preference: shoppingPreference }),
      ...(interests && { interests }),
      ...(sizePreference && { size_preference: sizePreference }),
    })
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Request barcode recovery. The RPC never reveals whether the email
 * exists (returns void, rate-limited) — the caller should always show
 * the same generic confirmation message regardless of outcome. Actual
 * email delivery is a future Edge Function.
 *
 * @param {string} email
 */
export async function requestBarcodeRecovery(email) {
  const { error } = await supabase.rpc('request_barcode_recovery', { lookup_email: email });
  if (error) throw error;
}
