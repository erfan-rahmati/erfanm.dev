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
  title: " توسعه نرم‌افزار با رویکرد محصول‌محور ",
  summary:
    " در هر پروژه تلاش می‌کنم قبل از انتخاب ابزار و تکنولوژی، مسئله اصلی کسب‌وکار را درک کنم. به همین دلیل تمرکز من فقط روی توسعه Front-End یا Back-End نیست؛ بلکه ساخت محصولی است که تجربه کاربری مناسب، معماری قابل توسعه و عملکرد قابل اعتماد را در کنار هم ارائه دهد - امروز بیشتر پروژه‌ها را با React، Next.js و ASP.NET Core توسعه می‌دهم؛ اما انتخاب تکنولوژی برای من همیشه نتیجه‌ی نیاز پروژه است، نه نقطه شروع آن ",
  productMindset:
    " برای من موفقیت یک پروژه، فقط تحویل نسخه نهایی نیست. محصول باید بعد از انتشار هم قابل توسعه باشد، نگهداری آسانی داشته باشد و بتواند هم‌زمان با رشد کسب‌وکار رشد کند ",
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
    label: "مستقر در",
    value: "بابلسر، مازندران",
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
    title: "طراحی سایت اختصاصی",
    technologies: ["React", "Next.js","TypeScript"],
    description:
      " طراحی رابط‌های کاربری سریع، واکنش‌گرا و بهینه که تجربه کار با محصول را ساده و لذت‌بخش می‌کنند ",
  },
  {
    id: "interface-design",
    title: "توسعه رابط کاربری استاندارد",
    technologies: ["TypeScript", "Tailwind CSS","BootStrap"],
    description:
      " توسعه رابط‌های کاربری با ساختاری استاندارد، کدنویسی Type-Safe و معماری قابل نگهداری برای پروژه‌های بلندمدت ",
  },
  {
    id: "backend",
    title: "توسعه Back-End و منطق کسب‌وکار",
    technologies: ["ASP.NET Core", "C#", "Node.js", "PHP"],
    description:
      " توسعه هسته نرم‌افزار، پیاده‌سازی منطق کسب‌وکار و طراحی سرویس‌های قابل توسعه با تمرکز بر امنیت، عملکرد و نگهداری آسان ",
  },
  {
    id: "architecture",
    title: "API و سرویس‌ها",
    technologies: ["Postman", "REST API"],
    description:
      " طراحی و توسعه REST APIهای استاندارد برای ارتباط امن و یکپارچه بین پنل مدیریت، وب‌سایت، اپلیکیشن و سرویس‌های مختلف ",
  },
  {
    id: "pwa",
    title: "توسعه وب‌اپلیکیشن (PWA)",
    technologies: ["PWA", "Service Worker"],
    description:
      " توسعه وب‌اپلیکیشن‌های قابل نصب با تجربه‌ای نزدیک به اپلیکیشن موبایل، عملکرد سریع و امکان استفاده در دستگاه‌های مختلف ",
  },
  {
    id: "wordpress",
    title: "طراحی سایت وردپرس اختصاصی",
    technologies: ["PHP", "WooCommerce", "Elementor"],
    description:
      " طراحی و توسعه وب‌سایت‌های وردپرسی متناسب با نیاز کسب‌وکار، از وب‌سایت شرکتی تا فروشگاه اینترنتی ",
  },
] as const satisfies readonly AboutExpertise[];

export const aboutProjectTypes = [
  {
    id: "custom-website",
    label: " طراحی سایت اختصاصی ",
  },
  {
    id: "pwa",
    label: "توسعه وب‌اپلیکیشن (PWA)",
  },
  {
    id: "saas-dashboard",
    label: "پنل مدیریت SaaS",
  },
  {
    id: "ecommerce",
    label: " فروشگاه اینترنتی ",
  },
  {
    id: "crm-system",
    label: " سیستم CRM ",
  },
  {
    id: "admin-dashboard",
    label: " داشبورد مدیریتی ",
  },
  {
    id: "enterprise-system",
    label: " سامانه‌های سازمانی ",
  },
  {
    id: "corporate-website",
    label: " وب‌سایت شرکتی ",
  },
  {
    id: "landing-page",
    label: " Landing Page ",
  },
] as const satisfies readonly AboutProjectType[];
