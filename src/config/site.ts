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

export const siteIdentity = {
  brand: "erfanm.dev",
  publicDomain: "erfanmdev.ir",
  ownerName: "عرفان رحمتی",
  footerDescription:
    "طراحی و توسعه وب‌سایت‌ها و وب‌اپلیکیشن‌های سریع، مدرن و قابل توسعه.",
} as const;

export const siteContact = {
  phone: {
    label: "تماس مستقیم",
    displayValue: "۰۹۳۵۴۰۵۵۱۵۰",
    rawValue: "09354055150",
    internationalValue: "+989354055150",
    href: "tel:+989354055150",
  },
  whatsapp: {
    label: "WhatsApp",
    displayValue: "۰۹۳۵۴۰۵۵۱۵۰",
    rawValue: "989354055150",
    href: "https://wa.me/989354055150",
  },
  telegram: {
    label: "Telegram",
    displayValue: "@erfanm_dev",
    username: "erfanm_dev",
    href: "https://t.me/erfanm_dev",
  },
} as const;