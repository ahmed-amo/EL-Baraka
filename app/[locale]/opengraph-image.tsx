import { ImageResponse } from "next/og";

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
          justifyContent: "flex-end",
          background: "#0B1626",
          color: "white",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} style={{ width: 10, height: 42, background: "#0B5199" }} />
          ))}
        </div>
        <div style={{ fontSize: 72, lineHeight: 0.9, maxWidth: 900 }}>Nous œuvrons pour votre sécurité</div>
        <div style={{ marginTop: 18, fontSize: 24 }}>
          Gardiennage, sécurisation, transport de fonds et produits sensibles
        </div>
      </div>
    ),
    size,
  );
}
