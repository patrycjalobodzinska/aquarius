export type City = {
  slug: string;
  name: string;
  nameLocative: string;
  region: string;
  /** Twardość wody — wartość główna w mg CaCO₃/l. */
  hardnessMg: number | string;
  /** Twardość w °n (Niemieckie stopnie twardości). */
  hardnessDh: number | string;
  /** Klasyfikacja: miękka / średnio twarda / twarda. */
  hardnessClass: "miękka" | "średnio twarda" | "twarda";
  /** Źródło i data danych (do uczciwego cytowania). */
  source: { label: string; url: string; period: string };
  /** Czy zmiękczacz jest sensowny w tej lokalizacji. */
  softenerRecommended: boolean;
  /** Lokalny opis (uczciwy, oparty na danych). */
  blurb: string;
  /** Sąsiednie miejscowości obsługiwane. */
  nearby: string[];
};

export const cities: City[] = [
  {
    slug: "rzeszow",
    name: "Rzeszów",
    nameLocative: "Rzeszowie",
    region: "Podkarpacie",
    hardnessMg: 282,
    hardnessDh: 15.8,
    hardnessClass: "średnio twarda",
    source: {
      label: "MPWiK Rzeszów",
      url: "https://mpwik.rzeszow.pl/download-category/jakosc-wody/",
      period: "kwiecień 2026",
    },
    softenerRecommended: true,
    blurb:
      "Rzeszów zasilany jest głównie z ujęcia na Wisłoku (SUW Zwięczyca). Według MPWiK twardość sięga 282 mg CaCO₃/l (15,8°n) — to wartość, przy której kamień szybko osadza się w bojlerach, zmywarkach i pralkach, szczególnie w dzielnicach z dłuższymi instalacjami.",
    nearby: [
      "Tyczyn",
      "Boguchwała",
      "Głogów Małopolski",
      "Trzebownisko",
      "Krasne",
      "Świlcza",
    ],
  },
  {
    slug: "krosno",
    name: "Krosno",
    nameLocative: "Krośnie",
    region: "Podkarpacie",
    hardnessMg: "162–252",
    hardnessDh: "9,1–14,1",
    hardnessClass: "średnio twarda",
    source: {
      label: "MPGK Krosno",
      url: "https://www.ekrosno.pl/uslugi/informacja-o-jakosci-wody",
      period: "I kwartał 2026",
    },
    softenerRecommended: true,
    blurb:
      "W Krośnie woda pochodzi z trzech ujęć i twardość różni się istotnie w zależności od dzielnicy: Sieniawa 162 mg CaCO₃/l (miękka), Iskrzynia 252 mg (średnio twarda), Szczepańcowa 196 mg. Dlatego przed doborem rozwiązania zawsze robimy pomiar na konkretnym kranie.",
    nearby: ["Korczyna", "Miejsce Piastowe", "Iwonicz-Zdrój", "Chorkówka"],
  },
  {
    slug: "przemysl",
    name: "Przemyśl",
    nameLocative: "Przemyślu",
    region: "Podkarpacie",
    hardnessMg: 170,
    hardnessDh: 9.6,
    hardnessClass: "miękka",
    source: {
      label: "PWiK Przemyśl",
      url: "https://www.pwik.przemysl.pl/woda/",
      period: "średnia roczna 2025",
    },
    softenerRecommended: false,
    blurb:
      "Przemyśl ma wodę z ujęcia na Sanie i jest to woda miękka — średnia roczna twardość według PWiK to 170 mg CaCO₃/l (ok. 9,6°n). Zmiękczacz tu zwykle nie jest potrzebny. Dla zdrowia i smaku polecamy filtr odwróconej osmozy pod zlew kuchenny.",
    nearby: ["Żurawica", "Krasiczyn", "Medyka", "Orły"],
  },
  {
    slug: "mielec",
    name: "Mielec",
    nameLocative: "Mielcu",
    region: "Podkarpacie",
    hardnessMg: "190–230",
    hardnessDh: "10,7–12,9",
    hardnessClass: "średnio twarda",
    source: {
      label: "MPGK Mielec",
      url: "https://www.mpgk.mielec.pl/index.php/jakosc-wody/twardosc-wody",
      period: "dane bieżące MPGK",
    },
    softenerRecommended: true,
    blurb:
      "Mielec to woda średnio twarda — 190–230 mg CaCO₃/l (ok. 11,7°n) wg MPGK. W starszych instalacjach i bojlerach kamień osadza się zauważalnie. Filtr RO eliminuje też pozostałości chloru z dezynfekcji sieci.",
    nearby: ["Tuszów Narodowy", "Przecław", "Radomyśl Wielki", "Borowa"],
  },
  {
    slug: "stalowa-wola",
    name: "Stalowa Wola",
    nameLocative: "Stalowej Woli",
    region: "Podkarpacie",
    hardnessMg: 130,
    hardnessDh: 7.3,
    hardnessClass: "miękka",
    source: {
      label: "MZK Stalowa Wola",
      url: "https://www.mzk.stalowa-wola.pl/bok/parametry-wody/",
      period: "aktualizacja maj 2026",
    },
    softenerRecommended: false,
    blurb:
      "Stalowa Wola ma jedną z najmiększych wód w regionie — 130 mg CaCO₃/l (ok. 7,3°n) z infiltracyjnego ujęcia na Sanie. Zmiękczacz nie ma tu sensu w sieci miejskiej. W domach ze studni warto sprawdzić żelazo i mangan — często wymagają odżelaziacza.",
    nearby: ["Nisko", "Pysznica", "Zaleszany", "Bojanów"],
  },
  {
    slug: "debica",
    name: "Dębica",
    nameLocative: "Dębicy",
    region: "Podkarpacie",
    hardnessMg: 210,
    hardnessDh: 11.8,
    hardnessClass: "średnio twarda",
    source: {
      label: "Wodociągi Dębickie",
      url: "https://www.wodociagi.debickie.pl/jakosc-wody/wskazniki-jakosci-wody/",
      period: "kwiecień 2026",
    },
    softenerRecommended: true,
    blurb:
      "W Dębicy średnia twardość wody to 210 mg CaCO₃/l (11,8°n) wg Wodociągów Dębickich — woda średnio twarda. Klienci najczęściej zgłaszają osad na szklankach po zmywarce i kamień w czajniku. Zmiękczacz + filtr RO rozwiązują problem kompleksowo.",
    nearby: ["Pustków", "Brzeźnica", "Żyraków", "Ocieka"],
  },
  {
    slug: "jaroslaw",
    name: "Jarosław",
    nameLocative: "Jarosławiu",
    region: "Podkarpacie",
    hardnessMg: "202–233",
    hardnessDh: "11,4–13,1",
    hardnessClass: "średnio twarda",
    source: {
      label: "PWiK Jarosław",
      url: "https://pwik-jaroslaw.pl/twardosc-wody/",
      period: "maj 2026",
    },
    softenerRecommended: true,
    blurb:
      "PWiK Jarosław publikuje twardość co miesiąc — ostatnie odczyty to 202–233 mg CaCO₃/l (ok. 11,4–13,1°n), woda średnio twarda. W domach z własnej studni twardość bywa znacznie wyższa — wtedy zmiękczacz jest praktycznie obowiązkowy.",
    nearby: ["Pruchnik", "Radymno", "Pawłosiów", "Wiązownica"],
  },
  {
    slug: "sanok",
    name: "Sanok",
    nameLocative: "Sanoku",
    region: "Podkarpacie",
    hardnessMg: 139,
    hardnessDh: 7,
    hardnessClass: "miękka",
    source: {
      label: "SPGK Sanok",
      url: "https://zwk.spgk.com.pl/laboratorium-spgk/",
      period: "I kwartał 2024",
    },
    softenerRecommended: false,
    blurb:
      "Sanok ma jedną z najczystszych i najmiększych wód w regionie — 139 mg CaCO₃/l (7°n) wg SPGK. Zmiękczacz nie jest tu konieczny. Filtr RO pod zlew warto rozważyć dla rodzin z dziećmi — eliminuje pozostałości chloru i ewentualne mikrozanieczyszczenia.",
    nearby: ["Zagórz", "Bukowsko", "Tyrawa Wołoska", "Lesko"],
  },
];

export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);
