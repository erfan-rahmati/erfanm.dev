import type {
  RecentArticle,
  RecentArticlesContent,
} from "./recent-articles.types";

export const recentArticlesContent = {
  eyebrow: "آخرین مقالات",
  title: "راهنماهای طراحی سایت، توسعه وب و سئو",
  description:
    " تجربه‌ها، راهنماهای عملی و نکات تخصصی درباره طراحی سایت، توسعه وب‌اپلیکیشن، سئو، بهینه‌سازی عملکرد و راه‌اندازی محصولات دیجیتال ",
  archiveLabel: "مشاهده همه مقالات",
  archiveHref: "/blog",
  archiveAvailable: false,
} as const satisfies RecentArticlesContent;

export const recentArticles: readonly RecentArticle[] = [
  {
    id: "web-design-rules-2026",
    slug: "ghavanin-tarahi-site-barnamenevisi-seo",
    href: "/blog/ghavanin-tarahi-site-barnamenevisi-seo",
    title:
      "قوانین طلایی طراحی سایت و برنامه‌نویسی وب در ۲۰۲۶؛ راهنمای کامل سئو برای کسب‌وکارهای بابلسر و مازندران",
    cardTitle:
      "۳۳ قانون طلایی طراحی سایت، برنامه‌نویسی و سئو در ۲۰۲۶",
    excerpt:
      "راهنمایی جامع از طراحی رابط کاربری و توسعه وب تا سئو تکنیکال، لینک‌سازی داخلی و سئو محلی برای کسب‌وکارهای بابلسر و مازندران.",
    category: "طراحی وب و سئو",
    badge: "راهنمای جامع",
    cover: "web-development-seo",
    publicationStatus: "coming-soon",
    publicationStatusLabel: "به‌زودی",
  },
  {
    id: "ecommerce-website-guide",
    slug: "tarahi-site-foroshgahi-babolsar-mazandaran",
    href: "/blog/tarahi-site-foroshgahi-babolsar-mazandaran",
    title:
      "طراحی سایت فروشگاهی در بابلسر و مازندران؛ راهنمای ساخت فروشگاه اینترنتی حرفه‌ای",
    cardTitle:
      "راهنمای طراحی فروشگاه اینترنتی حرفه‌ای در بابلسر و مازندران",
    excerpt:
      "راهنمای تصمیم‌گیری برای ساخت فروشگاه اینترنتی؛ از امکانات ضروری و انتخاب میان WordPress یا توسعه اختصاصی تا هزینه، سئو و افزایش فروش.",
    category: "فروشگاه اینترنتی",
    badge: "راهنمای کسب‌وکار",
    cover: "ecommerce-design",
    publicationStatus: "coming-soon",
    publicationStatusLabel: "به‌زودی",
  },
];