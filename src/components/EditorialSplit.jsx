import { Link } from 'react-router-dom';
import './EditorialSplit.css';

/* ============================================================
   MMAI — EDITORIAL SPLIT
   Brand story section, rendered on HomePage directly after
   CategoryGrid. Two-column: copy + CTA on the left, an
   animated image with a top-aligned quote on the right.
   ============================================================ */

export default function EditorialSplit() {
  return (
    <section className="editorial-split">
      <div className="editorial-split__copy">
        <p className="editorial-split__eyebrow">The MMAI Story</p>
        <h2 className="editorial-split__headline">
          Made in South Africa.
          <br />
          Worn worldwide.
        </h2>
        <p className="editorial-split__body">
          Your clothes should speak before you do. Every piece carries your name, your words,
          your identity — stitched in, not printed on. We don&apos;t do restocks. We don&apos;t
          do trends. We do drops.
        </p>
        <Link to="/about" className="editorial-split__cta">
          Discover the Brand
        </Link>
      </div>

      <div className="editorial-split__visual">
        {/* TODO: Phase 5 or when budget allows — replace this <img> with a looping
            <video autoPlay muted loop playsInline> using the same absolute
            positioning and object-fit: cover. Remove the editorial-pan CSS
            animation when swapping to video, since real motion replaces the
            simulated pan/zoom. Keep the gradient overlay and quote content
            exactly as-is — they layer on top of either an image or a video
            identically. */}
        <img
          src="/assets/editorial/brand-story.png"
          alt="MMAI identity garment, back view, concrete wall"
          className="editorial-split__image"
        />

        <div className="editorial-split__overlay" />

        <div className="editorial-split__quote">
          <p className="editorial-split__quote-text">I wear myself.</p>
          <p className="editorial-split__quote-label">MMAI · SOUTH AFRICA · EST. 2025</p>
        </div>
      </div>
    </section>
  );
}
