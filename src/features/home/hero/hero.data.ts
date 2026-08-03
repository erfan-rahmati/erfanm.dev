import type {
  HeroContent,
  HeroProject,
  HeroSocialLink,
  HeroTechnologyId,
} from "./hero.types";

export const heroContent = {
  eyebrow: "توسعه‌دهنده فول‌استک | Full-Stack Developer",
  titleFirstLine: "ایده‌ی شما را به",
  titleAccentLine: "وب‌سایت و اپلیکیشنی",
  titleLastLine: "حرفه‌ای تبدیل می‌کنم",
  description:
    "وب‌سایت‌ها، پنل‌های مدیریتی و اپلیکیشن‌های تحت وب را با تمرکز بر عملکرد، مقیاس‌پذیری و تجربه کاربری توسعه می‌دهم تا کسب‌وکارها سریع‌تر رشد کنند.",
  resumeHref: "/files/resume.pdf",
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
    href: "https://github.com/erfanm-dev",
  },
  {
    id: "instagram",
    label: "اینستاگرام عرفان رحمتی",
    href: "https://instagram.com/erfanm.dev",
  },
  {
    id: "telegram",
    label: "تلگرام عرفان رحمتی",
    href: "https://t.me/erfanmdev",
  },
  {
    id: "linkedin",
    label: "لینکدین عرفان رحمتی",
    href: "https://linkedin.com/in/erfanm-dev",
  },
] as const satisfies readonly HeroSocialLink[];