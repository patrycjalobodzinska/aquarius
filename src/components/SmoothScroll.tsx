"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Lenis smooth scroll wrapper. Przejmuje zdarzenia kółka i tworzy
 * łagodny easing scrolla. Kompatybilne z window.scrollY (ScrollWaterDrop dalej
 * czyta `window.scrollY` i aktualizuje pozycję kropli - tyle że teraz płynnie).
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
