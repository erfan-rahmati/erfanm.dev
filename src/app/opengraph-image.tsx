import { ImageResponse } from "next/og";

export const alt =
  "عرفان رحمتی — توسعه‌دهنده فول‌استک";
export const size = {
  width: 1200,
  height: 630,
};
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
          justifyContent: "space-between",
          padding: "72px 82px",
          color: "#f5f7ff",
          background:
            "linear-gradient(135deg, #080a16 0%, #11132a 55%, #261a58 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
            letterSpacing: -1,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 99,
              background: "#8d68ff",
              boxShadow: "0 0 36px #8d68ff",
            }}
          />
          <strong>erfanm.dev</strong>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              letterSpacing: -3,
            }}
          >
            Erfan Rahmati
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#c8c8df",
            }}
          >
            Full-stack developer · Web products · Technical SEO
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#9fa3c6",
          }}
        >
          <span>Babolsar · Mazandaran · Iran</span>
          <span>erfanmdev.ir</span>
        </div>
      </div>
    ),
    size,
  );
}
