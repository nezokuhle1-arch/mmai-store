import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signOut, requestBarcodeRecovery } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';
import IdentityCard from './IdentityCard';
import './IdentityDrawer.css';

/* ============================================================
   MMAI — IDENTITY DRAWER
   Sign-in (guests) and profile (signed-in), opened from NavBar
   or DrawerMenu — not a routed page.
   ============================================================ */

const PREFERENCE_LABELS = {
  him: 'For Him',
  her: 'For Her',
  both: 'Both',
};

export default function IdentityDrawer() {
  const navigate = useNavigate();
  const {
    session,
    customer,
    isIdentityDrawerOpen,
    closeIdentityDrawer,
  } = useAuth();

  useEffect(() => {
    if (!isIdentityDrawerOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeIdentityDrawer();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isIdentityDrawerOpen, closeIdentityDrawer]);

  useEffect(() => {
    document.body.style.overflow = isIdentityDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isIdentityDrawerOpen]);

  const panelModifier = session ? 'identity-drawer__panel--profile' : 'identity-drawer__panel--sign-in';

  return (
    <div
      className={`identity-drawer ${isIdentityDrawerOpen ? 'identity-drawer--open' : ''}`}
      aria-hidden={!isIdentityDrawerOpen}
    >
      <div className="identity-drawer__backdrop" onClick={closeIdentityDrawer} />

      <div className={`identity-drawer__panel hide-scrollbar ${panelModifier}`}>
        <span
          className="identity-drawer__close"
          onClick={closeIdentityDrawer}
          aria-label="Close identity panel"
        >
          ✕
        </span>

        {session ? (
          <ProfileView customer={customer} navigate={navigate} onClose={closeIdentityDrawer} />
        ) : (
          <SignInPanel navigate={navigate} onClose={closeIdentityDrawer} />
        )}
      </div>
    </div>
  );
}

function SignInPanel({ navigate, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signIn({ email, password });
    } catch (err) {
      setError(err.message || 'Could not sign in. Check your email and password.');
    }
  };

  const handleRecoverySubmit = async () => {
    try {
      await requestBarcodeRecovery(recoveryEmail);
    } catch {
      // The RPC never surfaces whether the email exists — always show
      // the same generic message below, regardless of outcome.
    }
    setRecoverySent(true);
  };

  const goCreateAccount = () => {
    onClose();
    navigate('/account/create');
  };

  return (
    <div className="identity-drawer__sign-in">
      <p className="sign-in__wordmark">MMAI.</p>
      <p className="sign-in__eyebrow">Identity</p>

      <div className="field-group">
        <label className="field-group__label" htmlFor="signInEmail">Email</label>
        <input
          id="signInEmail"
          type="email"
          className="field-group__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field-group">
        <label className="field-group__label" htmlFor="signInPassword">Password</label>
        <input
          id="signInPassword"
          type="password"
          className="field-group__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {!showRecovery && (
        <p className="sign-in__forgot-link" onClick={() => setShowRecovery(true)}>
          Forgot your barcode?
        </p>
      )}

      {showRecovery && !recoverySent && (
        <div className="sign-in__recovery">
          <input
            type="email"
            className="field-group__input"
            placeholder="Your email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <p className="sign-in__recovery-submit" onClick={handleRecoverySubmit}>
            Send &rarr;
          </p>
        </div>
      )}

      {recoverySent && (
        <p className="sign-in__recovery-confirm">If an account exists, we&rsquo;ll be in touch.</p>
      )}

      {error && <p className="sign-in__error">{error}</p>}

      <button type="button" className="sign-in__submit" onClick={handleSignIn}>
        Sign In
      </button>

      <button type="button" className="sign-in__create-outline" onClick={goCreateAccount}>
        Create an Account
      </button>
    </div>
  );
}

function ProfileView({ customer, navigate, onClose }) {
  const handleSignOut = async () => {
    await signOut();
  };

  const memberSinceYear = customer?.created_at
    ? new Date(customer.created_at).getFullYear()
    : null;

  const specs = [
    { key: 'Date of Birth', value: customer?.date_of_birth },
    {
      key: 'Shopping Preference',
      value: customer?.shopping_preference ? PREFERENCE_LABELS[customer.shopping_preference] : null,
    },
    {
      key: 'Interests',
      value: customer?.interests?.length ? customer.interests.join(', ') : null,
    },
    { key: 'Size', value: customer?.size_preference },
  ];

  const goEditPreferences = () => {
    onClose();
    navigate('/account/create?step=2');
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <h1 className="profile__title">My Identity</h1>
        <p className="profile__sign-out" onClick={handleSignOut}>Sign Out</p>
      </div>

      <div className="profile__grid">
        <div className="profile__left">
          <IdentityCard
            tier={customer?.membership_tier || 'SELF'}
            name={customer?.preferred_name}
            barcodeId={customer?.barcode_id}
          />
          <div className="profile__card-meta">
            {memberSinceYear && <p className="profile__member-since">Member since {memberSinceYear}</p>}
            <span className="profile__tier-tag">{customer?.membership_tier || 'SELF'}</span>
          </div>
        </div>

        <div className="profile__right">
          <p className="profile__barcode-eyebrow">Barcode ID</p>
          <p className="profile__barcode-value">{customer?.barcode_id || 'Not set'}</p>

          <div className="profile__divider" />

          {specs.map(({ key, value }) => (
            <div key={key} className="profile__spec-row">
              <span className="profile__spec-key">{key}</span>
              <span className={`profile__spec-value${value ? '' : ' profile__spec-value--empty'}`}>
                {value || 'Not set'}
              </span>
            </div>
          ))}

          <p className="profile__edit-link" onClick={goEditPreferences}>
            Edit preferences &rarr;
          </p>
        </div>
      </div>
    </div>
  );
}
