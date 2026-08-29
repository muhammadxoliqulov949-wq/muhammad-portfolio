import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/content";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const revalidate = 86400;

/** Favicon — ink fon + signal lime monogram (profil saqlanganda yangilanadi). */
export default async function Icon() {
  let initials = "MX";
  try {
    const { profile } = await getSiteData();
    initials = (profile.avatarInitials || profile.fullName || "MX").slice(0, 2).toUpperCase();
  } catch {
    /* fallback */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "#0a0c10",
          border: "2px solid rgba(214,242,92,0.35)",
          color: "#d6f25c",
          fontSize: 27,
          fontWeight: 800,
          fontFamily: "monospace",
          letterSpacing: -1,
        }}
      >
        {initials}
      </div>
    ),
    { ...size }
  );
}
