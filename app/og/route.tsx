import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/**
 * Imagem padrão de compartilhamento (Open Graph) — 1200×630, gerada no build.
 * PNG de verdade (via next/og), que funciona no WhatsApp, Facebook, X, etc.
 * — diferente de um .svg, que a maioria das redes não renderiza como preview.
 * Referenciada por `siteConfig.ogImage` ("/og").
 */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0d2818 0%, #0a0a0a 55%, #1a1a0a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 140,
              height: 140,
              borderRadius: 34,
              background: "#4ade80",
              color: "#0a0a0a",
              fontSize: 96,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: -2 }}>
              O CANABISTA
            </div>
            <div
              style={{
                fontSize: 30,
                color: "#4ade80",
                letterSpacing: 6,
                marginTop: 4,
              }}
            >
              CULTURA · CULTIVO · CONHECIMENTO
            </div>
          </div>
        </div>
        <div style={{ marginTop: 44, fontSize: 26, color: "#cbd5cb" }}>
          {`${siteConfig.description.slice(0, 70)} · +18`}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
