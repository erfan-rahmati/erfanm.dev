import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import {
  articles,
  mediaAssets,
  users,
} from "@/db/schema";
import type { ArticleEditorInput } from "@/features/admin/articles/article.schema";
import { calculateReadingMinutes } from "@/features/blog/article-content.utils";

const publicArticleCardSelection = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  cardTitle: articles.cardTitle,
  excerpt: articles.excerpt,
  category: articles.category,
  badge: articles.badge,
  coverImageUrl: articles.coverImageUrl,
  coverImageAlt: articles.coverImageAlt,
  readingMinutes: articles.readingMinutes,
  publishedAt: articles.publishedAt,
  updatedAt: articles.updatedAt,
} as const;

export type PublicArticleCard = Awaited<
  ReturnType<typeof listPublishedArticles>
>["items"][number];

function publishedArticleCondition() {
  return and(
    eq(articles.status, "published"),
    eq(articles.noIndex, false),
  );
}

export async function listPublishedArticles(
  input: Readonly<{
    page?: number;
    pageSize?: number;
    category?: string;
  }> = {},
) {
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(
    24,
    Math.max(1, input.pageSize ?? 12),
  );

  const filters: SQL[] = [
    publishedArticleCondition() as SQL,
  ];

  if (input.category?.trim()) {
    filters.push(
      eq(
        articles.category,
        input.category.trim(),
      ),
    );
  }

  const where = and(...filters);

  const [items, totalResult] =
    await Promise.all([
      db
        .select(publicArticleCardSelection)
        .from(articles)
        .where(where)
        .orderBy(
          desc(articles.isFeatured),
          desc(articles.publishedAt),
          desc(articles.createdAt),
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({
          value: count(),
        })
        .from(articles)
        .where(where),
    ]);

  const total = Number(
    totalResult[0]?.value ?? 0,
  );

  return {
    items,
    page,
    pageSize,
    total,
    pageCount: Math.max(
      1,
      Math.ceil(total / pageSize),
    ),
  };
}

export async function listRecentPublishedArticles(
  limit = 4,
) {
  return db
    .select(publicArticleCardSelection)
    .from(articles)
    .where(publishedArticleCondition())
    .orderBy(
      desc(articles.isFeatured),
      desc(articles.publishedAt),
      desc(articles.createdAt),
    )
    .limit(Math.min(8, Math.max(1, limit)));
}

export const getPublishedArticleBySlug = cache(
  async (slug: string) => {
    const [article] = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        cardTitle: articles.cardTitle,
        excerpt: articles.excerpt,
        summary: articles.summary,
        category: articles.category,
        badge: articles.badge,
        tags: articles.tags,
        coverImageUrl:
          articles.coverImageUrl,
        coverImageAlt:
          articles.coverImageAlt,
        content: articles.content,
        keyTakeaways:
          articles.keyTakeaways,
        faqItems: articles.faqItems,
        sources: articles.sources,
        seoTitle: articles.seoTitle,
        seoDescription:
          articles.seoDescription,
        canonicalUrl:
          articles.canonicalUrl,
        noIndex: articles.noIndex,
        readingMinutes:
          articles.readingMinutes,
        publishedAt: articles.publishedAt,
        updatedAt: articles.updatedAt,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(articles)
      .leftJoin(
        users,
        eq(articles.authorId, users.id),
      )
      .where(
        and(
          eq(articles.slug, slug),
          eq(articles.status, "published"),
        ),
      )
      .limit(1);

    return article ?? null;
  },
);

export async function listPublishedArticleSlugs() {
  return db
    .select({
      slug: articles.slug,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .where(publishedArticleCondition())
    .orderBy(desc(articles.publishedAt));
}

export async function listPublishedArticlesForDiscovery(
  limit = 50,
) {
  return db
    .select({
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      category: articles.category,
      publishedAt: articles.publishedAt,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .where(publishedArticleCondition())
    .orderBy(
      desc(articles.publishedAt),
      desc(articles.createdAt),
    )
    .limit(Math.min(100, Math.max(1, limit)));
}

export async function listPublishedCategories() {
  return db
    .selectDistinct({
      category: articles.category,
    })
    .from(articles)
    .where(publishedArticleCondition())
    .orderBy(asc(articles.category));
}

export async function listAdminArticles(
  input: Readonly<{
    page?: number;
    pageSize?: number;
    query?: string;
    status?: "draft" | "published" | "archived";
  }> = {},
) {
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(
    50,
    Math.max(1, input.pageSize ?? 15),
  );
  const filters: SQL[] = [];

  if (input.status) {
    filters.push(
      eq(articles.status, input.status),
    );
  }

  if (input.query?.trim()) {
    const query = `%${input.query.trim()}%`;
    const searchCondition = or(
      ilike(articles.title, query),
      ilike(articles.slug, query),
      ilike(articles.category, query),
    );

    if (searchCondition) {
      filters.push(searchCondition);
    }
  }

  const where =
    filters.length > 0
      ? and(...filters)
      : undefined;

  const [items, totalResult] =
    await Promise.all([
      db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          status: articles.status,
          category: articles.category,
          isFeatured: articles.isFeatured,
          publishedAt: articles.publishedAt,
          updatedAt: articles.updatedAt,
        })
        .from(articles)
        .where(where)
        .orderBy(desc(articles.updatedAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ value: count() })
        .from(articles)
        .where(where),
    ]);

  const total = Number(
    totalResult[0]?.value ?? 0,
  );

  return {
    items,
    page,
    total,
    pageCount: Math.max(
      1,
      Math.ceil(total / pageSize),
    ),
  };
}

export const getAdminArticleById = cache(
  async (id: string) => {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);

    return article ?? null;
  },
);

export async function createArticle(
  input: ArticleEditorInput,
  userId: string,
) {
  const now = new Date();
  const [createdArticle] = await db
    .insert(articles)
    .values({
      ...input,
      tags: [...input.tags],
      readingMinutes:
        calculateReadingMinutes(
          input.content,
        ),
      authorId: userId,
      updatedById: userId,
      publishedAt:
        input.status === "published"
          ? now
          : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      id: articles.id,
      slug: articles.slug,
    });

  if (!createdArticle) {
    throw new Error(
      "Article creation returned no record.",
    );
  }

  return createdArticle;
}

export async function updateArticle(
  id: string,
  input: ArticleEditorInput,
  userId: string,
) {
  const existing =
    await getAdminArticleById(id);

  if (!existing) {
    return null;
  }

  const [updatedArticle] = await db
    .update(articles)
    .set({
      ...input,
      tags: [...input.tags],
      readingMinutes:
        calculateReadingMinutes(
          input.content,
        ),
      authorId:
        existing.authorId ?? userId,
      updatedById: userId,
      publishedAt:
        input.status === "published"
          ? (existing.publishedAt ??
            new Date())
          : existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))
    .returning({
      id: articles.id,
      slug: articles.slug,
    });

  return updatedArticle ?? null;
}

export async function archiveArticle(
  id: string,
  userId: string,
) {
  const [article] = await db
    .update(articles)
    .set({
      status: "archived",
      noIndex: true,
      updatedById: userId,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))
    .returning({
      id: articles.id,
      slug: articles.slug,
    });

  return article ?? null;
}

export async function deleteArticleById(
  id: string,
) {
  const [deleted] = await db
    .delete(articles)
    .where(eq(articles.id, id))
    .returning({
      id: articles.id,
      slug: articles.slug,
    });

  return deleted ?? null;
}

export async function getArticleMediaUrls(
  articleId: string,
) {
  return db
    .select({
      url: mediaAssets.url,
    })
    .from(mediaAssets)
    .where(
      eq(mediaAssets.articleId, articleId),
    );
}

export async function getArticleDashboardCounts() {
  const grouped = await db
    .select({
      status: articles.status,
      value: count(),
    })
    .from(articles)
    .groupBy(articles.status);

  const counts = {
    draft: 0,
    published: 0,
    archived: 0,
  };

  for (const row of grouped) {
    counts[row.status] = Number(row.value);
  }

  return counts;
}
