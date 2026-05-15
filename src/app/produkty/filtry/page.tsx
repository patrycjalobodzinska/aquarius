import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import {
  categories,
  formatPrice,
  products,
  type ProductCategory,
} from "@/lib/products";

const FILTER_CATEGORIES: ProductCategory[] = [
  "ro-skrzynkowe",
  "ro-klasyczne",
  "ro-redox",
  "ultrafiltracja",
];

export const metadata: Metadata = {
  title: "Filtry wody — odwrócona osmoza, ultrafiltracja, RO",
  description:
    "Filtry odwróconej osmozy (RO), ultrafiltracja, systemy Direct Flow i klasyczne zestawy pod zlew. Usuwają do 99,9% zanieczyszczeń i przywracają wodzie naturalną mineralizację.",
  keywords: [
    "filtr wody",
    "filtr RO",
    "odwrócona osmoza",
    "ultrafiltracja",
    "filtr pod zlew",
    "Direct Flow",
    "filtr kuchenny",
    "Aquarius",
    "FitAqua",
  ],
  alternates: { canonical: "/produkty/filtry" },
  openGraph: {
    url: "/produkty/filtry",
    title: "Filtry wody — odwrócona osmoza i ultrafiltracja",
    description:
      "Filtry RO, ultrafiltracja i Direct Flow do mieszkania, domu i gastronomii. Doradztwo, montaż, serwis.",
  },
};

export default function FiltryPage() {
  const items = products.filter((p) =>
    FILTER_CATEGORIES.includes(p.category),
  );
  const byCategory = new Map<ProductCategory, typeof products>();
  for (const cat of FILTER_CATEGORIES) byCategory.set(cat, []);
  for (const p of items) {
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
          <Link href="/produkty" className="transition hover:text-blue-700">
            Produkty
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Filtry</span>
        </nav>

        <div className="max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
            Filtry wody
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-6xl">
            Czysta woda prosto z&nbsp;kranu
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            Filtry odwróconej osmozy, ultrafiltracja i&nbsp;systemy
            przepływowe — usuwają chlor, metale ciężkie, mikroplastik
            i&nbsp;pestycydy, zachowując minerały. Dla mieszkań, domów
            i&nbsp;gastronomii.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-blue-950 px-4 py-2 font-semibold text-white">
              {items.length} modeli w&nbsp;ofercie
            </span>
            <span className="rounded-full border border-blue-200 px-4 py-2 font-medium text-blue-900">
              Do 99,9% mniej zanieczyszczeń
            </span>
            <span className="rounded-full border border-blue-200 px-4 py-2 font-medium text-blue-900">
              Mineralizacja i&nbsp;pH 7,2–7,8
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-4 rounded-3xl border border-sky-100 bg-white/70 p-6 backdrop-blur-sm md:grid-cols-3 md:p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Odwrócona osmoza
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Najgłębsza filtracja — usuwa nawet sole, metale i&nbsp;pestycydy.
              Wymaga zbiornika i&nbsp;ciśnienia, ale daje wodę porównywalną
              z&nbsp;butelkowaną.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Ultrafiltracja
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Zachowuje cenne minerały, usuwa bakterie i&nbsp;mikroplastik.
              Świetna dla wody wodociągowej dobrej jakości — bez zbiornika,
              pełny przepływ.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Direct Flow
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              RO bez zbiornika — woda płynie z&nbsp;kranu na żądanie.
              Mikroprocesor monitoruje wkłady i&nbsp;jakość wody w&nbsp;czasie
              rzeczywistym.
            </p>
          </div>
        </div>

        {FILTER_CATEGORIES.map((catSlug) => {
          const list = byCategory.get(catSlug) ?? [];
          if (list.length === 0) return null;
          const cat = categories.find((c) => c.slug === catSlug);
          return (
            <section key={catSlug} className="mt-24 first:mt-20">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
                {cat?.label}
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
                {list.length} {list.length === 1 ? "model" : "modeli"}
              </h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((p) => (
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

        <section className="mt-28 rounded-3xl border border-sky-100 bg-white/70 p-8 backdrop-blur-sm md:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
                Nie wiesz, który model wybrać?
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
                Pomożemy dobrać filtr
                <br />
                do Twojej wody.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
                Wystarczy, że powiesz nam jaką masz wodę (wodociągowa, studnia)
                i ile osób w domu. Zaproponujemy konkretny model
                i&nbsp;przygotujemy wycenę montażu.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
                Skontaktuj się
              </Link>
              <Link
                href="/produkty/zmiekczacze"
                className="inline-flex items-center gap-2 rounded-full border border-blue-950/15 bg-white px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-sky-50">
                Zobacz zmiękczacze
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
