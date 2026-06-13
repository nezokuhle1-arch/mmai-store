import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/* ============================================================
   MMAI — NAV BAR
   Phase 1: minimal shell, styled with Slate Noir tokens.
   Phase 2: fixed/transparent-on-hero behaviour, mobile menu.
   ============================================================ */

export default function NavBar() {
  const { items, toggleCart } = useCart();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-md) var(--gutter)',
        background: 'var(--color-bg-inverse)',
        color: 'var(--color-text-inverse)',
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-md)',
          fontWeight: 700,
          color: 'var(--color-text-inverse)',
        }}
      >
        MMAI.
      </Link>

      <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
        <Link to="/" className="label" style={{ color: 'var(--color-text-inverse-muted)' }}>
          Home
        </Link>
        <Link to="/shop" className="label" style={{ color: 'var(--color-text-inverse-muted)' }}>
          Shop
        </Link>
        <Link to="/customize" className="label" style={{ color: 'var(--color-text-inverse-muted)' }}>
          Customize
        </Link>
      </div>

      <button
        onClick={toggleCart}
        className="label"
        style={{ color: 'var(--color-text-inverse)' }}
      >
        Cart ({items.length})
      </button>
    </nav>
  );
}
