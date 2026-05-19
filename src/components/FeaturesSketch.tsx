"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSketch() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile: brak animacji draw/erase, brak fixed SVG-overlaya. Tekst i obraz
    // wyświetlają się od razu, sekcja stackuje się normalnie.
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) {
      if (textRef.current) {
        textRef.current.style.opacity = "1";
        textRef.current.style.transform = "none";
      }
      if (imgRef.current) {
        imgRef.current.style.opacity = "1";
        imgRef.current.style.transform = "none";
      }
      return;
    }

    let tl: gsap.core.Timeline | null = null;

    const setup = () => {
      const section = sectionRef.current;
      const path = pathRef.current;
      const path2 = path2Ref.current;
      const svgWrap = svgWrapRef.current;
      const textEl = textRef.current;
      const imgEl = imgRef.current;
      if (!section || !path || !svgWrap) return;

      const length = path.getTotalLength();
      // dash L, gap 2L → offset od L (invisible) przez 0 (visible) do -L (invisible)
      // BEZ cyklowania wzoru z powrotem do dasha. Zero resztek na końcach path.
      path.style.strokeDasharray = `${length} ${length * 2}`;
      path.style.strokeDashoffset = `${length}`; // start: invisible

      let length2 = 0;
      if (path2) {
        length2 = path2.getTotalLength();
        path2.style.strokeDasharray = `${length2} ${length2 * 2}`;
        path2.style.strokeDashoffset = `${length2}`;
      }

      // startowe pozycje tekstu i obrazu - poza ekranem od DOŁU, niewidoczne.
      if (textEl) gsap.set(textEl, { y: 120, opacity: 0 });
      if (imgEl) gsap.set(imgEl, { y: 160, opacity: 0 });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
          invalidateOnRefresh: true,
          onLeave: () => {
            if (svgWrap) gsap.set(svgWrap, { opacity: 0 });
          },
          onLeaveBack: () => {
            if (svgWrap) gsap.set(svgWrap, { opacity: 0 });
          },
        },
      });

      tl.fromTo(
        svgWrap,
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 0.04 },
        0,
      );

      // DRAW path 1 — long, slow stroke.
      tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 0.42 }, 0);

      if (textEl)
        tl.to(
          textEl,
          { y: 0, opacity: 1, ease: "power2.out", duration: 0.2 },
          0.1,
        );

      if (imgEl)
        tl.to(
          imgEl,
          { y: 0, opacity: 1, ease: "power2.out", duration: 0.2 },
          0.22,
        );

      // ERASE path 1
      tl.to(
        path,
        {
          strokeDashoffset: -length * 1.3,
          ease: "none",
          duration: 0.18,
        },
        0.46,
      );
      tl.to(path, { opacity: 0, ease: "none", duration: 0.05 }, 0.6);

      // DRAW path 2 — same slow pacing as path 1.
      if (path2 && length2 > 0)
        tl.to(
          path2,
          { strokeDashoffset: 0, ease: "none", duration: 0.32 },
          0.62,
        );

      if (path2 && length2 > 0)
        tl.to(
          path2,
          { strokeDashoffset: -length2, ease: "none", duration: 0.05 },
          0.97,
        );

      tl.to(svgWrap, { opacity: 0, ease: "none", duration: 0.02 }, 0.98);

      ScrollTrigger.refresh();
    };

    const t = setTimeout(setup, 400);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <>
      {/* SVG fixed do ekranu - widoczne tylko desktop (md+). Na mobile
          ukrywamy całkowicie żeby nie generować efektu zanikania w tle. */}
      <div
        ref={svgWrapRef}
        className="pointer-events-none fixed inset-0 -z-10 hidden md:block"
        style={{ opacity: 0 }}
        aria-hidden>
        <svg
          className="h-full w-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          fill="none"
          style={{ overflow: "visible" }}>
          <path
            ref={pathRef}
            d="M -250 500 C 250 180, 850 780, 1300 400 C 1550 230, 1750 560, 1950 520"
            stroke="#1e3a8a"
            strokeWidth="40"
            strokeLinecap="butt"
            strokeOpacity="0.18"
            vectorEffect="non-scaling-stroke"
          />
          {/* PATH 2 - inny kształt */}
          <path
            ref={path2Ref}
            d="M -250 250 Q 200 720, 550 380 T 1150 500 T 1950 230"
            stroke="#0c2a5a"
            strokeWidth="32"
            strokeLinecap="butt"
            strokeOpacity="0.15"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Obraz i tekst scrollują normalnie. */}
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden pt-2 pb-10 md:h-[160vh] md:py-0">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-6 md:h-full md:gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            ref={textRef}
            className="opacity-100 will-change-[transform,opacity] md:opacity-0">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-5xl lg:text-6xl">
              Prześledź drogę
              <br />
              każdej kropli
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
              Od ujęcia, przez pięciostopniową filtrację aż do szklanki na Twoim
              stole - każdy etap jest mierzalny, powtarzalny i zgodny z normami
              NSF/ANSI.
            </p>
          </div>

          <div
            ref={imgRef}
            className="relative p-0 opacity-100 will-change-[transform,opacity] md:p-12 md:opacity-0 lg:p-16">
            <div className="relative h-[45vh] overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/20 ring-1 ring-white/50 md:h-[65vh]">
              <Image
                src="/hero-spash.jpg"
                alt="Splash czystej wody"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
