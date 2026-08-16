export type BlogArticleHref =
  `/blog/${string}`;

export type RecentArticleCoverId =
  | "web-development-seo"
  | "ecommerce-design";

export type RecentArticlesContent = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  archiveLabel: string;
  archiveHref: "/blog";
  archiveAvailable: boolean;
}>;

export type RecentArticle = Readonly<{
  id: string;
  slug: string;
  href: BlogArticleHref;
  title: string;
  cardTitle: string;
  excerpt: string;
  category: string;
  badge: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  readingMinutes: number;
  publishedAt: string | null;
}>;
