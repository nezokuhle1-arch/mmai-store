import { Link } from 'react-router-dom';
import { useDrop } from '../context/DropContext';
import { useSessionGenderFilter } from '../hooks/useSessionGenderFilter';
import { useRailScrollIndex } from '../hooks/useRailScrollIndex';
import ProductCard from './ProductCard';
import './BestsellersStrip.css';

/* ============================================================
   MMAI — BESTSELLERS STRIP
   Fan favorites on HomePage, shown as a horizontal drag-scroll rail.
   ============================================================ */

export default function BestsellersStrip() {
  const { activeDrop, loading } = useDrop();
  const [gender] = useSessionGenderFilter();
  const shopLink = gender
    ? `/shop?collection=bestsellers&gender=${gender}`
    : '/shop';

  // Temporary ordering: Phase 4 will replace this with real bestseller
  // data derived from Shopify order history.
  const products = activeDrop
    ? [2, 0, 3, 1].map((index) => activeDrop.products[index]).filter(Boolean)
    : [];
  const { trackRef, activeIndex } = useRailScrollIndex(products.length);

  if (loading || !activeDrop) return null;

  return (
    <section
      className="bestsellers-strip"
      aria-labelledby="bestsellers-strip-title"
      data-gender-filter={gender || undefined}
    >
      <div className="bestsellers-strip__eyebrow-row">
        <p className="bestsellers-strip__eyebrow">Fan Favorites</p>
        {gender && <span className="bestsellers-strip__filter">{gender}</span>}
      </div>

      <div className="bestsellers-strip__title-row">
        <h2 id="bestsellers-strip-title" className="bestsellers-strip__title">
          Bestsellers
        </h2>
        <Link to={shopLink} className="bestsellers-strip__view-all">
          View all →
        </Link>
      </div>

      <div className="bestsellers-strip__rail-viewport">
        <div className="bestsellers-strip__track hide-scrollbar" ref={trackRef}>
          {products.map((product) => (
            <div key={product.id} className="bestsellers-strip__card">
              <ProductCard product={product} gender={gender} />
            </div>
          ))}
        </div>
      </div>

      <div className="bestsellers-strip__dashes" aria-hidden="true">
        {products.map((product, index) => (
          <span
            key={product.id}
            className={
              index === activeIndex
                ? 'bestsellers-strip__dash bestsellers-strip__dash--active'
                : 'bestsellers-strip__dash'
            }
          />
        ))}
      </div>
    </section>
  );
}
