import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSessionGenderFilter } from '../hooks/useSessionGenderFilter';
import './DrawerMenu.css';

/* ============================================================
   MMAI — DRAWER MENU
   Slide-out nav drawer opened from the hamburger. Always mounted;
   open/closed is purely a CSS state so the slide can animate.
   ============================================================ */

const CATEGORIES = [
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Cargo Pants', slug: 'cargo-pants' },
  { label: 'Graphic Tees', slug: 'graphic-tees' },
  { label: 'Coats', slug: 'coats' },
  { label: 'Accessories', slug: 'accessories' },
];

export default function DrawerMenu({ isOpen, onClose }) {
  const { session, openIdentityDrawer } = useAuth();
  const [gender, setGender] = useSessionGenderFilter();

  const handleIdentityClick = () => {
    onClose();
    openIdentityDrawer();
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleGenderClick = (value) => {
    setGender(gender === value ? null : value);
  };

  const shopLink = gender ? `/shop?gender=${gender}` : '/shop';
  const categoryLink = (slug) =>
    gender ? `/shop?category=${slug}&gender=${gender}` : `/shop?category=${slug}`;

  return (
    <div className={`drawer-menu ${isOpen ? 'drawer-menu--open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer-menu__panel hide-scrollbar">
        <span className="drawer-menu__close" onClick={onClose} aria-label="Close menu">
          ✕
        </span>

        <Link to="/" className="drawer-menu__logo" onClick={onClose}>
          MMAI.
        </Link>

        <div className="drawer-menu__gender-tabs">
          <span
            className={`gender-tab ${gender === 'him' ? 'gender-tab--active' : ''}`}
            onClick={() => handleGenderClick('him')}
          >
            For Him
          </span>
          <span
            className={`gender-tab ${gender === 'her' ? 'gender-tab--active' : ''}`}
            onClick={() => handleGenderClick('her')}
          >
            For Her
          </span>
        </div>

        <div className="drawer-menu__primary-links">
          <Link to={shopLink} className="drawer-menu__link" onClick={onClose}>
            Shop
          </Link>
          <Link to="/shop?drop=001" className="drawer-menu__link" onClick={onClose}>
            Drop 001
          </Link>
          <Link to="/customize" className="drawer-menu__link" onClick={onClose}>
            Customize
          </Link>
          <Link to="/about" className="drawer-menu__link" onClick={onClose}>
            Our Story
          </Link>
          <span className="drawer-menu__link" onClick={handleIdentityClick}>
            {session ? 'My Identity' : 'Log In'}
          </span>
        </div>

        <div className="drawer-menu__categories">
          <p className="drawer-menu__category-label">Shop by Category</p>
          <div className="drawer-menu__category-links">
            {CATEGORIES.map(({ label, slug }) => (
              <Link
                key={slug}
                to={categoryLink(slug)}
                className="drawer-menu__category-link"
                onClick={onClose}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="drawer-menu__backdrop" onClick={onClose} />
    </div>
  );
}
