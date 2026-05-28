"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "/produkty/filtry", label: "Filtry" },
  { href: "/produkty/zmiekczacze", label: "Zmiękczacze" },
  { href: "/produkty", label: "Wszystkie produkty" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b border-sky-100/60 bg-white/85"
      style={{ willChange: "transform", transform: "translateZ(0)" }}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Aquarius — strona główna"
          onClick={() => setOpen(false)}>
          <Logo idSuffix="site-header" />
        </Link>

        <div className="hidden gap-7 text-sm text-slate-700 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-blue-700">
              {l.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="relative grid h-10 w-10 place-items-center rounded-full text-blue-950 transition hover:bg-white/60 md:hidden">
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`md:hidden grid overflow-hidden border-t border-sky-100/60 bg-white transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}>
        <div className="overflow-hidden">
          <ul className="flex flex-col px-6 py-3 text-base text-slate-800">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-sky-100/70 py-3 last:border-b-0 hover:text-blue-700">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
