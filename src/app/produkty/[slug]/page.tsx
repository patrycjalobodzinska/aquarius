import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCarousel from "@/components/ProductCarousel";
import ProductDetailHero from "@/components/ProductDetailHero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { categories, getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) {
    return {
      title: "Produkt nie znaleziony",
      robots: { index: false, follow: false },
    };
  }
  const categoryLabel = categories.find((c) => c.slug === p.category)?.label;
  const title = `${p.name} — ${categoryLabel ?? "uzdatnianie wody"}`;
  const description = `${p.short}. ${p.description}`.slice(0, 300);
  const url = `/produkty/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      p.name,
      categoryLabel ?? "filtr wody",
      "filtr wody",
      "uzdatnianie wody",
      "Aquarius",
      "FitAqua",
    ],
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: p.images.length
        ? [{ url: p.images[0], alt: p.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // Pełna karuzela: najpierw inne modele z tej samej kategorii,
  // potem reszta oferty.
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  );
  const otherCategories = products.filter(
    (p) => p.slug !== product.slug && p.category !== product.category,
  );
  const related = [...sameCategory, ...otherCategories];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://aquarius.craftedweb.pl";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    category: categories.find((c) => c.slug === product.category)?.label,
    brand: { "@type": "Brand", name: "FitAqua" },
    image: product.images.map((src) =>
      src.startsWith("http") ? src : `${siteUrl}${src}`,
    ),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/produkty/${product.slug}`,
      seller: { "@type": "Organization", name: "Aquarius" },
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produkty",
        item: `${siteUrl}/produkty`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/produkty/${product.slug}`,
      },
    ],
  };

  return (
    <div className="relative min-h-screen text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Te same gradient-warstwy co landing — strona produktu nie wygląda
          „ciemniej" / „odcięta" od reszty serwisu. */}
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
        <ProductDetailHero product={product} />

        <div className="mt-24 grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
              Opis
            </div>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              {product.description}
            </p>

            {product.stages && product.stages.length > 0 && (
              <div className="mt-16">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
                  Etapy filtracji
                </div>
                <ol className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  {product.stages.map((s, i) => (
                    <li key={s} className="flex gap-5">
                      <span className="text-[11px] font-semibold tracking-[0.28em] text-slate-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-base leading-relaxed text-blue-950">
                        {s}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <aside>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
              Specyfikacja
            </div>
            <dl className="mt-6 divide-y divide-sky-100 border-t border-sky-100">
              {product.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">{s.label}</dt>
                  <dd className="text-right font-medium text-blue-950">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

      </main>

      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
                Podobne produkty
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
                Inne modele z naszej oferty
              </h2>
            </div>
            <Link
              href="/produkty"
              className="text-sm font-medium text-blue-700 hover:underline">
              Zobacz wszystkie →
            </Link>
          </div>
          <ProductCarousel items={related} />
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
