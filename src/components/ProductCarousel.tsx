"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, useRef } from "react";
import { categories, formatPrice, type Product } from "@/lib/products";
import { productHeroViewTransitionName } from "@/lib/productViewTransition";

/**
 * Prosta, lekka karuzela: natywny CSS scroll-snap, bez GSAP, bez 3D,
 * bez filter:blur. `touch-action: pan-x` przepuszcza pionowy gest do
 * scrolla strony, `contain` izoluje paint, `content-visibility` pomija
 * kartę poza viewportem. Strzałki nawigują o jedną kartę na desktopie.
 */
export default function ProductCarousel({ items }: { items: Product[] }) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gapStr = getComputedStyle(el).gap || "0px";
    const gap = Number.parseFloat(gapStr.split(/\s+/)[0] || "0") || 24;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="product-carousel-track flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-6 pb-10 pt-4 [scrollbar-width:none] md:scroll-smooth md:gap-8 md:px-12 [&::-webkit-scrollbar]:hidden"
        style={{
          touchAction: "pan-x",
          contain: "content",
          WebkitOverflowScrolling: "touch",
        }}>
        {items.map((p) => {
          const href = `/produkty/${p.slug}`;
          const vtStyle: CSSProperties & { viewTransitionName?: string } = {
            viewTransitionName: productHeroViewTransitionName(p.slug),
          };
          return (
            <Link
              key={p.slug}
              href={href}
              prefetch
              data-card
              draggable={false}
              onClick={(e) => {
                e.preventDefault();
                expandCardAndNavigate(e.currentTarget, () => router.push(href));
              }}
              className="group relative flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_12px_30px_-15px_rgba(15,23,42,0.25)] transition-shadow sm:w-[46%] lg:w-[32%] xl:w-[24%]"
              style={vtStyle}>
              {p.badge && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-blue-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                  {p.badge}
                </span>
              )}
              <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-sky-50 to-white">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  draggable={false}
                  sizes="(min-width:1280px) 26vw, (min-width:1024px) 34vw, (min-width:640px) 46vw, 78vw"
                  loading="lazy"
                  className="object-contain p-6"
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

      <button
        type="button"
        aria-label="Poprzedni"
        onClick={() => scrollByCard(-1)}
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white/90 text-blue-950 shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-white sm:flex md:left-8">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M15 6l-6 6 6 6 1.4-1.4L11.8 12l4.6-4.6z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Następny"
        onClick={() => scrollByCard(1)}
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white/90 text-blue-950 shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-white sm:flex md:right-8">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4z" />
        </svg>
      </button>
    </div>
  );
}

// Klik karty rozciąga jej kontur na cały viewport (overlay), potem przekazuje
// nawigację. Efekt jednorazowy — nie wpływa na koszt scrolla.
function expandCardAndNavigate(card: HTMLElement, navigate: () => void) {
  if (typeof document === "undefined") {
    navigate();
    return;
  }
  const rect = card.getBoundingClientRect();
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
      "left .5s cubic-bezier(0.7,0,0.25,1), top .5s cubic-bezier(0.7,0,0.25,1), width .5s cubic-bezier(0.7,0,0.25,1), height .5s cubic-bezier(0.7,0,0.25,1), border-radius .5s cubic-bezier(0.7,0,0.25,1)",
    willChange: "left, top, width, height, border-radius",
  } as CSSStyleDeclaration);
  document.body.appendChild(overlay);

  const img = card.querySelector("img");
  if (img) {
    img.style.transition = "opacity .25s ease";
    img.style.opacity = "0";
  }

  void overlay.offsetWidth;
  Object.assign(overlay.style, {
    left: "0px",
    top: "0px",
    width: "100vw",
    height: "100vh",
    borderRadius: "0px",
  });

  window.setTimeout(() => {
    navigate();
    window.setTimeout(() => {
      overlay.style.transition = "opacity .3s ease";
      overlay.style.opacity = "0";
      window.setTimeout(() => overlay.remove(), 350);
    }, 100);
  }, 510);
}
