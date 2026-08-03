export const siteConfig = {
  name: "erfanm.dev",
  title: "عرفان رحمتی | توسعه‌دهنده فول‌استک",
  description:
    "وب‌سایت شخصی عرفان رحمتی؛ معرفی پروژه‌ها، تجربه‌های کاری و نوشته‌های فنی در حوزه توسعه وب.",
  url: "https://erfanmdev.ir",
  language: "fa",
  locale: "fa_IR",
  creator: "Erfan Rahmati",
} as const;

export type SiteConfig = typeof siteConfig;