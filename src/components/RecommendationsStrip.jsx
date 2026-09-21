import ProductCard from './ProductCard';
import './RecommendationsStrip.css';

/* ============================================================
   MMAI — RECOMMENDATIONS STRIP
   "Style With" — up to 4 other products from the active drop.
   ============================================================ */

export default function RecommendationsStrip({ currentProductId, products, gender }) {
  const recommendations = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <section className="recommendations-strip">
      <p className="recommendations-strip__header">Style With</p>
      <div className="recommendations-strip__grid">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} gender={gender} />
        ))}
      </div>
    </section>
  );
}
