import Link from "next/link";
import ProductCarousel from "./ProductCarousel";
import { products } from "@/lib/products";

type Kind = "filtry" | "zmiekczacze";

const META: Record<
  Kind,
  {
    sectionId: string;
    eyebrow: string;
    title: string;
    subtitleSuffix: string;
  }
> = {
  filtry: {
    sectionId: "produkty-filtry",
    eyebrow: "Filtry wody",
    title: "Systemy filtracji RO i przepływowe",
    subtitleSuffix:
      "modeli - od klasycznych zestawów RO po inteligentne stacje Direct Flow.",
  },
  zmiekczacze: {
    sectionId: "produkty-zmiekczacze",
    eyebrow: "Zmiękczacze wody",
    title: "Stacje zmiękczające - od mieszkania po dom z basenem",
    subtitleSuffix:
      "modeli - kompaktowe wersje 8 l aż po duże stacje 35 l ze sterownikiem Smart.",
  },
};

export default function ProductsSection({ kind }: { kind: Kind }) {
  const items =
    kind === "zmiekczacze"
      ? products.filter((p) => p.category === "zmiekczacze")
      : products.filter((p) => p.category !== "zmiekczacze");
  const meta = META[kind];

  return (
    <section id={meta.sectionId} className="relative lg:py-24">
      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            {meta.eyebrow}
          </div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 md:text-3xl">
            {meta.title}
          </h3>
          <p className="mt-2 text-slate-600">
            {items.length} {meta.subtitleSuffix}
          </p>
        </div>
        <Link
          href="/#produkty"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
          Zobacz wszystkie
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z" />
          </svg>
        </Link>
      </div>

      <ProductCarousel items={items} />
    </section>
  );
}
