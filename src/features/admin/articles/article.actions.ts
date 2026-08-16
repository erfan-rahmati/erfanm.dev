"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  archiveArticle,
  createArticle,
  deleteArticleById,
  getAdminArticleById,
  getArticleMediaUrls,
  updateArticle,
} from "@/server/articles/article.repository";
import {
  syncArticleMediaAssets,
  deleteMediaAssetRecord,
  getMediaAssetById,
} from "@/server/articles/media.repository";
import { requireAdminSession } from "@/server/auth/admin-session";
import { collectArticleImageUrls } from "@/features/blog/article-content.utils";

import { parseArticleFormData } from "./article.schema";

async function attachArticleMedia(
  articleId: string,
  userId: string,
  input: ReturnType<
    typeof parseArticleFormData
  >,
) {
  const urls = [
    ...(input.coverImageUrl
      ? [input.coverImageUrl]
      : []),
    ...collectArticleImageUrls(
      input.content,
    ),
  ];

  try {
    await syncArticleMediaAssets({
      articleId,
      uploadedById: userId,
      urls,
    });
  }
  catch (error) {
    console.error(
      "Article media attachment failed.",
      error,
    );
  }
}

export type ArticleActionState = Readonly<{
  ok: boolean;
  message: string;
  articleId?: string;
  slug?: string;
  fieldErrors?: Readonly<
    Record<string, readonly string[]>
  >;
}>;

function revalidateArticlePaths(
  slug?: string,
) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/llms.txt");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

function getSafeActionErrorMessage(
  error: unknown,
): string {
  if (error instanceof ZodError) {
    return (
      error.issues[0]?.message ??
      "یکی از ورودی‌های مقاله معتبر نیست."
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    return "این اسلاگ قبلاً برای مقاله دیگری استفاده شده است.";
  }

  if (error instanceof Error) {
    if (
      error.message === "UNAUTHORIZED"
    ) {
      return "نشست مدیریت معتبر نیست. دوباره وارد شو.";
    }

    if (
      !error.message.includes("database") &&
      !error.message.includes("SQL")
    ) {
      return error.message;
    }
  }

  return "عملیات ذخیره‌سازی با خطا روبه‌رو شد. دوباره تلاش کن.";
}

export async function saveArticleAction(
  _previousState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  try {
    const session =
      await requireAdminSession();
    const input =
      parseArticleFormData(formData);

    if (input.id) {
      const previousArticle =
        await getAdminArticleById(
          input.id,
        );

      if (!previousArticle) {
        return {
          ok: false,
          message: "مقاله پیدا نشد.",
        };
      }

      const updated = await updateArticle(
        input.id,
        input,
        session.user.id,
      );

      if (!updated) {
        return {
          ok: false,
          message: "مقاله پیدا نشد.",
        };
      }

      await attachArticleMedia(
        updated.id,
        session.user.id,
        input,
      );

      revalidateArticlePaths(
        previousArticle.slug,
      );
      revalidateArticlePaths(updated.slug);

      return {
        ok: true,
        message: "مقاله با موفقیت ذخیره شد.",
        articleId: updated.id,
        slug: updated.slug,
      };
    }

    const created = await createArticle(
      input,
      session.user.id,
    );

    await attachArticleMedia(
      created.id,
      session.user.id,
      input,
    );

    revalidateArticlePaths(created.slug);

    return {
      ok: true,
      message: "مقاله با موفقیت ساخته شد.",
      articleId: created.id,
      slug: created.slug,
    };
  }
  catch (error) {
    if (!(error instanceof ZodError)) {
      console.error(
        "Admin article save failed.",
        error,
      );
    }

    return {
      ok: false,
      message: getSafeActionErrorMessage(
        error,
      ),
    };
  }
}

export async function archiveArticleAction(
  formData: FormData,
): Promise<void> {
  const session =
    await requireAdminSession();
  const id = String(
    formData.get("id") ?? "",
  );

  if (
    !/^[0-9a-f-]{36}$/i.test(id)
  ) {
    throw new Error("INVALID_ARTICLE_ID");
  }

  const archived = await archiveArticle(
    id,
    session.user.id,
  );

  if (archived) {
    revalidateArticlePaths(archived.slug);
  }
}

export async function deleteArticleAction(
  _previousState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  try {
    await requireAdminSession();
    const id = String(
      formData.get("id") ?? "",
    );
    const confirmation = String(
      formData.get("confirmation") ?? "",
    ).trim();

    if (
      !/^[0-9a-f-]{36}$/i.test(id) ||
      confirmation !== "حذف دائمی"
    ) {
      return {
        ok: false,
        message:
          "برای حذف، عبارت «حذف دائمی» را دقیق وارد کن.",
      };
    }

    const article =
      await getAdminArticleById(id);

    if (!article) {
      return {
        ok: false,
        message: "مقاله پیدا نشد.",
      };
    }

    const media =
      await getArticleMediaUrls(id);

    const deleted =
      await deleteArticleById(id);

    if (!deleted) {
      return {
        ok: false,
        message:
          "مقاله حذف نشد؛ وضعیت آن را بررسی کن.",
      };
    }

    if (media.length > 0) {
      try {
        await del(
          media.map((item) => item.url),
        );
      }
      catch (blobError) {
        console.error(
          "Article blobs could not be removed.",
          blobError,
        );
      }
    }

    revalidateArticlePaths(deleted.slug);

    return {
      ok: true,
      message: "مقاله برای همیشه حذف شد.",
    };
  }
  catch (error) {
    console.error(
      "Admin article deletion failed.",
      error,
    );

    return {
      ok: false,
      message: getSafeActionErrorMessage(
        error,
      ),
    };
  }
}

export async function deleteMediaAction(
  formData: FormData,
): Promise<void> {
  await requireAdminSession();
  const id = String(
    formData.get("id") ?? "",
  );

  if (
    !/^[0-9a-f-]{36}$/i.test(id)
  ) {
    throw new Error("INVALID_MEDIA_ID");
  }

  const asset = await getMediaAssetById(id);

  if (!asset) {
    return;
  }

  if (asset.articleId) {
    throw new Error("MEDIA_ATTACHED_TO_ARTICLE");
  }

  await deleteMediaAssetRecord(id);
  try {
    await del(asset.url);
  }
  catch (error) {
    console.error(
      "Orphan media blob could not be removed.",
      error,
    );
  }
  revalidatePath("/admin/media");
}
