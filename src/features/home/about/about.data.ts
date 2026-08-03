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
  role: "Full-Stack Developer | React, Next.js & ASP.NET",
  title:
    "از ایده تا محصول؛ با تمرکز بر کیفیت و رشد بلندمدت",
  introduction: [
    "من عرفان رحمتی، توسعه‌دهنده فول‌استک با تمرکز بر React، Next.js و ASP.NET هستم. وب‌سایت‌ها و وب‌اپلیکیشن‌هایی طراحی و توسعه می‌دهم که در کنار ظاهر حرفه‌ای، سریع، مقیاس‌پذیر و قابل توسعه باشند.",
    "در هر پروژه تلاش می‌کنم تصمیم‌های فنی را با نیاز واقعی کاربران و اهداف کسب‌وکار هماهنگ کنم. حوزه کاری من از طراحی رابط‌های کاربری مدرن و واکنش‌گرا تا توسعه Back-End، وب‌اپلیکیشن‌های قابل نصب و راهکارهای اختصاصی و وردپرسی را پوشش می‌دهد.",
  ],
  philosophyTitle: "نگاه من به توسعه محصول",
  philosophy: [
    "برای من توسعه یک پروژه فقط به نوشتن کد محدود نمی‌شود. هر محصول را با نگاه محصول‌محور بررسی می‌کنم و به خوانایی کد، معماری مناسب، تجربه کاربری، قابلیت نگهداری و توسعه آینده اهمیت می‌دهم.",
    "هدفم ارائه راهکاری است که علاوه بر برطرف‌کردن نیاز فعلی، در بلندمدت نیز پایدار، قابل مدیریت و قابل گسترش باشد.",
  ],
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
    description:
      "توسعه رابط‌های سریع و قابل توسعه با React، Next.js، TypeScript و Tailwind CSS.",
  },
  {
    id: "interface-design",
    title: "رابط کاربری واکنش‌گرا",
    description:
      "طراحی و پیاده‌سازی رابط‌های حرفه‌ای با تمرکز بر تجربه کاربری و نمایش صحیح در اندازه‌های مختلف.",
  },
  {
    id: "backend",
    title: "Back-End",
    description:
      "توسعه منطق سمت سرور و سرویس‌های کاربردی با ASP.NET، Node.js و REST API.",
  },
  {
    id: "architecture",
    title: "معماری و کیفیت کد",
    description:
      "ساختاردهی پروژه‌ها با تمرکز بر خوانایی، نگهداری‌پذیری و قابلیت توسعه در آینده.",
  },
  {
    id: "pwa",
    title: "Progressive Web App",
    description:
      "ساخت وب‌اپلیکیشن‌های قابل نصب با قابلیت‌های آفلاین و تجربه نزدیک به اپلیکیشن‌های بومی.",
  },
  {
    id: "wordpress",
    title: "PHP و WordPress",
    description:
      "طراحی وب‌سایت‌های اقتصادی و توسعه قالب‌ها و افزونه‌های اختصاصی WordPress.",
  },
] as const satisfies readonly AboutExpertise[];

export const aboutProjectTypes = [
  {
    id: "custom-applications",
    label: "وب‌اپلیکیشن‌های اختصاصی",
  },
  {
    id: "dashboards",
    label: "داشبوردها و پنل‌های مدیریتی",
  },
  {
    id: "saas",
    label: "محصولات SaaS و پلتفرم‌های آنلاین",
  },
  {
    id: "ecommerce",
    label: "فروشگاه‌های اینترنتی حرفه‌ای",
  },
  {
    id: "corporate",
    label: "وب‌سایت شرکتی و Landing Page",
  },
  {
    id: "wordpress",
    label: "وب‌سایت‌های اقتصادی WordPress",
  },
  {
    id: "wordpress-development",
    label: "افزونه‌نویسی و قالب‌نویسی",
  },
] as const satisfies readonly AboutProjectType[];