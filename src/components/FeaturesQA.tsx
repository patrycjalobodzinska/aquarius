"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SmallDrop = dynamic(() => import("./SmallDrop"), { ssr: false });

const QA_ITEMS = [
  {
    q: "Wielostopniowa filtracja",
    a: "5 warstw aktywnego węgla i membrana RO zatrzymują chlor, metale ciężkie i mikroplastik - zanim trafią do Twojej szklanki.",
  },
  {
    q: "99,9% czystości",
    a: "Laboratoryjnie potwierdzona skuteczność wobec ponad 300 różnych zanieczyszczeń obecnych w wodzie z kranu.",
  },
  {
    q: "Certyfikat NSF/ANSI",
    a: "Zgodne z normami 42, 53 i 58 - poziom wody pitnej butelkowanej, bez plastikowych odpadów i kosztów transportu.",
  },
  {
    q: "Inteligentny wskaźnik",
    a: "Aplikacja przypomni o wymianie wkładu i pokaże bieżące zużycie - zawsze świeża filtracja, zero zgadywania.",
  },
  {
    q: "Instalacja w 15 minut",
    a: "Bez hydraulika. Złącza szybkozłączne, pełna instrukcja w pudełku - podłączysz pod zlew sam w kwadrans.",
  },
];

export default function FeaturesQA() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let tween: gsap.core.Tween | null = null;

    const setup = () => {
      const section = sectionRef.current;
      const rowsWrap = rowsRef.current;
      const R0 = rowRefs.current[0];
      const Rlast = rowRefs.current[QA_ITEMS.length - 1];
      if (!section || !rowsWrap || !R0 || !Rlast) return;

      const vh = window.innerHeight;
      const R0_mid = R0.offsetTop + R0.offsetHeight / 2;
      const Rlast_mid = Rlast.offsetTop + Rlast.offsetHeight / 2;
      const yInit = vh / 2 - R0_mid;
      const yFinal = vh / 2 - Rlast_mid;
      const scrollDist = Math.abs(Rlast_mid - R0_mid);

      if (scrollDist === 0) return;

      gsap.set(rowsWrap, { y: yInit });

      // Pin minimum 1 × viewport - żeby wyraźnie było widać „przyklejenie".
      const pinEnd = Math.max(scrollDist, vh * 0.8);

      tween = gsap.to(rowsWrap, {
        y: yFinal,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${pinEnd}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const currentRowMid = R0_mid + scrollDist * self.progress;
            let closestIdx = 0;
            let closestDist = Infinity;
            rowRefs.current.forEach((row, i) => {
              if (!row) return;
              const mid = row.offsetTop + row.offsetHeight / 2;
              const d = Math.abs(mid - currentRowMid);
              if (d < closestDist) {
                closestDist = d;
                closestIdx = i;
              }
            });

            for (let i = 0; i < QA_ITEMS.length; i++) {
              const isActive = i === closestIdx;
              const left = leftRefs.current[i];
              const right = rightRefs.current[i];
              if (left)
                gsap.to(left, {
                  x: isActive ? -15 : 0,
                  opacity: isActive ? 1 : 0.25,
                  duration: 0.3,
                  overwrite: true,
                });
              if (right)
                gsap.to(right, {
                  x: isActive ? 15 : 0,
                  opacity: isActive ? 1 : 0.25,
                  duration: 0.3,
                  overwrite: true,
                });
            }
          },
        },
      });

      // refresh po utworzeniu - Lenis + dynamic SmallDrop muszą zdążyć.
      ScrollTrigger.refresh();
    };

    // Czekamy aż layout się ustabilizuje (dynamic import SmallDrop ładuje canvas asynchronicznie).
    const t = setTimeout(setup, 500);

    const onLoad = () => ScrollTrigger.refresh();
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden">
      {/* KROPLA 3D - mała, wycentrowana w viewport, płynie nad treścią */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <SmallDrop size={80} />
      </div>

      {/* Kontener wierszy - podczas pinu jedzie w górę (scrub). */}
      <div ref={rowsRef} className="relative will-change-transform">
        {QA_ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="mx-auto flex w-full max-w-[1100px] items-center gap-10 px-[5vw] py-[6vh]">
            {/* Pytanie - lewa połowa */}
            <div
              ref={(el) => {
                leftRefs.current[i] = el;
              }}
              className="flex w-1/2 justify-end will-change-[transform,opacity]"
              style={{ opacity: 0.25 }}>
              <p
                className="m-0 max-w-md text-right font-semibold uppercase tracking-wide text-blue-950"
                style={{
                  fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
                  lineHeight: 1.25,
                }}>
                {item.q}
              </p>
            </div>

            {/* Treść - prawa połowa */}
            <div
              ref={(el) => {
                rightRefs.current[i] = el;
              }}
              className="w-1/2 will-change-[transform,opacity]"
              style={{ opacity: 0.25 }}>
              <p
                className="m-0 max-w-md leading-relaxed text-slate-600"
                style={{
                  fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                  lineHeight: 1.7,
                }}>
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
