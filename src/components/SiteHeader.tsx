import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/30 bg-white/40 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Aquarius — strona główna">
          <Logo idSuffix="site-header" />
        </Link>
        <div className="hidden gap-7 text-sm text-slate-700 md:flex">
          <Link href="/produkty/filtry" className="hover:text-blue-700">
            Filtry
          </Link>
          <Link href="/produkty/zmiekczacze" className="hover:text-blue-700">
            Zmiękczacze
          </Link>
          <Link href="/produkty" className="hover:text-blue-700">
            Wszystkie produkty
          </Link>
          <Link href="/kontakt" className="hover:text-blue-700">
            Kontakt
          </Link>
        </div>
      </nav>
    </header>
  );
}
