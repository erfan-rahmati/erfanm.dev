import { z } from "zod";

import {
  isAllowedArticleImageUrl,
  isSafeHttpUrl,
} from "@/features/blog/article-content.utils";
import type {
  ProjectCardLayout,
  ProjectGalleryImage,
  ProjectHighlight,
} from "@/features/projects/project.types";

export const PROJECT_STATUS_IDS = ["draft", "published", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUS_IDS)[number];

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalUrl = z.string().trim().max(2_000).refine(
  (value) => !value || isSafeHttpUrl(value),
  "آدرس واردشده معتبر نیست.",
);
const imageUrl = z.string().trim().max(2_000).refine(
  isAllowedArticleImageUrl,
  "تصویر باید محلی یا از فضای امن رسانه سایت باشد.",
);
const highlightSchema = z.object({
  title: text(2, 100),
  description: text(5, 500),
});
const galleryImageSchema = z.object({
  url: imageUrl,
  alt: text(3, 260),
  caption: z.string().trim().max(500).optional(),
});

const rawSchema = z.object({
  id: z.string().uuid().optional(),
  slug: text(3, 180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "اسلاگ فقط حروف انگلیسی کوچک، عدد و خط تیره دارد."),
  title: text(2, 200),
  eyebrow: text(2, 100),
  shortDescription: text(20, 360),
  overview: text(30, 8_000),
  challenge: text(20, 5_000),
  solution: text(20, 5_000),
  category: text(2, 100),
  services: z.string().trim().max(1_000),
  technologies: z.string().trim().max(1_000),
  highlightsJson: z.string().max(12_000),
  heroImageUrl: imageUrl,
  heroImageAlt: text(3, 260),
  galleryImagesJson: z.string().max(30_000),
  accentColor: z.string().trim().regex(/^#[0-9a-f]{6}$/i, "رنگ باید به فرمت #6D5CFF باشد."),
  externalUrl: optionalUrl,
  repositoryUrl: optionalUrl,
  cardLayout: z.enum(["featured", "standard", "wide"]),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
  status: z.enum(PROJECT_STATUS_IDS),
  isFeatured: z.boolean(),
  noIndex: z.boolean(),
  seoTitle: z.string().trim().max(75),
  seoDescription: text(50, 180),
  canonicalUrl: optionalUrl,
});

function parseJsonArray<T>(value: string, schema: z.ZodType<T>, label: string, maximum = 12): readonly T[] {
  let parsed: unknown;
  try { parsed = JSON.parse(value); }
  catch { throw new Error(`${label} ساختار معتبر ندارد.`); }
  return z.array(schema).max(maximum).parse(parsed);
}

function list(value: string) {
  return Array.from(new Set(value.split(/[،,\n]/u).map((item) => item.trim()).filter(Boolean))).slice(0, 20);
}

export type ProjectEditorInput = Readonly<{
  id?: string | undefined;
  slug: string;
  title: string;
  eyebrow: string;
  shortDescription: string;
  overview: string;
  challenge: string;
  solution: string;
  category: string;
  services: readonly string[];
  technologies: readonly string[];
  highlights: readonly ProjectHighlight[];
  heroImageUrl: string;
  heroImageAlt: string;
  galleryImages: readonly ProjectGalleryImage[];
  accentColor: string;
  externalUrl: string | null;
  repositoryUrl: string | null;
  cardLayout: ProjectCardLayout;
  sortOrder: number;
  status: ProjectStatus;
  isFeatured: boolean;
  noIndex: boolean;
  seoTitle: string | null;
  seoDescription: string;
  canonicalUrl: string | null;
}>;

export function parseProjectFormData(formData: FormData): ProjectEditorInput {
  const value = rawSchema.parse({
    id: String(formData.get("id") ?? "") || undefined,
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    eyebrow: String(formData.get("eyebrow") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    overview: String(formData.get("overview") ?? ""),
    challenge: String(formData.get("challenge") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    category: String(formData.get("category") ?? ""),
    services: String(formData.get("services") ?? ""),
    technologies: String(formData.get("technologies") ?? ""),
    highlightsJson: String(formData.get("highlightsJson") ?? "[]"),
    heroImageUrl: String(formData.get("heroImageUrl") ?? ""),
    heroImageAlt: String(formData.get("heroImageAlt") ?? ""),
    galleryImagesJson: String(formData.get("galleryImagesJson") ?? "[]"),
    accentColor: String(formData.get("accentColor") ?? "#6D5CFF"),
    externalUrl: String(formData.get("externalUrl") ?? ""),
    repositoryUrl: String(formData.get("repositoryUrl") ?? ""),
    cardLayout: String(formData.get("cardLayout") ?? "standard"),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
    status: String(formData.get("status") ?? "draft"),
    isFeatured: formData.get("isFeatured") === "on",
    noIndex: formData.get("noIndex") === "on",
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    canonicalUrl: String(formData.get("canonicalUrl") ?? ""),
  });

  return {
    ...value,
    services: list(value.services),
    technologies: list(value.technologies),
    highlights: parseJsonArray(value.highlightsJson, highlightSchema, "ویژگی‌ها"),
    galleryImages: parseJsonArray(value.galleryImagesJson, galleryImageSchema, "گالری", 3).map(
      (image) => image.caption
        ? { url: image.url, alt: image.alt, caption: image.caption }
        : { url: image.url, alt: image.alt },
    ),
    externalUrl: value.externalUrl || null,
    repositoryUrl: value.repositoryUrl || null,
    seoTitle: value.seoTitle || null,
    canonicalUrl: value.canonicalUrl || null,
  };
}
