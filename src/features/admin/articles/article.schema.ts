import { z } from "zod";

import {
  isAllowedArticleImageUrl,
  isArticleDocument,
  isSafeHttpUrl,
  MAX_ARTICLE_JSON_BYTES,
} from "@/features/blog/article-content.utils";
import type {
  ArticleDocument,
  ArticleFaqItem,
  ArticleSourceItem,
} from "@/features/blog/article-content.types";

export const ARTICLE_STATUS_IDS = [
  "draft",
  "published",
  "archived",
] as const;

export type ArticleStatus =
  (typeof ARTICLE_STATUS_IDS)[number];

const normalizedText = (
  minimum: number,
  maximum: number,
) =>
  z
    .string()
    .trim()
    .min(minimum)
    .max(maximum);

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "اسلاگ فقط باید شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.",
  );

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2_000)
  .refine(
    (value) =>
      value.length === 0 ||
      isSafeHttpUrl(value),
    "آدرس واردشده معتبر نیست.",
  );

const optionalImageUrlSchema = z
  .string()
  .trim()
  .max(2_000)
  .refine(
    (value) =>
      value.length === 0 ||
      isAllowedArticleImageUrl(value),
    "تصویر باید از رسانه‌های امن سایت انتخاب شود.",
  );

const articleFaqSchema = z.object({
  question: normalizedText(5, 240),
  answer: normalizedText(10, 2_000),
});

const articleSourceSchema = z.object({
  title: normalizedText(2, 240),
  url: z
    .string()
    .trim()
    .max(2_000)
    .refine(
      isSafeHttpUrl,
      "آدرس منبع معتبر نیست.",
    ),
  publisher: z
    .string()
    .trim()
    .max(160)
    .optional(),
});

function parseJson(
  value: string,
  label: string,
): unknown {
  try {
    return JSON.parse(value) as unknown;
  }
  catch {
    throw new Error(
      `${label} ساختار JSON معتبری ندارد.`,
    );
  }
}

function parseArticleDocument(
  value: string,
): ArticleDocument {
  if (
    new TextEncoder().encode(value).length >
    MAX_ARTICLE_JSON_BYTES
  ) {
    throw new Error(
      "حجم محتوای مقاله بیش از حد مجاز است.",
    );
  }

  const parsed = parseJson(
    value,
    "محتوای مقاله",
  );

  if (!isArticleDocument(parsed)) {
    throw new Error(
      "ساختار محتوای مقاله معتبر یا امن نیست.",
    );
  }

  return parsed;
}

function parseStringArray(
  value: string,
): readonly string[] {
  const parsed = parseJson(
    value,
    "نکات کلیدی",
  );

  return z
    .array(normalizedText(3, 400))
    .max(12)
    .parse(parsed);
}

function parseFaqItems(
  value: string,
): readonly ArticleFaqItem[] {
  const parsed = parseJson(
    value,
    "پرسش‌های متداول",
  );

  return z
    .array(articleFaqSchema)
    .max(15)
    .parse(parsed);
}

function parseSources(
  value: string,
): readonly ArticleSourceItem[] {
  const parsed = parseJson(value, "منابع");

  return z
    .array(articleSourceSchema)
    .max(30)
    .parse(parsed)
    .map((source) => ({
      title: source.title,
      url: source.url,
      ...(source.publisher
        ? {
            publisher: source.publisher,
          }
        : {}),
    }));
}

const rawArticleSchema = z.object({
  id: z.string().uuid().optional(),
  title: normalizedText(8, 240),
  cardTitle: normalizedText(8, 190),
  slug: slugSchema,
  excerpt: normalizedText(30, 600),
  summary: normalizedText(30, 1_200),
  category: normalizedText(2, 90),
  badge: normalizedText(2, 90),
  tags: z.string().trim().max(600),
  coverImageUrl: optionalImageUrlSchema,
  coverImageAlt: z
    .string()
    .trim()
    .max(260),
  contentJson: z.string().min(2),
  keyTakeawaysJson: z.string().min(2),
  faqItemsJson: z.string().min(2),
  sourcesJson: z.string().min(2),
  seoTitle: z.string().trim().max(75),
  seoDescription: normalizedText(50, 180),
  canonicalUrl: optionalUrlSchema,
  status: z.enum(ARTICLE_STATUS_IDS),
  isFeatured: z.boolean(),
  noIndex: z.boolean(),
});

