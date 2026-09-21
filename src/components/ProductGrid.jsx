import { Link } from 'react-router-dom';
import { useDrop } from '../context/DropContext';
import { useSessionGenderFilter } from '../hooks/useSessionGenderFilter';
import { useRailScrollIndex } from '../hooks/useRailScrollIndex';
import ProductCard from './ProductCard';
import './ProductGrid.css';

/* ============================================================
   MMAI — PRODUCT GRID
   The active drop's primary product presentation on HomePage,
   shown as a horizontal drag-scroll rail.
   ============================================================ */

export default function ProductGrid() {
  const { activeDrop, loading } = useDrop();
  const [gender] = useSessionGenderFilter();
  const shopLink = gender ? `/shop?drop=001&gender=${gender}` : '/shop?drop=001';
  const products = activeDrop?.products ?? [];
  const { trackRef, activeIndex } = useRailScrollIndex(products.length);

  if (loading || !activeDrop) return null;

  return (
    <section className="product-grid" aria-labelledby="product-grid-title">
      <p className="product-grid__eyebrow">The Current Drop</p>
      <div className="product-grid__title-row">
        <h2 id="product-grid-title" className="product-grid__title">
          {activeDrop.name}
        </h2>
        <Link to={shopLink} className="product-grid__view-all">
          View all →
        </Link>
      </div>

      <div className="product-grid__rail-viewport">
        <div className="product-grid__track hide-scrollbar" ref={trackRef}>
          {products.map((product) => (
            <div key={product.id} className="product-grid__card">
              <ProductCard product={product} gender={gender} />
            </div>
          ))}
        </div>
      </div>

      <div className="product-grid__dashes" aria-hidden="true">
        {products.map((product, index) => (
          <span
            key={product.id}
            className={
              index === activeIndex
                ? 'product-grid__dash product-grid__dash--active'
                : 'product-grid__dash'
            }
          />
        ))}
      </div>
    </section>
  );
}
