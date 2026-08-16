import "server-only";

import { and, desc, eq, inArray, isNull, notInArray } from "drizzle-orm";

import { db } from "@/db";
import { projectMediaAssets } from "@/db/schema";

export async function createProjectMediaAsset(input: Readonly<{
  projectId: string | null; uploadedById: string; kind: "hero" | "gallery";
  url: string; pathname: string; contentType: string; sizeBytes: number | null;
  alt: string; caption: string | null;
}>) {
  const [asset] = await db.insert(projectMediaAssets).values(input).onConflictDoNothing({ target: projectMediaAssets.url }).returning();
  return asset ?? null;
}

export async function syncProjectMediaAssets(input: Readonly<{ projectId: string; uploadedById: string; urls: readonly string[] }>) {
  const urls = [...new Set(input.urls)].slice(0, 13);
  const detach = db.update(projectMediaAssets).set({ projectId: null }).where(
    urls.length ? and(eq(projectMediaAssets.projectId, input.projectId), notInArray(projectMediaAssets.url, urls)) : eq(projectMediaAssets.projectId, input.projectId),
  );
  if (!urls.length) { await detach; return; }
  const attach = db.update(projectMediaAssets).set({ projectId: input.projectId }).where(and(isNull(projectMediaAssets.projectId), eq(projectMediaAssets.uploadedById, input.uploadedById), inArray(projectMediaAssets.url, urls)));
  await db.batch([detach, attach]);
}

export async function listProjectMediaAssets(limit = 60) {
  return db.select({
    id: projectMediaAssets.id, projectId: projectMediaAssets.projectId,
    kind: projectMediaAssets.kind, url: projectMediaAssets.url,
    alt: projectMediaAssets.alt, createdAt: projectMediaAssets.createdAt,
  }).from(projectMediaAssets).orderBy(desc(projectMediaAssets.createdAt)).limit(Math.min(100, Math.max(1, limit)));
}

export async function getProjectMediaAssetById(id: string) {
  const [asset] = await db.select().from(projectMediaAssets).where(eq(projectMediaAssets.id, id)).limit(1);
  return asset ?? null;
}

export async function deleteProjectMediaAssetRecord(id: string) {
  const [asset] = await db.delete(projectMediaAssets).where(eq(projectMediaAssets.id, id)).returning();
  return asset ?? null;
}
