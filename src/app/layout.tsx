import type { Metadata, Viewport } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aquarius.pl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Aquarius — Filtry wody i zmiękczacze | Czysta, mineralizowana woda z kranu",
    template: "%s | Aquarius",
  },
  description:
    "Filtry odwróconej osmozy, ultrafiltracja i zmiękczacze wody dla domu, mieszkania i gastronomii. Usuwamy do 99,9% zanieczyszczeń, przywracamy minerały i miękką wodę. Doradztwo, montaż, serwis w całej Polsce.",
  applicationName: "Aquarius",
  authors: [{ name: "Aquarius" }],
  creator: "Aquarius",
  publisher: "Aquarius",
  keywords: [
    "filtr wody",
    "filtr odwróconej osmozy",
    "filtr RO",
    "zmiękczacz wody",
    "stacja zmiękczająca",
    "ultrafiltracja",
    "woda mineralizowana",
    "kamień w wodzie",
    "filtr pod zlew",
    "uzdatnianie wody",
    "Aquarius",
    "FitAqua",
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
      "Aquarius — Filtry wody i zmiękczacze | Czysta, mineralizowana woda z kranu",
    description:
      "Filtracja RO, ultrafiltracja i zmiękczanie wody. Do 99,9% mniej zanieczyszczeń, naturalna mineralizacja, koniec z butelkami i kamieniem.",
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
      "Aquarius — Filtry wody i zmiękczacze | Czysta woda z kranu",
    description:
      "Filtry RO, ultrafiltracja, zmiękczacze wody. Czysta i mineralizowana woda prosto z kranu.",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aquarius",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  email: "kontakt@aquarius.pl",
  telephone: "+48 22 000 00 00",
  areaServed: "PL",
  sameAs: [] as string[],
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
            __html: JSON.stringify(organizationJsonLd),
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
