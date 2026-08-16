import Link from "next/link";

import { ArticleEditorForm } from "@/features/admin/articles/article-editor-form";
import { EMPTY_ARTICLE_DOCUMENT } from "@/features/blog/article-content.types";
import { listMediaAssets } from "@/server/articles/media.repository";

export default async function NewArticlePage() {
  const mediaAssets = (await listMediaAssets(80)).filter((asset) => asset.articleId === null);
  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            محتوای جدید
          </span>
          <h1>ساخت مقاله</h1>
          <p>
            مقاله را ابتدا پیش‌نویس ذخیره کن و پس از
            پیش‌نمایش منتشر کن.
          </p>
        </div>
        <Link
          href="/admin/articles"
          className="admin-button"
        >
          بازگشت به مقالات
        </Link>
      </header>

      <ArticleEditorForm
        mediaAssets={mediaAssets}
        initialData={{
          title: "",
          cardTitle: "",
          slug: "",
          excerpt: "",
          summary: "",
          category: "طراحی وب",
          badge: "راهنمای تخصصی",
          tags: [],
          coverImageUrl: null,
          coverImageAlt: null,
          content: EMPTY_ARTICLE_DOCUMENT,
          keyTakeaways: [],
          faqItems: [],
          sources: [],
          seoTitle: null,
          seoDescription: "",
          canonicalUrl: null,
          status: "draft",
          isFeatured: false,
          noIndex: false,
        }}
      />
    </main>
  );
}
