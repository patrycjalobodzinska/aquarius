import Link from "next/link";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-sky-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <Logo idSuffix="site-footer" />
          <p className="mt-3 text-sm text-slate-500">
            Czysta woda dla polskich domów.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-blue-950">Produkty</div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/produkty/filtry" className="hover:text-blue-700">
                Filtry wody
              </Link>
            </li>
            <li>
              <Link
                href="/produkty/zmiekczacze"
                className="hover:text-blue-700">
                Zmiękczacze
              </Link>
            </li>
            <li>
              <Link href="/produkty" className="hover:text-blue-700">
                Wszystkie produkty
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-blue-950">Strona</div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/#problemy" className="hover:text-blue-700">
                Problemy z wodą
              </Link>
            </li>
            <li>
              <Link href="/#zmiekczanie" className="hover:text-blue-700">
                Jak działa zmiękczanie
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-blue-700">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-blue-950">Kontakt</div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a
                href="mailto:januszlobodzinski.rzeszow70@gmail.com"
                className="hover:text-blue-700 break-all">
                januszlobodzinski.rzeszow70@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+48513001600" className="hover:text-blue-700">
                +48 513 001 600
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sky-50 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Aquarius — Wszystkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
