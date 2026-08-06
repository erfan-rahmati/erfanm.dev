import type {
  SkillCategory,
  SkillsContent,
} from "./skills.types";

export const skillsContent = {
  eyebrow: "مهارت‌ها و ابزارها",
  title: "فناوری‌هایی که پشت محصولات من قرار دارند",
  description:
    "  هر فناوری را بر اساس نقش آن در پروژه‌ها دسته‌بندی کرده‌ام؛ از طراحی رابط کاربری و توسعه Front-End گرفته تا Back-End، API، پایگاه داده و ابزارهای استقرار. این ساختار نشان می‌دهد هر بخش از محصول با چه ابزارهایی توسعه پیدا می‌کند  ",
} as const satisfies SkillsContent;

export const skillCategories = [
  {
    id: "frontend-platform",
    title: "Front-End و تجربه کاربری",
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
    title: "Back-End، API و پایگاه داده",
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
    title: "طراحی محصول و WordPress",
    description:
      " راهکارهای سریع و اقتصادی برای کسب‌وکارهایی که به مدیریت آسان محتوا نیاز دارند. ",
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
    title: "استقرار، DevOps و ابزارهای توسعه",
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
