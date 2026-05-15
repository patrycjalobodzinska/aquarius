"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Wspólny setup smooth-scrolla i wszystkich GSAP ScrollTriggerów.
 * Lenis drive'uje scroll, a ScrollTrigger aktualizuje się przez Lenis event.
 *
 * Elementy w Landing dostają atrybuty:
 *   data-reveal                - slide up + fade in
 *   data-reveal-x="left"       - slide z lewej, fade in
 *   data-reveal-x="right"      - slide z prawej, fade in
 *   data-stagger               - kontener, którego dzieci data-stagger-item lecą w sekwencji
 *   data-parallax="0.3"        - translacja Y z scrubem (wartość = szybkość)
 *   data-hero-title            - entry animation titla na mount (kaskadowy reveal)
 *   data-fade                  - proste opacity fade in
 */
export default function PageAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const triggers: ScrollTrigger[] = [];

    // --- HERO PIN: sekcja [data-hero-pin] stoi przypięta przez 100vh scrolla.
    //     pinSpacing:true dodaje 100vh „virtual" scrolla pod sekcją - kamera w HeroScene
    //     (czyta window.scrollY / innerHeight) zjeżdża w kroplę, a tekst się rozpływa.
    //     Po zakończeniu pinu następna sekcja pojawia się natychmiast, bez luki.
    gsap.utils.toArray<HTMLElement>("[data-hero-pin]").forEach((el) => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=100%",
        pin: true,
        // pinSpacing:true (default) - stabilne z Lenis. Layout nie dostaje
        // żadnych chwilowych „fixed" artefaktów po release. 100vh „luki" pod
        // pinowaną sekcją i tak jest wypełnione jednolitym gradientem outer
        // wrappera, więc wizualnie tło płynie.
        anticipatePin: 1,
      });
      triggers.push(st);
    });

    // --- REVEAL TOP-LEFT: zjazd z góry ekranu (lewy górny róg) ---
    gsap.utils.toArray<HTMLElement>("[data-reveal-tl]").forEach((el) => {
      gsap.set(el, { x: -200, y: "-90vh", opacity: 0 });
      const tl = gsap.to(el, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true,
        },
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    // --- HERO TITLE: per-linijkowy reveal na mount ---
    gsap.utils.toArray<HTMLElement>("[data-hero-title]").forEach((el) => {
      const lines = el.querySelectorAll("[data-hero-line]");
      if (lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.12,
            delay: 0.15,
          },
        );
      } else {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.3, ease: "power4.out", delay: 0.15 },
        );
      }
    });

    // --- DROP-IN PIN: sekcja z atrybutem [data-dropin] przypina się pod
    //     headerem, a jej dzieci [data-dropin-item] lecą kolejno z samej góry
    //     ekranu (zza headera) w dół do docelowej pozycji. Scrub - scroll napędza
    //     timeline 1:1, więc dla użytkownika scroll jest „zablokowany" dopóki
    //     wszystkie elementy nie wylądują.
    gsap.utils.toArray<HTMLElement>("[data-dropin]").forEach((section) => {
      const rawItems =
        section.querySelectorAll<HTMLElement>("[data-dropin-item]");
      if (!rawItems.length) return;

      // Sortujemy od najniżej położonego na stronie - dolny element wjeżdża
      // PIERWSZY, kolejne „dojeżdżają" w górę.
      const items = [...rawItems].sort(
        (a, b) => b.offsetTop + b.offsetHeight - (a.offsetTop + a.offsetHeight),
      );

      // Startowe pozycje „kaskadowo": pierwsze itemy LECĄ Z WYŻEJ i dalej,
      // ostatnie tuż-tuż nad pozycją docelową - daje efekt że pierwsze „lecą
      // dłużej", a reszta je dogania.
      const vh = window.innerHeight;
      items.forEach((item, i) => {
        const startY = -(vh * 1.1) + i * 80;
        gsap.set(item, { y: startY, opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Dłuższy pin - scroll zablokowany aż WSZYSTKIE elementy dojadą.
          end: () => `+=${Math.max(items.length * 40, 160)}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Każdy item ma WŁASNY start + własny czas trwania:
      //   pierwsze startują wcześnie, trwają długo (wolniej opadają),
      //   ostatnie startują późno, ale trwają krótko (doganiają).
      items.forEach((item, i) => {
        const start = i * 0.4;
        const duration = Math.max(0.8, 2.2 - i * 0.18);
        tl.to(
          item,
          {
            y: 0,
            opacity: 1,
            duration,
            ease: "power2.out",
          },
          start,
        );
      });
    });

    // --- REVEAL (spada z SAMEJ GÓRY EKRANU - „odwrócony scroll") ---
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.set(el, { y: "-90vh", opacity: 0 });
      const tl = gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    // --- REVEAL X (slide z boku) ---
    gsap.utils.toArray<HTMLElement>("[data-reveal-x]").forEach((el) => {
      const dir = el.dataset.revealX === "right" ? 1 : -1;
      gsap.set(el, { x: 80 * dir, opacity: 0 });
      const tl = gsap.to(el, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    // --- STAGGER (dzieci [data-stagger-item] spadają z samej góry ekranu) ---
    gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((container) => {
      const items = container.querySelectorAll<HTMLElement>(
        "[data-stagger-item]",
      );
      if (!items.length) return;
      gsap.set(items, { y: "-90vh", opacity: 0 });
      const tl = gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: container,
          start: "top 90%",
          once: true,
        },
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    // --- FADE (tylko opacity) ---
    gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
      gsap.set(el, { opacity: 0 });
      const tl = gsap.to(el, {
        opacity: 1,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    // --- PARALLAX (scrub-translacja Y) ---
    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || "0.3");
      const tl = gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    // Refresh po wszystkich obrazkach/fontach - unika rozjazdów pozycji triggerów.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tickerCb);
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  return null;
}
