import { useEffect, useRef, useState } from 'react';

/* ============================================================
   MMAI — RAIL SCROLL INDEX
   Tracks which card in a horizontal drag-scroll rail is most in
   view, for driving a dash progress indicator. Shared by
   ProductGrid and BestsellersStrip.
   ============================================================ */

export function useRailScrollIndex(itemCount) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || itemCount < 2) return;

    let ticking = false;

    const updateActiveIndex = () => {
      ticking = false;
      const { children } = track;
      if (children.length < 2) return;
      const itemWidth = children[1].offsetLeft - children[0].offsetLeft;
      if (!itemWidth) return;
      const index = Math.round(track.scrollLeft / itemWidth);
      setActiveIndex(Math.max(0, Math.min(index, itemCount - 1)));
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActiveIndex);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [itemCount]);

  return { trackRef, activeIndex };
}
