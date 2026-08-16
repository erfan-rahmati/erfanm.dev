import "server-only";

import {
  and,
  desc,
  eq,
  inArray,
  isNull,
  notInArray,
} from "drizzle-orm";

import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export async function createMediaAsset(
  input: Readonly<{
    articleId: string | null;
    uploadedById: string;
    kind: "cover" | "content";
    url: string;
    pathname: string;
    contentType: string;
    sizeBytes: number | null;
    alt: string;
    caption: string | null;
  }>,
) {
  const [created] = await db
    .insert(mediaAssets)
    .values(input)
    .onConflictDoNothing({
      target: mediaAssets.url,
    })
    .returning();

  return created ?? null;
}

export async function listMediaAssets(
  limit = 60,
) {
  return db
    .select({
      id: mediaAssets.id,
      articleId: mediaAssets.articleId,
      kind: mediaAssets.kind,
      url: mediaAssets.url,
      pathname: mediaAssets.pathname,
      contentType: mediaAssets.contentType,
      sizeBytes: mediaAssets.sizeBytes,
      alt: mediaAssets.alt,
      caption: mediaAssets.caption,
      createdAt: mediaAssets.createdAt,
    })
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt))
    .limit(Math.min(100, Math.max(1, limit)));
}

export async function getMediaAssetById(
  id: string,
) {
  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  return asset ?? null;
}

export async function deleteMediaAssetRecord(
  id: string,
) {
  const [asset] = await db
    .delete(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .returning();

  return asset ?? null;
}

export async function syncArticleMediaAssets(
  input: Readonly<{
    articleId: string;
    uploadedById: string;
    urls: readonly string[];
  }>,
) {
  const urls = [...new Set(input.urls)].slice(
    0,
    101,
  );

  const detachUnused = db
    .update(mediaAssets)
    .set({
      articleId: null,
    })
    .where(
      urls.length > 0
        ? and(
            eq(
              mediaAssets.articleId,
              input.articleId,
            ),
            notInArray(
              mediaAssets.url,
              urls,
            ),
          )
        : eq(
            mediaAssets.articleId,
            input.articleId,
          ),
    );

  if (urls.length === 0) {
    await detachUnused;
    return;
  }

  const attachReferenced = db
    .update(mediaAssets)
    .set({
      articleId: input.articleId,
    })
    .where(
      and(
        isNull(mediaAssets.articleId),
        eq(
          mediaAssets.uploadedById,
          input.uploadedById,
        ),
        inArray(mediaAssets.url, urls),
      ),
    );

  await db.batch([
    detachUnused,
    attachReferenced,
  ]);
}
