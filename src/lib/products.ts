export type ProductCategory =
  | "ro-skrzynkowe"
  | "ro-klasyczne"
  | "ro-redox"
  | "ultrafiltracja"
  | "zmiekczacze";

export const categories: { slug: ProductCategory; label: string }[] = [
  { slug: "ro-skrzynkowe", label: "Filtry skrzynkowe RO" },
  { slug: "ro-klasyczne", label: "Filtry klasyczne RO" },
  { slug: "ro-redox", label: "Filtry Redox / Jonizacja" },
  { slug: "ultrafiltracja", label: "Ultrafiltracja / Przepływowe" },
  { slug: "zmiekczacze", label: "Zmiękczacze" },
];

export type Product = {
  slug: string;
  name: string;
  short: string;
  category: ProductCategory;
  price: number;
  badge?: string;
  images: string[];
  highlights: string[];
  description: string;
  specs: { label: string; value: string }[];
  stages?: string[];
  /** Sekcja "Dlaczego X? Cechy urządzenia" - używane dla zmiękczaczy. */
  advantages?: { title: string; items: string[] };
  /** Sekcja "Inteligentne zarządzanie WiFi i aplikacja mobilna" - tylko gdy produkt ma smart funkcje. */
  smartFeatures?: { title: string; intro?: string; items: string[] };
  /** Pliki do pobrania (PDF, instrukcje). */
  attachments?: { label: string; href: string }[];
};

