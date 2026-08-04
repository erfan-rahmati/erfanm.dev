export const ARTICLE_PUBLICATION_STATUS_IDS = [
  "coming-soon",
  "published",
] as const;

export type ArticlePublicationStatus =
  (typeof ARTICLE_PUBLICATION_STATUS_IDS)[number];

export type RecentArticleId =
  | "web-design-rules-2026"
  | "ecommerce-website-guide";

export type RecentArticleCoverId =
  | "web-development-seo"
  | "ecommerce-design";

export type BlogArticleHref =
  `/blog/${string}`;

export type RecentArticlesContent = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  archiveLabel: string;
  archiveHref: "/blog";
  archiveAvailable: boolean;
}>;

export type RecentArticle = Readonly<{
  id: RecentArticleId;
  slug: string;
  href: BlogArticleHref;
  title: string;
  cardTitle: string;
  excerpt: string;
  category: string;
  badge: string;
  cover: RecentArticleCoverId;
  publicationStatus: ArticlePublicationStatus;
  publicationStatusLabel: string;
}>;