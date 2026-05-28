"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BEFORE_1 = "/IMG_4226.PNG";
const BEFORE_2 = "/IMG_4227.PNG";
const AFTER_1 = "/IMG_4228.PNG";
const AFTER_2 = "/IMG_4229.PNG";

export default function BeforeAfterArc() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const before1Ref = useRef<HTMLDivElement>(null);
  const before2Ref = useRef<HTMLDivElement>(null);
  const after1Ref = useRef<HTMLDivElement>(null);
  const after2Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile: brak sticky-transferu, dwa bloki BEFORE/AFTER stoją obok siebie
    // w naturalnym flow. GSAP timeline odpalamy tylko na md+.
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;

    let tl: gsap.core.Timeline | null = null;

    const setup = () => {
      const section = sectionRef.current;
      const b1 = before1Ref.current;
      const b2 = before2Ref.current;
      const a1 = after1Ref.current;
      const a2 = after2Ref.current;
      const t1 = text1Ref.current;
      const t2 = text2Ref.current;
      if (!section || !b1 || !b2 || !a1 || !a2 || !t1 || !t2) return;

      const restLeft = { x: 0, y: 130, rotation: 7 };
      const restRight = { x: 0, y: 50, rotation: -7 };
      // AFTER ląduje niżej niż BEFORE - żeby wizualnie nie nakładało się idealnie.
      const afterRestLeft = { x: 0, y: 200, rotation: 7 };
      const afterRestRight = { x: 0, y: 120, rotation: -7 };

      gsap.set(b1, { x: -700, y: -120, rotation: -18, opacity: 1 });
      gsap.set(b2, { x: -750, y: -170, rotation: -25, opacity: 1 });
      gsap.set(a1, { x: 0, y: -3000, rotation: 7, opacity: 1 });
      gsap.set(a2, { x: 0, y: -3000, rotation: -7, opacity: 1 });
      gsap.set(t1, { opacity: 0, x: 40 });
      gsap.set(t2, { opacity: 0, x: 40 });

      // Pille - start ukryte, wjeżdżają od dołu z lekkim staggerem.
      const pills = pillsRef.current
        ? (Array.from(pillsRef.current.children) as HTMLElement[])
        : [];
      pills.forEach((p) => gsap.set(p, { opacity: 0, y: 30, scale: 0.85 }));

      // Sticky stage - natywny browser sticky trzyma stage przyklejony do
      // top:0 podczas gdy section (h-[420vh]) przewija się normalnie. Brak
      // pinu = brak skoku-wpięcia. Lenis traktuje to jak zwykły scroll.
      // Timeline sterowany progressem section od 0 do 1 (cały scroll-rynek).
      // Trigger startuje już gdy section pojawia się od dołu viewportu
      // ("top bottom"), kończy gdy section znika u góry ("bottom bottom").
      // Dzięki temu BEFORE zaczynają wjeżdżać podczas wjazdu sekcji w viewport,
      // zanim sticky-stage przyklei się do góry - animacja jest "od zaraz".
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // Section 280vh + viewport 100vh = 380vh trigger range.
      // Sticky engaguje przy progress ≈ 0.26 (gdy section.top dotrze do top
      // viewportu). Po transferze sticky trzyma jeszcze ~150vh scrolla, żeby
      // użytkownik mógł zobaczyć AFTER, zanim sekcja odpuści.

      // 0 → 0.18: WJAZD BEFORE z lewej (podczas wjazdu section w viewport).
      tl.to(b1, { ...restLeft, ease: "power2.out", duration: 0.18 }, 0);
      tl.to(b2, { ...restRight, ease: "power2.out", duration: 0.18 }, 0.02);

      // 0.12 → 0.25: TEKST 1 fade-in.
      tl.to(t1, { opacity: 1, x: 0, ease: "power2.out", duration: 0.13 }, 0.12);

      // 0.3 → 0.55: TRANSFER - ~25% progressu × 380vh ≈ 95vh = jeden scroll.
      tl.to(
        b1,
        {
          y: 5000,
          rotation: 35,
          opacity: 0,
          ease: "power2.in",
          duration: 0.25,
        },
        0.3,
      );
      tl.to(
        b2,
        {
          y: 5000,
          rotation: -35,
          opacity: 0,
          ease: "power2.in",
          duration: 0.25,
        },
        0.32,
      );
      tl.to(a1, { ...afterRestLeft, ease: "power2.out", duration: 0.25 }, 0.3);
      tl.to(
        a2,
        { ...afterRestRight, ease: "power2.out", duration: 0.25 },
        0.32,
      );
      // TEKST 1 znika pierwszy, TEKST 2 wjeżdża dopiero po jego pełnym fade-out.
      tl.to(t1, { opacity: 0, x: 30, ease: "power2.in", duration: 0.15 }, 0.3);
      tl.to(t2, { opacity: 1, x: 0, ease: "power2.out", duration: 0.15 }, 0.48);

      // 0.6 → 0.9: PILLE - pojawiają się jedna po drugiej w trakcie kolejnego
      // scrolla po transferze. Każda pill startuje 0.04 progressu po poprzedniej.
      pills.forEach((p, i) => {
        tl!.to(
          p,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "back.out(1.6)",
            duration: 0.12,
          },
          0.6 + i * 0.04,
        );
      });

      // 0.9 → 1.0: HOLD końcowy - wszystko widoczne, sticky dalej trzyma chwilę.

      ScrollTrigger.refresh();
    };

    const t = setTimeout(setup, 400);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full md:h-[280vh]">
      {/* MOBILE: dwa bloki stack-em, bez sticky/transferu. */}
      <div className="flex flex-col gap-12 px-6 py-12 md:hidden">
        <div>
          <div className="mb-3 inline-block rounded-full bg-blue-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
            Teraz
          </div>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-blue-950">
            Tyle plastiku
            <br />
            zostaje w domu.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            1 440 butelek rocznie, ~3 800 zł kaucji, kilometry tragania z
            marketu. Chlor, mikroplastik, wirusy.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/30">
              <Image
                src={BEFORE_1}
                alt="Kuchnia z butelkami"
                fill
                sizes="45vw"
                className="object-cover"
                style={{ filter: "grayscale(1) brightness(0.85) contrast(0.95)" }}
              />
            </div>
            <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/30">
              <Image
                src={BEFORE_2}
                alt="Woda z wirusami"
                fill
                sizes="45vw"
                className="object-cover"
                style={{ filter: "grayscale(1) brightness(0.85) contrast(0.95)" }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 inline-block rounded-full bg-blue-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
            Z filtrem
          </div>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-blue-950">
            Jedno urządzenie.
            <br />
            Zero butelek.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Pięciostopniowa filtracja, woda wzbogacona minerałami, pH 7.2–7.8 -
            prosto z kranu, bez plastiku i bez kaucji.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/30">
              <Image
                src={AFTER_1}
                alt="Czysta kuchnia"
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] w-1/2 overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/30">
              <Image
                src={AFTER_2}
                alt="Czysta woda z minerałami"
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { label: "Bez plastiku", color: "bg-blue-700" },
              { label: "5 stopni filtracji", color: "bg-blue-950" },
              { label: "pH 7.2 – 7.8", color: "bg-sky-600" },
              { label: "Mineralizacja", color: "bg-blue-700" },
              { label: "Bez kaucji", color: "bg-blue-950" },
              { label: "99.9% czystości", color: "bg-sky-600" },
            ].map((pill) => (
              <span
                key={pill.label}
                className={`${pill.color} inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm`}>
                <span className="h-1 w-1 rounded-full bg-white/80" />
                {pill.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP: sticky-stage z transferem BEFORE→AFTER. */}
      <div
        ref={stageRef}
        className="sticky top-0 hidden h-screen w-full overflow-hidden md:block">
        {/* BEFORE + AFTER po lewej, te same rest-pozycje. */}
        <div className="absolute left-0 top-[58%] z-0 flex -translate-y-1/2 items-center gap-3 px-4 md:left-0 md:top-[36%] md:gap-6 md:pl-20 md:pr-0 lg:pl-28">
          <div
            ref={before1Ref}
            className="relative aspect-[3/4] h-[36vh] w-auto overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/40 will-change-transform md:aspect-auto md:h-[64vh] md:w-[22vw] md:min-w-[200px] md:max-w-[320px] md:rounded-3xl md:border-[6px] md:shadow-2xl">
            <Image
              src={BEFORE_1}
              alt="Kuchnia z butelkami"
              fill
              sizes="(min-width: 1024px) 22vw, 320px"
              className="object-cover"
              style={{ filter: "grayscale(1) brightness(0.85) contrast(0.95)" }}
            />
          </div>
          <div
            ref={before2Ref}
            className="relative aspect-[3/4] h-[36vh] w-auto overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/40 will-change-transform md:aspect-auto md:h-[64vh] md:w-[22vw] md:min-w-[200px] md:max-w-[320px] md:rounded-3xl md:border-[6px] md:shadow-2xl">
            <Image
              src={BEFORE_2}
              alt="Woda z wirusami"
              fill
              sizes="(min-width: 1024px) 22vw, 320px"
              className="object-cover"
              style={{ filter: "grayscale(1) brightness(0.85) contrast(0.95)" }}
            />
          </div>
        </div>

        <div className="absolute left-0 top-[58%] z-0 flex -translate-y-1/2 items-center gap-3 px-4 md:left-0 md:top-[36%] md:gap-6 md:pl-20 md:pr-0 lg:pl-28">
          <div
            ref={after1Ref}
            className="relative aspect-[3/4] h-[36vh] w-auto overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/30 will-change-transform md:aspect-auto md:h-[64vh] md:w-[22vw] md:min-w-[200px] md:max-w-[320px] md:rounded-3xl md:border-[6px] md:shadow-2xl">
            <Image
              src={AFTER_1}
              alt="Czysta kuchnia"
              fill
              sizes="(min-width: 1024px) 22vw, 320px"
              className="object-cover"
            />
          </div>
          <div
            ref={after2Ref}
            className="relative aspect-[3/4] h-[36vh] w-auto overflow-hidden rounded-2xl border-[4px] border-white shadow-xl shadow-blue-950/30 will-change-transform md:aspect-auto md:h-[64vh] md:w-[22vw] md:min-w-[200px] md:max-w-[320px] md:rounded-3xl md:border-[6px] md:shadow-2xl">
            <Image
              src={AFTER_2}
              alt="Czysta woda z minerałami"
              fill
              sizes="(min-width: 1024px) 22vw, 320px"
              className="object-cover"
            />
          </div>
        </div>

        <div
          ref={text1Ref}
          className="pointer-events-none absolute left-1/2 top-[18%] z-10 w-[90vw] max-w-sm -translate-x-1/2 px-4 text-center will-change-[transform,opacity] md:left-auto md:right-[8%] md:top-[36%] md:w-auto md:max-w-md md:-translate-x-0 md:-translate-y-1/2 md:px-0 md:text-left">
          <div className="mb-3 inline-block rounded-full bg-blue-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
            Teraz
          </div>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-blue-950 sm:text-3xl md:text-4xl">
            Tyle plastiku
            <br />
            zostaje w domu.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            1 440 butelek rocznie, ~3 800 zł kaucji, kilometry tragania
            z&nbsp;marketu. Do tego chlor, mikroplastik i pozostałości
            farmaceutyków w&nbsp;kranówce.
          </p>

          {/* Pille: co jest w wodzie z kranu / butelek */}
          <div className="mt-5 flex flex-wrap gap-2 md:justify-start justify-center">
            {["Chlor", "Mikroplastik", "Twarda woda", "Kamień", "Wirusy"].map(
              (t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  {t}
                </span>
              ),
            )}
          </div>

          {/* Trzy twarde liczby: butelki / koszt / plastik */}
          <div className="mt-5 grid grid-cols-3 gap-3 text-center md:text-left">
            {[
              { v: "1 440", l: "butelek / rok" },
              { v: "3 800 zł", l: "kosztu / rok" },
              { v: "12 kg", l: "plastiku / rok" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                <div className="text-base font-semibold text-blue-950 md:text-lg">
                  {s.v}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={text2Ref}
          className="pointer-events-none absolute left-1/2 top-[18%] z-10 w-[90vw] max-w-sm -translate-x-1/2 px-4 text-center will-change-[transform,opacity] md:left-auto md:right-[8%] md:top-[36%] md:w-auto md:max-w-md md:-translate-x-0 md:-translate-y-1/2 md:px-0 md:text-left">
          <div className="mb-3 inline-block rounded-full bg-blue-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
            Z filtrem
          </div>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-blue-950 sm:text-3xl md:text-4xl">
            Jedno urządzenie.
            <br />
            Zero butelek.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Pięciostopniowa filtracja, woda wzbogacona minerałami, pH 7,2–7,8 —
            prosto z&nbsp;kranu, bez plastiku i&nbsp;bez kaucji.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 md:justify-start justify-center">
            {[
              "5 stopni filtracji",
              "Mineralizacja",
              "pH 7,2 – 7,8",
              "Bez kaucji",
              "Bez plastiku",
            ].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-800">
                <span className="h-1 w-1 rounded-full bg-blue-600" />
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center md:text-left">
            {[
              { v: "99,9%", l: "mniej zanieczyszczeń" },
              { v: "0 kg", l: "plastiku / rok" },
              { v: "~2 lata", l: "membrana RO" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-sky-200 bg-white/80 px-3 py-2">
                <div className="text-base font-semibold text-blue-950 md:text-lg">
                  {s.v}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PILLE - pojawiają się staggerem przy kolejnym scrollu po transferze. */}
        <div
          ref={pillsRef}
          className="pointer-events-none absolute bottom-[10%] left-1/2 z-10 flex w-full max-w-3xl -translate-x-1/2 flex-wrap items-center justify-center gap-3 px-6">
          {[
            { label: "Bez plastiku", color: "bg-blue-700" },
            { label: "5 stopni filtracji", color: "bg-blue-950" },
            { label: "pH 7.2 – 7.8", color: "bg-sky-600" },
            { label: "Mineralizacja", color: "bg-blue-700" },
            { label: "Bez kaucji", color: "bg-blue-950" },
            { label: "99.9% czystości", color: "bg-sky-600" },
          ].map((pill) => (
            <span
              key={pill.label}
              className={`${pill.color} inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-blue-950/20 will-change-[transform,opacity]`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              {pill.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
