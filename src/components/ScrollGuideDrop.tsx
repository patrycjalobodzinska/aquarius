"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SmallDrop = dynamic(() => import("./SmallDrop"), { ssr: false });

/**
 * Kropla-przewodnik: NIE jest widoczna dopóki nie wyjedzie z góry pod koniec
 * pinu FeaturesSketch. Od tego momentu zostaje fixed na środku viewportu.
 */
export default function ScrollGuideDrop() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tween: gsap.core.Tween | null = null;

    const setup = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const trigger = document.querySelector<HTMLElement>(
        "[data-features-sketch]",
      );
      if (!trigger) return;

      // Stan startowy - autoAlpha=0 ustawia zarówno opacity:0 jak i
      // visibility:hidden → element jest GWARANTOWANIE niewidoczny
      // (także dla interakcji i rendering hinty).
      gsap.set(wrap, { autoAlpha: 0, yPercent: -300 });

      // Animacja wjazdu z góry w ostatnich 20% pinu FeaturesSketch (pin +=300%).
      tween = gsap.to(wrap, {
        autoAlpha: 1,
        yPercent: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger,
          start: "top top+=240%",
          end: "top top+=300%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    };

    const t = setTimeout(setup, 500);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
      style={{ visibility: "hidden", opacity: 0 }}>
      <SmallDrop size={110} />
    </div>
  );
}
