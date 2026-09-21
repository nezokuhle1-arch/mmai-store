import './ProductSpecs.css';

/* ============================================================
   MMAI — PRODUCT SPECS
   Soft, borderless spec list — Fabric / Fit / Made In / Care.
   ============================================================ */

export default function ProductSpecs({ product }) {
  const specs = [
    { key: 'Fabric', value: product.fabric },
    { key: 'Fit', value: product.fit },
    { key: 'Made In', value: product.madeIn },
    { key: 'Care', value: product.care },
  ];

  return (
    <div className="product-specs">
      <p className="product-specs__eyebrow">The Details</p>
      {specs.map(({ key, value }) => (
        <div key={key} className="product-specs__row">
          <span className="product-specs__key">{key}</span>
          <span className="product-specs__value">{value}</span>
        </div>
      ))}
    </div>
  );
}
