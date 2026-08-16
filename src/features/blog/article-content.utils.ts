import type {
  ArticleContentNode,
  ArticleDocument,
} from "./article-content.types";

const ALLOWED_NODE_TYPES = new Set([
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "text",
  "image",
  "table",
  "tableRow",
  "tableHeader",
  "tableCell",
]);

const ALLOWED_MARK_TYPES = new Set([
  "bold",
  "italic",
  "strike",
  "code",
  "link",
]);

const MAX_DOCUMENT_DEPTH = 14;
const MAX_DOCUMENT_NODES = 4_000;
const MAX_DOCUMENT_TEXT_LENGTH = 120_000;
const MAX_DOCUMENT_IMAGES = 4;
export const MAX_ARTICLE_JSON_BYTES = 600_000;

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function isSafeHttpUrl(
  value: string,
): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  }
  catch {
    return false;
  }
}

export function isAllowedArticleImageUrl(
  value: string,
): boolean {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (url.hostname === "erfanmdev.ir" ||
        url.hostname.endsWith(
          ".public.blob.vercel-storage.com",
        ))
    );
  }
  catch {
    return false;
  }
}

type DocumentValidationState = {
  nodes: number;
  textLength: number;
  images: number;
};

function validateContentNode(
  value: unknown,
  depth: number,
  state: DocumentValidationState,
): value is ArticleContentNode {
  if (
    !isRecord(value) ||
    typeof value.type !== "string" ||
    !ALLOWED_NODE_TYPES.has(value.type) ||
    depth > MAX_DOCUMENT_DEPTH
  ) {
    return false;
  }

  state.nodes += 1;

  if (state.nodes > MAX_DOCUMENT_NODES) {
    return false;
  }

  if (value.type === "text") {
    if (typeof value.text !== "string") {
      return false;
    }

    state.textLength += value.text.length;

    if (
      state.textLength >
      MAX_DOCUMENT_TEXT_LENGTH
    ) {
      return false;
    }
  }

  if (value.type === "heading") {
    const level = isRecord(value.attrs)
      ? value.attrs.level
      : undefined;

    if (level !== 2 && level !== 3) {
      return false;
    }
  }

  if (value.type === "image") {
    state.images += 1;

    if (
      state.images > MAX_DOCUMENT_IMAGES
    ) {
      return false;
    }

    if (!isRecord(value.attrs)) {
      return false;
    }

    const src = value.attrs.src;
    const alt = value.attrs.alt;

    if (
      typeof src !== "string" ||
      !isAllowedArticleImageUrl(src) ||
      typeof alt !== "string" ||
      alt.trim().length < 3 ||
      alt.length > 260
    ) {
      return false;
    }
  }

  if (value.marks !== undefined) {
    if (!Array.isArray(value.marks)) {
      return false;
    }

    for (const mark of value.marks) {
      if (
        !isRecord(mark) ||
        typeof mark.type !== "string" ||
        !ALLOWED_MARK_TYPES.has(mark.type)
      ) {
        return false;
      }

      if (mark.type === "link") {
        const href = isRecord(mark.attrs)
          ? mark.attrs.href
          : undefined;

        if (
          typeof href !== "string" ||
          !isSafeHttpUrl(href)
        ) {
          return false;
        }
      }
    }
  }

  if (value.content !== undefined) {
    if (!Array.isArray(value.content)) {
      return false;
    }

    for (const child of value.content) {
      if (
        !validateContentNode(
          child,
          depth + 1,
          state,
        )
      ) {
        return false;
      }
    }
  }

  return true;
}

export function isArticleDocument(
  value: unknown,
): value is ArticleDocument {
  if (
    !isRecord(value) ||
    value.type !== "doc" ||
    !Array.isArray(value.content)
  ) {
    return false;
  }

  return validateContentNode(value, 0, {
    nodes: 0,
    textLength: 0,
    images: 0,
  });
}

export function collectArticleImageUrls(
  document: ArticleDocument,
): readonly string[] {
  const urls = new Set<string>();

  function visit(node: ArticleContentNode) {
    if (
      node.type === "image" &&
      typeof node.attrs?.src === "string" &&
      isAllowedArticleImageUrl(node.attrs.src)
    ) {
      urls.add(node.attrs.src);
    }

    node.content?.forEach(visit);
  }

  document.content.forEach(visit);

  return [...urls];
}

export function extractArticlePlainText(
  document: ArticleDocument,
): string {
  const textParts: string[] = [];

  function visit(node: ArticleContentNode) {
    if (
      node.type === "text" &&
      typeof node.text === "string"
    ) {
      textParts.push(node.text);
    }

    node.content?.forEach(visit);

    if (
      node.type === "paragraph" ||
      node.type === "heading" ||
      node.type === "listItem"
    ) {
      textParts.push("\n");
    }
  }

  document.content.forEach(visit);

  return textParts
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateReadingMinutes(
  document: ArticleDocument,
): number {
  const wordCount = extractArticlePlainText(
    document,
  )
    .split(/\s+/u)
    .filter(Boolean).length;

  return Math.max(
    1,
    Math.ceil(wordCount / 190),
  );
}
