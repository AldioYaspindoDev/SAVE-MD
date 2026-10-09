import { ImageResponse } from "next/og";
import { APP_NAME, SITE_URL, THEME_COLOR } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${APP_NAME}: snippet kode, Markdown, dan prompt AI untuk developer`;

export default function OpengraphImage() {
  const domain = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: THEME_COLOR,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {"</>"}
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 1 }}>
            {APP_NAME.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            <div style={{ display: "flex" }}>Snippet, Markdown &amp;</div>
            <div style={{ display: "flex" }}>Prompt AI. Satu Tempat.</div>
          </div>
          <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>
            Aset kode pribadi developer, rapi dan mudah ditemukan.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 26,
            opacity: 0.8,
          }}
        >
          {domain}
        </div>
      </div>
    ),
    size,
  );
}
