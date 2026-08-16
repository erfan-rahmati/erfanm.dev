import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/features/blog/blog-card";
import {
  listPublishedArticles,
  listPublishedCategories,
} from "@/server/articles/article.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مقالات طراحی سایت، توسعه وب و سئو",
  description:
    "مقالات تخصصی و راهنماهای عملی عرفان رحمتی درباره طراحی سایت، توسعه وب‌اپلیکیشن، سئو فنی، تجربه کاربری و ساخت محصولات دیجیتال.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title:
      "مقالات طراحی سایت و توسعه وب | erfanm.dev",
    description:
      "راهنماهای عملی طراحی سایت، برنامه‌نویسی وب، سئو و بهینه‌سازی محصولات دیجیتال.",
  },
};

function createBlogHref(
  page: number,
  category?: string,
) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogArchivePage({
  searchParams,
}: PageProps<"/blog">) {
  const params = await searchParams;
  const category =
    typeof params.category === "string"
      ? params.category.slice(0, 90)
      : undefined;
  const rawPage = Number(
    typeof params.page === "string"
      ? params.page
      : "1",
  );
  const page = Number.isSafeInteger(rawPage)
    ? Math.max(1, rawPage)
    : 1;

  const [result, categories] =
    await Promise.all([
      listPublishedArticles({
        page,
        ...(category ? { category } : {}),
      }),
      listPublishedCategories(),
    ]);

  return (
    <main className="blog-archive">
      <section className="blog-archive__hero">
        <div className="blog-container">
          <span className="blog-eyebrow">
            INSIGHTS / ARTICLES
          </span>
          <h1>
            مقاله‌های طراحی سایت، توسعه وب و سئو
          </h1>
          <p>
            تجربه‌ها و راهنماهای عملی برای ساخت
            وب‌سایت‌های سریع، امن، سئوپذیر و قابل‌توسعه؛
            با تمرکز ویژه بر نیاز کسب‌وکارهای بابلسر،
            مازندران و سراسر ایران.
          </p>
        </div>
      </section>

      <section className="blog-archive__content blog-container">
        {categories.length > 1 ? (
          <nav
            className="blog-categories"
            aria-label="فیلتر دسته‌بندی مقالات"
          >
            <Link
              href="/blog"
              className={!category ? "is-active" : ""}
            >
              همه مقالات
            </Link>
            {categories.map((item) => (
              <Link
                key={item.category}
                href={createBlogHref(
                  1,
                  item.category,
                )}
                className={
                  category === item.category
                    ? "is-active"
                    : ""
                }
              >
                {item.category}
              </Link>
            ))}
          </nav>
        ) : null}

        {result.items.length > 0 ? (
          <div className="blog-grid">
            {result.items.map((article) => (
              <BlogCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <h2>هنوز مقاله‌ای در این بخش نیست</h2>
            <p>
              با تغییر فیلتر یا بازگشت در آینده، نوشته‌های
              جدید را ببین.
            </p>
          </div>
        )}

        {result.pageCount > 1 ? (
          <nav
            className="blog-pagination"
            aria-label="صفحه‌بندی مقالات"
          >
            {result.page > 1 ? (
              <Link
                href={createBlogHref(
                  result.page - 1,
                  category,
                )}
              >
                صفحه قبل
              </Link>
            ) : null}
            <span>
              صفحه {result.page.toLocaleString("fa-IR")} از{" "}
              {result.pageCount.toLocaleString("fa-IR")}
            </span>
            {result.page < result.pageCount ? (
              <Link
                href={createBlogHref(
                  result.page + 1,
                  category,
                )}
              >
                صفحه بعد
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
