import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/content";

export const alt = "Muhammad Xoliqulov — Student & AI Developer. AI yordamida veb-ilova qurish.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

/**
 * Satori (ImageResponse) har bir glif uchun shrift topa olmasa, uni tarmoqdan
 * yuklashga urinadi — sandbox/offline muhitda bu "Failed to load dynamic font"
 * bo'ladi. Shuning uchun OG matni ASCII'lashtirilgan variantdan o'tadi
 * (oʻ/ʼ/≈ kabi belgilar ' va "≈" o'rniga lotincha belgi bilan).
 */
function safeGlyphs(value: string): string {
  return value
    .replace(/[ʻʼ‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/≈/g, "~")
    .replace(/[–—]/g, "-")
    .replace(/·/g, "/");
}

/**
 * OG kartochka — dizayn tizimi bilan bir xil (ink + signal lime), va
 * matn DB'dan olinadi: admin profilni o'zgartirsa, kartochka ham o'zgaradi.
 */
export default async function OpenGraphImage() {
  let name = "Portfolio";
  let title = "Student & AI Developer";
  let location = "";
  let stats: { label: string; value: string }[] = [];

  try {
    const { profile } = await getSiteData();
    name = profile.fullName || name;
    title = profile.title || title;
    location = profile.location;
    stats = [
      { label: "Tajriba", value: profile.statExperience },
      { label: "Mijozlar", value: profile.statAvailability },
      { label: "Saytlar", value: profile.statProjects },
    ].filter((s) => s.value);
  } catch {
    // DB bo'lmasa ham kartochka qaytadi
  }

  name = safeGlyphs(name);
  title = safeGlyphs(title);
  location = safeGlyphs(location);
  stats = stats.map((s) => ({ ...s, value: safeGlyphs(s.value) }));

  const initials = name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "P";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0a0c10",
          color: "#f3f1ea",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-140px",
            width: "620px",
            height: "620px",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(214,242,92,0.22), transparent 62%)",
            display: "flex",
          }}
        />
        {/* to'r */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(243,241,234,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,234,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "18px", position: "relative" }}>
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#d6f25c",
              color: "#0a0c10",
              fontSize: "22px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "26px", fontWeight: 700 }}>{name}</span>
            <span style={{ fontSize: "17px", color: "#a8afbc", fontFamily: "monospace", letterSpacing: "2px" }}>
              {location ? location.toUpperCase() : "PORTFOLIO"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", position: "relative" }}>
          <div style={{ display: "flex", fontSize: "72px", fontWeight: 800, letterSpacing: "-2.5px", lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: "26px", color: "#a8afbc" }}>
            AI-assisted web development / prototipdan deploygacha
          </div>
        </div>

        {stats.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: "40px",
              borderTop: "1px solid rgba(243,241,234,0.16)",
              paddingTop: "26px",
              position: "relative",
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", color: "#767e8d", fontFamily: "monospace", letterSpacing: "1.6px" }}>
                  {s.label.toUpperCase()}
                </span>
                <span style={{ fontSize: "30px", fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    ),
    size
  );
}
