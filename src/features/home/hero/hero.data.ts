import type {
  HeroContent,
  HeroProject,
  HeroSocialLink,
  HeroTechnologyId,
} from "./hero.types";

export const heroContent = {
  eyebrow: "توسعه‌دهنده Full-Stack | طراحی سایت و وب‌اپلیکیشن اختصاصی",
  titleFirstLine: "طراحی سایت و توسعه وب‌اپلیکیشن",
  titleAccentLine: "برای کسب‌وکارهایی",
  titleLastLine: "که به دنبال رشد هستن",
  description:
    "هر پروژه با شناخت دقیق نیازهای کسب‌وکار شروع می‌شود، نه با انتخاب تکنولوژی - من به کسب‌وکارها کمک می‌کنم با طراحی سایت اختصاصی، توسعه وب‌اپلیکیشن و ساخت پنل‌های مدیریتی، محصولات دیجیتالی سریع، مقیاس‌پذیر و قابل توسعه داشته باشند",
  features: [
    "طراحی متناسب با نیاز کسب‌وکار",
    "توسعه استاندارد و مقیاس‌پذیر",
    "12 ماه پشتیبانی رایگان",
  ] as const,
  resumeHref: "/files/erfan-rahmati-resume.pdf",
  projectsHref: "#projects",
} as const satisfies HeroContent;

export const heroTechnologyLabels = {
  "tailwind-css": "Tailwind CSS",
  "rest-api": "REST API",
  typescript: "TypeScript",
  react: "React",
  aspnet: "ASP.NET",
  javascript: "JavaScript",
  nextjs: "Next.js",
} as const satisfies Record<HeroTechnologyId, string>;

export const heroProjects = [
  {
    id: "fixboo",
    name: "FixBoo",
    imageSrc: "/images/projects/fixboo/hero.png",
    imageAlt: "نمای پروژه FixBoo",
    imageWidth: 1402,
    imageHeight: 1122,
    ariaLabel: "پروژه ۱ از ۴: FixBoo",
    browserTone: "default",
    technologies: [
      "tailwind-css",
      "rest-api",
      "typescript",
      "react",
      "aspnet",
    ],
  },
  {
    id: "pixshow",
    name: "PixShow",
    imageSrc: "/images/projects/pixshow/hero.png",
    imageAlt: "نمای پروژه PixShow",
    imageWidth: 1448,
    imageHeight: 1086,
    ariaLabel: "پروژه ۲ از ۴: PixShow",
    browserTone: "violet",
    technologies: [
      "tailwind-css",
      "javascript",
      "nextjs",
      "rest-api",
      "aspnet",
    ],
  },
  {
    id: "nirvana",
    name: "Nirvana",
    imageSrc: "/images/projects/nirvana/hero.png",
    imageAlt: "نمای پروژه Nirvana",
    imageWidth: 1402,
    imageHeight: 1122,
    ariaLabel: "پروژه ۳ از ۴: Nirvana",
    browserTone: "teal",
    technologies: [
      "tailwind-css",
      "typescript",
      "react",
      "rest-api",
      "aspnet",
    ],
  },
  {
    id: "amaday-gasht",
    name: "AmadayGasht",
    imageSrc: "/images/projects/amaday-gasht/hero.png",
    imageAlt: "نمای پروژه AmadayGasht",
    imageWidth: 1448,
    imageHeight: 1086,
    ariaLabel: "پروژه ۴ از ۴: AmadayGasht",
    browserTone: "amber",
    technologies: [
      "tailwind-css",
      "javascript",
      "nextjs",
      "rest-api",
      "aspnet",
    ],
  },
] as const satisfies readonly HeroProject[];

export const heroSocialLinks = [
  {
    id: "github",
    label: "گیت‌هاب عرفان رحمتی",
    href: "https://github.com/erfan-rahmati",
  },
  {
    id: "instagram",
    label: "اینستاگرام عرفان رحمتی",
    href: "https://instagram.com/erfanm.dev",
  },
  {
    id: "telegram",
    label: "تلگرام عرفان رحمتی",
    href: "https://t.me/erfanm_dev",
  },
  {
    id: "linkedin",
    label: "لینکدین عرفان رحمتی",
    href: "https://linkedin.com/in/erfanm.dev",
  },
] as const satisfies readonly HeroSocialLink[];