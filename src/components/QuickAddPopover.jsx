import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';
import './QuickAddPopover.css';

/* ============================================================
   MMAI — QUICK ADD POPOVER
   Size (and future colour) selection opened from ProductCard's
   "+" button. Auto-advances through selecting -> loading ->
   confirmed once all required options are chosen, then adds the
   item to cart and self-closes. Portaled to <body> so the fixed
   backdrop isn't clipped by the rail's overflow ancestors.
   ============================================================ */

export default function QuickAddPopover({ product, anchorRef, isOpen, onClose }) {
  const { addItem } = useCart();
  const [stage, setStage] = useState('selecting');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColour, setSelectedColour] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setStage('selecting');
    setSelectedSize(null);
    setSelectedColour(null);
    setIsClosing(false);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    const container =
      anchorRef.current.closest('.product-card__visual') || anchorRef.current.parentElement;
    const rect = container.getBoundingClientRect();
    setCoords({ top: rect.top + 36, right: window.innerWidth - rect.right });
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (stage !== 'loading') return undefined;
    const id = setTimeout(() => setStage('confirmed'), 500);
    return () => clearTimeout(id);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'confirmed') return undefined;

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      qty: 1,
      customization: null,
    });

    const fadeId = setTimeout(() => setIsClosing(true), 600);
    const closeId = setTimeout(() => onClose(), 800);
    return () => {
      clearTimeout(fadeId);
      clearTimeout(closeId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const checkAdvance = (nextSize, nextColour) => {
    const sizeReady = Boolean(nextSize);
    const colourReady = product.colours?.length ? Boolean(nextColour) : true;
    if (sizeReady && colourReady) setStage('loading');
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    checkAdvance(size, selectedColour);
  };

  const handleColourClick = (colour) => {
    setSelectedColour(colour);
    checkAdvance(selectedSize, colour);
  };

  if (!isOpen || !coords) return null;

  // The backdrop and panel are portaled to document.body, but React's
  // synthetic events still bubble through the *React* tree (ProductCard's
  // outer onClick), not the DOM tree — stopPropagation here keeps clicks
  // inside the popover from also triggering the card's own navigation.
  const stopPropagation = (event) => event.stopPropagation();

  return createPortal(
    <>
      <div
        className="quick-add-popover__backdrop"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      />
      <div
        className={`quick-add-popover${isClosing ? ' quick-add-popover--closing' : ''}`}
        style={{ top: coords.top, right: coords.right }}
        onClick={stopPropagation}
      >
        {stage === 'selecting' && (
          <>
            <p className="quick-add-popover__title">{product.title}</p>

            <p className="quick-add-popover__label">Size</p>
            <div className="quick-add-popover__chips">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`quick-add-popover__chip${
                    selectedSize === size ? ' quick-add-popover__chip--selected' : ''
                  }`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {product.colours?.length > 0 && (
              <>
                <p className="quick-add-popover__label">Colour</p>
                <div className="quick-add-popover__chips">
                  {product.colours.map((colour) => (
                    <button
                      key={colour}
                      type="button"
                      className={`quick-add-popover__chip${
                        selectedColour === colour ? ' quick-add-popover__chip--selected' : ''
                      }`}
                      onClick={() => handleColourClick(colour)}
                    >
                      {colour}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {stage === 'loading' && (
          <div className="quick-add-popover__status">
            <span className="quick-add-popover__spinner" />
            <span className="quick-add-popover__status-text">Adding</span>
          </div>
        )}

        {stage === 'confirmed' && (
          <div className="quick-add-popover__status">
            <span className="quick-add-popover__check">✓</span>
            <span className="quick-add-popover__status-text quick-add-popover__status-text--confirmed">
              Added
            </span>
            <span className="quick-add-popover__subline">
              {product.title} · {selectedSize}
            </span>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
