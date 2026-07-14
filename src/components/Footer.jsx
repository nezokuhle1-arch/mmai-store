import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSessionGenderFilter } from '../hooks/useSessionGenderFilter';
import './Footer.css';

/* ============================================================
   MMAI — FOOTER
   Rendered once at the App level (see App.jsx) so it appears on
   every route: email capture, link grid, bottom bar, wordmark.
   ============================================================ */

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

const SHOP_LINKS = [
  { label: 'Drop 001', path: '/shop?drop=001' },
  { label: 'Hoodies', path: '/shop?category=hoodies' },
  { label: 'Cargo Pants', path: '/shop?category=cargo-pants' },
  { label: 'Accessories', path: '/shop?category=accessories' },
];

const BRAND_LINKS = [
  { label: 'Our Story', path: '/about' },
  { label: 'Customization', path: '/customize' },
  { label: 'Lookbook', path: '/lookbook' },
];

const HELP_LINKS = [
  { label: 'Sizing Guide', path: '/help' },
  { label: 'Shipping', path: '/help' },
  { label: 'Contact', path: '/help' },
];

export default function Footer() {
  const [gender] = useSessionGenderFilter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'confirmed' | 'invalid'

  const withGender = (path) => {
    if (!gender) return path;
    return path.includes('?') ? `${path}&gender=${gender}` : `${path}?gender=${gender}`;
  };

  useEffect(() => {
    if (status !== 'confirmed') return undefined;
    const id = setTimeout(() => {
      setStatus('idle');
      setEmail('');
    }, 2500);
    return () => clearTimeout(id);
  }, [status]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (status === 'invalid') setStatus('idle');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setStatus('invalid');
      return;
    }
    // Phase 4: replace this local confirmation with a real Supabase or email-service call
    setStatus('confirmed');
  };

  return (
    <footer className="footer">
      <div className="footer__signup">
        <div className="footer__signup-left">
          <h2 className="footer__headline">Get early access to every drop.</h2>
          <p className="footer__body-text">
            Join the MMAI list — drop alerts, member exclusives, your barcode ID.
          </p>

          <form className="footer__pill-form" onSubmit={handleSubmit} noValidate>
            <div className="footer__pill">
              {status === 'confirmed' ? (
                <span className="footer__pill-confirmed">Thanks — you're on the list.</span>
              ) : (
                <>
                  <input
                    type="email"
                    className="footer__pill-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    aria-label="Email address"
                  />
                  <button type="submit" className="footer__pill-button">
                    Join
                  </button>
                </>
              )}
            </div>
            {status === 'invalid' && (
              <p className="footer__pill-error">Enter a valid email</p>
            )}
          </form>
        </div>
      </div>

      <div className="footer__trust-badges" aria-label="Shopping benefits">
        <div className="footer__trust-badge">
          <svg className="footer__trust-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
          </svg>
          <div>
            <p className="footer__trust-title">Free Shipping</p>
            <p className="footer__trust-subtext">Orders over R1,500</p>
          </div>
        </div>

        <div className="footer__trust-badge">
          <svg className="footer__trust-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <div>
            <p className="footer__trust-title">Made to Order</p>
            <p className="footer__trust-subtext">Fulfilled in 7–10 days</p>
          </div>
        </div>

        <div className="footer__trust-badge">
          <svg className="footer__trust-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 7v5h-5M4 17v-5h5" />
            <path d="M18.2 15a7 7 0 0 1-11.8 2L4 14M5.8 9A7 7 0 0 1 17.6 7L20 10" />
          </svg>
          <div>
            <p className="footer__trust-title">14-Day Returns</p>
            <p className="footer__trust-subtext">Unworn, uncustomized items</p>
          </div>
        </div>

        <div className="footer__trust-badge">
          <svg className="footer__trust-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z" />
            <rect x="9" y="10" width="6" height="5" rx="1" />
            <path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10" />
          </svg>
          <div>
            <p className="footer__trust-title">Secure Payment</p>
            <p className="footer__trust-subtext">PayFast · Ozow · Visa</p>
          </div>
        </div>
      </div>

      <div className="footer__grid">
        <div className="footer__col footer__col--brand">
          <p className="footer__wordmark">MMAI.</p>
          <p className="footer__tagline">
            Me Myself And I.
            <br />
            Made in South Africa.
            <br />
            Worn worldwide.
          </p>
        </div>

        <div className="footer__col">
          <p className="footer__col-heading">Shop</p>
          <div className="footer__col-links">
            {SHOP_LINKS.map(({ label, path }) => (
              <Link key={label} to={withGender(path)} className="footer__col-link">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <p className="footer__col-heading">Brand</p>
          <div className="footer__col-links">
            {BRAND_LINKS.map(({ label, path }) => (
              <Link key={label} to={path} className="footer__col-link">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <p className="footer__col-heading">Help</p>
          <div className="footer__col-links">
            {HELP_LINKS.map(({ label, path }) => (
              <Link key={label} to={path} className="footer__col-link">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom-bar">
        <span className="footer__bottom-text">© 2025 MMAI · All rights reserved</span>
        <span className="footer__bottom-text">VISA · Mastercard · PayFast · Ozow</span>
        <span className="footer__bottom-text">Privacy · Terms</span>
      </div>

      <div className="footer__wordmark-wrap">
        <span className="footer__wordmark-text">MMAI.</span>
      </div>
    </footer>
  );
}
