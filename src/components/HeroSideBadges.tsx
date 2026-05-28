"use client";

import { forwardRef } from "react";

type Item = {
  label: [string, string];
  iconType: "drop" | "filter";
};

const ITEMS: Item[] = [
  { label: ["CZYSTA", "W 99.9%"], iconType: "drop" },
  { label: ["FILTR RO", "5 STOPNI"], iconType: "filter" },
];

function Icon({ type }: { type: Item["iconType"] }) {
  if (type === "drop") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
      <path d="M4 4h16v3H4zM4 9h16l-2 10H6L4 9zm4 3 .8 6h6.4l.8-6H8z" />
    </svg>
  );
}

const HeroSideBadges = forwardRef<HTMLDivElement, { visible?: boolean }>(
  function HeroSideBadges({ visible = true }, ref) {
    return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 flex-row gap-8 will-change-[opacity,transform,filter] md:bottom-auto md:left-auto md:right-[18%] md:top-1/2 md:flex-col md:gap-6 md:-translate-x-0 md:-translate-y-1/2">
      {ITEMS.map((item, i) => (
        <div
          key={item.iconType}
          className="transition-all duration-700 ease-out will-change-[opacity,transform,filter]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.92)",
            transitionDelay: visible ? `${i * 0.18}s` : "0s",
          }}>
          <ShinyBadge item={item} index={i} />
        </div>
      ))}

      <style jsx global>{`
        @keyframes badge-shimmer {
          0% {
            transform: translateX(-160%) skewX(-18deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translateX(160%) skewX(-18deg);
            opacity: 0;
          }
        }

        @keyframes badge-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes badge-spark {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.6);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes badge-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.45);
          }
          100% {
            box-shadow: 0 0 0 18px rgba(56, 189, 248, 0);
          }
        }
      `}</style>
    </div>
    );
  },
);

export default HeroSideBadges;

function ShinyBadge({ item, index }: { item: Item; index: number }) {
  return (
    <div
      className="pointer-events-auto flex flex-col items-center"
      style={{
        animation: `badge-float 5.5s ease-in-out ${index * 0.4}s infinite`,
      }}>
      <div
        className="relative h-20 w-20 overflow-hidden rounded-[40px] border border-white/60 bg-white/70 shadow-xl shadow-blue-950/10 backdrop-blur-md"
        style={{
          animation: `badge-ring 2.6s ease-out ${index * 0.6}s infinite`,
        }}>
        <div
          aria-hidden
          className="absolute inset-[-2px] rounded-[42px]"
          style={{
            background:
              "conic-gradient(from 200deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.55) 25%, rgba(147,197,253,0.7) 50%, rgba(56,189,248,0.55) 75%, rgba(56,189,248,0) 100%)",
            filter: "blur(6px)",
            opacity: 0.55,
          }}
        />

        <div className="absolute inset-[2px] rounded-[38px] bg-white/85" />

        <div
          aria-hidden
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center text-blue-950">
          <Icon type={item.iconType} />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden">
          <span
            className="absolute top-0 left-0 h-full w-1/3"
            style={{
              background:
                "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 70%, transparent 100%)",
              animation: `badge-shimmer 3.4s ease-in-out ${
                index * 0.8 + 0.4
              }s infinite`,
            }}
          />
        </div>

        <span
          aria-hidden
          className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-white"
          style={{
            boxShadow: "0 0 8px 2px rgba(255,255,255,0.9)",
            animation: `badge-spark 2.2s ease-in-out ${
              index * 0.5 + 0.2
            }s infinite`,
          }}
        />
        <span
          aria-hidden
          className="absolute bottom-3 left-3 h-1 w-1 rounded-full bg-sky-200"
          style={{
            boxShadow: "0 0 6px 2px rgba(186,230,253,0.9)",
            animation: `badge-spark 2.8s ease-in-out ${
              index * 0.5 + 1.1
            }s infinite`,
          }}
        />
      </div>

      <div className="mt-3 text-center text-[11px] font-semibold uppercase leading-tight tracking-widest text-blue-950">
        <div>{item.label[0]}</div>
        <div>{item.label[1]}</div>
      </div>
    </div>
  );
}
