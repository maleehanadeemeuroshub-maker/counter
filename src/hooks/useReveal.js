import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element the first time it scrolls into view, then stops
 * observing. Returns `[ref, revealed]`.
 */
export default function useReveal({ threshold = 0.15, rootMargin = '0px 0px -12% 0px' } = {}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, revealed]);

  return [ref, revealed];
}
