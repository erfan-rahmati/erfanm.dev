import { notFound } from "next/navigation";

import "@/features/blog/blog.css";

import { siteIdentity } from "@/config/site";
import { BlogArticleView } from "@/features/blog/blog-article-view";
import { getAdminArticleById } from "@/server/articles/article.repository";

export default async function AdminArticlePreviewPage({
  params,
}: PageProps<"/admin/articles/[id]/preview">) {
  const { id } = await params;
  const article = await getAdminArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <BlogArticleView
      isPreview
      article={{
        ...article,
        authorName: siteIdentity.ownerName,
      }}
    />
  );
}
