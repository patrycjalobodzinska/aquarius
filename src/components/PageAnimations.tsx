"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * Reveal nagłówka hero [data-hero-title] na mount — per linia, staggered.
 *
 * Wcześniej ten plik utrzymywał WŁASNĄ instancję Lenis (drugą, oprócz
 * SmoothScroll) plus 8 typów ScrollTriggera (hero-pin, dropin, reveal,
 * reveal-x, stagger, fade, parallax, reveal-tl). Żaden poza data-hero-title
 * nie był używany na stronie — wywalone.
 *
 * GSAP zostaje, ale tylko jako jednorazowy fromTo bez ScrollTrigger.
 */
export default function PageAnimations() {
  useEffect(() => {
    gsap.utils.toArray<HTMLElement>("[data-hero-title]").forEach((el) => {
      const lines = el.querySelectorAll("[data-hero-line]");
      if (lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.12,
            delay: 0.15,
          },
        );
      } else {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.3, ease: "power4.out", delay: 0.15 },
        );
      }
    });
  }, []);

  return null;
}
