const faq = [
  {
    q: "Jaka jest twardość wody w Rzeszowie i na Podkarpaciu?",
    a: "W Rzeszowie woda osiąga zwykle 14–18 °n, czyli jest twarda. Wartości w innych miastach Podkarpacia wahają się od 9 °n w Sanoku do 19 °n w Przemyślu. Powyżej 12 °n kamień zaczyna realnie skracać żywotność bojlerów, zmywarek i pralek.",
  },
  {
    q: "Ile kosztuje zmiękczacz wody z montażem?",
    a: "Stacja zmiękczająca dla domu jednorodzinnego to koszt 3 500–6 500 zł z montażem, zależnie od pojemności złoża i twardości wody na danym ujęciu. Wycenę przygotowujemy po bezpłatnym pomiarze u klienta.",
  },
  {
    q: "Czy zmiękczona woda jest zdrowa do picia?",
    a: "Zmiękczacz jonowymienny zamienia wapń i magnez na sód — woda jest bezpieczna do mycia, prania i AGD, ale do picia rekomendujemy filtr odwróconej osmozy z mineralizacją. W jednym domu często montujemy oba systemy.",
  },
  {
    q: "Jak długo trwa montaż zmiękczacza?",
    a: "Standardowy montaż w domu jednorodzinnym to 2–4 godziny. Wymaga punktu wody zimnej za wodomierzem, odpływu do kanalizacji i gniazdka 230 V w pobliżu. Wszystkie podejścia możemy doprowadzić.",
  },
  {
    q: "Czym różni się odwrócona osmoza od filtra węglowego?",
    a: "Filtr węglowy łapie chlor i większe zanieczyszczenia, ale przepuszcza sole, metale ciężkie i pestycydy. Odwrócona osmoza (RO) usuwa do 99,9% rozpuszczonych substancji, a moduł mineralizacji przywraca wapń i magnez w bezpiecznych ilościach.",
  },
  {
    q: "Czy obsługujecie też mniejsze miejscowości na Podkarpaciu?",
    a: "Tak — z Rzeszowa dojeżdżamy do całego Podkarpacia: Krosno, Przemyśl, Mielec, Stalowa Wola, Dębica, Jarosław, Sanok i okoliczne gminy. Domy ze studniami głębinowymi też obsługujemy, często z dodatkowym odżelaziaczem.",
  },
  {
    q: "Jak często serwisuje się zmiękczacz wody?",
    a: "Sól regeneracyjną uzupełnia się co 1–3 miesiące. Serwis okresowy zalecamy raz w roku — obejmuje on dezynfekcję złoża, kontrolę elektroniki, regulację parametrów. Złoże jonowymienne wytrzymuje 8–10 lat.",
  },
  {
    q: "Czy montujecie filtry w mieszkaniach w bloku?",
    a: "Tak. Najpopularniejsze rozwiązanie w mieszkaniu to filtr RO pod zlew kuchenny z osobnym kranikiem na czystą wodę. Zmiękczacz w bloku rzadko ma sens — twarda woda jest problemem w domach jednorodzinnych z większym zużyciem.",
  },
];

export default function FaqSection() {
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
    <section className="relative px-6 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600">
          FAQ · Rzeszów i Podkarpacie
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-blue-950 md:text-4xl">
          Najczęstsze pytania o uzdatnianie wody
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          Praktyczne odpowiedzi na pytania, które słyszymy od klientów
          w Rzeszowie i okolicach — twarda woda, koszty, montaż, serwis.
        </p>

        <div className="mt-10 divide-y divide-sky-100 rounded-2xl border border-sky-100 bg-white/70 backdrop-blur-sm">
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
      </div>
    </section>
  );
}
