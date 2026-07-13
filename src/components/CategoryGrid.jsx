import { Link } from 'react-router-dom';
import { useSessionGenderFilter } from '../hooks/useSessionGenderFilter';
import './CategoryGrid.css';

/* ============================================================
   MMAI — CATEGORY GRID
   Shop-by-category tile grid, rendered on HomePage directly
   below BrandValueStrip. Respects the session gender filter
   when building /shop links but never sets it.
   ============================================================ */

const CATEGORIES = [
  { label: 'Hoodies', slug: 'hoodies', modifier: 'hoodies' },
  { label: 'Cargo Pants', slug: 'cargo-pants', modifier: 'cargo-pants' },
  { label: 'Graphic Tees', slug: 'graphic-tees', modifier: 'graphic-tees' },
  { label: 'Coats', slug: 'coats', modifier: 'coats' },
  { label: 'Accessories', slug: 'accessories', modifier: 'accessories' },
];

export default function CategoryGrid() {
  const [gender] = useSessionGenderFilter();

  const categoryLink = (slug) =>
    gender ? `/shop?category=${slug}&gender=${gender}` : `/shop?category=${slug}`;

  return (
    <section className="category-grid">
      <div className="category-grid__header">
        <p className="category-grid__eyebrow">Explore</p>
        <h2 className="category-grid__title">Shop by Category</h2>
      </div>

      <div className="category-grid__tiles">
        {CATEGORIES.map(({ label, slug, modifier }) => (
          <Link
            key={slug}
            to={categoryLink(slug)}
            className={`category-grid__tile category-grid__tile--${modifier}`}
          >
            <span className="category-grid__label">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
