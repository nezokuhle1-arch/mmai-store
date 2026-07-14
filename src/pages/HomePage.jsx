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
  return (
    <>
      <Hero />
      <BrandValueStrip />
      <CategoryGrid />
      <ProductGrid />
      <EditorialSplit />
      <BestsellersStrip />
    </>
  );
}
