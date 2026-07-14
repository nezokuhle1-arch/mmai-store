import './InstagramStrip.css';

/* ============================================================
   MMAI — INSTAGRAM STRIP
   Edge-to-edge social proof grid at the end of HomePage.
   ============================================================ */

const INSTAGRAM_TILES = Array.from({ length: 6 }, (_, index) => index + 1);

export default function InstagramStrip() {
  return (
    <section className="instagram-strip" aria-labelledby="instagram-strip-handle">
      <header className="instagram-strip__header">
        <p className="instagram-strip__eyebrow">Follow us on Instagram</p>
        <h2 id="instagram-strip-handle" className="instagram-strip__handle">
          @mmai.store
        </h2>
      </header>

      <div className="instagram-strip__grid">
        {INSTAGRAM_TILES.map((tile) => (
          <a
            key={tile}
            className={`instagram-strip__tile instagram-strip__tile--${tile}`}
            href="https://www.instagram.com/mmai.store/"
            target="_blank"
            rel="noreferrer"
            aria-label={`View MMAI Instagram post ${tile}`}
          >
            <span className="instagram-strip__placeholder">MMAI ·</span>
            <span className="instagram-strip__overlay" aria-hidden="true">
              <svg className="instagram-strip__heart" viewBox="0 0 24 24">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </span>
          </a>
        ))}
      </div>

      <div className="instagram-strip__callout">Tag @mmai.store to be featured</div>
    </section>
  );
}
