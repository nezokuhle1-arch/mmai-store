/* ============================================================
   MMAI — PRODUCT LIST PAGE
   Full catalog view: campaign banner, dynamic header, filter
   bar, and a standard grid layout (not the homepage rail
   pattern — this page shows the whole collection at once).
   ============================================================ */

import { useSearchParams } from 'react-router-dom';
import { useDrop } from '../context/DropContext';
import { useSessionGenderFilter } from '../hooks/useSessionGenderFilter';
import ProductCard from '../components/ProductCard';
import './ProductListPage.css';

// Temporary mock-data matching: URL category slugs don't correspond to a
// real Shopify taxonomy yet, so each filter matches loosely against the
// product handle/title instead. Phase 4 replaces this with real
// Shopify collections/taxonomy.
const CATEGORY_FILTERS = [
  { slug: 'hoodies', label: 'Hoodies', match: 'hoodie' },
  { slug: 'cargo-pants', label: 'Cargo Pants', match: 'cargo' },
  { slug: 'graphic-tees', label: 'Graphic Tees', match: 'tee' },
  { slug: 'coats', label: 'Coats', match: 'coat' },
  { slug: 'accessories', label: 'Accessories', match: 'accessor' },
];

export default function ProductListPage() {
  const { activeDrop, loading } = useDrop();
  const [gender, setGender] = useSessionGenderFilter();
  const [searchParams, setSearchParams] = useSearchParams();

  if (loading || !activeDrop) {
    return <p style={{ padding: 'var(--gutter)' }}>Loading…</p>;
  }

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const activeCategory = CATEGORY_FILTERS.find((c) => c.slug === categorySlug) || null;

  let filteredProducts = activeDrop.products;

  if (categorySlug) {
    filteredProducts = activeCategory
      ? filteredProducts.filter(
          (p) =>
            p.handle.toLowerCase().includes(activeCategory.match) ||
            p.title.toLowerCase().includes(activeCategory.match)
        )
      : [];
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter((p) => p.title.toLowerCase().includes(query));
  }

  // Gender intentionally has NO filtering effect on the products shown —
  // MMAI's collection is unisex/identity-first. The session gender only
  // drives the dismissible pill below and customize-link query strings.

  const count = filteredProducts.length;
  const countLabel = `${String(count).padStart(2, '0')} ${count === 1 ? 'PIECE' : 'PIECES'} · DROP 001`;

  const handleCategoryClick = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  return (
    <>
      <section className="plp-banner">
        <img
          src="/assets/editorial/brand-story.png"
          alt="MMAI Drop 001 campaign"
          className="plp-banner__image"
        />
        <div className="plp-banner__overlay" />
        <div className="plp-banner__content">
          <p className="plp-banner__eyebrow">MMAI · South Africa</p>
          <h1 className="plp-banner__title">Drop 001</h1>
        </div>
      </section>

      <header className="plp-header">
        <p className="plp-header__eyebrow">
          {activeCategory ? `Category · ${activeCategory.label}` : 'Full Collection'}
        </p>
        <div className="plp-header__title-row">
          <h2 className="plp-header__title">The Collection</h2>
          <span className="plp-header__count">{countLabel}</span>
        </div>
        <p className="plp-header__scarcity">
          Four pieces. No restocks. Made to order, one at a time.
        </p>
      </header>

      <div className="plp-filter-bar">
        <button
          type="button"
          className={
            categorySlug === null ? 'plp-filter-bar__btn plp-filter-bar__btn--active' : 'plp-filter-bar__btn'
          }
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>
        {CATEGORY_FILTERS.map(({ slug, label }) => (
          <button
            key={slug}
            type="button"
            className={
              categorySlug === slug
                ? 'plp-filter-bar__btn plp-filter-bar__btn--active'
                : 'plp-filter-bar__btn'
            }
            onClick={() => handleCategoryClick(slug)}
          >
            {label}
          </button>
        ))}
        {gender && (
          <button
            type="button"
            className="plp-filter-bar__gender-pill"
            onClick={() => setGender(null)}
          >
            For {gender === 'him' ? 'Him' : 'Her'} ✕
          </button>
        )}
      </div>

      <section className="plp-grid">
        {filteredProducts.length === 0 ? (
          <p className="plp-grid__empty">No pieces match this filter yet.</p>
        ) : (
          <div className="plp-grid__cards">
            {filteredProducts.map((product) => (
              <div key={product.id} className="plp-grid__card">
                <ProductCard product={product} gender={gender} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
