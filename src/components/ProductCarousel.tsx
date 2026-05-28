"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { categories, formatPrice, type Product } from "@/lib/products";
import { productHeroViewTransitionName } from "@/lib/productViewTransition";

type LoopEntry = { product: Product; segment: 0 | 1 | 2; reactKey: string };

/**
 * Coverflow + nieskończona pętla (3× ta sama lista): widać karty po lewej i prawej od aktywnej.
 * View Transition tylko na środkowym segmencie - unikalna nazwa w dokumencie.
 */
export default function ProductCarousel({ items }: { items: Product[] }) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const segmentWidthRef = useRef(0);
  const loopJumpRef = useRef(false);

  const n = items.length;

  // Na mobile rezygnujemy z nieskończonej pętli (3× lista + loop-jump przy
  // krawędzi) - na touch-snap-mandatory powodowało to dziwne "cofanie" scrolla.
  // Mobile: jedna lista, linearny scroll. Desktop: pętla.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const looped = useMemo((): LoopEntry[] => {
    if (n === 0) return [];
    if (n === 1 || isMobile) {
      return items.map((product, i) => ({
        product,
        segment: 1,
        reactKey: `1-${product.slug}-${i}`,
      }));
    }
    const block = (seg: 0 | 1 | 2): LoopEntry[] =>
      items.map((product, i) => ({
        product,
        segment: seg,
        reactKey: `${seg}-${product.slug}-${i}`,
      }));
    return [...block(0), ...block(1), ...block(2)];
  }, [items, n, isMobile]);

  /** Indeks pierwszej karty środkowego segmentu (tam ustawiamy start scrolla). */
  const midStartIndex = n >= 2 && !isMobile ? n : 0;

  const setters = useRef<
    Array<{
      scale: gsap.QuickToFunc;
      rotY: gsap.QuickToFunc;
      z: gsap.QuickToFunc;
      opacity: gsap.QuickToFunc;
      blur: gsap.QuickToFunc;
    }>
  >([]);

  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    setters.current = cardRefs.current.map((el) => {
      if (!el) {
        return {
          scale: (() => {}) as unknown as gsap.QuickToFunc,
          rotY: (() => {}) as unknown as gsap.QuickToFunc,
          z: (() => {}) as unknown as gsap.QuickToFunc,
          opacity: (() => {}) as unknown as gsap.QuickToFunc,
          blur: (() => {}) as unknown as gsap.QuickToFunc,
        };
      }
      gsap.set(el, {
        transformPerspective: 1400,
        transformOrigin: "center center",
        force3D: true,
      });
      return {
        scale: gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" }),
        rotY: gsap.quickTo(el, "rotationY", {
          duration: 0.55,
          ease: "power3.out",
        }),
        z: gsap.quickTo(el, "z", { duration: 0.55, ease: "power3.out" }),
        opacity: gsap.quickTo(el, "opacity", {
          duration: 0.45,
          ease: "power2.out",
        }),
        blur: gsap.quickTo(el, "--card-blur", {
          duration: 0.45,
          ease: "power2.out",
        }),
      };
    });
    requestAnimationFrame(() => updateTransforms());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [looped.length]);

  const updateTransforms = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = (cardCenter - center) / (trackRect.width / 2);
      const clamped = Math.max(-1.4, Math.min(1.4, dist));
      const abs = Math.min(1, Math.abs(clamped));

      const s = setters.current[i];
      if (!s) return;
      if (isMobile) {
        // Mobile: tylko scale + opacity, BEZ rotY i z-translate. Te 3D-transformy
        // pod palcem mieszały się z momentum-scrollem iOS dając "szarpanie".
        s.scale(1 - 0.12 * abs);
        s.rotY(0);
        s.z(0);
        s.opacity(1 - 0.35 * abs);
        s.blur(abs * 2);
      } else {
        s.scale(1.12 - 0.42 * abs);
        s.rotY(clamped * -32);
        s.z(-220 * abs);
        s.opacity(1 - 0.55 * abs);
        s.blur(abs * 4);
      }
      el.style.zIndex = String(Math.round(100 - abs * 60));
    });

    if (n <= 1) {
      setCanPrev(false);
      setCanNext(false);
    } else {
      setCanPrev(true);
      setCanNext(true);
    }
  }, [n, isMobile]);

  const measureSegment = useCallback(() => {
    const track = trackRef.current;
    if (!track || n < 2) return;
    const a = cardRefs.current[0];
    const b = cardRefs.current[midStartIndex];
    if (!a || !b) return;
    segmentWidthRef.current = b.offsetLeft - a.offsetLeft;
  }, [n, midStartIndex]);

  const scrollToMiddleStart = useCallback(() => {
    const track = trackRef.current;
    const card = cardRefs.current[midStartIndex];
    if (!track || !card || n < 2) return;
    // Mobile: centruj pierwszą kartę, nie rób żadnej pętli (midStartIndex=0).
    // Desktop: pętla 3× lista, start w środkowym segmencie.
    track.scrollLeft =
      card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    if (!isMobile) {
      segmentWidthRef.current =
        cardRefs.current[midStartIndex]!.offsetLeft -
        cardRefs.current[0]!.offsetLeft;
    }
  }, [n, midStartIndex, isMobile]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || looped.length === 0) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const seg = segmentWidthRef.current;
        if (!loopJumpRef.current && n >= 2 && seg > 0) {
          const sl = track.scrollLeft;
          const soft = Math.min(track.clientWidth * 0.28, seg * 0.22);
          if (sl < soft) {
            loopJumpRef.current = true;
            track.scrollLeft = sl + seg;
            loopJumpRef.current = false;
          } else if (sl > seg * 2 - soft) {
            loopJumpRef.current = true;
            track.scrollLeft = sl - seg;
            loopJumpRef.current = false;
          }
        }
        updateTransforms();
      });
    };

    const onResize = () => {
      measureSegment();
      if (n >= 2) scrollToMiddleStart();
      onScroll();
    };

    requestAnimationFrame(() => {
      measureSegment();
      if (n >= 2) scrollToMiddleStart();
      else track.scrollLeft = 0;
      onScroll();
    });

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [looped.length, measureSegment, n, scrollToMiddleStart, updateTransforms]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gapStr = getComputedStyle(el).gap || "0px";
    const gap = Number.parseFloat(gapStr.split(/\s+/)[0] || "0") || 32;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (looped.length === 0) return null;

  return (
    <div className="relative">
      <div className="relative" style={{ perspective: "1200px" }}>
        <div
          ref={trackRef}
          data-lenis-prevent-wheel
          style={{ touchAction: "pan-x" }}
          className="product-carousel-track flex snap-x snap-proximity gap-1 overflow-x-auto overscroll-x-contain px-[16vw] pb-12 pt-4 [scrollbar-width:none] md:snap-mandatory md:gap-10 md:scroll-smooth md:px-0 lg:pb-16 lg:pt-12 [&::-webkit-scrollbar]:hidden">
          {looped.map((entry, i) => {
            const p = entry.product;
            const href = `/produkty/${p.slug}`;
            const vtActive = entry.segment === 1;
            const vtStyle = vtActive
              ? ({
                  viewTransitionName: productHeroViewTransitionName(p.slug),
                } as CSSProperties & { viewTransitionName?: string })
              : undefined;

            return (
              <Link
                key={entry.reactKey}
                href={href}
                prefetch
                data-card
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                draggable={false}
                onClick={(e) => {
                  e.preventDefault();
                  expandCardAndNavigate(e.currentTarget, href, () =>
                    router.push(href),
                  );
                }}
                className="group relative flex w-[68vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)] transition-shadow sm:w-[42%] lg:w-[30%] xl:w-[24%]"
                style={{
                  filter: "blur(var(--card-blur, 0px))",
                  willChange: "transform, opacity, filter",
                }}>
                {p.badge && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-blue-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                    {p.badge}
                  </span>
                )}
                <div
                  className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-sky-50 to-white"
                  style={vtStyle}>
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    draggable={false}
                    sizes="(min-width:1280px) 26vw, (min-width:1024px) 34vw, (min-width:640px) 46vw, 78vw"
                    priority={vtActive && i === midStartIndex}
                    className="object-contain p-6"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6)_0%,transparent_28%,transparent_72%,rgba(125,211,252,0.25)_100%)]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-sky-600">
                    {categories.find((c) => c.slug === p.category)?.label}
                  </div>
                  <h3 className="mt-1 text-base font-semibold leading-snug text-blue-950">
                    {p.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {p.short}
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400">
                        Cena
                      </div>
                      <div className="text-lg font-semibold text-blue-950">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-950 px-3 py-2 text-xs font-medium text-white transition group-hover:bg-blue-800">
                      Zobacz
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="currentColor">
                        <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        aria-label="Poprzedni"
        onClick={() => scrollByCard(-1)}
        disabled={!canPrev}
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white/90 text-blue-950 shadow-xl backdrop-blur-md transition hover:bg-white hover:scale-110 disabled:pointer-events-none disabled:opacity-30 sm:flex md:left-8">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M15 6l-6 6 6 6 1.4-1.4L11.8 12l4.6-4.6z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Następny"
        onClick={() => scrollByCard(1)}
        disabled={!canNext}
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white/90 text-blue-950 shadow-xl backdrop-blur-md transition hover:bg-white hover:scale-110 disabled:pointer-events-none disabled:opacity-30 sm:flex md:right-8">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4z" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================================
// Card-to-fullscreen transition: na klik karty klonujemy jej geometrię na
// fixed overlayu, animujemy do pełnego viewportu (rozciągnięcie), w trakcie
// fadeujemy zdjęcie produktu, a po dojechaniu odpalamy nawigację. Po
// wyrenderowaniu nowej strony overlay znika fadem.
// ============================================================================
function expandCardAndNavigate(
  card: HTMLElement,
  href: string,
  navigate: () => void,
) {
  if (typeof document === "undefined") {
    navigate();
    return;
  }
  const rect = card.getBoundingClientRect();

  // Overlay: kopiuje geometrię karty, kolor tła, zaokrąglenie.
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    background: "#ffffff",
    borderRadius: "24px",
    zIndex: "9998",
    pointerEvents: "none",
    boxShadow: "0 30px 70px -30px rgba(15,23,42,0.35)",
    transition:
      "left .55s cubic-bezier(0.7,0,0.25,1), top .55s cubic-bezier(0.7,0,0.25,1), width .55s cubic-bezier(0.7,0,0.25,1), height .55s cubic-bezier(0.7,0,0.25,1), border-radius .55s cubic-bezier(0.7,0,0.25,1)",
    willChange: "left, top, width, height, border-radius",
  } as CSSStyleDeclaration);
  document.body.appendChild(overlay);

  // Fade-out zdjęcia produktu wewnątrz oryginalnej karty (krótszy, żeby
  // znikało zanim overlay zakryje cały kadr).
  const img = card.querySelector("img");
  if (img) {
    img.style.transition = "opacity .3s ease";
    img.style.opacity = "0";
  }

  // Force reflow — następna klatka odpala transition do fullscreena.
  void overlay.offsetWidth;
  Object.assign(overlay.style, {
    left: "0px",
    top: "0px",
    width: "100vw",
    height: "100vh",
    borderRadius: "0px",
  });

  // Po ~550 ms (czas transition) → router.push. Overlay zostaje, zakrywa nowy
  // render, potem znika fadem.
  window.setTimeout(() => {
    navigate();
    // Daj nowej stronie chwilę na pierwszy paint zanim odsłonimy.
    window.setTimeout(() => {
      overlay.style.transition = "opacity .35s ease";
      overlay.style.opacity = "0";
      window.setTimeout(() => overlay.remove(), 400);
    }, 120);
  }, 560);
}
