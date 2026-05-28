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
        {/* Decorative blue droplet glow */}
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            color: "#1e3a8a",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#1d4ed8",
              display: "flex",
            }}
          />
          Aquarius
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
