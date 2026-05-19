"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import HeroSideBadges from "./HeroSideBadges";
import FeaturesSketch from "./FeaturesSketch";
import MineralsSection from "./MineralsSection";
import BeforeAfterArc from "./BeforeAfterArc";
import ProductsSection from "./ProductsSection";
import TwoTracksSection from "./TwoTracksSection";
import SofteningDeepDive from "./SofteningDeepDive";
import ContactSection from "./ContactSection";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const PageAnimations = dynamic(
  () => import(/* webpackPreload: true */ "./PageAnimations"),
  { ssr: false },
);

export default function Landing() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroBgTextRef = useRef<HTMLSpanElement>(null);
  const heroBadgesRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const ribbonTextPathRef = useRef<SVGTextPathElement>(null);

  const [badgesVisible, setBadgesVisible] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setBadgesVisible(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  // Po każdym (re)mount-cie wymuszamy scroll na samą górę - browser bez tego
  // odtwarza pozycję po F5, a my właśnie pokazujemy hero od zera.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Marquee napisu na łuku - manualny scroll-handler (omija potencjalne
  // konflikty z Lenis/ScrollTrigger, ten sam pattern co fade hero). Scroll
  // w dół przesuwa napis w prawo, scroll w górę w lewo.
  useEffect(() => {
    const ribbon = ribbonRef.current;
    const path = ribbonTextPathRef.current;
    if (!ribbon || !path) return;
    const onScroll = () => {
      const rect = ribbon.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 gdy górna krawędź wstążki jest dokładnie u dołu viewportu,
      // 1 gdy dolna krawędź wstążki jest u góry viewportu.
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
    // Scroll-fade hero tylko na desktopie - mobile ma być proste stackowanie
    // sekcji bez efektów zanikania.
    const mql = window.matchMedia("(min-width: 768px)");
    if (!mql.matches) return;

    const onScroll = () => {
      const h = Math.max(window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      const t = Math.min(1, Math.max(0, (p - 0.15) / 0.55));
      const fade = 1 - t;
      const el = heroTextRef.current;
      if (el) {
        el.style.opacity = String(fade);
        el.style.transform = `translate3d(${-60 * t}px, 0, 0) scale(${1 - 0.15 * t})`;
        el.style.filter = `blur(${t * 4}px)`;
      }
      const bg = heroBgTextRef.current;
      if (bg) {
        bg.style.opacity = String(fade);
        bg.style.transform = `scale(${1 - 0.08 * t})`;
        bg.style.filter = `blur(${t * 6}px)`;
      }
      const badges = heroBadgesRef.current;
      if (badges) {
        badges.style.opacity = String(fade);
        badges.style.transform = `translate3d(${30 * t}px, -50%, 0)`;
        badges.style.filter = `blur(${t * 4}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="relative overflow-x-clip text-slate-800">
      {/* Sztywne tło hero na CAŁĄ stronę - fixed + inset-0, nigdy się nie przesuwa.
          Sekcje z własnym bg (HOW IT WORKS, TRUST, FOOTER) zasłonią je lokalnie;
          sekcje bez tła (hero, FEATURES, TESTIMONIALS, CTA) pokażą ten sam gradient. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 30% at 50% 70%, rgba(125, 211, 252, 0.35), transparent 75%)",
            "linear-gradient(to bottom, transparent 55%, rgba(255,255,255,0.6) 60%, transparent 68%)",
            "linear-gradient(to bottom, #dbeafe 0%, #eff6fb 42%, #f5fbff 55%, #dde8f1 100%)",
          ].join(","),
        }}
      />
      <PageAnimations />

      <SiteHeader />

      <section className="relative h-svh overflow-hidden">
        {/* WIELKI PÓŁPRZEZROCZYSTY NAPIS - w tle, z animowanym gradientem. */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <span
            ref={heroBgTextRef}
            className="hero-bg-text-shimmer block w-full whitespace-nowrap text-center font-semibold uppercase tracking-tight text-[22vw] leading-none will-change-[opacity,transform,filter]">
            Aquarius
          </span>
        </div>

        <div className="absolute inset-0 z-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="h-[70vh] w-[70vh] max-h-[700px] max-w-[700px] rounded-full blur-3xl hero-glow-pulse"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(190,225,255,0.55) 0%, rgba(125,211,252,0.25) 30%, rgba(125,211,252,0.08) 55%, transparent 75%)",
                transform: "translateY(-4vh)",
              }}
            />
          </div>
        </div>

        {/* Pływające krople-dekoracje - widoczne głównie na mobile, gdzie nie
            ma side-badges po prawej. Na desktopie zostają jako subtelny akcent. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          <svg
            className="hero-drop-a absolute right-[6%] top-[14%] h-14 w-14 text-sky-400/70 md:right-[12%] md:top-[18%] md:h-16 md:w-16"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z" />
            <path
              d="M9 14c0 2 1.5 3.5 3.5 3.5"
              stroke="white"
              strokeWidth="1.2"
              fill="none"
              opacity="0.7"
            />
          </svg>
          <svg
            className="hero-drop-b absolute right-[22%] top-[42%] h-9 w-9 text-blue-500/60 md:right-[28%] md:top-[58%] md:h-10 md:w-10"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z" />
          </svg>
          <svg
            className="hero-drop-c absolute right-[12%] top-[62%] h-6 w-6 text-cyan-400/70 md:right-[18%] md:top-[32%] md:h-8 md:w-8"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z" />
          </svg>
          <svg
            className="hero-drop-a absolute right-[34%] top-[24%] h-5 w-5 text-blue-400/70 md:hidden"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ animationDelay: "1.8s" }}>
            <path d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z" />
          </svg>

        </div>

        <HeroSideBadges ref={heroBadgesRef} visible={badgesVisible} />

        <div
          ref={heroTextRef}
          className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 will-change-[opacity,transform,filter]"
          style={{ transformOrigin: "left center" }}>
          <div className="max-w-lg">
            <h1
              data-hero-title
              className="text-5xl font-semibold leading-[0.95] tracking-tight text-blue-950 md:text-6xl lg:text-7xl">
              <span data-hero-line className="block overflow-hidden pb-1">
                Czysta
              </span>
              <span data-hero-line className="block overflow-hidden pb-1">
                źródlana
              </span>
              <span data-hero-line className="block overflow-hidden pb-1">
                woda
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-700 md:text-lg">
              Filtry odwróconej osmozy i&nbsp;zmiękczacze, które usuwają do
              99,9% zanieczyszczeń i&nbsp;przywracają wodzie naturalną
              mineralizację — bez butelek, bez kamienia, prosto z&nbsp;Twojego
              kranu.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/produkty/filtry"
                className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-800">
                Zobacz filtry
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="currentColor">
                  <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z" />
                </svg>
              </a>
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-blue-950/15 bg-white/60 px-6 py-3 text-sm font-semibold text-blue-950 backdrop-blur-sm transition hover:bg-white">
                Porozmawiajmy
              </a>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSketch />
      <TwoTracksSection />
      <MineralsSection />

      {/* Półokrąg-wstążka: gruba, wychodzi poza szerokość ekranu,
          nachodzi na obcięty dół elipsy z sekcji wyżej */}
      <div
        ref={ribbonRef}
        aria-hidden
        className="relative z-20 hidden w-screen left-1/2 -translate-x-1/2 overflow-hidden -mt-16 md:-mt-24 lg:-mt-52 lg:block">
        <svg
          viewBox="-100 -80 1720 440"
          preserveAspectRatio="xMidYMid meet"
          className="block w-[160vw] min-w-[1600px] max-w-none -ml-[30vw]"
          style={{ height: "auto", overflow: "visible" }}>
          <defs>
            {/* Ścieżka nierównej elipsy - wyciągnięta w prawy górny róg */}
            <path
              id="ribbon-arc-text"
              d="M-68 300 C 173 173 515.5 1 937.2 1 1254.5 1 1468 183.3 1543 246.9"
              fill="none"
            />
          </defs>

          {/* Gruba wstążka - pełny niebieski pas */}
          <path
            d="M-68 300 C 173 173 515.5 1 937.2 1 1254.5 1 1468 183.3 1543 246.9"
            fill="none"
            stroke="#1e40af"
            strokeWidth="90"
            strokeLinecap="butt"
          />

          {/* Delikatna jaśniejsza krawędź u góry, dla głębi */}
          <path
            d="M-68 300 C 173 173 515.5 1 937.2 1 1254.5 1 1468 183.3 1543 246.9"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="90"
            strokeLinecap="butt"
            opacity="0.35"
            transform="translate(0,-2)"
          />

          <text
            fill="#ffffff"
            className="font-semibold uppercase"
            style={{ fontSize: "64px", letterSpacing: "0.05em" }}>
            <textPath
              ref={ribbonTextPathRef}
              href="#ribbon-arc-text"
              startOffset="50%"
              textAnchor="middle">
              CZYSTA WODA · NATURALNA MINERALIZACJA · BEZ BUTELEK
            </textPath>
          </text>
        </svg>
      </div>

      <BeforeAfterArc />

      <ProductsSection kind="filtry" />

      <SofteningDeepDive />

      <ProductsSection kind="zmiekczacze" />

      <ContactSection />

      <SiteFooter />
    </div>
  );
}
