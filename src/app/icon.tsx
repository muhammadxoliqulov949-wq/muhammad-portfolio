import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: "linear-gradient(135deg, #0d1a3d, #123f82 55%, #00b7ff)",
          color: "#fff",
          fontSize: 30,
          fontWeight: 900,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        MX
      </div>
    ),
    { ...size }
  );
}
