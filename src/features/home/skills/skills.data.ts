import type {
  SkillCategory,
  SkillsContent,
} from "./skills.types";

export const skillsContent = {
  eyebrow: "مهارت‌ها و ابزارها",
  title: "فناوری‌هایی که با آن‌ها محصول می‌سازم",
  description:
    "مهارت‌ها را در چهار گروه فشرده جمع کرده‌ام تا در یک نگاه قابل بررسی باشند؛ جزئیات هر گروه نیز در صورت نیاز باز می‌شود.",
} as const satisfies SkillsContent;

export const skillCategories = [
  {
    id: "frontend-platform",
    title: "Front-End و Web Platform",
    description:
      "رابط‌های سریع، واکنش‌گرا و قابل نصب با فناوری‌های مدرن وب.",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript ES6+",
      "Tailwind CSS v4",
      "App Router",
      "Server Components",
      "Server Actions",
      "shadcn/ui",
      "Responsive Design",
      "Mobile-First Design",
      "Progressive Web App",
      "Service Worker",
      "Offline Support",
      "Web Manifest",
      "REST API Integration",
    ],
  },
  {
    id: "backend-data",
    title: "Back-End، API و داده",
    description:
      "پیاده‌سازی منطق سمت سرور، APIها و ساختار داده قابل نگهداری.",
    skills: [
      "C#",
      "PHP",
      "REST API",
      "Web API Development",
      "Authentication",
      "Authorization",
      "CRUD Applications",
      "MVC Architecture",
      "SQL Server",
      "PostgreSQL",
      "MySQL",
      "Entity Framework",
      "Database Design",
      "Query Optimization",
      "Modular Architecture",
    ],
  },
  {
    id: "wordpress-design",
    title: "WordPress و طراحی محصول",
    description:
      "راهکارهای اقتصادی و اختصاصی با تمرکز بر رابط کاربری و نیاز کسب‌وکار.",
    skills: [
      "WooCommerce",
      "Theme Development",
      "Plugin Development",
      "Theme Customization",
      "Custom Post Types",
      "Elementor",
      "Figma",
      "UI Design",
      "Component Design",
      "UX Principles",
      "Accessibility Fundamentals",
    ],
  },
  {
    id: "tooling-delivery",
    title: "ابزارها و انتشار محصول",
    description:
      "ابزارهای روزمره توسعه، کنترل نسخه، بررسی API و استقرار پروژه.",
    skills: [
      "Git",
      "GitHub",
      "npm",
      "pnpm",
      "Postman",
      "Docker",
      "Visual Studio Code",
      "Visual Studio",
      "Chrome DevTools",
      "Vercel",
      "Liara",
      "IIS",
      "S3-Compatible Object Storage",
      "Environment Variables",
      "Domain & DNS Configuration",
      "ESLint",
      "TypeScript Strict Mode",
      "Code Review",
      "Clean Code",
    ],
  },
] as const satisfies readonly SkillCategory[];
