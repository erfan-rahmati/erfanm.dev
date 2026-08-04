import type {
  AboutContent,
  AboutDetail,
  AboutExpertise,
  AboutProjectType,
  AboutStatistic,
} from "./about.types";

export const aboutContent = {
  eyebrow: "درباره من",
  name: "عرفان رحمتی",
  role: "Full-Stack Developer | React, Next.js & ASP.NET Core",
  title: "توسعه فول‌استک با نگاه محصول‌محور",
  summary:
    "من عرفان رحمتی هستم؛ توسعه‌دهنده فول‌استک با تمرکز بر React، Next.js و ASP.NET Core. محصولات وب سریع، مقیاس‌پذیر و قابل توسعه را از رابط کاربری تا Back-End طراحی و پیاده‌سازی می‌کنم.",
  productMindset:
    "در هر پروژه فقط به تحویل کد فکر نمی‌کنم؛ معماری، تجربه کاربری، نگهداری آینده و هدف کسب‌وکار را کنار هم می‌بینم تا راهکار نهایی در بلندمدت هم ارزشمند بماند.",
  primaryAction: {
    label: "شروع همکاری",
    href: "#contact",
  },
  secondaryAction: {
    label: "مشاهده پروژه‌ها",
    href: "#projects",
  },
} as const satisfies AboutContent;

export const aboutStatistics = [
  {
    id: "experience",
    value: "۵+",
    label: "سال تجربه",
  },
  {
    id: "projects",
    value: "۲۰+",
    label: "پروژه انجام‌شده",
  },
] as const satisfies readonly AboutStatistic[];

export const aboutDetails = [
  {
    id: "location",
    label: "محل فعالیت",
    value: "بابلسر، مازندران، ایران",
  },
  {
    id: "availability",
    label: "نوع همکاری",
    value: "فریلنس • پروژه‌ای • دورکاری",
  },
] as const satisfies readonly AboutDetail[];

export const aboutExpertise = [
  {
    id: "frontend",
    title: "Front-End مدرن",
    technologies: ["React", "Next.js"],
    description:
      "توسعه رابط‌های سریع، تعاملی و قابل نگهداری با معماری Component-Based.",
  },
  {
    id: "interface-design",
    title: "رابط کاربری و کیفیت",
    technologies: ["TypeScript", "Tailwind CSS"],
    description:
      "طراحی واکنش‌گرا، مدل‌سازی Type-Safe و تجربه کاربری منسجم در همه نمایشگرها.",
  },
  {
    id: "backend",
    title: "Back-End ساخت‌یافته",
    technologies: ["ASP.NET Core", "C#"],
    description:
      "پیاده‌سازی منطق سمت سرور و سامانه‌های قابل توسعه با معماری روشن و پایدار.",
  },
  {
    id: "architecture",
    title: "API و سرویس‌ها",
    technologies: ["Node.js", "REST API"],
    description:
      "ساخت سرویس‌ها، احراز هویت و ارتباط مطمئن میان بخش‌های مختلف محصول.",
  },
  {
    id: "pwa",
    title: "Web Platform",
    technologies: ["PWA", "Service Worker"],
    description:
      "ساخت وب‌اپلیکیشن‌های قابل نصب با قابلیت آفلاین و تجربه نزدیک به اپلیکیشن بومی.",
  },
  {
    id: "wordpress",
    title: "WordPress Development",
    technologies: ["PHP", "WooCommerce"],
    description:
      "توسعه قالب، افزونه و فروشگاه‌های اختصاصی متناسب با نیاز واقعی کسب‌وکار.",
  },
] as const satisfies readonly AboutExpertise[];

export const aboutProjectTypes = [
  {
    id: "custom-products",
    label: "وب‌اپلیکیشن اختصاصی و SaaS",
  },
  {
    id: "dashboards",
    label: "داشبورد و پنل مدیریتی",
  },
  {
    id: "ecommerce",
    label: "فروشگاه اینترنتی حرفه‌ای",
  },
  {
    id: "corporate",
    label: "سایت شرکتی و Landing Page",
  },
  {
    id: "wordpress",
    label: "WordPress، قالب و افزونه اختصاصی",
  },
] as const satisfies readonly AboutProjectType[];
