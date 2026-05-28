"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef } from "react";
import FeaturesSketch from "./FeaturesSketch";
import MineralsSection from "./MineralsSection";
import BeforeAfterArc from "./BeforeAfterArc";
import ProductsSection from "./ProductsSection";
import TwoTracksSection from "./TwoTracksSection";
import SofteningDeepDive from "./SofteningDeepDive";
import ContactSection from "./ContactSection";
import FaqSection from "./FaqSection";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const PageAnimations = dynamic(
  () => import(/* webpackPreload: true */ "./PageAnimations"),
  { ssr: false },
);

export default function Landing() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const ribbonTextPathRef = useRef<SVGTextPathElement>(null);

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
      }
      const img = heroImageRef.current;
      if (img) {
        img.style.opacity = String(fade);
        img.style.transform = `translate3d(${30 * t}px, 0, 0) scale(${1 - 0.08 * t})`;
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
        {/* Ambient glow za szklanką */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center md:justify-end md:pr-[8%]">
          <div
            className="h-[70vh] w-[70vh] max-h-[700px] max-w-[700px] rounded-full blur-3xl hero-glow-pulse"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(190,225,255,0.55) 0%, rgba(125,211,252,0.25) 30%, rgba(125,211,252,0.08) 55%, transparent 75%)",
              transform: "translateY(-4vh)",
            }}
          />
        </div>

        {/* Szklanka — na mobile za tekstem (większa, prawa krawędź wystaje
            poza viewport), na desktopie po prawej w siatce 2-kolumnowej. */}
        <div
          ref={heroImageRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[-25%] z-[5] flex w-[110%] items-center opacity-50 md:opacity-100 md:right-0 md:w-1/2 md:justify-center">
          <div className="relative h-[70%] w-full md:h-[85%]">
            <Image
              src="/water-glass.webp"
              alt=""
              fill
              priority
              sizes="(min-width:1024px) 45vw, 110vw"
              className="object-contain object-center"
            />
          </div>
        </div>

        <div
          ref={heroTextRef}
          className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 will-change-[opacity,transform]"
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
                className="inline-flex items-center gap-2 rounded-full border border-blue-950/15 bg-white/60 px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-white">
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

      <FaqSection />

      <ContactSection />

      <SiteFooter />
    </div>
  );
}
