import { del, head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminArticleById } from "@/server/articles/article.repository";
import { createMediaAsset } from "@/server/articles/media.repository";
import {
  getSessionForHeaders,
  isAdminSession,
} from "@/server/auth/admin-session";
import { isBlobConfigurationError } from "@/server/blob/blob-auth";

const finalizeSchema = z.object({
  articleId: z.string().uuid().nullable(),
  kind: z.enum(["cover", "content"]),
  alt: z.string().trim().min(3).max(260),
  caption: z.string().trim().max(1_000).nullable(),
  pathname: z.string().trim().min(1).max(950),
});

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_FILE_EXTENSION = /\.(?:jpe?g|png|webp|avif)$/i;

export async function POST(request: Request) {
  let uploadedPathname: string | null = null;

  try {
    const session = await getSessionForHeaders(request.headers);

    if (!session || !isAdminSession(session)) {
      return NextResponse.json(
        { error: "نشست مدیریت معتبر نیست." },
        { status: 401 },
      );
    }

    const payload = finalizeSchema.parse(await request.json());
    uploadedPathname = payload.pathname;

    if (payload.articleId) {
      const article = await getAdminArticleById(payload.articleId);

      if (!article) {
        throw new Error("ARTICLE_NOT_FOUND");
      }
    }

    const blob = await head(payload.pathname);

    if (
      !blob.pathname.startsWith("articles/") ||
      !ALLOWED_FILE_EXTENSION.test(blob.pathname) ||
      !ALLOWED_CONTENT_TYPES.has(blob.contentType) ||
      blob.size < 1 ||
      blob.size > 5 * 1024 * 1024
    ) {
      throw new Error("INVALID_BLOB_METADATA");
    }

    await createMediaAsset({
      articleId: null,
      uploadedById: session.user.id,
      kind: payload.kind,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      sizeBytes: blob.size,
      alt: payload.alt,
      caption: payload.caption,
    });

    return NextResponse.json({
      ok: true,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
      },
    });
  } catch (error) {
    if (uploadedPathname) {
      try {
        await del(uploadedPathname);
      } catch {
        // Best-effort cleanup only. Never hide the original finalize error.
      }
    }

    if (isBlobConfigurationError(error)) {
      return NextResponse.json(
        {
          error:
            "اتصال Blob برای محیط فعلی فعال نیست. دسترسی Development پروژه را در اتصال Blob فعال کن.",
          code: "BLOB_CONFIGURATION_INVALID",
        },
        { status: 503 },
      );
    }

    console.error("Admin media finalize failed.", error);

    return NextResponse.json(
      { error: "ثبت تصویر در کتابخانه رسانه انجام نشد." },
      { status: 400 },
    );
  }
}
