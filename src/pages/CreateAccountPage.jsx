import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signUp, getCustomerProfile, updateCustomerPreferences } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';
import IdentityCard from '../components/IdentityCard';
import './CreateAccountPage.css';

/* ============================================================
   MMAI — CREATE ACCOUNT PAGE
   Two-step account creation: tier + identity (step 1), then
   preferences (step 2). Route: /account/create

   NOTE: IdentityCard renders public/assets/identity/mmai-card-monogram.png.
   That file must be manually placed in public/assets/identity/ — it's
   already committed to the repo, but if it's ever missing locally
   (fresh checkout gone wrong, etc.) the build will not regenerate or
   copy it from anywhere else.

   ⚠️ PRE-LAUNCH REQUIREMENT: Supabase email confirmation is
   currently DISABLED to allow immediate-session signup during
   development. Before going live, this MUST be re-enabled
   (Authentication → Providers → Email → Confirm email), and this
   component will then need a "Check your email to continue"
   intermediate state for when signUp() doesn't return an active
   session — see the "Option 2" discussion from 2026-09-23 for
   the intended UX. Do not launch with confirmation disabled.
   ============================================================ */

const INTEREST_CATEGORIES = [
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Cargo Pants', slug: 'cargo-pants' },
  { label: 'Graphic Tees', slug: 'graphic-tees' },
  { label: 'Coats', slug: 'coats' },
  { label: 'Accessories', slug: 'accessories' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const TIER_COPY = {
  SELF: {
    eyebrow: 'Standard Access',
    title: 'SELF',
    description:
      'Access all capsule drops, order history, and the MMAI brand community.',
  },
  'MAISON DU SELF': {
    eyebrow: 'Luxury Access',
    title: 'Maison Du Self',
    description:
      'Early drop access, exclusive members-only pieces, and priority queue — available from launch, alongside SELF.',
  },
};

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    customer: authCustomer,
    loading: authLoading,
    setCustomer: setAuthCustomer,
    openIdentityDrawer,
  } = useAuth();

  // /account/create?step=2 is the "Edit preferences" entry point for an
  // already-signed-in customer — prefill everything from their existing
  // profile instead of starting blank. AuthContext's session/profile fetch
  // is async, so on a hard page load `authCustomer` isn't available yet at
  // mount time — hydrate from it in an effect once auth finishes loading,
  // rather than in the initial useState (which would silently fall back to
  // step 1 on a direct URL load, since authCustomer would still be null).
  const wantsStep2 = searchParams.get('step') === '2';
  const [hydratedFromAuth, setHydratedFromAuth] = useState(false);

  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState('SELF');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [shoppingPreference, setShoppingPreference] = useState(null);
  const [interests, setInterests] = useState([]);
  const [sizePreference, setSizePreference] = useState(null);

  useEffect(() => {
    if (hydratedFromAuth || authLoading) return;

    if (wantsStep2 && authCustomer) {
      setStep(2);
      setSelectedTier(authCustomer.membership_tier || 'SELF');
      setPreferredName(authCustomer.preferred_name || '');
      setCustomer(authCustomer);
      setDateOfBirth(authCustomer.date_of_birth || '');
      setShoppingPreference(authCustomer.shopping_preference || null);
      setInterests(authCustomer.interests || []);
      setSizePreference(authCustomer.size_preference || null);
    }

    setHydratedFromAuth(true);
  }, [hydratedFromAuth, authLoading, wantsStep2, authCustomer]);

  const toggleInterest = (slug) => {
    setInterests((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleCreateAccount = async () => {
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!preferredName.trim()) {
      setError('Please enter your preferred name.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setStep('loading');

    try {
      // Sequential by design: confirm the signup, hold the loading
      // screen for a minimum display time, THEN fetch the profile —
      // fetching in parallel with signUp() could race the
      // handle_new_user trigger and return before the customers row exists.
      await signUp({ email, password, preferredName, membershipTier: selectedTier });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const profile = await getCustomerProfile();

      setCustomer(profile);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep(1);
    }
  };

  const handleCompleteProfile = async () => {
    setError(null);
    try {
      const updated = await updateCustomerPreferences({
        preferredName,
        dateOfBirth,
        shoppingPreference,
        interests,
        sizePreference,
      });
      // IdentityDrawer reads the customer from AuthContext, not from this
      // page's local state — without this, it would keep showing the
      // stale pre-update profile fetched at sign-in.
      setAuthCustomer(updated);
      navigate('/');
      openIdentityDrawer();
    } catch (err) {
      setError(err.message || 'Could not save your preferences.');
    }
  };

  if (step === 'loading') {
    return (
      <div className="create-account-loading">
        <div className="create-account-loading__spinner" />
        <p className="create-account-loading__label">Creating Account</p>
        <p className="create-account-loading__sublabel">Generating your identity&hellip;</p>
      </div>
    );
  }

  // A direct/refreshed load of ?step=2 needs AuthContext's session +
  // profile fetch to resolve before we know what to hydrate step 2 with.
  if (wantsStep2 && !hydratedFromAuth) {
    return (
      <div className="create-account-loading">
        <div className="create-account-loading__spinner" />
        <p className="create-account-loading__label">Loading</p>
        <p className="create-account-loading__sublabel">Fetching your profile&hellip;</p>
      </div>
    );
  }

  const copy = TIER_COPY[selectedTier];
  const displayBarcode = step === 2 ? customer?.barcode_id : null;

  return (
    <div className="create-account">
      <div className="create-account__left">
        {step === 1 && (
          <div className="tier-toggle">
            <button
              type="button"
              className={`tier-toggle__tab${selectedTier === 'SELF' ? ' tier-toggle__tab--active' : ''}`}
              onClick={() => setSelectedTier('SELF')}
            >
              SELF
            </button>
            <button
              type="button"
              className={`tier-toggle__tab${selectedTier === 'MAISON DU SELF' ? ' tier-toggle__tab--active' : ''}`}
              onClick={() => setSelectedTier('MAISON DU SELF')}
            >
              MAISON DU SELF
            </button>
          </div>
        )}

        <IdentityCard tier={selectedTier} name={preferredName} barcodeId={displayBarcode} />

        <div className="benefit-copy">
          <p className="benefit-copy__eyebrow">{copy.eyebrow}</p>
          <p className="benefit-copy__title">{copy.title}</p>
          <p className="benefit-copy__description">{copy.description}</p>
        </div>
      </div>

      <div className="create-account__right">
        {step === 1 && (
          <>
            <p className="create-account__step-indicator">1 / 2 &middot; DETAILS</p>
            <h1 className="create-account__title">Create your account.</h1>
            <p className="create-account__subtitle">Join MMAI and wear who you truly are.</p>
            <div className="create-account__divider" />

            <div className="field-group">
              <label className="field-group__label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="field-group__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-group__label" htmlFor="preferredName">Preferred Name</label>
              <input
                id="preferredName"
                type="text"
                className="field-group__input"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-group__label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="field-group__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="create-account__error">{error}</p>}

            <button type="button" className="create-account__submit" onClick={handleCreateAccount}>
              Create Account
            </button>

            <p
              className="create-account__login-link"
              onClick={() => {
                navigate('/');
                openIdentityDrawer();
              }}
            >
              Already have an account? Login here
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="create-account__step-indicator">2 / 2 &middot; PREFERENCES</p>
            <h1 className="create-account__title">Tell Us More.</h1>
            <p className="create-account__subtitle">Help us personalize your experience.</p>
            <div className="create-account__divider" />

            <div className="field-group">
              <label className="field-group__label" htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                type="date"
                className="field-group__input"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="field-group">
              <p className="field-group__label">Shopping Preference</p>
              <div className="chip-row">
                {[
                  { label: 'For Him', value: 'him' },
                  { label: 'For Her', value: 'her' },
                  { label: 'Both', value: 'both' },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    className={`chip${shoppingPreference === value ? ' chip--selected' : ''}`}
                    onClick={() => setShoppingPreference(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <p className="field-group__label">I'm Interested In</p>
              <div className="interest-tiles">
                {INTEREST_CATEGORIES.map(({ label, slug }) => (
                  <button
                    key={slug}
                    type="button"
                    className={`interest-tile interest-tile--${slug}${interests.includes(slug) ? ' interest-tile--selected' : ''}`}
                    onClick={() => toggleInterest(slug)}
                  >
                    <span className="interest-tile__label">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <p className="field-group__label">Size</p>
              <div className="chip-row">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`chip chip--size${sizePreference === size ? ' chip--selected' : ''}`}
                    onClick={() => setSizePreference(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="create-account__error">{error}</p>}

            <button type="button" className="create-account__submit" onClick={handleCompleteProfile}>
              Complete Profile
            </button>

            <p
              className="create-account__skip-link"
              onClick={() => {
                navigate('/');
                openIdentityDrawer();
              }}
            >
              Skip for now &rarr;
            </p>
          </>
        )}
      </div>
    </div>
  );
}
