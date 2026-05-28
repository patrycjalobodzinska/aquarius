import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailHero from "@/components/ProductDetailHero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";
import { categories, formatPrice, getProduct, getRelated, products } from "@/lib/products";

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

  const related = getRelated(product, 4);

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

        {related.length > 0 && (
          <div className="mt-32">
            <div className="flex items-end justify-between">
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
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/produkty/${p.slug}`}
                  className="group block">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-sky-100">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 22vw, 45vw"
                      className="object-contain p-6 transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="text-base font-semibold text-blue-950">
                      {p.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 line-clamp-1">
                      {p.short}
                    </div>
                    <div className="mt-2 text-base font-semibold text-blue-950">
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
