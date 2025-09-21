'use client';

import { useEffect, useRef } from 'react';

export default function BrandLine() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let paused = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const brand = el.closest('.cursor-brand');
    const onEnter = () => { paused = true; el.classList.remove('is-hopping'); if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; } };
    const onLeave = () => { paused = false; scheduleNext(); };
    brand?.addEventListener('mouseenter', onEnter);
    brand?.addEventListener('mouseleave', onLeave);

    const hopOnce = () => {
      if (paused) return;
      const duration = 350 + Math.random() * 700; // 0.35s - 1.05s
      el.style.setProperty('--hop-duration', `${duration}ms`);
      el.classList.add('is-hopping');
      setTimeout(() => el.classList.remove('is-hopping'), duration + 20);
    };

    const scheduleNext = () => {
      if (paused) return;
      const rest = 700 + Math.random() * 1400; // 0.7s - 2.1s
      timeoutId = setTimeout(() => {
        hopOnce();
        scheduleNext();
      }, rest);
    };

    scheduleNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      brand?.removeEventListener('mouseenter', onEnter);
      brand?.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-brand-line" aria-hidden="true" />;
}


