import type { Metadata } from "next";
import Landing from "@/components/Landing";

export const metadata: Metadata = {
  title:
    "Filtry wody RO i zmiękczacze — czysta, mineralizowana woda z kranu",
  description:
    "Filtracja odwróconą osmozą, ultrafiltracja i zmiękczanie wody. Doradzimy odpowiedni model i zamontujemy. Sprzęt sprawdzonych marek z gwarancją producenta. Rzeszów i Podkarpacie.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title:
      "Aquarius — Filtry RO i zmiękczacze wody do domu i gastronomii",
    description:
      "Czysta i mineralizowana woda prosto z kranu. Filtry odwróconej osmozy, ultrafiltracja, zmiękczacze. Koniec z butelkami i kamieniem.",
  },
};

export default function Home() {
  return <Landing />;
}
