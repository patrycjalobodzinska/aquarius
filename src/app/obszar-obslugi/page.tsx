import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { cities } from "@/lib/cities";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aquarius.craftedweb.pl";

export const metadata: Metadata = {
  title: "Obszar obsługi — Rzeszów i całe Podkarpacie | Aquarius",
  description:
    "Aquarius — montaż systemów uzdatniania wody na Podkarpaciu. Doradzamy i montujemy z dojazdem w Rzeszowie, Krośnie, Przemyślu, Mielcu, Stalowej Woli, Dębicy, Jarosławiu, Sanoku i okolicach.",
  alternates: { canonical: "/obszar-obslugi" },
  keywords: [
    "zmiękczacz wody Podkarpacie",
    "filtr wody Podkarpacie",
    "uzdatnianie wody Rzeszów",
    "montaż filtra wody Podkarpacie",
    "obszar obsługi Aquarius",
  ],
  openGraph: {
    type: "website",
    url: "/obszar-obslugi",
    title: "Obszar obsługi — Podkarpacie | Aquarius",
    description:
      "Doradztwo i montaż systemów uzdatniania wody na Podkarpaciu. Dojazd, wycena, montaż.",
  },
};

export default function ObszarObslugiPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Obszar obsługi Aquarius — miasta Podkarpacia",
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/zmiekczacze-wody/${c.slug}`,
      name: c.name,
    })),
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Obszar obsługi",
        item: `${SITE_URL}/obszar-obslugi`,
      },
    ],
  };

  return (
    <div className="relative overflow-x-clip text-slate-800">
      <SmoothScroll />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #dbeafe 0%, #eff6fb 42%, #f5fbff 55%, #dde8f1 100%)",
        }}
      />
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-36">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-950">
            Strona główna
          </Link>
          <span className="mx-2">/</span>
          <span className="text-blue-950">Obszar obsługi</span>
        </nav>

        <header className="mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600">
            Podkarpacie · dojazd do klienta
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-blue-950 md:text-5xl">
            Obszar obsługi Aquarius
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
            Nie mamy stacjonarnego salonu — przyjeżdżamy do klienta. Z Rzeszowa
            doradzamy i montujemy systemy uzdatniania wody na całym Podkarpaciu.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-800">
              Skontaktuj się
            </Link>
            <a
              href="tel:+48513001600"
              className="inline-flex items-center gap-2 rounded-full border border-blue-950/15 bg-white/60 px-6 py-3 text-sm font-semibold text-blue-950 backdrop-blur-sm transition hover:bg-white">
              +48 513 001 600
            </a>
          </div>
        </header>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-blue-950 md:text-3xl">
            Główne miasta z dedykowanymi stronami
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Dla każdego miasta zebraliśmy dane o lokalnej twardości wody
            z oficjalnych źródeł (wodociągi miejskie), żeby od razu wiedzieć
            jakie rozwiązanie ma sens — a kiedy zmiękczacz nie jest potrzebny.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/zmiekczacze-wody/${c.slug}`}
                className="group rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-blue-950 group-hover:text-blue-800">
                    {c.name}
                  </h3>
                  <span className="text-xs uppercase tracking-wider text-sky-600">
                    {c.hardnessClass}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {c.hardnessMg} mg CaCO₃/l · {c.hardnessDh}°n
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                  {c.blurb}
                </p>
                <div className="mt-4 text-xs text-slate-400">
                  + okolice: {c.nearby.slice(0, 3).join(", ")}…
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-blue-950 md:text-3xl">
            Pozostałe miejscowości w obszarze obsługi
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Z Rzeszowa standardowo dojeżdżamy do całego Podkarpacia w ramach
            jednego dnia roboczego. Poniżej lista miejscowości, gdzie mieliśmy
            ostatnio realizacje.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from(
              new Set(cities.flatMap((c) => c.nearby)),
            )
              .sort()
              .map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-sky-100 bg-white px-4 py-2 text-sm text-slate-700">
                  {m}
                </span>
              ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-2xl font-semibold text-blue-950">1.</div>
            <h3 className="mt-2 text-lg font-semibold text-blue-950">
              Krótka rozmowa
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Telefon lub formularz — pytamy o instalację, twardość wody
              i potrzeby, podajemy zakres cenowy.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-2xl font-semibold text-blue-950">2.</div>
            <h3 className="mt-2 text-lg font-semibold text-blue-950">
              Doradzamy model
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Wskazujemy konkretny model ze sprawdzonej marki, podajemy cenę
              ze sprzętem i montażem. Nie proponujemy zmiękczacza, jeśli nie
              jest potrzebny.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-2xl font-semibold text-blue-950">3.</div>
            <h3 className="mt-2 text-lg font-semibold text-blue-950">
              Dostawa i montaż
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Po Twojej decyzji przyjeżdżamy na umówiony termin ze sprzętem
              i montujemy. Gwarancja producenta na urządzenie + gwarancja
              na nasz montaż.
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-blue-950 p-8 text-white md:p-12">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Twoje miasto nie ma jeszcze strony?
          </h2>
          <p className="mt-3 max-w-xl text-sky-100">
            Nic nie szkodzi — zadzwoń. Z Rzeszowa dojeżdżamy do każdej
            miejscowości na Podkarpaciu.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-sky-50">
              Napisz do nas
            </Link>
            <a
              href="tel:+48513001600"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              +48 513 001 600
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