export const products: Product[] = [
  {
    slug: "filtr-alabaster-ro6",
    name: "Filtr Alabaster RO6",
    short: "6-stopniowy system odwróconej osmozy",
    category: "ro-skrzynkowe",
    price: 1500,
    badge: "Bestseller",
    images: [
      "/products/filtr-alabaster-ro6.webp",
      "/products/filtr-alabaster-ro6-1.webp",
      "/products/filtr-alabaster-ro6-2.webp",
    ],
    highlights: [
      "Membrana RO 75 GPD",
      "6 stopni filtracji",
      "Mineralizator wody",
      "Cicha praca",
      "Łatwy montaż",
    ],
    description:
      "Sześciostopniowy system odwróconej osmozy w eleganckiej obudowie skrzynkowej. Usuwa do 99,9% zanieczyszczeń, w tym chlor, metale ciężkie i mikroplastik, a finalna mineralizacja przywraca naturalny smak wody.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Wydajność", value: "284 l/dobę" },
      { label: "Pojemność zbiornika", value: "12 l" },
      { label: "Stopnie filtracji", value: "6" },
      { label: "Ciśnienie pracy", value: "2,8–6 bar" },
      { label: "Gwarancja", value: "24 miesiące" },
    ],
    stages: [
      "Wkład sedymentacyjny 5µm",
      "Wkład węglowy GAC",
      "Wkład węglowy CTO",
      "Membrana RO 75 GPD",
      "Postfilter węglowy",
      "Mineralizator",
    ],
  },
  {
    slug: "filtr-alabaster-ro5-z-pompa",
    name: "Filtr Alabaster RO5 z pompą",
    short: "5-stopniowy RO z pompą wspomagającą",
    category: "ro-skrzynkowe",
    price: 1750,
    images: [
      "/products/filtr-alabaster-5-stopniowy-ro5-zpompa.webp",
      "/products/filtr-alabaster-5-stopniowy-ro5-zpompa-1.webp",
      "/products/filtr-alabaster-5-stopniowy-ro5-zpompa-2.webp",
    ],
    highlights: [
      "Pompa wspomagająca",
      "Działa przy niskim ciśnieniu",
      "5 stopni filtracji",
      "Cichy zbiornik 12L",
    ],
    description:
      "Pięciostopniowy filtr RO z pompą wspomagającą - idealny dla mieszkań z niskim ciśnieniem wody. Kompaktowa obudowa skrzynkowa, szybkozłączki, automatyczne wyłączanie po napełnieniu zbiornika.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Wydajność", value: "284 l/dobę" },
      { label: "Pojemność zbiornika", value: "12 l" },
      { label: "Pompa", value: "Tak, 24V DC" },
      { label: "Stopnie filtracji", value: "5" },
    ],
    stages: [
      "Sedyment 5µm",
      "Węgiel GAC",
      "Węgiel CTO",
      "Membrana RO 75 GPD",
      "Postfilter węglowy",
    ],
  },
  {
    slug: "filtr-alabaster-ro7-bioceramic",
    name: "Filtr Alabaster RO7 Bioceramic",
    short: "7-stopniowy z wkładem bioceramicznym",
    category: "ro-skrzynkowe",
    price: 1890,
    badge: "Nowość",
    images: [
      "/products/filtr-alabaster-7-stopniowy-z-wkladem-bioceramicznym-ro7.webp",
      "/products/filtr-alabaster-7-stopniowy-z-wkladem-bioceramicznym-ro7-1.webp",
    ],
    highlights: [
      "Wkład bioceramiczny",
      "Mineralizacja + alkalizacja",
      "7 stopni filtracji",
      "Aktywuje cząsteczki wody",
    ],
    description:
      "Najwyższa wersja systemu Alabaster - 7 stopni filtracji wzbogaconych o wkład bioceramiczny, który restrukturyzuje wodę i podnosi jej pH. Dla osób, które oczekują od wody więcej niż tylko czystości.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Wydajność", value: "284 l/dobę" },
      { label: "pH na wyjściu", value: "7,5–8,5" },
      { label: "Stopnie filtracji", value: "7" },
    ],
    stages: [
      "Sedyment",
      "Węgiel GAC",
      "Węgiel CTO",
      "Membrana RO",
      "Mineralizator",
      "Postfilter węglowy",
      "Bioceramika",
    ],
  },
  {
    slug: "filtr-alabaster-redox-7",
    name: "Filtr Alabaster Redox",
    short: "7-stopniowy z wkładem REDOX",
    category: "ro-redox",
    price: 2100,
    images: [
      "/products/filtr-alabaster-redox-7-stopniowy.webp",
      "/products/filtr-alabaster-redox-7-stopniowy-1.webp",
      "/products/filtr-alabaster-redox-7-stopniowy-2.webp",
      "/products/filtr-alabaster-redox-7-stopniowy-3.webp",
    ],
    highlights: [
      "Wkład REDOX (KDF)",
      "Ujemny potencjał ORP",
      "Antyoksydacyjne działanie",
      "7 stopni filtracji",
    ],
    description:
      "System z wkładem REDOX obniża potencjał oksydoredukcyjny wody, nadając jej właściwości antyoksydacyjne. Kompletna 7-stopniowa filtracja w obudowie skrzynkowej.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Stopnie filtracji", value: "7" },
      { label: "ORP", value: "−150 do −250 mV" },
      { label: "Pojemność zbiornika", value: "12 l" },
    ],
  },
  {
    slug: "filtr-alabaster-ro7-redox-mnx",
    name: "Filtr Alabaster RO7 Redox MNX",
    short: "Premium 7-stopniowy Redox + MNX",
    category: "ro-redox",
    price: 2390,
    badge: "Premium",
    images: [
      "/products/filtr-alabaster-ro7-redox-mnx.webp",
      "/products/filtr-alabaster-ro7-redox-mnx-1.webp",
      "/products/filtr-alabaster-ro7-redox-mnx-2.webp",
      "/products/filtr-alabaster-ro7-redox-mnx-3.webp",
    ],
    highlights: [
      "Wkład MNX + REDOX",
      "Dodatkowy magnez",
      "Jonizacja alkaliczna",
      "Najwyższa specyfikacja",
    ],
    description:
      "Topowa wersja serii Alabaster - łączy filtrację RO z wkładem REDOX i mineralizatorem MNX wzbogacającym wodę w magnez. Stworzona dla świadomych konsumentów.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Stopnie filtracji", value: "7" },
      { label: "Mineralizacja", value: "Mg, Ca, K" },
      { label: "ORP", value: "do −300 mV" },
    ],
  },
  {
    slug: "filtr-dfl-home-pro",
    name: "Filtr DFL Home Pro",
    short: "Bezzbiornikowy filtr przepływowy RO",
    category: "ro-skrzynkowe",
    price: 2890,
    images: [
      "/products/filtr-dfl-home-pro.webp",
      "/products/filtr-dfl-home-pro-1.webp",
    ],
    highlights: [
      "Direct Flow - bez zbiornika",
      "Wydajność 600 GPD",
      "Smart wskaźnik wkładów",
      "Cyfrowy panel LED",
    ],
    description:
      "Nowoczesny filtr przepływowy bez zbiornika - woda płynie z kranu na żądanie. Wbudowany mikroprocesor monitoruje stan wkładów i jakość wody w czasie rzeczywistym.",
    specs: [
      { label: "Wydajność", value: "600 GPD (~1,6 l/min)" },
      { label: "Sterowanie", value: "Panel LED" },
      { label: "Stopnie filtracji", value: "4" },
      { label: "Wymiary", value: "42 × 14 × 40 cm" },
    ],
  },
  {
    slug: "filtr-kuchenny-3-stopniowy",
    name: "Filtr kuchenny 3-stopniowy",
    short: "Klasyczny filtr przepływowy",
    category: "ultrafiltracja",
    price: 450,
    images: ["/products/filtr-kuchenny-3stopniowy-przeplywowy.webp"],
    highlights: [
      "3 stopnie filtracji",
      "Bez zbiornika",
      "Pełen przepływ wody",
      "Tani w eksploatacji",
    ],
    description:
      "Prosty i niezawodny filtr 3-stopniowy bez zbiornika i bez membrany RO. Świetne rozwiązanie dla wody o dobrej jakości, gdy potrzebujesz usunąć chlor i osady.",
    specs: [
      { label: "Stopnie filtracji", value: "3" },
      { label: "Przepływ", value: "Do 4 l/min" },
      { label: "Zbiornik", value: "Brak" },
    ],
    stages: ["Sedyment 5µm", "Węgiel aktywny GAC", "Węgiel blokowy CTO"],
  },
  {
    slug: "filtr-kuchenny-ro6",
    name: "Filtr kuchenny RO6",
    short: "6-stopniowy klasyczny RO",
    category: "ro-klasyczne",
    price: 990,
    images: [
      "/products/filtr-kuchenny-6-stopniowy-ro6.webp",
      "/products/filtr-kuchenny-6-stopniowy-ro6-1.webp",
    ],
    highlights: [
      "Klasyczna konstrukcja",
      "Mineralizator",
      "Zbiornik 12L",
      "Dobry stosunek ceny do jakości",
    ],
    description:
      "Klasyczny zestaw 6-stopniowej osmozy do montażu pod zlewem. Sprawdzony przez tysiące rodzin - łatwy serwis, dostępne wkłady standardu 10''.",
    specs: [
      { label: "Stopnie filtracji", value: "6" },
      { label: "Wydajność", value: "190 l/dobę" },
      { label: "Zbiornik", value: "12 l" },
    ],
    stages: [
      "Sedyment",
      "Węgiel GAC",
      "Węgiel CTO",
      "Membrana RO 50 GPD",
      "Postfilter",
      "Mineralizator",
    ],
  },
  {
    slug: "filtr-kuchenny-ro5",
    name: "Filtr kuchenny RO5",
    short: "5-stopniowy klasyczny RO",
    category: "ro-klasyczne",
    price: 850,
    images: [
      "/products/filtr-kuchenny-ro-5.webp",
      "/products/filtr-kuchenny-ro-5-1.webp",
    ],
    highlights: [
      "5 stopni filtracji",
      "Standard 10''",
      "Łatwa wymiana wkładów",
      "Zbiornik 12L",
    ],
    description:
      "Najpopularniejszy zestaw RO w polskich domach. Pięciostopniowa filtracja w klasycznej konstrukcji - niezawodna i tania w eksploatacji.",
    specs: [
      { label: "Stopnie filtracji", value: "5" },
      { label: "Wydajność", value: "190 l/dobę" },
      { label: "Zbiornik", value: "12 l" },
    ],
    stages: [
      "Sedyment",
      "Węgiel GAC",
      "Węgiel CTO",
      "Membrana RO 50 GPD",
      "Postfilter węglowy",
    ],
  },
  {
    slug: "filtr-kuchenny-ro7",
    name: "Filtr kuchenny RO7",
    short: "7-stopniowy z mineralizacją",
    category: "ro-klasyczne",
    price: 1190,
    images: [
      "/products/filtr-kuchenny-ro-7.webp",
      "/products/filtr-kuchenny-ro-7-1.webp",
    ],
    highlights: [
      "7 stopni filtracji",
      "Podwójna mineralizacja",
      "Zbiornik 12L",
      "Sprawdzona konstrukcja",
    ],
    description:
      "Rozbudowana wersja klasycznego filtra RO o dodatkowe stopnie mineralizujące. Woda po filtracji jest miękka, ale wzbogacona w naturalne minerały.",
    specs: [
      { label: "Stopnie filtracji", value: "7" },
      { label: "Wydajność", value: "190 l/dobę" },
      { label: "Zbiornik", value: "12 l" },
    ],
  },
  {
    slug: "filtr-kuchenny-ups41",
    name: "Filtr kuchenny UPS41",
    short: "Kompaktowy filtr ultrafiltracyjny",
    category: "ultrafiltracja",
    price: 690,
    images: ["/products/filtr-kuchenny-ups41.webp"],
    highlights: [
      "Membrana UF 0,01µm",
      "Bez zbiornika",
      "Zachowuje minerały",
      "Mały rozmiar",
    ],
    description:
      "Filtr z membraną ultrafiltracyjną - usuwa bakterie i mikroplastik, ale zachowuje cenne minerały. Polecany tam, gdzie woda wodociągowa jest dobrej jakości.",
    specs: [
      { label: "Stopnie filtracji", value: "4" },
      { label: "Przepływ", value: "Do 3 l/min" },
      { label: "Membrana", value: "UF 0,01µm" },
    ],
  },
  {
    slug: "filtr-magnepure-grafit",
    name: "Filtr MagnePure Grafit",
    short: "Filtr magnetyczny z grafitem",
    category: "ultrafiltracja",
    price: 540,
    images: ["/products/filtr-magnepure-grafit.webp"],
    highlights: [
      "Wkład grafitowy",
      "Element magnetyczny",
      "Eliminuje kamień",
      "Ciche działanie",
    ],
    description:
      "Innowacyjne połączenie filtra grafitowego i obróbki magnetycznej. Redukuje twardość wody i poprawia smak bez stosowania chemii.",
    specs: [
      { label: "Stopnie filtracji", value: "3" },
      { label: "Technologia", value: "Grafit + magnes" },
      { label: "Przepływ", value: "Do 4 l/min" },
    ],
  },
  {
    slug: "zmiekczacz-eos-carbon",
    name: "Zmiękczacz EOS Carbon",
    short: "Stacja zmiękczająca z węglem",
    category: "zmiekczacze",
    price: 3200,
    images: [
      "/products/zmiekczacz-eos-carbon.webp",
      "/products/zmiekczacz-eos-carbon-1.webp",
    ],
    highlights: [
      "Złoże kationitowe + węglowe",
      "Sterownik elektroniczny",
      "Tryb ECO",
      "Cicha regeneracja",
    ],
    description:
      "Centralny zmiękczacz wody EOS Carbon łączy zmiękczanie z filtracją węglową. Idealny dla domów do 5 osób, znacząco redukuje kamień i chlor w całej instalacji.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Pojemność złoża", value: "20 l kationit + 5 l węgla" },
      { label: "Wydajność nominalna", value: "1,4 m³/h" },
      { label: "Sterownik", value: "Clack WS1" },
      { label: "Zasilanie", value: "230 V / 50 Hz" },
      { label: "Pobór mocy", value: "12 W" },
      { label: "Ciśnienie pracy", value: "2–6 bar" },
      { label: "Temperatura wody", value: "5–40 °C" },
      { label: "Norma higieniczna", value: "Atest PZH" },
      { label: "Gwarancja", value: "24 miesiące" },
    ],
    advantages: {
      title: "Dlaczego EOS Carbon?",
      items: [
        "Dwustopniowa obróbka - zmiękczanie + filtracja węglem aktywnym w jednej obudowie",
        "Sterownik objętościowy regeneruje złoże tylko gdy faktycznie zostanie wykorzystane",
        "Tryb ECO obniża zużycie soli i wody nawet o 30%",
        "Cicha praca dzięki nowoczesnym zaworom - można postawić w pomieszczeniu mieszkalnym",
        "Bypass i przewody przyłączeniowe w zestawie",
      ],
    },
    attachments: [
      { label: "Karta katalogowa (PDF)", href: "#" },
      { label: "Instrukcja obsługi (PDF)", href: "#" },
    ],
  },
  {
    slug: "zmiekczacz-gastro-rx65b3",
    name: "Zmiękczacz GASTRO RX65B3",
    short: "Kompaktowy zmiękczacz gastronomiczny",
    category: "zmiekczacze",
    price: 1230,
    images: [
      "/products/zmiekczacz-gastro-rx65b3.webp",
      "/products/zmiekczacz-gastro-rx65b3-1.webp",
    ],
    highlights: [
      "Dla gastronomii",
      "Mały gabaryt",
      "Manualna regeneracja",
      "Zabezpiecza ekspres",
    ],
    description:
      "Kompaktowy zmiękczacz dedykowany do urządzeń gastronomicznych - ekspresów do kawy, pieców konwekcyjnych, zmywarek. Chroni przed osadzaniem się kamienia.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Złoże", value: "6,5 l kationit" },
      { label: "Wydajność", value: "do 6500 l (zal. od twardości)" },
      { label: "Przyłącze", value: '3/8"' },
      { label: "Ciśnienie pracy", value: "2–6 bar" },
      { label: "Temperatura wody", value: "5–40 °C" },
      { label: "Wymiary", value: "20 × 50 × 14 cm" },
      { label: "Waga", value: "8 kg" },
      { label: "Norma higieniczna", value: "Atest PZH" },
    ],
    advantages: {
      title: "Dlaczego GASTRO RX65B3?",
      items: [
        "Stworzony pod ekspresy ciśnieniowe i piece konwekcyjno-parowe",
        "Mieści się pod blatem lub w szafce serwisowej",
        "Manualna regeneracja - bez prądu, bez awarii sterownika",
        "Wydłuża żywotność urządzeń kuchennych nawet 3-krotnie",
      ],
    },
    attachments: [
      { label: "Karta katalogowa (PDF)", href: "#" },
      { label: "Instrukcja obsługi (PDF)", href: "#" },
    ],
  },
  {
    slug: "zmiekczacz-hera-l",
    name: "Zmiękczacz Hera L",
    short: "Stacja 20 l złoża",
    category: "zmiekczacze",
    price: 2890,
    images: [
      "/products/zmiekczacz-hera-l-20-l-zloza.webp",
      "/products/zmiekczacz-hera-l-20-l-zloza-1.webp",
    ],
    highlights: [
      "20 l złoża kationitowego",
      "Sterownik objętościowy",
      "Bypass w komplecie",
      "Cicha praca",
    ],
    description:
      "Zmiękczacz Hera L w wersji 20-litrowej - sprawdzony wybór dla gospodarstw 3–4 osobowych. Sterownik objętościowy minimalizuje zużycie soli i wody.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Złoże", value: "20 l kationit" },
      { label: "Wydajność nominalna", value: "1,2 m³/h" },
      { label: "Sterownik", value: "Objętościowy" },
      { label: "Solanka", value: "70 l" },
      { label: "Pobór mocy", value: "10 W" },
      { label: "Ciśnienie pracy", value: "2–6 bar" },
      { label: "Wymiary", value: "30 × 50 × 105 cm" },
      { label: "Norma higieniczna", value: "Atest PZH" },
    ],
    advantages: {
      title: "Dlaczego Hera L?",
      items: [
        "Złoże 20 l obsługuje typowy dom 3–4 osobowy bez kompromisów",
        "Sterownik objętościowy - regeneracja tylko po przepracowaniu zaprogramowanej ilości wody",
        "Cicha praca - poziom hałasu poniżej 30 dB",
        "Bypass i przewody w komplecie - montaż w 30 minut",
      ],
    },
    attachments: [
      { label: "Karta katalogowa (PDF)", href: "#" },
      { label: "Instrukcja obsługi (PDF)", href: "#" },
    ],
  },
  {
    slug: "zmiekczacz-hera-s",
    name: "Zmiękczacz Hera S",
    short: "Stacja 8 l złoża",
    category: "zmiekczacze",
    price: 1990,
    images: [
      "/products/zmiekczacz-hera-s-8-l-zloza.webp",
      "/products/zmiekczacz-hera-s-8-l-zloza-1.webp",
    ],
    highlights: [
      "8 l złoża",
      "Najmniejszy w serii",
      "Idealny do mieszkania",
      "Energooszczędny",
    ],
    description:
      "Mała wersja Hery - 8 litrów złoża, dedykowana do mieszkań i domów dla 1–2 osób. Mieści się w typowej szafce kuchennej.",
    specs: [
      { label: "Producent", value: "FitAqua" },
      { label: "Złoże", value: "8 l kationit" },
      { label: "Wydajność nominalna", value: "0,8 m³/h" },
      { label: "Sterownik", value: "Objętościowy" },
      { label: "Solanka", value: "25 l" },
      { label: "Pobór mocy", value: "8 W" },
      { label: "Wymiary", value: "20 × 50 × 50 cm" },
      { label: "Norma higieniczna", value: "Atest PZH" },
    ],
    advantages: {
      title: "Dlaczego Hera S?",
      items: [
        "Najbardziej kompaktowy zmiękczacz w ofercie - mieści się pod typowym blatem",
        "Idealny dla mieszkań i domów dla 1–2 osób",
        "Niski pobór energii - działa na poziomie zwykłego routera Wi-Fi",
        "Solanka 25 l wystarcza średnio na 2–3 miesiące",
      ],
    },
    attachments: [
      { label: "Karta katalogowa (PDF)", href: "#" },
      { label: "Instrukcja obsługi (PDF)", href: "#" },
    ],
  },
  {
    slug: "zmiekczacz-ivision",
    name: "Zmiękczacz iVISION",
    short: "Inteligentny zmiękczacz wody z Wi-Fi i aplikacją mobilną",
    category: "zmiekczacze",
    price: 4800,
    badge: "Smart",
    images: [
      "/products/zmiekczacz-ivision.webp",
      "/products/zmiekczacz-ivision-1.webp",
      "/products/zmiekczacz-ivision-2.webp",
    ],
    highlights: [
      "Wi-Fi 2,4 GHz + chmura",
      "Aplikacja mobilna iOS / Android",
      "Predykcja zużycia soli",
      "Diagnostyka online",
      "Sterowanie głosowe (Google / Alexa)",
    ],
    description:
      "iVISION to najnowocześniejszy zmiękczacz w naszej ofercie - łączy sprawdzoną technologię wymiany jonowej z pełną integracją smart home. Urządzenie samo monitoruje twardość, planuje regenerację w nocy i wysyła powiadomienia, gdy poziom soli spada. Idealny wybór dla wymagających użytkowników, którzy oczekują od domowej instalacji wody tej samej wygody, co od oświetlenia czy ogrzewania.",
    specs: [
      { label: "Marka", value: "FitAqua" },
      { label: "Producent", value: "FitAqua" },
      { label: "EAN", value: "5904567812345" },
      { label: "Pojemność złoża", value: "20 l kationit (Lewatit)" },
      { label: "Pojemność solanki", value: "70 l" },
      { label: "Wydajność nominalna", value: "1,5 m³/h" },
      { label: "Wydajność szczytowa", value: "2,1 m³/h" },
      { label: "Pobór mocy", value: "12 W" },
      { label: "Zasilanie", value: "230 V / 50 Hz" },
      { label: "Ciśnienie pracy", value: "2–6 bar" },
      { label: "Temperatura wody", value: "5–40 °C" },
      { label: "Łączność", value: "Wi-Fi 2,4 GHz, BT 5.0" },
      { label: "Aplikacja", value: "iVISION app - iOS 14+ / Android 9+" },
      { label: "Sterownik", value: "iVISION SmartCtrl 4.2" },
      { label: "Wymiary (S × G × W)", value: "30 × 50 × 110 cm" },
      { label: "Waga (bez złoża)", value: "26 kg" },
      { label: "Norma higieniczna", value: "Atest PZH HK/W/0312/01/2023" },
      { label: "Gwarancja", value: "36 miesięcy" },
    ],
    advantages: {
      title: "Dlaczego iVISION? Cechy urządzenia",
      items: [
        "Inteligentna predykcja - uczy się rytmu zużycia wody w Twoim domu i optymalizuje cykl regeneracji",
        "Tryb wakacyjny - automatycznie wstrzymuje regeneracje gdy nie ma poboru wody przez dłuższy czas",
        "Cichy zawór proporcjonalny - poziom hałasu poniżej 28 dB nawet podczas regeneracji",
        "Wysokiej jakości złoże Lewatit - żywica jonowymienna o wydłużonej żywotności (10+ lat)",
        "Zintegrowany licznik wody i czujnik twardości na wyjściu - pełna kontrola jakości w czasie rzeczywistym",
        "Bypass i przewody przyłączeniowe w komplecie - montaż przez instalatora w ok. 1 godzinę",
      ],
    },
    smartFeatures: {
      title: "Inteligentne zarządzanie - Wi-Fi i aplikacja mobilna",
      intro:
        "Sparuj urządzenie z domowym Wi-Fi w 2 minuty i miej pełną kontrolę z dowolnego miejsca na świecie. Aplikacja iVISION jest darmowa, bez subskrypcji.",
      items: [
        "Powiadomienia push o niskim poziomie soli, błędach lub zaplanowanym serwisie",
        "Podgląd aktualnego zużycia wody - dziennie, miesięcznie, rocznie",
        "Statystyki regeneracji i zużycia soli - łatwiej planować zakupy",
        "Zdalne uruchomienie regeneracji manualnej",
        "Integracja z Google Assistant i Amazon Alexa",
        "Możliwość udostępnienia panelu instalatorowi w trybie diagnostycznym",
      ],
    },
    attachments: [
      { label: "Karta katalogowa iVISION (PDF)", href: "#" },
      { label: "Instrukcja obsługi (PDF)", href: "#" },
      { label: "Atest PZH (PDF)", href: "#" },
    ],
  },
  {
    slug: "zmiekczacz-luna-l",
    name: "Zmiękczacz Luna L",
    short: "Stacja 20 l złoża",
    category: "zmiekczacze",
    price: 2790,
    images: [
      "/products/zmiekczacz-luna-l-20-l-zloza.webp",
      "/products/zmiekczacz-luna-l-20-l-zloza-1.webp",
    ],
    highlights: [
      "20 l złoża",
      "Kompaktowa obudowa",
      "Cyfrowy sterownik",
      "Cicha regeneracja",
    ],
    description:
      "Stacja Luna L - sprawdzona konstrukcja w atrakcyjnej cenie, idealna dla domów jednorodzinnych dla 3–4 osób.",
    specs: [
      { label: "Złoże", value: "20 l" },
      { label: "Wydajność", value: "1,2 m³/h" },
      { label: "Sterownik", value: "Czasowy / objętościowy" },
    ],
  },
  {
    slug: "zmiekczacz-luna-xl",
    name: "Zmiękczacz Luna XL",
    short: "Stacja 25 l złoża",
    category: "zmiekczacze",
    price: 2990,
    images: [
      "/products/zmiekczacz-luna-xl-25-l-zloza.webp",
      "/products/zmiekczacz-luna-xl-25-l-zloza-1.webp",
    ],
    highlights: [
      "25 l złoża",
      "Większa wydajność",
      "Dla 4–5 osób",
      "Sterownik objętościowy",
    ],
    description:
      "Wersja XL stacji Luna - 25 litrów złoża zapewnia komfortową pracę nawet w gospodarstwach 4–5 osobowych z umiarkowanie twardą wodą.",
    specs: [
      { label: "Złoże", value: "25 l" },
      { label: "Wydajność", value: "1,5 m³/h" },
    ],
  },
  {
    slug: "zmiekczacz-luna-xxl",
    name: "Zmiękczacz Luna XXL",
    short: "Stacja 35 l złoża",
    category: "zmiekczacze",
    price: 3200,
    images: [
      "/products/zmiekczacz-luna-xxl-35-litrow-zloza.webp",
      "/products/zmiekczacz-luna-xxl-35-litrow-zloza-1.webp",
    ],
    highlights: [
      "35 l złoża",
      "Dla dużych gospodarstw",
      "Wysoka wydajność",
      "Solanka 100 l",
    ],
    description:
      "Największa wersja serii Luna - 35 litrów złoża dla domów 5–7 osobowych lub miejsc o bardzo twardej wodzie. Solanka 100 l ogranicza częstotliwość uzupełniania.",
    specs: [
      { label: "Złoże", value: "35 l" },
      { label: "Wydajność", value: "1,8 m³/h" },
      { label: "Solanka", value: "100 l" },
    ],
  },
  {
    slug: "zmiekczacz-saturn-m",
    name: "Zmiękczacz Saturn M",
    short: "Średnia stacja zmiękczająca",
    category: "zmiekczacze",
    price: 2480,
    images: [
      "/products/zmiekczacz-saturn-m.webp",
      "/products/zmiekczacz-saturn-m-1.webp",
    ],
    highlights: [
      "Średni rozmiar",
      "Sterownik Clack",
      "Łatwy montaż",
      "Bypass w zestawie",
    ],
    description:
      "Saturn M - uniwersalna stacja zmiękczająca średniej wielkości. Sprawdza się w typowym domu jednorodzinnym dla 3–4 osób.",
    specs: [
      { label: "Złoże", value: "16 l" },
      { label: "Wydajność", value: "1,1 m³/h" },
      { label: "Sterownik", value: "Clack WS1" },
    ],
  },
  {
    slug: "zmiekczacz-ursus-xl",
    name: "Zmiękczacz Ursus XL",
    short: "Stacja 25 l złoża",
    category: "zmiekczacze",
    price: 3490,
    images: [
      "/products/zmiekczacz-ursus-xl-25-l-zloza.webp",
      "/products/zmiekczacz-ursus-xl-25-l-zloza-1.webp",
    ],
    highlights: [
      "25 l złoża",
      "Wzmocniona obudowa",
      "Praca ciągła",
      "Premium komponenty",
    ],
    description:
      "Stacja Ursus XL - solidna konstrukcja przeznaczona do intensywnej pracy. Wybierana w domach z basenem, ogrzewaniem podłogowym i dużym zużyciem ciepłej wody.",
    specs: [
      { label: "Złoże", value: "25 l" },
      { label: "Wydajność", value: "1,5 m³/h" },
      { label: "Korpus", value: "Wzmocniony FRP" },
    ],
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getRelated = (current: Product, count = 4) =>
  products
    .filter((p) => p.slug !== current.slug && p.category === current.category)
    .slice(0, count);

export const formatPrice = (price: number) =>
  price.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " zł";
