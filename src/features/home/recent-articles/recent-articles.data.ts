import type { RecentArticlesContent } from "./recent-articles.types";

export const recentArticlesContent = {
  eyebrow: "آخرین مقالات",
  title: "راهنماهای طراحی سایت، توسعه وب و سئو",
  description:
    " تجربه‌ها، راهنماهای عملی و نکات تخصصی درباره طراحی سایت، توسعه وب‌اپلیکیشن، سئو، بهینه‌سازی عملکرد و راه‌اندازی محصولات دیجیتال ",
  archiveLabel: "مشاهده همه مقالات",
  archiveHref: "/blog",
  archiveAvailable: true,
} as const satisfies RecentArticlesContent;
