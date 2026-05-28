"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { categories, formatPrice, type Product } from "@/lib/products";
import { productHeroViewTransitionName } from "@/lib/productViewTransition";

const CARD_W_DESKTOP = "clamp(260px, 28vw, 420px)";
const CARD_GAP_DESKTOP = "24px";

/**
 * Karuzela index-based: track translateX-uje się o całe karty.
 * Lista x3 (tripled) — środkowy segment to "prawdziwe" karty, lewy/prawy
 * to bufor do nieskończonej pętli. Po przejściu na skraj robimy silent
 * jump z powrotem do środkowego segmentu (animate=false na 1 klatkę).
 *
 * touch-pan-y na trackingu: pionowy gest leci do scrolla strony,
 * poziomy łapią touch handlery (handleTouchStart/Move/End) → go(±1).
 */
export default function ProductCarousel({ items }: { items: Product[] }) {
  const router = useRouter();
  const len = items.length;

  const tripled = len > 0 ? [...items, ...items, ...items] : [];
  const [index, setIndex] = useState(len);
  const [animate, setAnimate] = useState(true);

  const go = useCallback((d: 1 | -1) => {
    setAnimate(true);
    setIndex((i) => i + d);
  }, []);

  const handleTransitionEnd = () => {
    if (len === 0) return;
    if (index >= 2 * len) {
      setAnimate(false);
      setIndex(index - len);
    } else if (index < len) {
      setAnimate(false);
      setIndex(index + len);
    }
  };

  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    const dx = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (Math.abs(dx) < 40) return;
    go(dx < 0 ? 1 : -1);
  };

  if (len === 0) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="relative z-10 w-full [--card-w:82vw] [--card-gap:14px] md:[--card-gap:var(--card-gap-md)] md:[--card-w:var(--card-w-md)]"
        style={
          {
            ["--card-w-md" as string]: CARD_W_DESKTOP,
            ["--card-gap-md" as string]: CARD_GAP_DESKTOP,
          } as CSSProperties
        }>
        <div
          className="relative h-[62vh] min-h-[520px] w-full touch-pan-y md:h-[66vh] md:min-h-[600px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          <div
            onTransitionEnd={handleTransitionEnd}
            className="absolute left-0 top-1/2 flex h-[94%] -translate-y-1/2 items-center will-change-transform"
            style={{
              gap: "var(--card-gap)",
              transform: `translateX(calc(50vw - var(--card-w) / 2 - ${index} * (var(--card-w) + var(--card-gap))))`,
              transition: animate
                ? "transform 720ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}>
            {tripled.map((item, i) => {
              const isActive = i === index;
              const isMiddleSegment = i >= len && i < 2 * len;
              const categoryLabel = categories.find(
                (c) => c.slug === item.category,
              )?.label;
              const handleClick = () => {
                if (!isActive) {
                  setAnimate(true);
                  setIndex(i);
                  return;
                }
                router.push(`/produkty/${item.slug}`);
              };
              const vtStyle: CSSProperties & {
                viewTransitionName?: string;
              } = isMiddleSegment
                ? {
                    viewTransitionName: productHeroViewTransitionName(
                      item.slug,
                    ),
                  }
                : {};

              return (
                <article
                  key={`${item.slug}-${i}`}
                  onClick={handleClick}
                  className="relative h-full shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-sky-100 bg-white transition-all duration-700 ease-out"
                  style={{
                    width: "var(--card-w)",
                    transform: isActive ? "scale(1)" : "scale(0.88)",
                    transformOrigin: "center",
                    zIndex: isActive ? 2 : 1,
                    opacity: isActive ? 1 : 0.72,
                    boxShadow: isActive
                      ? "0 30px 70px -28px rgba(15,42,80,0.32)"
                      : "0 14px 40px -22px rgba(15,42,80,0.15)",
                  }}>
                  <div className="flex h-full flex-col">
                    <div
                      className="relative w-full flex-1 overflow-hidden bg-gradient-to-br from-sky-50 to-white"
                      style={vtStyle}>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 82vw, 28vw"
                        className="object-contain p-6"
                        loading={isActive ? "eager" : "lazy"}
                        priority={isActive && isMiddleSegment}
                      />
                      {item.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-blue-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 p-5">
                      {categoryLabel && (
                        <div className="text-[11px] font-medium uppercase tracking-wider text-sky-600">
                          {categoryLabel}
                        </div>
                      )}
                      <h3 className="text-base font-semibold leading-snug text-blue-950">
                        {item.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-slate-500">
                        {item.short}
                      </p>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-slate-400">
                            Cena
                          </div>
                          <div className="text-lg font-semibold text-blue-950">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-950 px-3 py-2 text-xs font-medium text-white">
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
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto mt-6 flex w-full max-w-[1100px] flex-col items-center gap-5 px-6 md:mt-10">
          {/* Mobile dots */}
          <div className="flex items-center gap-1.5 md:hidden" aria-hidden>
            {Array.from({ length: len }).map((_, i) => {
              const active = ((index % len) + len) % len === i;
              return (
                <span
                  key={i}
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: active ? "20px" : "6px",
                    height: "6px",
                    background: active
                      ? "#1e3a8a"
                      : "rgba(30,58,138,0.22)",
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Poprzedni"
              className="grid h-12 w-12 place-items-center rounded-full border border-blue-950/20 text-blue-950/70 transition hover:border-blue-950/60 hover:text-blue-950">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5M5 12l6-6M5 12l6 6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Następny"
              className="grid h-12 w-12 place-items-center rounded-full bg-blue-950 text-white transition hover:bg-blue-800">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M19 12l-6-6M19 12l-6 6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
