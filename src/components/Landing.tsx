"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import FeatureBadge from "./FeatureBadge";
import FeaturesSketch from "./FeaturesSketch";
import MineralsSection from "./MineralsSection";
import BeforeAfterArc from "./BeforeAfterArc";
import ProductsSection from "./ProductsSection";
import TwoTracksSection from "./TwoTracksSection";
import SofteningDeepDive from "./SofteningDeepDive";
import ContactSection from "./ContactSection";
import SiteFooter from "./SiteFooter";
import Logo from "./Logo";

const FilterShowcase = dynamic(
  () => import(/* webpackPrefetch: true */ "./FilterShowcase"),
  { ssr: false },
);

// Eager warm-up: w przeglądarce odpalamy import natychmiast po sparse-owaniu
// modułu — webpack zaczyna pobierać chunk Three.js zanim React dotrze do
// renderu komponentu. To skraca czas między „strona pokazuje treść" a
// „kropla wskakuje na scenę".
if (typeof window !== "undefined") {
  void import("./HeroScene");
}

const HeroScene = dynamic(
  () => import(/* webpackPreload: true */ "./HeroScene"),
  { ssr: false },
);

const PageAnimations = dynamic(
  () => import(/* webpackPreload: true */ "./PageAnimations"),
  { ssr: false },
);

