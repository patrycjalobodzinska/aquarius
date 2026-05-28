import { ImageResponse } from "next/og";

export const alt =
  "Aquarius — zmiękczacze i filtry wody · Rzeszów i Podkarpacie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #dbeafe 0%, #eff6fb 45%, #c7e0f4 100%)",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}>
        {/* Soft cyan glow w prawym górnym rogu */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(125,211,252,0.55) 0%, rgba(125,211,252,0) 70%)",
            display: "flex",
          }}
        />

        {/* Logo: kropla + Aquarius */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            color: "#0f1e4a",
          }}>
          <svg
            width="100"
            height="100"
            viewBox="0 0 24 24"
            style={{ marginRight: -22, opacity: 0.85 }}>
            <defs>
              <linearGradient id="og-drop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="45%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <radialGradient id="og-drop-hi" cx="35%" cy="30%" r="25%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            <path
              d="M12 2c3.5 4.5 7 9 7 13a7 7 0 0 1-14 0c0-4 3.5-8.5 7-13z"
              fill="url(#og-drop-grad)"
            />
            <ellipse cx="9" cy="9" rx="2" ry="3" fill="url(#og-drop-hi)" />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 64,
              fontWeight: 300,
              marginBottom: 4,
            }}>
            A<span style={{ fontSize: 36, fontWeight: 600 }}>quarius</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 900,
          }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: "#0f1e4a",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}>
            Zmiękczacze i filtry wody
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "#1e3a8a",
              lineHeight: 1.2,
            }}>
            Doradztwo i montaż — Rzeszów i Podkarpacie
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#1e3a8a",
          }}>
          <div style={{ display: "flex" }}>+48 513 001 600</div>
          <div style={{ display: "flex" }}>aquarius.craftedweb.pl</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
