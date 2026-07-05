import './BrandValueStrip.css';

/* ============================================================
   MMAI — BRAND VALUE STRIP
   4-column brand pillars, rendered directly below the Hero.
   ============================================================ */

const PILLARS = [
  {
    title: 'Fully Customizable',
    description: 'Yours to define',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="8.5" y1="8" x2="20" y2="19" />
        <line x1="20" y1="5" x2="8.5" y2="16" />
      </svg>
    ),
  },
  {
    title: 'Made in South Africa',
    description: 'Local · Global',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21s7-7.58 7-12A7 7 0 0 0 5 9c0 4.42 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Limited Drops Only',
    description: 'No restocks',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 9 L8 3 H16 L20 9 L12 21 Z" />
        <path d="M4 9 H20" />
        <path d="M9 9 L12 21" />
        <path d="M15 9 L12 21" />
        <path d="M8 3 L9 9" />
        <path d="M16 3 L15 9" />
      </svg>
    ),
  },
  {
    title: 'Your Identity',
    description: 'Barcode ID',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="10.5" />
      </svg>
    ),
  },
];

export default function BrandValueStrip() {
  return (
    <div className="brand-value-strip">
      {PILLARS.map(({ title, description, icon }) => (
        <div className="brand-value-strip__pillar" key={title}>
          <div className="brand-value-strip__icon">{icon}</div>
          <p className="brand-value-strip__title">{title}</p>
          <p className="brand-value-strip__description">{description}</p>
        </div>
      ))}
    </div>
  );
}
