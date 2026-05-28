import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { cities, cityBySlug, type City } from "@/lib/cities";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aquarius.craftedweb.pl";

export function generateStaticParams() {
  return cities.map((c) => ({ miasto: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ miasto: string }>;
}): Promise<Metadata> {
  const { miasto } = await params;
  const city = cityBySlug(miasto);
  if (!city) {
    return { title: "Nie znaleziono", robots: { index: false, follow: false } };
  }
  const title = city.softenerRecommended
    ? `Zmiękczacze wody ${city.name} — doradztwo i montaż | Aquarius`
    : `Uzdatnianie wody ${city.name} — filtry RO i doradztwo | Aquarius`;
  const description = `${city.blurb} Doradzimy i zamontujemy sprzęt sprawdzonych marek — dojeżdżamy do klienta.`;
  const url = `/zmiekczacze-wody/${city.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      `zmiękczacz wody ${city.name}`,
      `filtr wody ${city.name}`,
      `twarda woda ${city.name}`,
      `uzdatnianie wody ${city.name}`,
      `odwrócona osmoza ${city.name}`,
      `montaż filtra wody ${city.name}`,
      "zmiękczacz wody Podkarpacie",
      "Aquarius",
    ],
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

const faqFor = (city: City) => {
  const hardnessStr = `${city.hardnessMg} mg CaCO₃/l (ok. ${city.hardnessDh}°n)`;
  const baseFaq = [
    {
      q: `Jaka jest twardość wody w ${city.nameLocative}?`,
      a: `Według ${city.source.label} (${city.source.period}) twardość wody w ${city.nameLocative} to ${hardnessStr} — woda ${city.hardnessClass}. Te dane pochodzą z oficjalnego źródła wodociągów — można je sprawdzić w linku do raportu.`,
    },
  ];

  if (city.softenerRecommended) {
    baseFaq.push(
      {
        q: `Ile kosztuje montaż zmiękczacza wody w ${city.nameLocative}?`,
        a: `Koszt zmiękczacza wody dla domu jednorodzinnego to zwykle 3 500–6 500 zł ze sprzętem i montażem, zależnie od wybranego modelu. Konkretną cenę podamy po krótkiej rozmowie o Twojej instalacji.`,
      },
      {
        q: `Czy zmiękczona woda nadaje się do picia?`,
        a: `Zmiękczona woda jest bezpieczna do mycia, prania i AGD. Do picia polecamy filtr odwróconej osmozy z mineralizacją — często montujemy oba systemy w jednym domu.`,
      },
    );
  } else {
    baseFaq.push(
      {
        q: `Czy w ${city.nameLocative} potrzebny jest zmiękczacz wody?`,
        a: `Woda w sieci miejskiej w ${city.nameLocative} jest miękka — zmiękczacz na zasilaniu z wodociągów najczęściej nie ma sensu. Inaczej wygląda to w domach zasilanych z własnej studni, gdzie twardość może być znacznie wyższa. Najlepiej sprawdzić to testem twardości (tani test paskowy z apteki lub sklepu zoologicznego).`,
      },
      {
        q: `Co warto zamontować zamiast zmiękczacza w ${city.nameLocative}?`,
        a: `Najczęściej polecamy filtr odwróconej osmozy (RO) pod zlew kuchenny — usuwa chlor, metale ciężkie i pozostałości farmaceutyków. Koszt zestawu z montażem to zwykle 1 500–3 000 zł.`,
      },
    );
  }

  baseFaq.push(
    {
      q: `Jak często wymienia się filtry / wkłady?`,
      a: `Sól do zmiękczacza uzupełnia się co 1–3 miesiące, złoże wytrzymuje 8–10 lat. Filtry wstępne RO wymienia się co 6–12 miesięcy, membrana RO — co 2–3 lata. Wkłady kupisz u producenta lub w sklepach internetowych z hydrauliką.`,
    },
    {
      q: `Czy obsługujecie miejscowości wokół ${city.name}?`,
      a: `Tak — dojeżdżamy do klienta. Z ${city.nameLocative} obsługujemy m.in. ${city.nearby.join(", ")}. Nie mamy stacjonarnego salonu.`,
    },
  );

  return baseFaq;
};

export default async function CityPage({
  params,
}: {
  params: Promise<{ miasto: string }>;
}) {
  const { miasto } = await params;
  const city = cityBySlug(miasto);
  if (!city) notFound();

  const faq = faqFor(city);
  const hardnessDisplay = `${city.hardnessMg} mg/l`;
  const hardnessDh = `${city.hardnessDh}°n`;

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Uzdatnianie wody",
        item: `${SITE_URL}/produkty`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city.name,
        item: `${SITE_URL}/zmiekczacze-wody/${city.slug}`,
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: city.softenerRecommended
      ? `Zmiękczacze wody ${city.name}`
      : `Uzdatnianie wody ${city.name}`,
    image: `${SITE_URL}/zmiekczacze-wody/${city.slug}/opengraph-image`,
    serviceType: "Doradztwo i montaż systemów uzdatniania wody",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Aquarius",
      telephone: "+48 513 001 600",
      email: "januszlobodzinski.rzeszow70@gmail.com",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "województwo podkarpackie",
      },
    },
    areaServed: { "@type": "City", name: city.name },
    description: city.blurb,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip text-slate-800">
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24 pt-28 md:pt-36">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-950">
            Strona główna
          </Link>
          <span className="mx-2">/</span>
          <Link href="/produkty" className="hover:text-blue-950">
            Uzdatnianie wody
          </Link>
          <span className="mx-2">/</span>
          <span className="text-blue-950">{city.name}</span>
        </nav>

        <header className="mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600">
            {city.region} · obsługa mobilna z dojazdem
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-blue-950 md:text-5xl">
            {city.softenerRecommended
              ? `Zmiękczacze wody w ${city.nameLocative}`
              : `Uzdatnianie wody w ${city.nameLocative}`}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
            {city.blurb}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Źródło danych:{" "}
            <a
              href={city.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-sky-300 underline-offset-2 hover:text-blue-950">
              {city.source.label}
            </a>{" "}
            ({city.source.period}).
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-800">
              Porozmawiajmy o montażu
            </Link>
            <a
              href="tel:+48513001600"
              className="inline-flex items-center gap-2 rounded-full border border-blue-950/15 bg-white/60 px-6 py-3 text-sm font-semibold text-blue-950 backdrop-blur-sm transition hover:bg-white">
              +48 513 001 600
            </a>
          </div>
        </header>

        <section className="mb-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-sky-600">
              Twardość wody
            </div>
            <div className="mt-2 text-2xl font-semibold text-blue-950">
              {hardnessDisplay}
            </div>
            <p className="mt-1 text-sm text-slate-500">{hardnessDh}</p>
            <p className="mt-2 text-sm text-slate-600">
              Woda {city.hardnessClass} wg {city.source.label}.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-sky-600">
              Dojazd
            </div>
            <div className="mt-2 text-2xl font-semibold text-blue-950">
              Cała okolica
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Bez stacjonarnego salonu — przyjeżdżamy z gotowym sprzętem
              na umówiony termin.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-sky-600">
              Gwarancja
            </div>
            <div className="mt-2 text-2xl font-semibold text-blue-950">
              Producenta
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Sprzęt sprawdzonych marek z gwarancją producenta + gwarancja
              na nasz montaż.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-blue-950 md:text-3xl">
            Co robimy w {city.nameLocative}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {(city.softenerRecommended
              ? [
                  {
                    t: "Zmiękczacze wody",
                    d: `Dobór i montaż stacji zmiękczających dla domów w ${city.nameLocative}. Eliminujemy kamień u źródła — chronimy AGD, bojler i piec.`,
                  },
                  {
                    t: "Filtry odwróconej osmozy",
                    d: `Filtry RO pod zlew z mineralizacją. Czysta woda do picia i gotowania prosto z kranu.`,
                  },
                  {
                    t: "Ultrafiltracja",
                    d: `Większe odbiory — gastronomia, biura, gabinety w ${city.nameLocative}.`,
                  },
                  {
                    t: "Doradztwo i wycena",
                    d: `Pomagamy wybrać model do Twojej instalacji i podajemy konkretną cenę ze sprzętem i montażem.`,
                  },
                ]
              : [
                  {
                    t: "Filtry odwróconej osmozy",
                    d: `Najczęstsze rozwiązanie w ${city.nameLocative} — filtr RO pod zlew kuchenny z mineralizacją. Czysta woda do picia bez chloru i pozostałości farmaceutyków.`,
                  },
                  {
                    t: "Ultrafiltracja",
                    d: `Dla większych odbiorów lub całego mieszkania — usuwa bakterie, wirusy i mikroplastik bez odsalania wody.`,
                  },
                  {
                    t: "Doradztwo techniczne",
                    d: `Pomagamy dobrać urządzenie do Twojej sytuacji. Nie proponujemy zmiękczacza, jeśli nie jest potrzebny.`,
                  },
                  {
                    t: "Domy ze studni",
                    d: `W okolicach ${city.nameLocative} domy ze studni mają często wysokie żelazo, mangan lub twardość — wtedy łączymy odżelaziacz + zmiękczacz + RO.`,
                  },
                ]
            ).map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-sky-100 bg-white/70 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-blue-950">
                  {item.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-blue-950 md:text-3xl">
            Najczęstsze pytania — {city.name}
          </h2>
          <div className="mt-6 divide-y divide-sky-100 rounded-2xl border border-sky-100 bg-white/70 backdrop-blur-sm">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-blue-950">
                  <span>{item.q}</span>
                  <span className="text-xl leading-none text-sky-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-blue-950 md:text-3xl">
            Obsługujemy również okolice
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {city.nearby.map((n) => (
              <span
                key={n}
                className="rounded-full border border-sky-100 bg-white px-4 py-2 text-sm text-slate-700">
                {n}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-950 md:text-3xl">
            Uzdatnianie wody w innych miastach Podkarpacia
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {cities
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/zmiekczacze-wody/${c.slug}`}
                  className="rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm font-medium text-blue-950 transition hover:border-sky-300 hover:bg-sky-50">
                  {c.name}
                </Link>
              ))}
          </div>
        </section>

        <section className="rounded-3xl bg-blue-950 p-8 text-white md:p-12">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Montaż uzdatniania wody w {city.nameLocative}
          </h2>
          <p className="mt-3 max-w-xl text-sky-100">
            Doradzimy odpowiedni model do Twojej instalacji, zamówimy sprzęt
            i zamontujemy. Konkretna wycena po krótkiej rozmowie — bez
            zobowiązań.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-950 transition hover:bg-sky-50">
              Skontaktuj się
            </Link>
            <a
              href="tel:+48513001600"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Zadzwoń: +48 513 001 600
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
