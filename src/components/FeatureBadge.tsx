"use client";

import BorderGlow from "./BorderGlow";

type IconType = "drop" | "filter";

type Props = {
  label: [string, string];
  iconType: IconType;
};

function Icon({ type }: { type: IconType }) {
  if (type === "drop") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M4 4h16v3H4zM4 9h16l-2 10H6L4 9zm4 3 .8 6h6.4l.8-6H8z" />
    </svg>
  );
}

export default function FeatureBadge({ label, iconType }: Props) {
  return (
    <div className="pointer-events-auto flex flex-col items-center">
      <BorderGlow
        className="h-20 w-20"
        edgeSensitivity={25}
        glowColor="215 90 55"
        backgroundColor="rgba(255,255,255,0.6)"
        borderRadius={40}
        glowRadius={24}
        glowIntensity={0.9}
        coneSpread={20}
        animated
        colors={["#2563eb", "#38bdf8", "#93c5fd"]}
        fillOpacity={0.7}
      >
        <div className="absolute inset-0 flex items-center justify-center text-blue-950">
          <Icon type={iconType} />
        </div>
      </BorderGlow>
      <div className="mt-3 text-center text-[11px] font-semibold uppercase leading-tight tracking-widest text-blue-950">
        <div>{label[0]}</div>
        <div>{label[1]}</div>
      </div>
    </div>
  );
}
