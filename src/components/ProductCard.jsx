import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import QuickAddPopover from './QuickAddPopover';
import './ProductCard.css';

/* ============================================================
   MMAI — PRODUCT CARD
   Shared product presentation used by homepage product sections.
   ============================================================ */

export default function ProductCard({ product, gender }) {
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const plusButtonRef = useRef(null);

  const productLink = `/product/${product.handle}`;
  const customizeLink = gender
    ? `/customize?product=${product.handle}&gender=${gender}`
    : `/customize?product=${product.handle}`;

  const statusLabel = product.isLimitedDrop
    ? 'Limited'
    : product.stockCount >= 0 && product.stockCount <= 5
      ? `${product.stockCount} Left`
      : null;

  const handleCardClick = () => {
    navigate(productLink);
  };

  const handlePlusClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsPopoverOpen(true);
  };

  const handleCustomizeClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    navigate(customizeLink);
  };

  return (
    <article
      className={`product-card${isPopoverOpen ? ' product-card--popover-open' : ''}`}
      onClick={handleCardClick}
    >
      <div
        className={`product-card__visual product-card__visual--${product.category.toLowerCase()}`}
      >
        {statusLabel && <span className="product-card__status">{statusLabel}</span>}
        <button
          type="button"
          ref={plusButtonRef}
          className="product-card__quick-add"
          onClick={handlePlusClick}
          aria-label={`Quick add ${product.title}`}
        >
          +
        </button>
        <QuickAddPopover
          product={product}
          anchorRef={plusButtonRef}
          isOpen={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
        />
      </div>

      <div className="product-card__details">
        <p className="product-card__category">{product.category}</p>
        <p className="product-card__title">{product.title}</p>
        <p className="product-card__price">R {product.price.toLocaleString()}</p>
        <p className="product-card__customize" onClick={handleCustomizeClick}>
          Customize →
        </p>
      </div>
    </article>
  );
}
