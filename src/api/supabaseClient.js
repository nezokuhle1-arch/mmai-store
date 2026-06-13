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
 * Sign up a new customer. The database trigger generates the
 * barcode_id automatically (e.g. "MMAI-Sanele-001").
 *
 * @param {string} preferredName - e.g. "Sanele"
 * @returns {Promise<{ barcode_id: string, customer_number: number }>}
 */
export async function signUpCustomer(preferredName) {
  const { data, error } = await supabase
    .from('customers')
    .insert({ preferred_name: preferredName })
    .select('id, barcode_id, customer_number, preferred_name, membership_tier')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Look up a customer by their barcode ID (used as login credential
 * and identity display across the platform).
 *
 * @param {string} barcodeId - e.g. "MMAI-Sanele-001"
 */
export async function getCustomerByBarcode(barcodeId) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('barcode_id', barcodeId)
    .single();

  if (error) throw error;
  return data;
}
