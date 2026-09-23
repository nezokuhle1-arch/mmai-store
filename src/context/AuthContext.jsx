import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase, getCustomerProfile } from '../api/supabaseClient';

/* ============================================================
   MMAI — AUTH CONTEXT
   Tracks the current Supabase session and customer profile
   globally, so any component can read the signed-in user's
   tier, barcode, etc. without re-fetching.
   ============================================================ */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isIdentityDrawerOpen, setIsIdentityDrawerOpen] = useState(false);

  const openIdentityDrawer = useCallback(() => setIsIdentityDrawerOpen(true), []);
  const closeIdentityDrawer = useCallback(() => setIsIdentityDrawerOpen(false), []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        // `loading` is the contract consumers use to know both session
        // AND customer are settled — must await this, not fire-and-forget,
        // or loading flips to false while customer is still null.
        try {
          setCustomer(await getCustomerProfile());
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          const profile = await getCustomerProfile();
          setCustomer(profile);
        } else {
          setCustomer(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    customer,
    loading,
    setCustomer,
    isIdentityDrawerOpen,
    openIdentityDrawer,
    closeIdentityDrawer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
