import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "erfanm.dev — عرفان رحمتی",
    short_name: "erfanm.dev",
    description:
      "طراحی سایت اختصاصی، توسعه وب‌اپلیکیشن و مقالات تخصصی توسعه وب.",
    start_url: "/",
    display: "standalone",
    background_color: "#070913",
    theme_color: "#7857ff",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/icon.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
