import { useState } from 'react';
import './ProductAccordion.css';

/* ============================================================
   MMAI — PRODUCT ACCORDION
   Collapsible info sections below the size selector. Currently
   only "Shipping & Returns" — built as a list so future sections
   (e.g. Sizing Guide) can be appended without restructuring.
   ============================================================ */

const SECTIONS = [
  {
    id: 'shipping-returns',
    label: 'Shipping & Returns',
    content:
      'Orders are fulfilled within 7–10 business days. All MMAI pieces are made to order. Free shipping on orders over R1,500. Returns accepted within 14 days for unworn, uncustomized items.',
  },
];

export default function ProductAccordion() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="product-accordion">
      {SECTIONS.map((section) => {
        const isOpen = openId === section.id;
        return (
          <div key={section.id} className="product-accordion__section">
            <div
              className="product-accordion__row"
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              <span className="product-accordion__label">{section.label}</span>
              <span className="product-accordion__toggle">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
              <p className="product-accordion__content">{section.content}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
