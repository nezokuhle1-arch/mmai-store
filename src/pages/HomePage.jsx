/* ============================================================
   MMAI — HOME PAGE
   Hero, drop announcement, featured products, brand ticker.
   Phase 1: shell only. Built out in Phase 2.
   ============================================================ */

export default function HomePage() {
  return (
    <section style={{ padding: 'var(--space-xl) var(--gutter)' }}>
      <p className="eyebrow" style={{ color: 'var(--color-text-muted)' }}>
        Drop 001 — Coming Soon
      </p>
      <h1 style={{ marginTop: 'var(--space-sm)' }}>
        I wear <em className="editorial">myself.</em>
      </h1>
      <p style={{ marginTop: 'var(--space-md)', maxWidth: '420px' }}>
        Customizable luxury streetwear rooted in African identity.
        Every piece tells your story — no one else&apos;s.
      </p>
    </section>
  );
}
