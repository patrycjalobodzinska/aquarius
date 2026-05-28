import type { Metadata, Viewport } from "next";
import { Questrial } from "next/font/google";
import { cities } from "@/lib/cities";
import "./globals.css";

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aquarius.craftedweb.pl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Aquarius Rzeszów — Zmiękczacze wody i filtry RO | Podkarpacie",
    template: "%s | Aquarius",
  },
  description:
    "Zmiękczacze wody, filtry odwróconej osmozy i ultrafiltracja w Rzeszowie i na Podkarpaciu. Doradzimy odpowiedni model i zamontujemy w Twoim domu lub lokalu. Sprzęt sprawdzonych marek z gwarancją producenta.",
  applicationName: "Aquarius",
  authors: [{ name: "Aquarius" }],
  creator: "Aquarius",
  publisher: "Aquarius",
  keywords: [
    "zmiękczacz wody Rzeszów",
    "filtr wody Rzeszów",
    "filtr odwróconej osmozy Rzeszów",
    "twarda woda Rzeszów",
    "uzdatnianie wody Podkarpacie",
    "zmiękczacz wody Podkarpacie",
    "montaż zmiękczacza wody",
    "montaż filtra wody Rzeszów",
    "filtr RO pod zlew",
    "stacja zmiękczająca",
    "ultrafiltracja",
    "woda mineralizowana",
    "kamień w wodzie",
    "Aquarius Rzeszów",
  ],
  category: "shopping",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: SITE_URL,
    siteName: "Aquarius",
    title:
      "Aquarius Rzeszów — Zmiękczacze wody i filtry RO | Podkarpacie",
    description:
      "Zmiękczacze wody, filtry RO i ultrafiltracja. Doradzimy i zamontujemy w Rzeszowie i na całym Podkarpaciu.",
    images: [
      {
        url: "/hero-spash.jpg",
        width: 1200,
        height: 630,
        alt: "Czysta, mineralizowana woda Aquarius",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Aquarius Rzeszów — Zmiękczacze wody i filtry RO",
    description:
      "Doradztwo i montaż zmiękczaczy oraz filtrów RO w Rzeszowie i na Podkarpaciu.",
    images: ["/hero-spash.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eff6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c2a5a" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

// Service Area Business (mobilny serwis bez stacjonarnej siedziby).
// Schema bez `address` / `geo` — zgodnie z zaleceniami Google dla SAB.
// `areaServed` definiuje obszar obsługi.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Aquarius — zmiękczacze i filtry wody",
  alternateName: "Aquarius Rzeszów",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  image: `${SITE_URL}/hero-spash.jpg`,
  email: "januszlobodzinski.rzeszow70@gmail.com",
  telephone: "+48 513 001 600",
  priceRange: "$$",
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: "województwo podkarpackie",
    },
    ...cities.map((c) => ({
      "@type": "City" as const,
      name: c.name,
    })),
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 50.0413,
      longitude: 21.9991,
    },
    geoRadius: 150000,
  },
  serviceType: [
    "Montaż zmiękczaczy wody",
    "Montaż filtrów odwróconej osmozy",
    "Montaż systemów ultrafiltracji",
    "Doradztwo techniczne",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Aquarius",
  url: SITE_URL,
  inLanguage: "pl-PL",
  publisher: {
    "@type": "Organization",
    name: "Aquarius",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${questrial.variable} h-full antialiased`}>
      <head>
        {/* Hero env map - pobierane z wysokim priorytetem, żeby kropla
            dostała odbicia tuż po pierwszej klatce. */}
        <link
          rel="preload"
          as="image"
          href="/hero-env-small.jpg"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className="font-sans min-h-full flex flex-col">{children}</body>
    </html>
  );
}
