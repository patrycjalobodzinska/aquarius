"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-contain p-8"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Zdjęcie ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${
                i === active
                  ? "border-blue-700 shadow-md"
                  : "border-sky-100 hover:border-sky-300"
              }`}>
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
