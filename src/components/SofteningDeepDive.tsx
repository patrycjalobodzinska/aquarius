"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SofteningDeepDive() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const arrowHeadRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    const setup = () => {
      const section = sectionRef.current;
      if (!section) return;

      // Jeśli sekcja jest już w viewporcie (np. user przeładował stronę na niej),
      // pomijamy ustawianie startowego opacity:0 - inaczej treść zostałaby
      // niewidoczna, bo toggleActions nie odpala onEnter retroaktywnie.
      const rect = section.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.8;

      const reveal = (
        el: HTMLElement | null,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
        start: string,
      ) => {
        if (!el) return;
        if (alreadyVisible) {
          gsap.set(el, { clearProps: "all" });
          return;
        }
        gsap.set(el, from);
        tweens.push(
          gsap.to(el, {
            ...to,
            scrollTrigger: {
              trigger: section,
              start,
              toggleActions: "play none none none",
            },
          }),
        );
      };

      reveal(
        headingRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out", duration: 1 },
        "top 80%",
      );
      reveal(
        numberRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, ease: "power3.out", duration: 1.4, delay: 0.15 },
        "top 80%",
      );
      reveal(
        textRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, ease: "power2.out", duration: 1, delay: 0.3 },
        "top 75%",
      );

      // Strzałka przy "70%" - rysuje się jak długopisem
      [arrowRef.current, arrowHeadRef.current].forEach((p, i) => {
        if (!p) return;
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        if (alreadyVisible) {
          p.style.strokeDashoffset = "0";
          return;
        }
        p.style.strokeDashoffset = `${len}`;
        tweens.push(
          gsap.to(p, {
            strokeDashoffset: 0,
            ease: "power2.inOut",
            duration: 0.8,
            delay: 0.6 + i * 0.15,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }),
        );
      });

      // Pen-underline pod kluczową frazą
      if (underlineRef.current) {
        const len = underlineRef.current.getTotalLength();
        underlineRef.current.style.strokeDasharray = `${len}`;
        if (alreadyVisible) {
          underlineRef.current.style.strokeDashoffset = "0";
        } else {
          underlineRef.current.style.strokeDashoffset = `${len}`;
          tweens.push(
            gsap.to(underlineRef.current, {
              strokeDashoffset: 0,
              ease: "power2.inOut",
              duration: 1.2,
              delay: 1,
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            }),
          );
        }
      }

      ScrollTrigger.refresh();
    };

    const t = setTimeout(setup, 400);
    return () => {
      clearTimeout(t);
      tweens.forEach((tw) => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    };
  }, []);

  // Niespokojne falowanie podkreślenia
  useEffect(() => {
    const el = underlineRef.current;
    if (!el) return;
    const wave = gsap.to(el, {
      y: 1.6,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      wave.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="zmiekczanie"
      className="relative w-full overflow-visible py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2
          ref={headingRef}
          className="lg:mb-16 mb-6 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight text-blue-950 md:text-7xl lg:text-[5.5rem]">
          Kamień zostaje
          <br />
          w&nbsp;czajniku.
        </h2>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-20">
          {/* LEWA - gigantyczne 70% z odręczną adnotacją */}
          <div ref={numberRef} className="relative">
            <div className="relative inline-block leading-none">
              <span className="block text-[10rem] font-semibold tracking-tighter text-blue-950 md:text-[18rem]">
                70
                <span className="text-blue-600">%</span>
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-4 left-2 right-2 h-2 rounded-full bg-gradient-to-r from-sky-200 via-sky-300 to-sky-100 opacity-70 blur-sm"
              />
            </div>

            <p className="mt-6 lg:mt-12 max-w-md text-base leading-relaxed text-slate-600">
              W&nbsp;Warszawie, Krakowie, Poznaniu, Wrocławiu i&nbsp;większości
              średnich miast woda przekracza <em>12°dH</em>. To poziom, przy
              którym kamień zaczyna osadzać się natychmiast.
            </p>
          </div>

          {/* PRAWA - editorial copy z pen-underline */}
          <div
            ref={textRef}
            className="will-change-[transform,opacity] lg:-mt-16">
            <p className="text-2xl leading-snug tracking-tight text-blue-950 md:text-3xl">
              Każdy litr zostawia w&nbsp;urządzeniach{" "}
              <span className="relative inline-block whitespace-nowrap">
                wapń i&nbsp;magnez
                <svg
                  className="pointer-events-none absolute -bottom-3 left-0 h-5 w-full"
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  fill="none"
                  style={{ overflow: "visible" }}
                  aria-hidden>
                  <path
                    ref={underlineRef}
                    d="M 3 9 Q 50 3, 100 8 T 200 7 T 297 9"
                    stroke="#2563eb"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      strokeDasharray: 9999,
                      strokeDashoffset: 9999,
                    }}
                  />
                </svg>
              </span>
              . Po roku to kilogram osadu - w&nbsp;pralce, ekspresie, bojlerze.
            </p>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-slate-600">
              Zmiękczacz nie&nbsp;zmienia smaku ani ciśnienia. Wymienia jony
              wapnia i&nbsp;magnezu na sód - przez to samo zjawisko wymiany
              jonowej, które wykorzystuje organizm człowieka.
            </p>

            {/* skutki - italiki z myślnikiem, w stylu „adnotacji" */}
            <ul className="mt-10 space-y-2 text-blue-900">
              <li className="text-base italic">
                - kamień w&nbsp;AGD i&nbsp;na grzałkach
              </li>
              <li className="text-base italic">
                - plamy na szkle, baterii, kabinie
              </li>
              <li className="text-base italic">- sucha skóra, matowe włosy</li>
              <li className="text-base italic">
                - 30–50% więcej proszku i&nbsp;mydła
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
