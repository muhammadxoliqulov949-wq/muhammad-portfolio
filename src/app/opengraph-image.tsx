import { ImageResponse } from "next/og";

export const alt = "Muhammad — Full-stack dasturchi | Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(900px 600px at 85% -10%, rgba(30,107,255,0.35), transparent 60%), radial-gradient(700px 500px at -10% 40%, rgba(0,183,255,0.25), transparent 55%), #050816",
          color: "#e9efff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #1e6bff, #00b7ff)",
              fontSize: "32px",
              fontWeight: 900,
              color: "#fff",
            }}
          >
            MX
          </div>
          <div style={{ display: "flex", fontSize: "28px", fontWeight: 700, color: "#93a1c0" }}>
            MUHAMMAD
            <span style={{ color: "#00b7ff" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: "76px", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.1 }}>
          Full-stack{" "}
          <span
            style={{
              background: "linear-gradient(120deg, #60a5fa, #00b7ff, #a5f3fc)",
              color: "transparent",
            }}
          >
            dasturchi
          </span>
        </div>
        <div style={{ fontSize: "32px", color: "#93a1c0", marginTop: "24px" }}>
          Zamonaviy veb-saytlar · Admin panellar · Telegram botlar
        </div>
      </div>
    ),
    size
  );
}
