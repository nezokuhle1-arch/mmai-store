import './IdentityCard.css';

/* ============================================================
   MMAI — IDENTITY CARD
   The woven-texture membership card, shared across account
   creation (steps 1 & 2, live-updating) and the profile view
   (fully populated with real data).
   ============================================================ */

export default function IdentityCard({ tier = 'SELF', name = '', barcodeId = null }) {
  const modifier = tier === 'MAISON DU SELF' ? 'maison' : 'self';
  const displayBarcode = barcodeId || 'MMAI-•••-•••';

  return (
    <div className={`identity-card identity-card--${modifier}`}>
      <div className="identity-card__top-row">
        <span className="identity-card__member-label">Member</span>
      </div>

      {/* mmai-card-monogram.png must be manually placed in
          public/assets/identity/ — it's already committed to the
          repo, but static assets under public/ aren't copied by the
          build from anywhere else, so a missing file here means it
          wasn't checked out/placed correctly, not a code bug. */}
      <img
        src="/assets/identity/mmai-card-monogram.png"
        alt="MMAI monogram"
        className="identity-card__monogram"
      />

      <p className="identity-card__wordmark">MMAI</p>

      <p className={`identity-card__name${name ? '' : ' identity-card__name--muted'}`}>
        {name || 'Your Name'}
      </p>

      <p className="identity-card__barcode">{displayBarcode}</p>

      <span className="identity-card__tier-badge">{tier}</span>
    </div>
  );
}
