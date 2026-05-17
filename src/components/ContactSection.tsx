"use client";

import Image from "next/image";
import { useState } from "react";

const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
  "https://formspree.io/f/xzdwpnqr";

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!FORM_ENDPOINT) {
      // Brak endpointu — emulujemy sukces (dev).
      setSubmitting(true);
      window.setTimeout(() => {
        setSubmitting(false);
        setSent(true);
      }, 400);
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się wysłać wiadomości. Spróbuj jeszcze raz.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="kontakt"
      className="relative scroll-mt-32 overflow-hidden px-6 py-24 md:py-28">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEWA — eyebrow + nagłówek + opis + szklanka na bublu */}
        <div className="relative">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
            Kontakt
          </div>

          <h2 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-6xl">
            Porozmawiajmy{" "}
            <span className="italic font-medium text-blue-700">
              o&nbsp;wodzie
            </span>
            .
          </h2>

          {/* Szklanka + nieregularny bubble. Bubble wystaje w prawo, wchodząc
              wizualnie pod formularz. Szklanka mocno wysunięta w górę
              (top-[-12%]) — dodatkowo wchodzi nad nagłówek. */}
          <div
            aria-hidden
            className="relative -mt-24 -mb-20 lg:-mb-0 lg:-mt-0 h-[460px] w-full md:h-[560px] lg:h-[640px]">
            {/* SVG-blob — rozciągnięty poza prawą krawędź kolumny (right:-40%
                na lg), żeby zachodził na obszar formularza. */}
            <svg
              viewBox="0 0 200 200"
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-none absolute top-36 lg:top-10 bottom-0 -left-[10%] h-full w-auto lg:-left-[20%]"
              xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="bubble-blob" cx="42%" cy="38%" r="62%">
                  <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                  <stop offset="25%" stopColor="rgba(186,230,253,0.95)" />
                  <stop offset="60%" stopColor="rgba(125,211,252,0.8)" />
                  <stop offset="100%" stopColor="rgba(56,189,248,0.45)" />
                </radialGradient>
              </defs>
              <path
                fill="url(#bubble-blob)"
                d="M39.6,-60.1C54.2,-52.2,71,-46.1,76.6,-34.8C82.2,-23.4,76.5,-6.6,72.3,9.2C68.1,24.9,65.5,39.7,57.9,52.5C50.4,65.4,38,76.3,24.2,78.5C10.5,80.8,-4.7,74.3,-20.1,69.4C-35.5,64.5,-51.2,61.2,-61.4,51.8C-71.7,42.5,-76.6,27.1,-79.9,10.8C-83.3,-5.4,-85.2,-22.6,-79.9,-37.5C-74.6,-52.3,-62.2,-64.9,-47.7,-72.8C-33.2,-80.8,-16.6,-84.2,-2.1,-80.9C12.5,-77.7,24.9,-68,39.6,-60.1Z"
                transform="translate(100 100)"
              />
            </svg>

            {/* Szklanka z wodą — wysunięta wyraźnie w górę (top-[-10%]) */}
            <div className="absolute left-0 right-0  flex justify-center">
              <div className="relative h-[520px] w-[78%] md:h-[600px]">
                <Image
                  src="/water-glass.webp"
                  alt=""
                  fill
                  sizes="(min-width:1024px) 35vw, 80vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRAWA — formularz */}
        <div className="lg:pt-2">
          {sent ? (
            <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur-sm md:p-10">
              <h3 className="text-2xl font-semibold text-blue-950">
                Dziękujemy — odezwiemy się do&nbsp;końca dnia roboczego.
              </h3>
              <p className="mt-3 text-base text-slate-600">
                Zgłoszenie trafiło do zespołu doradców.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur-sm md:p-10">
              {/* Meta-pola: zapytanie ogólne ze strony głównej. Endpoint
                  jest wspólny dla wszystkich formularzy — `category`
                  pozwala odróżnić to zgłoszenie od zapytań produktowych. */}
              <input type="hidden" name="category" value="general" />
              <input
                type="hidden"
                name="_subject"
                value="Nowe zapytanie ze strony głównej"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Imię i nazwisko"
                  name="name"
                  required
                  placeholder="Jan Kowalski"
                />
                <Field
                  label="Telefon"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+48 600 000 000"
                />
                <Field
                  label="E-mail"
                  name="email"
                  type="email"
                  placeholder="jan@kowalski.pl"
                />
                <Field
                  label="Miejscowość"
                  name="city"
                  placeholder="Warszawa, Mokotów"
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Wiadomość"
                  hint="opcjonalnie"
                  name="message"
                  textarea
                  placeholder="Np. mam dom 200 m², woda ze studni, dużo kamienia w czajniku…"
                />
              </div>

              <label className="mt-5 flex items-start gap-3 text-xs text-slate-500">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-sky-300 text-blue-700 focus:ring-blue-200"
                />
                <span className="leading-relaxed">
                  Zgadzam się na kontakt telefoniczny i&nbsp;mailowy
                  w&nbsp;sprawie zapytania.
                </span>
              </label>

              {error && (
                <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-blue-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60 sm:w-auto">
                {submitting ? "Wysyłanie…" : "Wyślij wiadomość"}
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition group-hover:translate-x-0.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="currentColor">
                    <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z" />
                  </svg>
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
}: {
  label: string;
  hint?: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}) {
  const inputCls =
    "mt-2 block w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-base text-blue-950 placeholder:text-slate-400 transition focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200";
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-medium text-blue-950">
        {label}
        {required && <span className="text-rose-500">*</span>}
        {hint && <span className="font-normal text-slate-400">({hint})</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={4}
          className={`${inputCls} resize-y`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </label>
  );
}
