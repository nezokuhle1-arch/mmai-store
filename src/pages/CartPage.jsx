/* ============================================================
   MMAI — CART PAGE
   Cart items with customization details + order summary.
   Phase 1: shell only — reads from CartContext.
   ============================================================ */

import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, subtotal } = useCart();

  return (
    <section style={{ padding: 'var(--space-xl) var(--gutter)' }}>
      <h1>Your cart</h1>
      {items.length === 0 ? (
        <p style={{ marginTop: 'var(--space-md)' }}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ marginTop: 'var(--space-lg)' }}>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: 'var(--space-sm)' }}>
                {item.title} — R {item.price} x {item.qty}
              </li>
            ))}
          </ul>
          <p className="identity-text" style={{ marginTop: 'var(--space-lg)' }}>
            Subtotal: R {subtotal}
          </p>
        </>
      )}
    </section>
  );
}
