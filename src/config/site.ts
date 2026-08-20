export const siteConfig = {
  name: "erfanm.dev",

  title:
    "عرفان رحمتی | برنامه نویس و طراح سایت در مازندران",

  description:
    "عرفان رحمتی، توسعه‌دهنده فول‌استک و طراح سایت در مازندران؛ ارائه خدمات طراحی سایت اختصاصی، توسعه وب‌اپلیکیشن، پنل مدیریت و راهکارهای نرم‌افزاری مدرن",

  url: "https://erfanmdev.ir",

  language: "fa",
  locale: "fa_IR",

  creator: "Erfan Rahmati",
  creatorDisplayName: "عرفان رحمتی",

  creatorJobTitle:
    "برنامه نویس، توسعه‌دهنده فول‌استک و طراح سایت",

  location:
    "بابلسر، مازندران، ایران",

  socialProfiles: [
    "https://github.com/erfan-rahmati",
    "https://instagram.com/erfanm.dev",
    "https://t.me/erfanm_dev",
    "https://linkedin.com/in/erfanm-dev",
  ],

  topics: [
    "عرفان رحمتی",
    "طراحی سایت در بابلسر",
    "طراحی سایت در مازندران",
    "برنامه نویس مازندران",
    "طراحی سایت اختصاصی",
    "توسعه وب‌اپلیکیشن",
    "Next.js",
    "React",
    "TypeScript",
    "طراحی پنل مدیریت",
    "توسعه API",
    "PWA",
    "سئو فنی",
    "بهینه‌سازی سرعت وب",
  ],
} as const;


export type SiteConfig = typeof siteConfig;


export const siteIdentity = {
  brand: "erfanm.dev",

  publicDomain:
    "erfanmdev.ir",

  ownerName:
    "عرفان رحمتی",

  footerDescription:
    "عرفان رحمتی، برنامه نویس و طراح سایت در بابلسر و مازندران؛ متخصص طراحی سایت اختصاصی، توسعه وب‌اپلیکیشن، پنل‌های مدیریتی و محصولات دیجیتال.",

  footertext:
    "erfanm.dev وب‌سایت رسمی عرفان رحمتی برای معرفی خدمات طراحی سایت، توسعه وب، توسعه API، ساخت نرم‌افزارهای تحت وب و انتشار مقالات تخصصی حوزه فناوری است.",

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