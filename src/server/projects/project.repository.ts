import "server-only";

import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { projectMediaAssets, projects } from "@/db/schema";
import type { ProjectEditorInput } from "@/features/admin/projects/project.schema";

const publicSelection = {
  id: projects.id, slug: projects.slug, title: projects.title, eyebrow: projects.eyebrow,
  shortDescription: projects.shortDescription, overview: projects.overview,
  challenge: projects.challenge, solution: projects.solution, category: projects.category,
  services: projects.services, technologies: projects.technologies, highlights: projects.highlights,
  heroImageUrl: projects.heroImageUrl, heroImageAlt: projects.heroImageAlt,
  galleryImages: projects.galleryImages, accentColor: projects.accentColor,
  externalUrl: projects.externalUrl, repositoryUrl: projects.repositoryUrl,
  cardLayout: projects.cardLayout, sortOrder: projects.sortOrder, noIndex: projects.noIndex,
  seoTitle: projects.seoTitle, seoDescription: projects.seoDescription,
  canonicalUrl: projects.canonicalUrl, publishedAt: projects.publishedAt, updatedAt: projects.updatedAt,
} as const;

export type PublicProject = Awaited<ReturnType<typeof listPublishedProjects>>[number];

function published() {
  return and(eq(projects.status, "published"), eq(projects.noIndex, false));
}

export async function listPublishedProjects() {
  return db.select(publicSelection).from(projects).where(published()).orderBy(asc(projects.sortOrder), desc(projects.isFeatured), desc(projects.publishedAt));
}

export const getPublishedProjectBySlug = cache(async (slug: string) => {
  const [project] = await db.select(publicSelection).from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.status, "published"))).limit(1);
  return project ?? null;
});

export async function listPublishedProjectSlugs() {
  return db.select({ slug: projects.slug, updatedAt: projects.updatedAt }).from(projects).where(published()).orderBy(asc(projects.sortOrder));
}

export async function listAdminProjects(input: Readonly<{ page?: number; query?: string; status?: "draft" | "published" | "archived" }> = {}) {
  const page = Math.max(1, input.page ?? 1);
  const filters: SQL[] = [];
  if (input.status) filters.push(eq(projects.status, input.status));
  if (input.query?.trim()) {
    const query = `%${input.query.trim()}%`;
    const condition = or(ilike(projects.title, query), ilike(projects.slug, query), ilike(projects.category, query));
    if (condition) filters.push(condition);
  }
  const where = filters.length ? and(...filters) : undefined;
  const [items, totals] = await Promise.all([
    db.select({ id: projects.id, title: projects.title, slug: projects.slug, category: projects.category, status: projects.status, sortOrder: projects.sortOrder, updatedAt: projects.updatedAt }).from(projects).where(where).orderBy(asc(projects.sortOrder), desc(projects.updatedAt)).limit(15).offset((page - 1) * 15),
    db.select({ value: count() }).from(projects).where(where),
  ]);
  const total = Number(totals[0]?.value ?? 0);
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / 15)) };
}

export const getAdminProjectById = cache(async (id: string) => {
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return project ?? null;
});

export async function createProject(input: ProjectEditorInput, userId: string) {
  const now = new Date();
  const [created] = await db.insert(projects).values({ ...input, services: [...input.services], technologies: [...input.technologies], highlights: [...input.highlights], galleryImages: [...input.galleryImages], authorId: userId, updatedById: userId, publishedAt: input.status === "published" ? now : null, createdAt: now, updatedAt: now }).returning({ id: projects.id, slug: projects.slug });
  if (!created) throw new Error("Project creation returned no record.");
  return created;
}

export async function updateProject(id: string, input: ProjectEditorInput, userId: string) {
  const previous = await getAdminProjectById(id);
  if (!previous) return null;
  const [updated] = await db.update(projects).set({ ...input, services: [...input.services], technologies: [...input.technologies], highlights: [...input.highlights], galleryImages: [...input.galleryImages], authorId: previous.authorId ?? userId, updatedById: userId, publishedAt: input.status === "published" ? (previous.publishedAt ?? new Date()) : previous.publishedAt, updatedAt: new Date() }).where(eq(projects.id, id)).returning({ id: projects.id, slug: projects.slug });
  return updated ?? null;
}

export async function archiveProject(id: string, userId: string) {
  const [project] = await db.update(projects).set({ status: "archived", noIndex: true, updatedById: userId, updatedAt: new Date() }).where(eq(projects.id, id)).returning({ id: projects.id, slug: projects.slug });
  return project ?? null;
}

export async function deleteProjectById(id: string) {
  const [project] = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id, slug: projects.slug });
  return project ?? null;
}

export async function getProjectMediaUrls(id: string) {
  return db.select({ url: projectMediaAssets.url }).from(projectMediaAssets).where(eq(projectMediaAssets.projectId, id));
}

export async function getProjectDashboardCounts() {
  const rows = await db.select({ status: projects.status, value: count() }).from(projects).groupBy(projects.status);
  const result = { draft: 0, published: 0, archived: 0 };
  for (const row of rows) result[row.status] = Number(row.value);
  return result;
}
