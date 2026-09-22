-- ============================================================
-- MMAI — GRANT AUTHENTICATED ACCESS TO CUSTOMERS TABLE
-- Run AFTER 001, 002, and 003 are already applied
-- ============================================================

-- Allow authenticated (signed-in) users to read and update 
-- their own row. INSERT stays revoked — only the signup trigger 
-- creates rows. DELETE stays revoked — rows are cleaned up 
-- automatically via the ON DELETE CASCADE on user_id when the 
-- auth user is deleted.
grant select, update on public.customers to authenticated;

-- Also needed for the sequence (customer_number uses it 
-- via the trigger, but just in case any service role calls touch it)
grant usage on sequence customer_number_seq to authenticated;

-- Revoke public execution of request_barcode_recovery 
-- (already handled by 003's queue approach, but belt-and-suspenders)
revoke execute on function request_barcode_recovery(text) from anon, public;