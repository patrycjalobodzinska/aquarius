const steps = [
  {
    n: "01",
    title: "Bezpłatny pomiar u Ciebie",
    text: "Przyjeżdżamy w dogodnym terminie, robimy pełny test wody (twardość, chlor, TDS, pH) i oglądamy instalację. Bez zobowiązań, bez sprzedaży na siłę.",
    duration: "30–45 min",
  },
  {
    n: "02",
    title: "Indywidualna propozycja",
    text: "Na podstawie wyników i Twoich potrzeb dobieramy konkretne urządzenia - filtr, zmiękczacz albo zestaw. Pokazujemy 2–3 warianty z wyceną.",
    duration: "do 2 dni",
  },
  {
    n: "03",
    title: "Profesjonalny montaż",
    text: "Nasi instalatorzy montują urządzenie w 1–3 godziny. Bez kucia, bez bałaganu. Po montażu sprawdzamy parametry wody i szkolimy Cię z obsługi.",
    duration: "1–3 h",
  },
  {
    n: "04",
    title: "Opieka serwisowa",
    text: "Pamiętamy o terminach wymiany wkładów i dezynfekcji. Wsparcie telefoniczne 7 dni w tygodniu, serwis w ciągu 48 h. Gwarancja na sprzęt 24–36 miesięcy.",
    duration: "stale",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="proces"
      className="relative bg-gradient-to-b from-white to-sky-50/80 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-700">
            Jak pracujemy
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
            Od pomiaru do pierwszej szklanki - 4 kroki
          </h2>
          <p className="mt-4 text-slate-600">
            Nie sprzedajemy urządzeń z półki. Doradzamy, mierzymy i instalujemy
            - tak żeby rozwiązanie pasowało do Twojej wody, instalacji i
            oczekiwań.
          </p>
        </div>

        <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="relative flex flex-col rounded-2xl border border-sky-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold tracking-tight text-blue-700">
                  {s.n}
                </span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-sky-700">
                  {s.duration}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-blue-950">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {s.text}
              </p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 text-sky-300 lg:block">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="currentColor">
                    <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center text-sm text-slate-500">
          Nie czekaj z decyzją -{" "}
          <a
            href="#kontakt"
            className="font-medium text-blue-700 hover:underline">
            umów bezpłatny pomiar
          </a>{" "}
          i porozmawiajmy o Twojej wodzie.
        </div>
      </div>
    </section>
  );
}
