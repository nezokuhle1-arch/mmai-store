import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import DrawerMenu from './DrawerMenu';
import './NavBar.css';

/* ============================================================
   MMAI — NAV BAR
   Fixed overlay, rendered once at the App level so it persists
   across every route. Transparent on the homepage (overlays the
   Hero image); gets a dark backdrop everywhere else for legibility
   against off-white page backgrounds.
   ============================================================ */

export default function NavBar() {
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isHome = location.pathname === '/';

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/shop?search=${searchQuery}`);
    }
  };

  return (
    <nav className={`navbar ${!isHome ? 'navbar--backdrop' : ''}`}>
      <div className="navbar__hamburger" onClick={handleMenuClick}>
        <span className="navbar__hamburger-line navbar__hamburger-line--full" />
        <span className="navbar__hamburger-line navbar__hamburger-line--short" />
        <span className="navbar__hamburger-line navbar__hamburger-line--full" />
      </div>

      <Link to="/" className="navbar__logo">
        MMAI.
      </Link>

      <div className="navbar__utility">
        <div className="navbar__search">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search"
          />
        </div>

        <div className="navbar__links">
          <Link to="/cart" className="navbar__link">
            Bag
            <span className="navbar__badge">{items.length}</span>
          </Link>
          <Link to="/account" className="navbar__link">
            Log In
          </Link>
          <Link to="/help" className="navbar__link navbar__link--help">
            Help
          </Link>
        </div>
      </div>

      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </nav>
  );
}
