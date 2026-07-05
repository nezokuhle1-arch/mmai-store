import { useNavigate } from 'react-router-dom';
import './Hero.css';

/* ============================================================
   MMAI — HERO
   Full-bleed hero. NavBar is rendered separately at the App
   level (fixed overlay) — this component only supplies the
   gradient legibility overlay and the hero content itself.
   ============================================================ */

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__gradient-overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">Drop 001 — Now Live</p>
        <h1 className="hero__headline">I wear myself.</h1>
        <button className="hero__cta" onClick={() => navigate('/shop')}>
          Shop The Drop
        </button>
      </div>
    </section>
  );
}
