/* ============================================================
   MMAI — PRODUCT LIST PAGE
   Grid of products with filter/sort.
   Phase 1: shell only — renders mock product titles.
   ============================================================ */

import { useDrop } from '../context/DropContext';

export default function ProductListPage() {
  const { activeDrop, loading } = useDrop();

  if (loading) return <p style={{ padding: 'var(--gutter)' }}>Loading…</p>;

  return (
    <section style={{ padding: 'var(--space-xl) var(--gutter)' }}>
      <h2>{activeDrop.name}</h2>
      <ul style={{ marginTop: 'var(--space-lg)' }}>
        {activeDrop.products.map((product) => (
          <li key={product.id} style={{ marginBottom: 'var(--space-sm)' }}>
            {product.title} — R {product.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
