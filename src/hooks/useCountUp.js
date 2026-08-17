import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Tweens a number towards `target` with requestAnimationFrame.
 * The animation only runs while the value is changing, so nothing
 * keeps the main thread busy once the page is idle.
 */
export default function useCountUp(target, duration = 620) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const frameRef = useRef(0);

  useEffect(() => {
    const from = displayRef.current;

    if (from === target || prefersReducedMotion()) {
      displayRef.current = target;
      setDisplay(target);
      return undefined;
    }

    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);

      displayRef.current = next;
      setDisplay(next);

      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return display;
}
