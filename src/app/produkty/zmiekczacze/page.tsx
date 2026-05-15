import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { formatPrice, products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Zmiękczacze wody — stacje zmiękczające do domu i gastronomii",
  description:
    "Zmiękczacze wody Aquarius — stacje 8 l, 20 l, 25 l i 35 l ze sterownikiem objętościowym, modele inteligentne z Wi-Fi i kompaktowe zmiękczacze gastronomiczne. Koniec z kamieniem.",
  keywords: [
    "zmiękczacz wody",
    "stacja zmiękczająca",
    "zmiękczacz do domu",
    "zmiękczacz mieszkanie",
    "zmiękczacz gastronomia",
    "twarda woda",
    "kamień",
    "iVISION",
    "Aquarius",
    "FitAqua",
  ],
  alternates: { canonical: "/produkty/zmiekczacze" },
  openGraph: {
    url: "/produkty/zmiekczacze",
    title: "Zmiękczacze wody Aquarius — stacje do domu i gastronomii",
    description:
      "Zmiękczacze 8–35 l, modele smart z Wi-Fi, kompaktowe wersje dla ekspresów i pieców. Wymiana jonowa, miękka woda w całej instalacji.",
  },
};

export default function ZmiekczaczePage() {
  const items = products.filter((p) => p.category === "zmiekczacze");

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
          <span className="text-slate-700">Zmiękczacze</span>
        </nav>

        <div className="max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
            Zmiękczacze wody
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-6xl">
            Koniec z&nbsp;kamieniem
            <br />w&nbsp;całym domu.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            Stacje zmiękczające wymieniają jony wapnia i&nbsp;magnezu na sód —
            wodą o&nbsp;twardości bliskiej zera, bez osadu w&nbsp;czajniku,
            pralce, bojlerze i&nbsp;na baterii. Modele od mieszkania po
            dom&nbsp;z&nbsp;basenem.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-blue-950 px-4 py-2 font-semibold text-white">
              {items.length} modeli w&nbsp;ofercie
            </span>
            <span className="rounded-full border border-blue-200 px-4 py-2 font-medium text-blue-900">
              Twardość nawet do 0°dH
            </span>
            <span className="rounded-full border border-blue-200 px-4 py-2 font-medium text-blue-900">
              30–50% mniej detergentów
            </span>
            <span className="rounded-full border border-blue-200 px-4 py-2 font-medium text-blue-900">
              Atest PZH
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-6 rounded-3xl border border-sky-100 bg-white/70 p-6 backdrop-blur-sm md:grid-cols-3 md:p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Mieszkanie / 1–2 osoby
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Stacje 8 l — kompaktowa obudowa pod blat, niski pobór energii,
              cicha praca. Solanka starcza na 2–3 miesiące.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Dom / 3–5 osób
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Stacje 16–25 l ze sterownikiem objętościowym. Regeneracja tylko
              wtedy, gdy złoże zostanie wykorzystane — mniej soli, mniej wody.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Duży dom / gastronomia
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Stacje 35 l i&nbsp;modele dedykowane dla ekspresów oraz pieców
              konwekcyjnych. Chronią drogie urządzenia przed kamieniem.
            </p>
          </div>
        </div>

        <section className="mt-24">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
            Wszystkie modele
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
            {items.length} stacji do wyboru
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

        <section className="mt-28 rounded-3xl border border-sky-100 bg-white/70 p-8 backdrop-blur-sm md:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
                Zmierzymy twardość Twojej wody
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
                Dobierzemy zmiękczacz pod Twój dom.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
                Powiedz nam, ile osób mieszka, jaką masz wodę (wodociągowa /
                studnia) i&nbsp;ile metrów kwadratowych ma instalacja —
                zaproponujemy konkretny model z&nbsp;wyceną montażu.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
                Skontaktuj się
              </Link>
              <Link
                href="/produkty/filtry"
                className="inline-flex items-center gap-2 rounded-full border border-blue-950/15 bg-white px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-sky-50">
                Zobacz filtry
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
