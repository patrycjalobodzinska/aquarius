"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Klaster kółek - centrum ~215°.
const MINERALS: { label: string; angle: number }[] = [
  { label: "Wapń", angle: 245 },
  { label: "Magnez", angle: 225 },
  { label: "Potas", angle: 205 },
  { label: "Sód", angle: 185 },
];

export default function MineralsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileRibbonRef = useRef<HTMLDivElement>(null);
  const mobileRibbonTextPathRef = useRef<SVGTextPathElement>(null);

  // Marquee napisu w mobile-ribbon — taki sam pattern jak w Landing.tsx dla
  // desktop-ribbona: progress scrolla strony aktualizuje startOffset textPath-a.
  useEffect(() => {
    const ribbon = mobileRibbonRef.current;
    const path = mobileRibbonTextPathRef.current;
    if (!ribbon || !path) return;
    const onScroll = () => {
      const rect = ribbon.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + rect.height;
      const progressed = vh - rect.top;
      const t = Math.max(0, Math.min(1, progressed / total));
      const offset = 10 + t * 80;
      path.setAttribute("startOffset", `${offset}%`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    const setup = () => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      const text = textRef.current;
      const ring = ringRef.current;
      const parallax = parallaxRef.current;
      const img = imgRef.current;
      const underline = underlineRef.current;
      if (!section) return;

      // Delikatny parallax ringa+szklanki - porusza się w przeciwnym kierunku
      // do scrolla (yPercent 10 → -10 przez całe pole widoczności sekcji).
      if (parallax) {
        tweens.push(
          gsap.fromTo(
            parallax,
            { yPercent: 8 },
            {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            },
          ),
        );
      }

      // Heading - slide up + fade.
      if (heading) {
        gsap.set(heading, { y: 50, opacity: 0 });
        tweens.push(
          gsap.to(heading, {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "restart none restart reset",
            },
          }),
        );
      }

      // Text po prawej - slide from right + fade.
      if (text) {
        gsap.set(text, { x: 60, opacity: 0 });
        tweens.push(
          gsap.to(text, {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 1,
            delay: 0.25,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "restart none restart reset",
            },
          }),
        );
      }

      // Ring - wjazd od dołu. Sam łuk SVG ma własny obrót (patrz transform na
      //  <svg> niżej w JSX), żeby tylko on był pochylony - label-e
      //  Wapń/Magnez/Sód/Potas i szklanka pozostają w pionie.
      if (ring) {
        gsap.set(ring, { y: 400, opacity: 0 });
        tweens.push(
          gsap.to(ring, {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 2,
            delay: 0.05,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "restart none restart reset",
            },
          }),
        );
      }

      // Szklanka wody - start ciut po ringu, dłuższa.
      if (img) {
        gsap.set(img, { scale: 0.7, opacity: 0, y: 40 });
        tweens.push(
          gsap.to(img, {
            scale: 1,
            opacity: 1,
            y: 0,
            ease: "back.out(1.4)",
            duration: 2.2,
            delay: 0.2,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "restart none restart reset",
            },
          }),
        );
      }

      // Pen-underline - rysuje się jak długopisem po wszystkim.
      if (underline) {
        const len = underline.getTotalLength();
        underline.style.strokeDasharray = `${len}`;
        underline.style.strokeDashoffset = `${len}`;
        tweens.push(
          gsap.to(underline, {
            strokeDashoffset: 0,
            ease: "power2.inOut",
            duration: 1.3,
            delay: 1.1,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "restart none restart reset",
            },
          }),
        );
      }

      ScrollTrigger.refresh();
    };

    const t = setTimeout(setup, 400);
    return () => {
      clearTimeout(t);
      tweens.forEach((tw) => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    };
  }, []);

  // Nieskończone, delikatne falowanie podkreślenia - always running
  // (niezależne od scroll-triggerów draw/animacji wjazdu).
  useEffect(() => {
    const el = underlineRef.current;
    if (!el) return;
    const wave = gsap.to(el, {
      y: 1.8,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      wave.kill();
    };
  }, []);

  // Hover: animacja odpala się raz na enter (kierunek = skąd wjechał kursor)
  // → brak wibracji przy granicach, łagodne power3.out.
  const handleEnter = (i: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const el = circleRefs.current[i];
    if (!el) return;
    const wrapper = e.currentTarget;
    const r = wrapper.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const len = Math.hypot(dx, dy) || 1;
    // Mocniejszy odsuw od kursora - kółka wyraźnie „uciekają".
    const push = 42;
    gsap.to(el, {
      x: -(dx / len) * push,
      y: -(dy / len) * push,
      duration: 0.55,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const handleLeave = (i: number) => () => {
    const el = circleRefs.current[i];
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      overwrite: true,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-visible pt-8 pb-0 md:pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* DUŻY NAPIS NA POCZĄTKU SEKCJI */}
        <h2
          ref={headingRef}
          className="mb-8 max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight text-blue-950 sm:text-5xl md:mb-16 md:text-7xl lg:text-[5.5rem]">
          Minerały wracają do wody.
        </h2>

        {/* 2-kolumnowy układ pod nagłówkiem */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-20">
          {/* LEWA - ring z kółkami, szklanka i strzałka. Sam ring/szklanka
              jest opuszczona (`mt-`), żeby cały visual zaczynał się niżej i
              wjeżdżał zza wstążki. Wysokość kolumny = ~73% szerokości ringa,
              czyli do dołu widocznego łuku. */}
          <div className="relative mt-6 h-[300px] sm:mt-12 sm:h-[400px] lg:mt-20 lg:h-[470px]">
            {/* parallax wrapper - ruch niezależny od animacji wjazdu ringa */}
            <div
              ref={parallaxRef}
              className="absolute inset-0 will-change-transform">
              <div
                ref={ringRef}
                className="absolute left-1/2 top-0 aspect-square w-[min(100%,780px)] -translate-x-1/2 will-change-[transform,opacity]">
                {/* Strzałka + napis w LEWYM GÓRNYM */}
                <div className="absolute -left-6 -top-6 w-52 text-blue-900">
                  <div className="text-[15px] italic leading-tight">
                    woda wzbogacona
                    <br />o minerały
                  </div>
                  <svg
                    viewBox="0 0 100 60"
                    className="mt-1 h-10 w-24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M 8 8 Q 30 50, 85 48" />
                    <path d="M 78 40 L 86 49 L 76 54" />
                  </svg>
                </div>

                {/* OKRĄG - SVG, otwarty u dołu. Sam łuk pochylony o -7°
                  (obrót na <path>, wokół środka 50,50 viewBoxa), bez
                  ruszania całego kontenera ringa. */}
                <svg
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(255,255,255,0.5))",
                  }}>
                  <path
                    d="M 10.2 73 A 46 46 0 1 1 89.8 73"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    transform="rotate(-12 50 50)"
                  />
                </svg>

                {/* SZKLANKA - mobile niżej, desktop wyżej. */}
                <div
                  ref={imgRef}
                  className="pointer-events-none absolute left-[65%] top-[25%] -translate-x-1/2 -translate-y-1/2 will-change-[transform,opacity] lg:top-[-10%]"
                  style={{ width: "72%", height: "72%" }}>
                  <Image
                    src="/water-glass.webp"
                    alt="Szklanka z wodą"
                    fill
                    sizes="(min-width: 1024px) 35vw, 70vw"
                    className="object-contain"
                  />
                </div>

                {/* Minerał-kółka - hit-zone 144x144, inner circle 96x96 */}
                {MINERALS.map((m, i) => {
                  const rad = (m.angle * Math.PI) / 180;
                  const xPct = 50 + 50 * Math.cos(rad);
                  const yPct = 50 + 50 * Math.sin(rad);
                  return (
                    <div
                      key={m.label}
                      onMouseEnter={handleEnter(i)}
                      onMouseLeave={handleLeave(i)}
                      className="absolute z-10 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center"
                      style={{ left: `${xPct}%`, top: `${yPct}%` }}>
                      <div
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                        className="grid h-24 w-24 cursor-pointer place-items-center rounded-full border border-white/60 bg-white/90 text-center text-[13px] font-semibold uppercase tracking-wide text-blue-950 shadow-lg backdrop-blur transition-colors hover:bg-white"
                        style={{ willChange: "transform" }}>
                        {m.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* WSTĄŻKA MOBILE - widoczna tylko < lg. Wjeżdża między łuk
              okręgu a tekst „Filtr nie tylko usuwa…", podczas gdy desktop
              renderuje swoją wersję w Landing.tsx pod całą sekcją. */}
          <div
            ref={mobileRibbonRef}
            aria-hidden
            className="relative -mt-28 w-screen left-1/2 -translate-x-1/2 overflow-hidden lg:hidden">
            <svg
              viewBox="-100 -100 1720 460"
              preserveAspectRatio="xMidYMid meet"
              className="block w-[180vw] min-w-[700px] max-w-none -ml-[40vw]"
              style={{ height: "auto", overflow: "visible" }}>
              <defs>
                <path
                  id="ribbon-arc-text-mobile"
                  d="M-68 300 C 173 173 515.5 1 937.2 1 1254.5 1 1468 183.3 1543 246.9"
                  fill="none"
                />
              </defs>
              <path
                d="M-68 300 C 173 173 515.5 1 937.2 1 1254.5 1 1468 183.3 1543 246.9"
                fill="none"
                stroke="#1e40af"
                strokeWidth="140"
                strokeLinecap="butt"
              />
              <path
                d="M-68 300 C 173 173 515.5 1 937.2 1 1254.5 1 1468 183.3 1543 246.9"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="140"
                strokeLinecap="butt"
                opacity="0.35"
                transform="translate(0,-2)"
              />
              <text
                fill="#ffffff"
                className="font-semibold uppercase"
                style={{ fontSize: "64px", letterSpacing: "0.05em" }}>
                <textPath
                  ref={mobileRibbonTextPathRef}
                  href="#ribbon-arc-text-mobile"
                  startOffset="50%"
                  textAnchor="middle">
                  CZYSTA WODA · NATURALNA MINERALIZACJA · BEZ BUTELEK
                </textPath>
              </text>
            </svg>
          </div>

          {/* PRAWA - bez tła, większy fragment + opis, pen-underline */}
          <div ref={textRef} className="will-change-[transform,opacity]">
            <p className="text-2xl leading-snug tracking-tight text-blue-950 md:text-3xl">
              Filtr nie tylko usuwa zanieczyszczenia - po odwróconej osmozie{" "}
              <span className="relative inline-block whitespace-nowrap">
                ponownie wzbogaca wodę
                <svg
                  className="pointer-events-none absolute -bottom-3 left-0 h-5 w-full"
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  fill="none"
                  style={{ overflow: "visible" }}
                  aria-hidden>
                  <path
                    ref={underlineRef}
                    d="M 3 9 Q 50 3, 100 8 T 200 7 T 297 9"
                    stroke="#2563eb"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      strokeDasharray: 9999,
                      strokeDashoffset: 9999,
                    }}
                  />
                </svg>
              </span>{" "}
              o wapń, magnez, potas i sód.
            </p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600">
              Smak i właściwości wody mineralnej - bez butelki, bez dowozu, bez
              plastiku. Każda szklanka z Twojego kranu zachowuje balans zdrowego
              pH i naturalnej mineralizacji.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
