import './SizeSelector.css';

/* ============================================================
   MMAI — SIZE SELECTOR
   Size grid used on the product detail page.
   ============================================================ */

export default function SizeSelector({ sizes, selectedSize, onSizeSelect }) {
  return (
    <div className="size-selector">
      <div className="size-selector__label-row">
        <span className="size-selector__label">Select Size</span>
        <span className="size-selector__guide-link">Size Guide</span>
      </div>
      <div className="size-selector__options">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={`size-selector__option${size === selectedSize ? ' size-selector__option--selected' : ''}`}
            onClick={() => onSizeSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
