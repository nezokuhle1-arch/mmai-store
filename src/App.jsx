import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { DropProvider } from './context/DropContext';

import NavBar from './components/NavBar';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomizePage from './pages/CustomizePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

/* ============================================================
   MMAI — APP ROOT
   Routing + global providers (Cart, Drop).
   ============================================================ */

export default function App() {
  return (
    <CartProvider>
      <DropProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ProductListPage />} />
            <Route path="/product/:handle" element={<ProductDetailPage />} />
            <Route path="/customize" element={<CustomizePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </BrowserRouter>
      </DropProvider>
    </CartProvider>
  );
}
