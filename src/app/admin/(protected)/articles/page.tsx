import Link from "next/link";

import {
  formatAdminDate,
  formatAdminNumber,
} from "@/features/admin/admin-formatters";
import {
  archiveArticleAction,
} from "@/features/admin/articles/article.actions";
import { ArticleDeleteForm } from "@/features/admin/articles/article-delete-form";
import {
  ARTICLE_STATUS_IDS,
  type ArticleStatus,
} from "@/features/admin/articles/article.schema";
import { listAdminArticles } from "@/server/articles/article.repository";

const articleStatusLabels: Record<
  ArticleStatus,
  string
> = {
  draft: "پیش‌نویس",
  published: "منتشرشده",
  archived: "آرشیوشده",
};

function isArticleStatus(
  value: string | undefined,
): value is ArticleStatus {
  return ARTICLE_STATUS_IDS.some(
    (status) => status === value,
  );
}

function createArticlesHref(
  page: number,
  query: string,
  status?: ArticleStatus,
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query) params.set("q", query);
  if (status) params.set("status", status);
  return `/admin/articles?${params.toString()}`;
}

export default async function AdminArticlesPage({
  searchParams,
}: PageProps<"/admin/articles">) {
  const params = await searchParams;
  const query =
    typeof params.q === "string"
      ? params.q.slice(0, 120)
      : "";
  const statusValue =
    typeof params.status === "string"
      ? params.status
      : undefined;
  const status = isArticleStatus(statusValue)
    ? statusValue
    : undefined;
  const pageValue = Number(
    typeof params.page === "string"
      ? params.page
      : "1",
  );

  const result = await listAdminArticles({
    page: Number.isSafeInteger(pageValue)
      ? pageValue
      : 1,
    query,
    ...(status ? { status } : {}),
  });

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            مدیریت محتوا
          </span>
          <h1>مقالات</h1>
          <p>
            {formatAdminNumber(result.total)} مقاله در
            این فهرست وجود دارد.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="admin-button admin-button--primary"
        >
          مقاله جدید
        </Link>
      </header>

      <form className="admin-filter-form">
        <input
          name="q"
          defaultValue={query}
          placeholder="جست‌وجوی عنوان، اسلاگ یا دسته‌بندی"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="draft">پیش‌نویس</option>
          <option value="published">
            منتشرشده
          </option>
          <option value="archived">
            آرشیوشده
          </option>
        </select>
        <button
          type="submit"
          className="admin-button"
        >
          اعمال فیلتر
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>مقاله</th>
              <th>دسته‌بندی</th>
              <th>وضعیت</th>
              <th>آخرین ویرایش</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((article) => (
              <tr key={article.id}>
                <td>
                  <div className="admin-table__title">
                    <strong>{article.title}</strong>
                    <small>/blog/{article.slug}</small>
                  </div>
                </td>
                <td>{article.category}</td>
                <td>
                  <span
                    className={`admin-status admin-status--${article.status}`}
                  >
                    {
                      articleStatusLabels[
                        article.status
                      ]
                    }
                  </span>
                </td>
                <td>
                  {formatAdminDate(
                    article.updatedAt,
                  )}
                </td>
                <td>
                  <div className="admin-table__actions">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                    >
                      ویرایش
                    </Link>
                    <Link
                      href={`/admin/articles/${article.id}/preview`}
                      target="_blank"
                    >
                      پیش‌نمایش
                    </Link>
                    {article.status !==
                    "archived" ? (
                      <form
                        action={archiveArticleAction}
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={article.id}
                        />
                        <button type="submit">
                          آرشیو
                        </button>
                      </form>
                    ) : null}
                  </div>
                  <ArticleDeleteForm
                    articleId={article.id}
                    articleTitle={article.title}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {result.items.length === 0 ? (
          <p className="admin-empty">
            مقاله‌ای مطابق این فیلتر پیدا نشد.
          </p>
        ) : null}
      </div>

      <nav
        className="admin-pagination"
        aria-label="صفحه‌بندی مقالات"
      >
        {result.page > 1 ? (
          <Link
            href={createArticlesHref(
              result.page - 1,
              query,
              status,
            )}
          >
            صفحه قبل
          </Link>
        ) : null}
        <span>
          صفحه {formatAdminNumber(result.page)} از{" "}
          {formatAdminNumber(result.pageCount)}
        </span>
        {result.page < result.pageCount ? (
          <Link
            href={createArticlesHref(
              result.page + 1,
              query,
              status,
            )}
          >
            صفحه بعد
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
