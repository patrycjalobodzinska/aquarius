/**
 * Logo Aquarius — kropla SVG z gradientem + napis nakładający się na ikonę.
 * Używane w SiteHeader, SiteFooter i Landing.tsx (header w hero).
 *
 * `idSuffix` jest opcjonalny, ale powinien być unikalny per użycie na stronie,
 * żeby dwa równoległe `<Logo>` (np. header + hero header) nie kolidowały
 * `id`-kami w gradientach SVG.
 */
export default function Logo({
  idSuffix = "default",
  className = "",
  iconClassName = "relative z-0 mr-[-15px] h-16 w-16 opacity-70",
  textClassName = "relative z-10 mb-2 -ml-3 text-4xl font-light",
}: {
  idSuffix?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}) {
  const gradId = `logo-drop-grad-${idSuffix}`;
  const hiId = `logo-drop-hi-${idSuffix}`;
  return (
    <span
      className={`flex items-end font-semibold text-blue-950 ${className}`.trim()}>
      <svg viewBox="0 0 24 24" className={iconClassName} aria-hidden>
        <defs>
          <linearGradient
            id={gradId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="45%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <radialGradient id={hiId} cx="35%" cy="30%" r="25%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <path
          d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z"
          fill={`url(#${gradId})`}
        />
        <ellipse cx="9" cy="9" rx="2" ry="3" fill={`url(#${hiId})`} />
      </svg>
      <span className={textClassName}>
        A<span className="text-xl font-semibold">quarius</span>
      </span>
    </span>
  );
}
