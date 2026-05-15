const tracks = [
  {
    eyebrow: "Filtracja",
    title: "Co pijesz z kranu?",
    intro:
      "Polska woda spełnia normy, ale „spełnia normy” nie znaczy „idealna do picia”. Po drodze rurami zbiera chlor, metale i mikroplastik.",
    items: [
      "Chlor i podchloryny - wpływ na smak i mikroflorę jelitową",
      "Metale ciężkie - ołów, miedź i nikiel ze starych instalacji",
      "Mikroplastik - wykryty w 80% próbek wody w UE",
      "Pestycydy i herbicydy - szczególnie w ujęciach studziennych",
    ],
    footer: "Filtr RO usuwa do 99,9% rozpuszczonych zanieczyszczeń.",
    accent: "from-sky-500/15 via-white to-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 2C9 6 5 11 5 15a7 7 0 0 0 14 0c0-4-4-9-7-13z" />
      </svg>
    ),
  },
  {
    eyebrow: "Zmiękczanie",
    title: "Co zostaje w czajniku?",
    intro:
      "Twarda woda to sole wapnia i magnezu - 70% Polski ma wodę powyżej 12°dH. Skutki widać każdego dnia, ale rzadko łączymy je z wodą.",
    items: [
      "Kamień w czajniku, ekspresie, pralce i zmywarce - krótsza żywotność",
      "Plamy na szkle, baterii i kabinie prysznicowej",
      "Sucha skóra, matowe włosy, więcej kremów i odżywek",
      "30–50% większe zużycie detergentów i mydła",
    ],
    footer: "Zmiękczacz redukuje twardość z 25°dH nawet do 0°dH.",
    accent: "from-blue-500/15 via-white to-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M7 4h10v2H7zm-1 4h12l-1 12H7zm3 3v7h2v-7zm4 0v7h2v-7z" />
      </svg>
    ),
  },
];

export default function TwoTracksSection() {
  return (
    <section id="problemy" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-700">
            Dwa problemy
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
            Z polską wodą zwykle są dwie sprawy
          </h2>
          <p className="mt-4 text-slate-600">
            Większość domów, które obsługujemy, potrzebuje rozwiązania na obie.
            Najpierw warto wiedzieć, z czym dokładnie ma się do czynienia.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-10">
          {tracks.map((t) => (
            <article
              key={t.eyebrow}
              className={`relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br ${t.accent} p-8 shadow-sm md:p-10`}>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-md ring-1 ring-sky-100">
                {t.icon}
              </div>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                {t.eyebrow}
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 md:text-3xl">
                {t.title}
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{t.intro}</p>

              <ul className="mt-6 grid gap-3">
                {t.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl bg-white/70 p-4 text-sm font-medium text-blue-950 ring-1 ring-sky-100 backdrop-blur-sm">
                {t.footer}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
