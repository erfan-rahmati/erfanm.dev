import { issueSignedToken, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getSessionForHeaders,
  isAdminSession,
} from "@/server/auth/admin-session";
import { getAdminProjectById } from "@/server/projects/project.repository";
import { isBlobConfigurationError } from "@/server/blob/blob-auth";

const uploadPayloadSchema = z.object({
  projectId: z.string().uuid().nullable(),
  kind: z.enum(["hero", "gallery"]),
  alt: z.string().trim().min(3).max(260),
  sizeBytes: z.number().int().min(1).max(8 * 1024 * 1024),
});

const uploadRequestSchema = z.object({
  pathname: z.string().trim().min(1).max(950),
  metadata: uploadPayloadSchema,
});

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

const ALLOWED_FILE_EXTENSION = /\.(?:jpe?g|png|webp|avif)$/i;
const FIVE_MINUTES = 5 * 60 * 1_000;

export async function POST(request: Request) {
  try {
    const session = await getSessionForHeaders(request.headers);

    if (!session || !isAdminSession(session)) {
      return NextResponse.json(
        { error: "نشست مدیریت معتبر نیست." },
        { status: 401 },
      );
    }

    const { pathname, metadata } = uploadRequestSchema.parse(
      await request.json(),
    );

    if (
      !pathname.startsWith("projects/") ||
      !ALLOWED_FILE_EXTENSION.test(pathname)
    ) {
      return NextResponse.json(
        { error: "مسیر فایل برای رسانه پروژه معتبر نیست." },
        { status: 400 },
      );
    }

    if (metadata.projectId) {
      const project = await getAdminProjectById(metadata.projectId);

      if (!project) {
        return NextResponse.json(
          { error: "پروژه موردنظر پیدا نشد." },
          { status: 404 },
        );
      }
    }

    const validUntil = Date.now() + FIVE_MINUTES;
    const signedToken = await issueSignedToken({
      pathname,
      operations: ["put"],
      validUntil,
      allowedContentTypes: [...ALLOWED_CONTENT_TYPES],
      maximumSizeInBytes: 8 * 1024 * 1024,
    });

    const { presignedUrl } = await presignUrl(signedToken, {
      operation: "put",
      pathname,
      access: "public",
      validUntil,
      allowedContentTypes: [...ALLOWED_CONTENT_TYPES],
      maximumSizeInBytes: 8 * 1024 * 1024,
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json({ presignedUrl, pathname });
  } catch (error) {
    if (isBlobConfigurationError(error)) {
      console.error(
        "Project media upload is unavailable because Blob access is not configured for the current Vercel environment.",
      );

      return NextResponse.json(
        {
          error:
            "اتصال Blob برای محیط فعلی فعال نیست. دسترسی Development پروژه را در اتصال Blob فعال کن.",
          code: "BLOB_CONFIGURATION_INVALID",
        },
        { status: 503 },
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات فایل برای آپلود معتبر نیست." },
        { status: 400 },
      );
    }

    console.error("Project media upload failed.", error);

    return NextResponse.json(
      { error: "آماده‌سازی آپلود تصویر پروژه انجام نشد." },
      { status: 400 },
    );
  }
}
