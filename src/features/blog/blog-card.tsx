import Image from "next/image";
import Link from "next/link";

import type { PublicArticleCard } from "@/server/articles/article.repository";

const dateFormatter = new Intl.DateTimeFormat(
  "fa-IR",
  {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
);

export function BlogCard({
  article,
}: Readonly<{ article: PublicArticleCard }>) {
  return (
    <article className="blog-card">
      <Link
        href={`/blog/${article.slug}`}
        className="blog-card__cover"
        aria-label={`مطالعه مقاله ${article.title}`}
      >
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={
              article.coverImageAlt ??
              article.title
            }
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
            className="blog-card__image"
            unoptimized
          />
        ) : (
          <div
            className="blog-card__placeholder"
            aria-hidden="true"
          >
            <span>erfanm.dev</span>
            <strong>{article.category}</strong>
          </div>
        )}
        <span className="blog-card__badge">
          {article.badge}
        </span>
      </Link>

      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span>{article.category}</span>
          <span aria-hidden="true">•</span>
          <span>
            {article.readingMinutes.toLocaleString(
              "fa-IR",
            )}{" "}
            دقیقه مطالعه
          </span>
        </div>
        <h2>
          <Link href={`/blog/${article.slug}`}>
            {article.cardTitle}
          </Link>
        </h2>
        <p>{article.excerpt}</p>
        <footer>
          <span>
            {article.publishedAt
              ? dateFormatter.format(
                  article.publishedAt,
                )
              : ""}
          </span>
          <Link href={`/blog/${article.slug}`}>
            مطالعه مقاله ←
          </Link>
        </footer>
      </div>
    </article>
  );
}
