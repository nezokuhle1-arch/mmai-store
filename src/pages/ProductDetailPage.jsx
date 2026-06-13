/* ============================================================
   MMAI — PRODUCT DETAIL PAGE
   Full product view: size selector, add to cart, customize CTA.
   Phase 1: shell only — looks up product by handle from mock data.
   ============================================================ */

import { useParams } from 'react-router-dom';
import { useDrop } from '../context/DropContext';

export default function ProductDetailPage() {
  const { handle } = useParams();
  const { activeDrop, loading } = useDrop();

  if (loading) return <p style={{ padding: 'var(--gutter)' }}>Loading…</p>;

  const product = activeDrop.products.find((p) => p.handle === handle);

  if (!product) {
    return <p style={{ padding: 'var(--gutter)' }}>Product not found.</p>;
  }

  return (
    <section style={{ padding: 'var(--space-xl) var(--gutter)' }}>
      <p className="eyebrow" style={{ color: 'var(--color-text-muted)' }}>
        Shop / {product.category} / {product.title}
      </p>
      <h1 style={{ marginTop: 'var(--space-sm)' }}>{product.title}</h1>
      <p className="identity-text" style={{ marginTop: 'var(--space-xs)' }}>
        R {product.price}
      </p>
      <p style={{ marginTop: 'var(--space-md)', maxWidth: '480px' }}>
        {product.description}
      </p>
    </section>
  );
}
