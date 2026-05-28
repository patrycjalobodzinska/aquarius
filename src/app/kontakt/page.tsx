import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Kontakt — doradztwo i montaż filtrów wody",
  description:
    "Skontaktuj się z Aquarius. Doradzimy filtr, zmiękczacz lub system RO, dobierzemy model i zorganizujemy montaż. Rzeszów i Podkarpacie.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    url: "/kontakt",
    title: "Kontakt Aquarius — filtry wody i zmiękczacze",
    description:
      "Doradztwo, dobór modelu i montaż filtrów wody oraz zmiękczaczy. Rzeszów i Podkarpacie.",
  },
};

const channels: {
  label: string;
  value: string;
  href: string;
  note?: string;
}[] = [
  {
    label: "Telefon",
    value: "+48 513 001 600",
    href: "tel:+48513001600",
    note: "Pon–Pt 8:00–18:00, Sob 9:00–14:00",
  },
  {
    label: "E-mail",
    value: "januszlobodzinski.rzeszow70@gmail.com",
    href: "mailto:januszlobodzinski.rzeszow70@gmail.com",
    note: "Odpowiadamy do końca dnia roboczego",
  },
];

export default function KontaktPage() {
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

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28 md:pt-32">
        <nav className="mb-10 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-700">
            Strona główna
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Kontakt</span>
        </nav>

        <div className="max-w-3xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
            Kontakt
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-6xl">
            Porozmawiajmy{" "}
            <span className="italic font-medium text-blue-700">
              o&nbsp;Twojej wodzie
            </span>
            .
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            Pomożemy dobrać filtr lub zmiękczacz do Twojej instalacji
            i&nbsp;zorganizujemy montaż. Doradztwo i&nbsp;wycena bez
            zobowiązań.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="block rounded-2xl border border-sky-100 bg-white/70 p-6 backdrop-blur-sm transition hover:border-blue-200 hover:bg-white">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                {c.label}
              </div>
              <div className="mt-3 text-2xl font-semibold text-blue-950">
                {c.value}
              </div>
              {c.note && (
                <div className="mt-2 text-sm leading-relaxed text-slate-500">
                  {c.note}
                </div>
              )}
            </a>
          ))}
        </div>
      </main>

      <ContactSection />

      <SiteFooter />
    </div>
  );
}
