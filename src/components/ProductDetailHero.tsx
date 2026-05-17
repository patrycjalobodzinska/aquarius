"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { categories, formatPrice, type Product } from "@/lib/products";
import { productHeroViewTransitionName } from "@/lib/productViewTransition";

// Pojedynczy endpoint — wystarczy ustawić jedną zmienną. Każde zgłoszenie z
// formularza produktowego wysyła dodatkowe pola `product`/`category` (oraz
// `_subject` do Formspree), żeby zespół wiedział czego dotyczy.
const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
  "https://formspree.io/f/xzdwpnqr";

export default function ProductDetailHero({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const vt = productHeroViewTransitionName(product.slug);
  const categoryLabel = categories.find(
    (c) => c.slug === product.category,
  )?.label;

  useEffect(() => setMounted(true), []);

  // Po otwarciu — scroll do form-a, żeby user nie szukał gdzie wjechał.
  useEffect(() => {
    if (!formOpen) return;
    const t = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [formOpen]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!FORM_ENDPOINT) {
      // Tryb dev / brak skonfigurowanego endpointu — emulujemy sukces.
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
    <div>
      <nav className="mb-10 text-sm text-slate-500">
        <Link href="/" className="transition hover:text-blue-700">
          Strona główna
        </Link>
        <span className="mx-2">/</span>
        <Link href="/produkty" className="transition hover:text-blue-700">
          Produkty
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
        {/* LEFT — gallery */}
        <div className="flex flex-col gap-5 lg:flex-row-reverse lg:items-stretch">
          <div className="relative flex-1">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white/70 ring-1 ring-sky-100"
              style={
                mounted
                  ? ({ viewTransitionName: vt } as CSSProperties & {
                      viewTransitionName?: string;
                    })
                  : undefined
              }>
              <Image
                src={product.images[active]}
                alt={product.name}
                fill
                priority
                sizes="(min-width:1024px) 48vw, 100vw"
                className="object-contain p-10 md:p-16"
              />
            </div>
            {product.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-blue-950 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex flex-row gap-3 overflow-x-auto p-1 lg:w-24 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Miniatura ${i + 1}`}
                  className={`relative aspect-square w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-white transition lg:w-full ${
                    i === active
                      ? "border-2 border-blue-700"
                      : "border-2 border-sky-100 hover:border-sky-300"
                  }`}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — copy + price + CTA */}
        <div className="flex flex-col gap-7">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
            {categoryLabel}
          </div>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-5xl lg:text-6xl">
            {product.name}
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-slate-600">
            {product.short}
          </p>

          <div className="mt-2 flex items-baseline gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Cena
            </div>
            <div className="text-4xl font-semibold tracking-tight text-blue-950 md:text-5xl">
              {formatPrice(product.price)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            aria-expanded={formOpen}
            className="group mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-blue-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto">
            {formOpen ? "Zamknij zapytanie" : "Zapytaj o ten produkt"}
            <span
              className={`grid h-7 w-7 place-items-center rounded-full bg-white/15 transition ${
                formOpen ? "rotate-45" : "group-hover:translate-x-0.5"
              }`}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                {formOpen ? (
                  <path d="M19 13H5v-2h14v2z" />
                ) : (
                  <path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z" />
                )}
              </svg>
            </span>
          </button>

          {product.highlights.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-sky-100 pt-8 sm:grid-cols-2">
              {product.highlights.slice(0, 6).map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* INLINE FORM — rozwija się płynnie pod hero, scrollnięcie do widoku
          po otwarciu. Animacja przez grid-template-rows: 0fr → 1fr (czysty
          CSS, bez JS height-math). */}
      <div
        ref={formRef}
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: formOpen ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div
            className={`mt-12 transition-all duration-500 ${
              formOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}>
            {sent ? (
              <div className="rounded-3xl border border-sky-100 bg-white/80 p-10 shadow-sm backdrop-blur-sm">
                <h3 className="text-2xl font-semibold text-blue-950">
                  Dziękujemy — odezwiemy się w sprawie{" "}
                  <span className="text-blue-700">{product.name}</span>.
                </h3>
                <p className="mt-3 text-base text-slate-600">
                  Zgłoszenie trafiło do zespołu doradców. Skontaktujemy się do
                  końca dnia roboczego.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur-sm md:p-10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700">
                  Zapytanie o produkt
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-blue-950 md:text-3xl">
                  Chcę wiedzieć więcej o{" "}
                  <span className="italic text-blue-700">{product.name}</span>
                </h3>

                {/* Meta-pola: trafiają do Formspree razem z wiadomością.
                    Dzięki nim wszystkie maile lecą na jeden endpoint, ale
                    zespół widzi którego produktu dotyczy zapytanie. */}
                <input type="hidden" name="product" value={product.name} />
                <input
                  type="hidden"
                  name="product_slug"
                  value={product.slug}
                />
                <input
                  type="hidden"
                  name="category"
                  value={product.category}
                />
                <input
                  type="hidden"
                  name="_subject"
                  value={`Zapytanie: ${product.name}`}
                />

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                    placeholder={`Np. jestem zainteresowany montażem ${product.name} w domu jednorodzinnym…`}
                  />
                </div>

                <label className="mt-5 flex items-start gap-3 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-sky-300 text-blue-700 focus:ring-blue-200"
                  />
                  <span className="leading-relaxed">
                    Zgadzam się na kontakt telefoniczny i mailowy w sprawie
                    zapytania.
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
                  {submitting ? "Wysyłanie…" : "Wyślij zapytanie"}
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
      </div>
    </div>
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
        {hint && (
          <span className="font-normal text-slate-400">({hint})</span>
        )}
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
