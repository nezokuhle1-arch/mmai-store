import { useEffect, useState } from 'react';
import './AnnouncementBar.css';

/* ============================================================
   MMAI — ANNOUNCEMENT BAR
   Solid bar above everything, including the transparent nav.
   Rotates through 3 messages every 4s with a fade transition.
   ============================================================ */

const MESSAGES = [
  "Drop 001 — Limited Pieces. Once They're Gone.",
  'Free shipping on orders over R1,500 · South Africa wide',
  'Your barcode. Your identity. Sign up and claim yours.',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="announcement-bar">
      <span className={`announcement-bar__text ${visible ? 'announcement-bar__text--visible' : ''}`}>
        {MESSAGES[index]}
      </span>
    </div>
  );
}
