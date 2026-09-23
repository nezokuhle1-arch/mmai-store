import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { DropProvider } from './context/DropContext';
import { AuthProvider } from './context/AuthContext';

import AnnouncementBar from './components/AnnouncementBar';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import IdentityDrawer from './components/IdentityDrawer';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomizePage from './pages/CustomizePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CreateAccountPage from './pages/CreateAccountPage';

import './App.css';

/* ============================================================
   MMAI — APP ROOT
   Routing + global providers (Cart, Drop).
   ============================================================ */

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isImmersiveRoute = location.pathname === '/account/create';
  // /shop has a full-bleed campaign banner directly behind the nav, same as
  // the homepage Hero — both need the transparent-overlay nav treatment
  // instead of the solid background plain content pages get.
  const hasFullBleedBanner = isHome || location.pathname === '/shop';

  const mainClassName = isImmersiveRoute
    ? undefined
    : hasFullBleedBanner
      ? 'page-content--home'
      : 'page-content--offset';

  return (
    <>
      {!isImmersiveRoute && <AnnouncementBar />}
      {!isImmersiveRoute && <NavBar transparent={hasFullBleedBanner} />}
      <ScrollToTop />
      <main className={mainClassName}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductListPage />} />
          <Route path="/product/:handle" element={<ProductDetailPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account/create" element={<CreateAccountPage />} />
        </Routes>
      </main>
      {!isImmersiveRoute && <Footer />}
      <IdentityDrawer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <DropProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AuthProvider>
      </DropProvider>
    </CartProvider>
  );
}