export type ArticleEditorInput = Readonly<{
  id?: string;
  title: string;
  cardTitle: string;
  slug: string;
  excerpt: string;
  summary: string;
  category: string;
  badge: string;
  tags: readonly string[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  content: ArticleDocument;
  keyTakeaways: readonly string[];
  faqItems: readonly ArticleFaqItem[];
  sources: readonly ArticleSourceItem[];
  seoTitle: string | null;
  seoDescription: string;
  canonicalUrl: string | null;
  status: ArticleStatus;
  isFeatured: boolean;
  noIndex: boolean;
}>;

function optionalString(
  value: string,
): string | null {
  return value.length > 0 ? value : null;
}

export function parseArticleFormData(
  formData: FormData,
): ArticleEditorInput {
  const rawInput = rawArticleSchema.parse({
    id:
      String(formData.get("id") ?? "") ||
      undefined,
    title: String(formData.get("title") ?? ""),
    cardTitle: String(
      formData.get("cardTitle") ?? "",
    ),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(
      formData.get("excerpt") ?? "",
    ),
    summary: String(
      formData.get("summary") ?? "",
    ),
    category: String(
      formData.get("category") ?? "",
    ),
    badge: String(formData.get("badge") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    coverImageUrl: String(
      formData.get("coverImageUrl") ?? "",
    ),
    coverImageAlt: String(
      formData.get("coverImageAlt") ?? "",
    ),
    contentJson: String(
      formData.get("contentJson") ?? "",
    ),
    keyTakeawaysJson: String(
      formData.get("keyTakeawaysJson") ?? "[]",
    ),
    faqItemsJson: String(
      formData.get("faqItemsJson") ?? "[]",
    ),
    sourcesJson: String(
      formData.get("sourcesJson") ?? "[]",
    ),
    seoTitle: String(
      formData.get("seoTitle") ?? "",
    ),
    seoDescription: String(
      formData.get("seoDescription") ?? "",
    ),
    canonicalUrl: String(
      formData.get("canonicalUrl") ?? "",
    ),
    status: String(
      formData.get("status") ?? "draft",
    ),
    isFeatured:
      formData.get("isFeatured") === "on",
    noIndex: formData.get("noIndex") === "on",
  });

  const tags = Array.from(
    new Set(
      rawInput.tags
        .split(/[،,]/u)
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ).slice(0, 15);

  if (rawInput.canonicalUrl) {
    const expectedCanonical =
      `https://erfanmdev.ir/blog/${rawInput.slug}`;
    const canonical = new URL(
      rawInput.canonicalUrl,
    ).href.replace(/\/$/u, "");

    if (canonical !== expectedCanonical) {
      throw new Error(
        `Canonical این مقاله باید دقیقاً ${expectedCanonical} باشد.`,
      );
    }
  }

  if (
    rawInput.coverImageUrl &&
    rawInput.coverImageAlt.length < 3
  ) {
    throw new Error(
      "برای تصویر کاور، متن جایگزین دقیق وارد کن.",
    );
  }

  return {
    ...(rawInput.id
      ? {
          id: rawInput.id,
        }
      : {}),
    title: rawInput.title,
    cardTitle: rawInput.cardTitle,
    slug: rawInput.slug,
    excerpt: rawInput.excerpt,
    summary: rawInput.summary,
    category: rawInput.category,
    badge: rawInput.badge,
    tags,
    coverImageUrl: optionalString(
      rawInput.coverImageUrl,
    ),
    coverImageAlt: optionalString(
      rawInput.coverImageAlt,
    ),
    content: parseArticleDocument(
      rawInput.contentJson,
    ),
    keyTakeaways: parseStringArray(
      rawInput.keyTakeawaysJson,
    ),
    faqItems: parseFaqItems(
      rawInput.faqItemsJson,
    ),
    sources: parseSources(
      rawInput.sourcesJson,
    ),
    seoTitle: optionalString(
      rawInput.seoTitle,
    ),
    seoDescription:
      rawInput.seoDescription,
    canonicalUrl: optionalString(
      rawInput.canonicalUrl,
    ),
    status: rawInput.status,
    isFeatured: rawInput.isFeatured,
    noIndex: rawInput.noIndex,
  };
}