export default function Landing() {
  // Tekst hero + wielki napis w tle znikają w miarę jak kamera zjeżdża w kroplę.
  // Ten sam progress (scrollY / innerHeight, 0-1) który steruje kamerą w HeroScene.
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroBgTextRef = useRef<HTMLSpanElement>(null);
  const heroBadgesRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const ribbonTextPathRef = useRef<SVGTextPathElement>(null);

  // Blokada scrolla na czas ładowania hero - zdejmujemy gdy kropla + env-mapa
  // są gotowe (callback z HeroScene → ReadySignal w Suspense).
  const [heroReady, setHeroReady] = useState(false);
  const handleHeroReady = useCallback(() => setHeroReady(true), []);

  // Badge'e nie czekają na env-mapę 3D - lecą zaraz po reveal'u h1 (stagger
  // linii konczy sie ~1.2s). Wcześniej były gated heroReady, przez co użytkownik
  // czytał już tytuł, a badge'y wjeżdżały dopiero gdy kropla była gotowa.
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

  // Smooth scroll dla linków w headerze. Liczymy offset uwzględniając
  // wysokość headera (h-16 = 64px), żeby cel nie znikał pod paskiem nawigacji.
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href) return;
      if (href === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 150;
      const rect = (target as HTMLElement).getBoundingClientRect();
      const top = window.scrollY + rect.top - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [],
  );

  useEffect(() => {
    if (heroReady) {
      // Po odblokowaniu - dispatch resize, żeby Lenis i ScrollTriggery
      // przeliczyły pozycje (zwłaszcza że layout mógł się ustabilizować).
      window.dispatchEvent(new Event("resize"));
      return;
    }
    // scrollbar-gutter: stable na <html> (globals.css) sprawia, że miejsce na
    // scrollbara jest zawsze zarezerwowane - wystarczy ustawić overflow:hidden.
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    // Bezpiecznik: gdyby ready-callback nie wszedł (np. błąd ładowania),
    // odblokuj po 6s, żeby nigdy nie zostawić użytkownika z zamrożoną stroną.
    const safety = window.setTimeout(() => setHeroReady(true), 6000);
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.clearTimeout(safety);
    };
  }, [heroReady]);

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
    const onScroll = () => {
      const h = Math.max(window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      // start fade 15% scrolla, pełne zniknięcie przy 70%.
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
        bg.style.opacity = String(0.3 * fade);
        bg.style.transform = `scale(${1 - 0.08 * t})`;
        bg.style.filter = `blur(${t * 6}px)`;
      }
      const badges = heroBadgesRef.current;
      if (badges) {
        badges.style.opacity = String(fade);
        // Subtelny przesuw w prawo + zanikanie - jakby „odsuwały się" w cień
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

      {/* HEADER - fixed, żeby hero wchodziło pod niego */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-white/40 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* LOGO - po lewej */}
          <a
            href="#"
            onClick={handleNavClick}
            aria-label="Aquarius - strona główna">
            <Logo idSuffix="landing-header" />
          </a>

          {/* SEKCJE - po prawej */}
          <div className="hidden gap-7 text-sm text-slate-700 md:flex">
            <a href="/produkty/filtry" className="hover:text-blue-700">
              Filtry
            </a>
            <a href="/produkty/zmiekczacze" className="hover:text-blue-700">
              Zmiękczacze
            </a>
            <a href="/produkty" className="hover:text-blue-700">
              Wszystkie produkty
            </a>
            <a href="/kontakt" className="hover:text-blue-700">
              Kontakt
            </a>
          </div>
        </nav>
      </header>

      {/* HERO - sekcja h-svh, pinowana przez ScrollTrigger (pinSpacing:true) na 100vh.
          Podczas pinu kamera w HeroScene zjeżdża w kroplę, tekst znika.
          Po zakończeniu pinu następna sekcja pojawia się natychmiast. */}
      <section data-hero-pin className="relative h-svh overflow-hidden">
        {/* WIELKI PÓŁPRZEZROCZYSTY NAPIS - w tle, za kroplą. */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <span
            ref={heroBgTextRef}
            className="block w-full whitespace-nowrap text-center font-semibold uppercase tracking-tight text-blue-950/10 text-[22vw] leading-none will-change-[opacity,transform,filter]"
            style={{ opacity: 0.3 }}>
            Aquarius
          </span>
        </div>

        <div className="absolute inset-0 z-10">
          {/* Brak placeholdera-kropli - żeby nie było widać „kuli, która
              znika i ustępuje 3D-owej kropli". Zamiast tego: niedefiniowalny,
              atmosferyczny rozmyty glow (radial-gradient w miejscu, gdzie
              wyląduje kropla). Po zamontowaniu 3D-owej kropli glow zostaje
              jako naturalne tło/halo, więc nic „nie znika" wizualnie. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`h-[70vh] w-[70vh] max-h-[700px] max-w-[700px] rounded-full blur-3xl ${
                heroReady ? "" : "hero-glow-pulse"
              }`}
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(190,225,255,0.55) 0%, rgba(125,211,252,0.25) 30%, rgba(125,211,252,0.08) 55%, transparent 75%)",
                transform: "translateY(-4vh)",
              }}
            />
          </div>
          <HeroScene onReady={handleHeroReady} />
        </div>

        {/* BADGE'Y - wjeżdżają zsynchronizowane z kroplą (heroReady = env-mapa
            gotowa). Stagger między 1. a 2. badgem przez transition-delay. */}
        <div
          ref={heroBadgesRef}
          className="pointer-events-none absolute right-[14%] top-1/2 z-20 -translate-y-1/2 flex flex-col gap-6 will-change-[opacity,transform,filter] md:right-[18%]">
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: badgesVisible ? 1 : 0,
              transform: badgesVisible
                ? "translateX(0) scale(1)"
                : "translateX(40px) scale(0.92)",
              transitionDelay: badgesVisible ? "0s" : "0s",
            }}>
            <FeatureBadge label={["CZYSTA", "W 99.9%"]} iconType="drop" />
          </div>
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: badgesVisible ? 1 : 0,
              transform: badgesVisible
                ? "translateX(0) scale(1)"
                : "translateX(40px) scale(0.92)",
              transitionDelay: badgesVisible ? "0.18s" : "0s",
            }}>
            <FeatureBadge label={["FILTR RO", "5 STOPNI"]} iconType="filter" />
          </div>
        </div>

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
