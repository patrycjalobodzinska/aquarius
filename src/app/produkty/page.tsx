import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { categories, formatPrice, products, type ProductCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Produkty — filtry RO, ultrafiltracja i zmiękczacze wody",
  description:
    "Pełna oferta Aquarius: filtry odwróconej osmozy, ultrafiltracja, zmiękczacze wody do mieszkania, domu i gastronomii. Sprawdzone modele z dostawą, montażem i serwisem w całej Polsce.",
  keywords: [
    "filtry wody",
    "filtr RO",
    "odwrócona osmoza",
    "ultrafiltracja",
    "zmiękczacz wody",
    "stacja zmiękczająca",
    "filtr pod zlew",
    "FitAqua",
    "Aquarius",
  ],
  alternates: { canonical: "/produkty" },
  openGraph: {
    url: "/produkty",
    title: "Filtry wody i zmiękczacze Aquarius — pełna oferta",
    description:
      "Filtry odwróconej osmozy, ultrafiltracja i zmiękczacze wody. Modele dla mieszkań, domów i gastronomii z dostawą i serwisem.",
  },
  twitter: {
    title: "Filtry wody i zmiękczacze Aquarius — pełna oferta",
    description:
      "Filtry odwróconej osmozy, ultrafiltracja i zmiękczacze wody. Modele dla mieszkań, domów i gastronomii.",
  },
};

export default function ProductsListingPage() {
  // Grupujemy produkty po kategorii, w kolejności z categories[].
  const byCategory = new Map<ProductCategory, typeof products>();
  for (const cat of categories) byCategory.set(cat.slug, []);
  for (const p of products) {
    const bucket = byCategory.get(p.category);
    if (bucket) bucket.push(p);
  }

  return (
    <div className="relative min-h-screen text-slate-800">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 30% at 50% 70%, rgba(125, 211, 252, 0.35), transparent 75%)",
            "linear-gradient(to bottom, #dbeafe 0%, #eff6fb 42%, #f5fbff 55%, #dde8f1 100%)",
          ].join(","),
        }}
      />

      <SmoothScroll />
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 pb-32 pt-28 md:pt-32">
        <nav className="mb-10 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-700">
            Strona główna
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Produkty</span>
        </nav>

        <div className="max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
            Sklep
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-6xl">
            Filtry i&nbsp;zmiękczacze Aquarius
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            Sprawdzone modele dla mieszkań, domów i&nbsp;gastronomii. Każdy
            z&nbsp;dostawą i&nbsp;pełną obsługą serwisową.
          </p>
        </div>

        {/* Sekcje per kategoria */}
        {categories.map((cat) => {
          const items = byCategory.get(cat.slug) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={cat.slug} className="mt-24 first:mt-20">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
                {cat.label}
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
                {items.length} {items.length === 1 ? "model" : "modeli"}
              </h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/produkty/${p.slug}`}
                    className="group block">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-sky-100">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(min-width:1280px) 22vw, (min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                        className="object-contain p-6 transition duration-500 group-hover:scale-105"
                      />
                      {p.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-blue-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="text-base font-semibold text-blue-950">
                        {p.name}
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {p.short}
                      </div>
                      <div className="mt-3 text-base font-semibold text-blue-950">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <SiteFooter />
    </div>
  );
}
