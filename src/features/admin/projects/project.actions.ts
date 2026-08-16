"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { requireAdminSession } from "@/server/auth/admin-session";
import {
  archiveProject, createProject, deleteProjectById, getAdminProjectById,
  getProjectMediaUrls, updateProject,
} from "@/server/projects/project.repository";
import { deleteProjectMediaAssetRecord, getProjectMediaAssetById, syncProjectMediaAssets } from "@/server/projects/project-media.repository";

import { parseProjectFormData } from "./project.schema";

export type ProjectActionState = Readonly<{ ok: boolean; message: string; projectId?: string; slug?: string }>;

function revalidate(slug?: string) {
  for (const path of ["/", "/projects", "/admin", "/admin/projects", "/sitemap.xml", "/llms.txt"]) revalidatePath(path);
  if (slug) revalidatePath(`/projects/${slug}`);
}

function safeError(error: unknown) {
  if (error instanceof ZodError) return error.issues[0]?.message ?? "یکی از ورودی‌های پروژه معتبر نیست.";
  if (typeof error === "object" && error && "code" in error && error.code === "23505") return "این اسلاگ قبلاً استفاده شده است.";
  if (error instanceof Error && error.message === "UNAUTHORIZED") return "نشست مدیریت معتبر نیست. دوباره وارد شو.";
  if (error instanceof Error && !/database|SQL/i.test(error.message)) return error.message;
  return "ذخیره پروژه انجام نشد. ورودی‌ها را بررسی و دوباره تلاش کن.";
}

export async function saveProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  try {
    const session = await requireAdminSession();
    const input = parseProjectFormData(formData);
    const previous = input.id ? await getAdminProjectById(input.id) : null;
    const saved = input.id ? await updateProject(input.id, input, session.user.id) : await createProject(input, session.user.id);
    if (!saved) return { ok: false, message: "پروژه پیدا نشد." };
    const urls = [input.heroImageUrl, ...input.galleryImages.map((image) => image.url)];
    await syncProjectMediaAssets({ projectId: saved.id, uploadedById: session.user.id, urls }).catch((error) => console.error("Project media sync failed.", error));
    if (previous) revalidate(previous.slug);
    revalidate(saved.slug);
    return { ok: true, message: "پروژه با موفقیت ذخیره شد.", projectId: saved.id, slug: saved.slug };
  } catch (error) {
    if (!(error instanceof ZodError)) {
      console.error("Project save failed.", error);
    }
    return { ok: false, message: safeError(error) };
  }
}

export async function archiveProjectAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!zUuid(id)) throw new Error("INVALID_PROJECT_ID");
  const project = await archiveProject(id, session.user.id);
  if (project) revalidate(project.slug);
}

function zUuid(value: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }

export async function deleteProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  try {
    await requireAdminSession();
    const id = String(formData.get("id") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "").trim();
    if (!zUuid(id) || confirmation !== "حذف دائمی") return { ok: false, message: "عبارت «حذف دائمی» را دقیق وارد کن." };
    const current = await getAdminProjectById(id);
    if (!current) return { ok: false, message: "پروژه پیدا نشد." };
    const media = await getProjectMediaUrls(id);
    const deleted = await deleteProjectById(id);
    if (!deleted) return { ok: false, message: "پروژه حذف نشد." };
    if (media.length) await del(media.map((item) => item.url)).catch((error) => console.error("Project blobs could not be deleted.", error));
    revalidate(deleted.slug);
    return { ok: true, message: "پروژه برای همیشه حذف شد." };
  } catch (error) {
    console.error("Project deletion failed.", error);
    return { ok: false, message: safeError(error) };
  }
}

export async function deleteProjectMediaAction(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!zUuid(id)) throw new Error("INVALID_PROJECT_MEDIA_ID");
  const asset = await getProjectMediaAssetById(id);
  if (!asset) return;
  if (asset.projectId) throw new Error("MEDIA_ATTACHED_TO_PROJECT");
  await deleteProjectMediaAssetRecord(id);
  await del(asset.url).catch((error) => console.error("Orphan project blob could not be removed.", error));
  revalidatePath("/admin/media");
}
