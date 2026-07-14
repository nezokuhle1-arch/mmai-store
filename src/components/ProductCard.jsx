import { Link } from 'react-router-dom';
import './ProductCard.css';

/* ============================================================
   MMAI — PRODUCT CARD
   Shared product presentation used by homepage product sections.
   ============================================================ */

export default function ProductCard({ product, gender, onAddToCart, onCustomize }) {
  const productLink = `/product/${product.handle}`;
  const customizeLink = gender
    ? `/customize?product=${product.handle}&gender=${gender}`
    : `/customize?product=${product.handle}`;

  const stockLabel =
    product.stockCount < 0
      ? 'Made to order'
      : product.stockCount <= 5
        ? `${product.stockCount} left`
        : product.isLimitedDrop
          ? 'Limited drop'
          : null;

  return (
    <article className="product-card">
      <Link
        to={productLink}
        className={`product-card__visual product-card__visual--${product.category.toLowerCase()}`}
        aria-label={`View ${product.title}`}
      >
        {stockLabel && <span className="product-card__badge">{stockLabel}</span>}
        <span className="product-card__monogram" aria-hidden="true">
          MMAI.
        </span>
      </Link>

      <div className="product-card__details">
        <p className="product-card__category">{product.category}</p>
        <Link to={productLink} className="product-card__title">
          {product.title}
        </Link>
        <p className="product-card__price">
          {product.currency === 'ZAR' ? 'R' : product.currency} {product.price.toLocaleString()}
        </p>

        <div className="product-card__actions">
          <button
            type="button"
            className="product-card__action product-card__action--primary"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
          <Link
            to={customizeLink}
            className="product-card__action"
            onClick={(event) => onCustomize?.(product, event, customizeLink)}
          >
            Customize
          </Link>
        </div>
      </div>
    </article>
  );
}
