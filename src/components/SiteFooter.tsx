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
            <li>
              <Link href="/kontakt" className="hover:text-blue-700">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-blue-950">Pomoc</div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a href="#" className="hover:text-blue-700">
                Jak zamontować
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-700">
                Serwis
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-700">
                Gwarancja
              </a>
            </li>
            <li>
              <a href="#" id="faq" className="hover:text-blue-700">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-medium text-blue-950">Kontakt</div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <a
                href="mailto:kontakt@aquarius.pl"
                className="hover:text-blue-700">
                kontakt@aquarius.pl
              </a>
            </li>
            <li>
              <a href="tel:+48220000000" className="hover:text-blue-700">
                +48 22 000 00 00
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
