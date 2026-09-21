import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrop } from '../context/DropContext';
import { useCart } from '../context/CartContext';
import { useSessionGenderFilter } from '../hooks/useSessionGenderFilter';
import SizeSelector from '../components/SizeSelector';
import ProductSpecs from '../components/ProductSpecs';
import ProductAccordion from '../components/ProductAccordion';
import RecommendationsStrip from '../components/RecommendationsStrip';
import './ProductDetailPage.css';

/* ============================================================
   MMAI — PRODUCT DETAIL PAGE
   Full product view: size selector, add to cart, customize CTA.
   ============================================================ */

const TRUST_ITEMS = [
  {
    label: 'Free Shipping',
    paths: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
  },
  {
    label: 'Made to Order',
    paths: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    label: 'Secure Payment',
    paths: (
      <>
        <path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z" />
        <rect x="9" y="10" width="6" height="5" rx="1" />
        <path d="M10.5 10V8.5a1.5 1.5 0 0 1 3 0V10" />
      </>
    ),
  },
];

export default function ProductDetailPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { activeDrop, loading } = useDrop();
  const { addItem } = useCart();
  const [gender] = useSessionGenderFilter();
  const [selectedSize, setSelectedSize] = useState(null);

  if (loading) return <p style={{ padding: 'var(--gutter)' }}>Loading…</p>;

  const product = activeDrop.products.find((p) => p.handle === handle);

  if (!product) {
    return <p style={{ padding: 'var(--gutter)' }}>Product not found.</p>;
  }

  // Mock data today (product.stockCount). Phase 4 replaces this with live
  // Shopify inventory quantity.
  const stockMessage =
    product.stockCount === -1
      ? 'Made to order.'
      : product.stockCount <= 5
        ? `Only ${product.stockCount} left.`
        : null;

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      qty: 1,
      customization: null,
    });
  };

  const handleCustomize = () => {
    const query = gender
      ? `?product=${product.handle}&gender=${gender}`
      : `?product=${product.handle}`;
    navigate(`/customize${query}`);
  };

  return (
    <>
      <div className="pdp">
        <div className="pdp__thumbnails">
          {/* TODO: wire to real product.images array once multiple angles exist — currently static placeholders */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pdp__thumbnail${i === 0 ? ' pdp__thumbnail--active' : ''}`}
            />
          ))}
        </div>

        <div className="pdp__main-image">
          <div className="pdp__garment-placeholder">MMAI</div>
        </div>

        <div className="pdp__info">
          <p className="pdp__breadcrumb">
            Shop / {product.category} / {product.title}
          </p>
          <h1 className="pdp__title">{product.title}</h1>
          <p className="pdp__price">R {product.price.toLocaleString()}</p>
          {stockMessage && <p className="pdp__stock">{stockMessage}</p>}

          <div className="pdp__divider" />

          <p className="pdp__description">{product.description}</p>

          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />

          <button
            type="button"
            className="pdp__add-to-cart"
            disabled={!selectedSize}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <button type="button" className="pdp__customize" onClick={handleCustomize}>
            Customize This Piece →
          </button>

          <ProductSpecs product={product} />

          <div className="pdp__trust-badges">
            {TRUST_ITEMS.map(({ label, paths }) => (
              <div key={label} className="pdp__trust-badge">
                <svg className="pdp__trust-icon" viewBox="0 0 24 24" aria-hidden="true">
                  {paths}
                </svg>
                <span className="pdp__trust-text">{label}</span>
              </div>
            ))}
          </div>

          <p className="pdp__membership">SELF members earn points on every purchase →</p>

          <ProductAccordion product={product} />
        </div>
      </div>

      <RecommendationsStrip
        currentProductId={product.id}
        products={activeDrop.products}
        gender={gender}
      />
    </>
  );
}
