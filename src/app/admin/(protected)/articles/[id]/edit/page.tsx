import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleEditorForm } from "@/features/admin/articles/article-editor-form";
import { getAdminArticleById } from "@/server/articles/article.repository";
import { listMediaAssets } from "@/server/articles/media.repository";

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/articles/[id]/edit">) {
  const { id } = await params;
  const [article, allMediaAssets] = await Promise.all([
    getAdminArticleById(id),
    listMediaAssets(80),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            ویرایش محتوا
          </span>
          <h1>{article.cardTitle}</h1>
          <p dir="ltr">/blog/{article.slug}</p>
        </div>
        <div className="admin-page__actions">
          <Link
            href={`/admin/articles/${article.id}/preview`}
            className="admin-button"
            target="_blank"
          >
            پیش‌نمایش امن
          </Link>
          <Link
            href="/admin/articles"
            className="admin-button"
          >
            بازگشت
          </Link>
        </div>
      </header>

      <ArticleEditorForm
        mediaAssets={allMediaAssets.filter((asset) => asset.articleId === null || asset.articleId === article.id)}
        initialData={{
          id: article.id,
          title: article.title,
          cardTitle: article.cardTitle,
          slug: article.slug,
          excerpt: article.excerpt,
          summary: article.summary,
          category: article.category,
          badge: article.badge,
          tags: article.tags,
          coverImageUrl: article.coverImageUrl,
          coverImageAlt: article.coverImageAlt,
          content: article.content,
          keyTakeaways: article.keyTakeaways,
          faqItems: article.faqItems,
          sources: article.sources,
          seoTitle: article.seoTitle,
          seoDescription:
            article.seoDescription,
          canonicalUrl: article.canonicalUrl,
          status: article.status,
          isFeatured: article.isFeatured,
          noIndex: article.noIndex,
        }}
      />
    </main>
  );
}
