import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Hero from '../components/Hero';
import BrandValueStrip from '../components/BrandValueStrip';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import EditorialSplit from '../components/EditorialSplit';
import BestsellersStrip from '../components/BestsellersStrip';

/* ============================================================
   MMAI — HOME PAGE
   Hero, brand value strip, category grid, editorial split,
   featured products, brand ticker. Built out further in later
   phases.
   ============================================================ */

export default function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      size: product.sizes[0],
      qty: 1,
      customization: null,
    });
  };

  const handleCustomize = (_product, event, destination) => {
    event.preventDefault();
    navigate(destination);
  };

  return (
    <>
      <Hero />
      <BrandValueStrip />
      <CategoryGrid />
      <ProductGrid onAddToCart={handleAddToCart} onCustomize={handleCustomize} />
      <EditorialSplit />
      <BestsellersStrip onAddToCart={handleAddToCart} onCustomize={handleCustomize} />
    </>
  );
}
