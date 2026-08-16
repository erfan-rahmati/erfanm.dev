import Image from "next/image";
import Link from "next/link";

import type {
  ArticleDocument,
  ArticleFaqItem,
  ArticleSourceItem,
} from "./article-content.types";
import {
  ArticleContent,
  collectArticleHeadings,
} from "./article-content";

const dateFormatter = new Intl.DateTimeFormat(
  "fa-IR",
  {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
);

export type BlogArticleViewModel = Readonly<{
  slug: string;
  title: string;
  summary: string;
  category: string;
  badge: string;
  tags: readonly string[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  content: ArticleDocument;
  keyTakeaways: readonly string[];
  faqItems: readonly ArticleFaqItem[];
  sources: readonly ArticleSourceItem[];
  readingMinutes: number;
  publishedAt: Date | null;
  updatedAt: Date;
  authorName: string;
}>;

export function BlogArticleView({
  article,
  isPreview = false,
}: Readonly<{
  article: BlogArticleViewModel;
  isPreview?: boolean;
}>) {
  const headings = collectArticleHeadings(
    article.content,
  ).filter((heading) => heading.level === 2);

  return (
    <main className="blog-article">
      {isPreview ? (
        <div className="blog-preview-banner">
          پیش‌نمایش خصوصی — این نسخه ایندکس نمی‌شود.
        </div>
      ) : null}

      <header className="blog-article__hero">
        <div className="blog-article__hero-inner blog-container">
          <nav
            className="blog-breadcrumb"
            aria-label="مسیر صفحه"
          >
            <Link href="/">خانه</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">مقالات</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">
              {article.category}
            </span>
          </nav>

          <div className="blog-article__labels">
            <span>{article.badge}</span>
            <span>{article.category}</span>
          </div>
          <h1>{article.title}</h1>
          <p className="blog-article__lead">
            {article.summary}
          </p>
          <div className="blog-article__meta">
            <span>
              نوشته {article.authorName}
            </span>
            <span aria-hidden="true">•</span>
            <span>
              {article.readingMinutes.toLocaleString(
                "fa-IR",
              )}{" "}
              دقیقه مطالعه
            </span>
            {article.publishedAt ? (
              <>
                <span aria-hidden="true">•</span>
                <time
                  dateTime={
                    article.publishedAt.toISOString()
                  }
                >
                  {dateFormatter.format(
                    article.publishedAt,
                  )}
                </time>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {article.coverImageUrl ? (
        <figure className="blog-article__cover blog-container">
          <Image
            src={article.coverImageUrl}
            alt={
              article.coverImageAlt ??
              article.title
            }
            width={1600}
            height={900}
            sizes="(max-width: 1440px) 100vw, 1320px"
            priority
            unoptimized
          />
        </figure>
      ) : (
        <div className="blog-article__cover-placeholder blog-container">
          <span>erfanm.dev</span>
          <strong>{article.category}</strong>
        </div>
      )}

      <div className="blog-article__layout blog-container">
        <aside className="blog-article__aside">
          {headings.length > 0 ? (
            <nav aria-label="فهرست مقاله">
              <strong>در این مقاله</strong>
              <ol>
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </aside>

        <article className="blog-article__body">
          <section
            className="blog-answer-box"
            aria-labelledby="article-short-answer"
          >
            <span>پاسخ کوتاه</span>
            <h2 id="article-short-answer">
              نتیجه اصلی چیست؟
            </h2>
            <p>{article.summary}</p>
          </section>

          {article.keyTakeaways.length > 0 ? (
            <section
              className="blog-key-takeaways"
              aria-labelledby="key-takeaways-title"
            >
              <h2 id="key-takeaways-title">
                نکات کلیدی
              </h2>
              <ul>
                {article.keyTakeaways.map(
                  (item) => (
                    <li key={item}>{item}</li>
                  ),
                )}
              </ul>
            </section>
          ) : null}

          <ArticleContent
            document={article.content}
          />

          {article.faqItems.length > 0 ? (
            <section
              className="blog-faq"
              aria-labelledby="article-faq-title"
            >
              <span className="blog-eyebrow">
                QUESTIONS / ANSWERS
              </span>
              <h2 id="article-faq-title">
                سؤالات متداول
              </h2>
              <div>
                {article.faqItems.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {article.sources.length > 0 ? (
            <section
              className="blog-sources"
              aria-labelledby="article-sources-title"
            >
              <h2 id="article-sources-title">
                منابع و مطالعه بیشتر
              </h2>
              <ol>
                {article.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title}
                    </a>
                    {source.publisher ? (
                      <span>
                        {" "}— {source.publisher}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="blog-author-card">
            <div className="blog-author-card__mark">
              ER
            </div>
            <div>
              <span>درباره نویسنده</span>
              <h2>{article.authorName}</h2>
              <p>
                توسعه‌دهنده فول‌استک با تمرکز بر طراحی
                سایت اختصاصی، توسعه وب‌اپلیکیشن، پنل‌های
                مدیریتی، API، PWA و سئو فنی؛ مستقر در
                بابلسر، مازندران.
              </p>
              <Link href="/#about">
                آشنایی بیشتر با نویسنده
              </Link>
            </div>
          </section>

          <section className="blog-article__cta">
            <span>PROJECT / CONSULTATION</span>
            <h2>
              برای پروژه خودت به یک مسیر دقیق نیاز داری؟
            </h2>
            <p>
              جزئیات اولیه پروژه را بفرست تا نیازها، مسیر
              فنی و برآورد اولیه را بررسی کنیم.
            </p>
            <Link href="/#contact">
              ثبت درخواست مشاوره
            </Link>
          </section>

          <footer className="blog-article__footer-meta">
            <p>
              آخرین به‌روزرسانی:{" "}
              <time
                dateTime={article.updatedAt.toISOString()}
              >
                {dateFormatter.format(
                  article.updatedAt,
                )}
              </time>
            </p>
            {article.tags.length > 0 ? (
              <ul aria-label="برچسب‌های مقاله">
                {article.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </footer>
        </article>
      </div>
    </main>
  );
}
