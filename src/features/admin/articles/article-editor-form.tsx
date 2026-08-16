"use client";


import { finalizeAdminUpload } from "@/features/admin/media/finalize-upload";
import { uploadWithPresignedUrl } from "@/features/admin/media/presigned-upload";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EditorContent,
  useEditor,
  type Editor,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";

import type {
  ArticleDocument,
  ArticleFaqItem,
  ArticleSourceItem,
} from "@/features/blog/article-content.types";

import {
  saveArticleAction,
  type ArticleActionState,
} from "./article.actions";

export type ArticleMediaOption = Readonly<{
  id: string;
  articleId: string | null;
  url: string;
  alt: string;
  caption: string | null;
}>;

export type ArticleEditorInitialData =
  Readonly<{
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
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    noIndex: boolean;
  }>;

const initialActionState: ArticleActionState = {
  ok: false,
  message: "",
};

function sanitizeFileName(fileName: string) {
  const extension =
    fileName.split(".").pop()?.toLowerCase() ??
    "webp";

  return `${crypto.randomUUID()}.${extension.replace(/[^a-z0-9]/g, "")}`;
}

type EditorToolbarProps = Readonly<{
  editor: Editor | null;
  onSelectImage: () => void;
  onOpenMedia: () => void;
  onEditLink: () => void;
}>;

function EditorToolbar({
  editor,
  onSelectImage,
  onOpenMedia,
  onEditLink,
}: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div
      className="admin-editor__toolbar"
      aria-label="ابزارهای ویرایش مقاله"
    >
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .setParagraph()
            .run()
        }
      >
        متن
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
      >
        H2
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        }
      >
        H3
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
      >
        ضخیم
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
      >
        مورب
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
      >
        فهرست
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
      >
        شماره‌دار
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        }
      >
        نقل‌قول
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleCodeBlock()
            .run()
        }
      >
        کد
      </button>
      <button
        type="button"
        onClick={onEditLink}
      >
        افزودن/ویرایش لینک
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run()
        }
      >
        جدول
      </button>
      {editor.isActive("table") ? (
        <>
          <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>+ ردیف</button>
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ ستون</button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()}>حذف ردیف</button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()}>حذف ستون</button>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()}>حذف جدول</button>
        </>
      ) : null}
      <button
        type="button"
        onClick={onSelectImage}
      >
        افزودن تصویر
      </button>
      <button type="button" onClick={onOpenMedia}>
        انتخاب از رسانه‌ها
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().undo().run()
        }
      >
        بازگشت
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().redo().run()
        }
      >
        تکرار
      </button>
    </div>
  );
}

export function ArticleEditorForm({
  initialData,
  mediaAssets = [],
}: Readonly<{
  initialData: ArticleEditorInitialData;
  mediaAssets?: readonly ArticleMediaOption[];
}>) {
  const router = useRouter();
  const imageInputRef =
    useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] =
    useActionState(
      saveArticleAction,
      initialActionState,
    );

  const [contentJson, setContentJson] =
    useState(
      JSON.stringify(initialData.content),
    );
  const [coverImageUrl, setCoverImageUrl] =
    useState(initialData.coverImageUrl ?? "");
  const [coverImageAlt, setCoverImageAlt] =
    useState(initialData.coverImageAlt ?? "");
  const [takeaways, setTakeaways] =
    useState<string[]>([
      ...initialData.keyTakeaways,
    ]);
  const [faqItems, setFaqItems] = useState<
    ArticleFaqItem[]
  >([...initialData.faqItems]);
  const [sources, setSources] = useState<
    ArticleSourceItem[]
  >([...initialData.sources]);
  const [uploadAlt, setUploadAlt] =
    useState("");
  const [uploadCaption, setUploadCaption] =
    useState("");
  const [isUploading, setIsUploading] =
    useState(false);
  const [uploadMessage, setUploadMessage] =
    useState("");
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [linkMessage, setLinkMessage] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      TiptapImage.configure({
        allowBase64: false,
      }),
      TableKit,
      Placeholder.configure({
        placeholder:
          "متن کامل مقاله را از اینجا بنویس...",
      }),
    ],
    content: JSON.parse(
      JSON.stringify(initialData.content),
    ) as JSONContent,
    onUpdate: ({ editor: currentEditor }) => {
      setContentJson(
        JSON.stringify(
          currentEditor.getJSON(),
        ),
      );
    },
  });

  const serializedTakeaways = useMemo(
    () =>
      JSON.stringify(
        takeaways
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    [takeaways],
  );
  const serializedFaqItems = useMemo(
    () =>
      JSON.stringify(
        faqItems.filter(
          (item) =>
            item.question.trim() &&
            item.answer.trim(),
        ),
      ),
    [faqItems],
  );
  const serializedSources = useMemo(
    () =>
      JSON.stringify(
        sources.filter(
          (item) =>
            item.title.trim() &&
            item.url.trim(),
        ),
      ),
    [sources],
  );

  const contentImageCount = useMemo(() => {
    try {
      const document = JSON.parse(contentJson) as JSONContent;
      let count = 0;
      const visit = (node: JSONContent) => {
        if (node.type === "image") count += 1;
        node.content?.forEach(visit);
      };
      visit(document);
      return count;
    } catch {
      return 0;
    }
  }, [contentJson]);

  const tocHeadings = useMemo(() => {
    try {
      const document = JSON.parse(contentJson) as JSONContent;
      const result: string[] = [];
      const textOf = (node: JSONContent): string => node.text ?? node.content?.map(textOf).join("") ?? "";
      const visit = (node: JSONContent) => {
        if (node.type === "heading" && node.attrs?.level === 2) {
          const text = textOf(node).trim();
          if (text) result.push(text);
        }
        node.content?.forEach(visit);
      };
      visit(document);
      return result;
    } catch {
      return [];
    }
  }, [contentJson]);

  function insertMediaAsset(asset: ArticleMediaOption) {
    if (contentImageCount >= 4) {
      setUploadMessage("حداکثر ۴ تصویر داخل متن مجاز است؛ همراه کاور، مقاله ۵ تصویر خواهد داشت.");
      return;
    }
    editor?.chain().focus().setImage({
      src: asset.url,
      alt: asset.alt,
      ...(asset.caption ? { title: asset.caption } : {}),
    }).run();
    setIsMediaOpen(false);
    setUploadMessage("تصویر کتابخانه در محل نشانگر درج شد.");
  }

  function applyLink() {
    const value = linkHref.trim();
    if (!(value.startsWith("/") && !value.startsWith("//")) && !/^https?:\/\//i.test(value)) {
      setLinkMessage("برای لینک داخلی از /blog/... و برای لینک خارجی از https://... استفاده کن.");
      return;
    }
    if (!editor || editor.state.selection.empty) {
      setLinkMessage("ابتدا متن موردنظر را در ویرایشگر انتخاب کن.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
    setIsLinkOpen(false);
    setLinkMessage("");
  }

  useEffect(() => {
    if (!state.ok || !state.articleId) {
      return;
    }

    if (!initialData.id) {
      router.replace(
        `/admin/articles/${state.articleId}/edit?saved=1`,
      );
      return;
    }

    router.refresh();
  }, [
    initialData.id,
    router,
    state.articleId,
    state.ok,
  ]);

  async function uploadSelectedImage(
    file: File,
    kind: "cover" | "content",
  ) {
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setUploadMessage(
        "فقط JPG، PNG، WebP یا AVIF تا حجم ۵ مگابایت مجاز است.",
      );
      return;
    }

    if (uploadAlt.trim().length < 3) {
      setUploadMessage(
        "پیش از آپلود، متن جایگزین دقیق تصویر را وارد کن.",
      );
      return;
    }

    setIsUploading(true);
    setUploadMessage("");

    try {
      const uploadMetadata = {
        articleId: initialData.id ?? null,
        kind,
        alt: uploadAlt.trim(),
        caption: uploadCaption.trim() || null,
        sizeBytes: file.size,
      } as const;

      const preparedUpload = await uploadWithPresignedUrl(
        "/api/admin/media/upload",
        `articles/${sanitizeFileName(file.name)}`,
        file,
        uploadMetadata,
      );

      const blob = await finalizeAdminUpload(
        "/api/admin/media/finalize",
        {
          articleId: uploadMetadata.articleId,
          kind: uploadMetadata.kind,
          alt: uploadMetadata.alt,
          caption: uploadMetadata.caption,
          pathname: preparedUpload.pathname,
        },
      );

      if (kind === "cover") {
        setCoverImageUrl(blob.url);
        setCoverImageAlt(uploadAlt.trim());
      }
      else {
        if (contentImageCount >= 4) {
          setUploadMessage(
            "حداکثر ۴ تصویر داخل متن مجاز است؛ همراه کاور، مقاله ۵ تصویر خواهد داشت.",
          );
          return;
        }
        editor
          ?.chain()
          .focus()
          .setImage({
            src: blob.url,
            alt: uploadAlt.trim(),
            ...(uploadCaption.trim()
              ? {
                  title:
                    uploadCaption.trim(),
                }
              : {}),
          })
          .run();
      }

      setUploadMessage(
        "تصویر با موفقیت آپلود شد.",
      );
      setUploadAlt("");
      setUploadCaption("");
    }
    catch (error) {
      setUploadMessage(
        error instanceof Error
          ? error.message
          : "آپلود تصویر انجام نشد. اتصال، Token فضای رسانه و نشست ورود را بررسی کن.",
      );
    }
    finally {
      setIsUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }

  return (
    <form action={formAction}>
      {initialData.id ? (
        <input
          type="hidden"
          name="id"
          value={initialData.id}
        />
      ) : null}
      <input
        type="hidden"
        name="contentJson"
        value={contentJson}
      />
      <input
        type="hidden"
        name="keyTakeawaysJson"
        value={serializedTakeaways}
      />
      <input
        type="hidden"
        name="faqItemsJson"
        value={serializedFaqItems}
      />
      <input
        type="hidden"
        name="sourcesJson"
        value={serializedSources}
      />
      <input
        type="hidden"
        name="coverImageUrl"
        value={coverImageUrl}
      />
      <input
        type="hidden"
        name="coverImageAlt"
        value={coverImageAlt}
      />

      <div className="admin-editor-layout">
        <div className="admin-editor-column">
          <section className="admin-panel admin-form-stack">
            <div className="admin-field-grid">
              <label className="admin-field">
                <span>عنوان اصلی (H1)</span>
                <input
                  name="title"
                  defaultValue={initialData.title}
                  minLength={8}
                  maxLength={240}
                  required
                />
              </label>
              <label className="admin-field">
                <span>عنوان کوتاه کارت</span>
                <input
                  name="cardTitle"
                  defaultValue={
                    initialData.cardTitle
                  }
                  minLength={8}
                  maxLength={190}
                  required
                />
              </label>
            </div>

            <label className="admin-field">
              <span>اسلاگ انگلیسی</span>
              <input
                name="slug"
                defaultValue={initialData.slug}
                dir="ltr"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                required
              />
              <small>
                نمونه:
                web-design-cost-babolsar
              </small>
            </label>

            <label className="admin-field">
              <span>خلاصه کارت</span>
              <textarea
                name="excerpt"
                defaultValue={initialData.excerpt}
                minLength={30}
                maxLength={600}
                required
              />
            </label>

            <label className="admin-field">
              <span>
                پاسخ کوتاه و مستقیم مقاله (GEO)
              </span>
              <textarea
                name="summary"
                defaultValue={initialData.summary}
                minLength={30}
                maxLength={1200}
                required
              />
              <small>
                این بخش ابتدای مقاله قرار می‌گیرد تا
                پاسخ اصلی برای کاربر و موتورهای پاسخ‌گو
                شفاف باشد.
              </small>
            </label>
          </section>

          <section className="admin-panel">
            <h2>محتوای مقاله</h2>
            <p>
              فقط یک H1 در صفحه وجود دارد؛ داخل متن از
              H2 و H3 استفاده کن.
            </p>

            <div className="admin-editor">
              <EditorToolbar
                editor={editor}
                onSelectImage={() => {
                  imageInputRef.current?.click();
                }}
                onOpenMedia={() => setIsMediaOpen((current) => !current)}
                onEditLink={() => {
                  setLinkHref(String(editor?.getAttributes("link").href ?? ""));
                  setLinkMessage("");
                  setIsLinkOpen((current) => !current);
                }}
              />
              {isLinkOpen ? (
                <div className="admin-editor__link-panel">
                  <label className="admin-field">
                    <span>آدرس لینک داخلی یا خارجی</span>
                    <input
                      value={linkHref}
                      dir="ltr"
                      placeholder="/blog/article-slug یا https://example.com"
                      onChange={(event) => setLinkHref(event.target.value)}
                    />
                  </label>
                  <div className="admin-editor__link-actions">
                    <button type="button" className="admin-button admin-button--primary" onClick={applyLink}>ثبت روی متن انتخاب‌شده</button>
                    <button type="button" className="admin-button" onClick={() => {
                      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
                      setIsLinkOpen(false);
                    }}>حذف لینک</button>
                    <button type="button" className="admin-button" onClick={() => setIsLinkOpen(false)}>انصراف</button>
                  </div>
                  {linkMessage ? <p className="admin-alert admin-alert--error">{linkMessage}</p> : null}
                </div>
              ) : null}
              {isMediaOpen ? (
                <div className="admin-editor__media-picker">
                  <div className="admin-editor__guide-heading">
                    <div><strong>انتخاب از کتابخانه رسانه</strong><small>فقط تصاویر آزاد یا متصل به همین مقاله نمایش داده می‌شوند.</small></div>
                    <button type="button" onClick={() => setIsMediaOpen(false)}>بستن</button>
                  </div>
                  {mediaAssets.length ? (
                    <div className="admin-editor__media-grid">
                      {mediaAssets.map((asset) => (
                        <article key={asset.id}>
                          <Image src={asset.url} alt={asset.alt} width={320} height={200} unoptimized />
                          <strong>{asset.alt}</strong>
                          <div>
                            <button type="button" onClick={() => insertMediaAsset(asset)}>درج در متن</button>
                            <button type="button" onClick={() => {
                              setCoverImageUrl(asset.url);
                              setCoverImageAlt(asset.alt);
                              setIsMediaOpen(false);
                            }}>انتخاب به‌عنوان کاور</button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : <p className="admin-empty">تصویر آزادی وجود ندارد؛ از همین صفحه یا بخش رسانه‌ها تصویر آپلود کن.</p>}
                </div>
              ) : null}
              <EditorContent editor={editor} />
            </div>
            <div className="admin-editor-guide">
              <div>
                <strong>تصاویر مقاله: {contentImageCount.toLocaleString("fa-IR")} از ۴ تصویر داخل متن</strong>
                <p>یک کاور در بالا و ۲ تا ۴ تصویر داخل متن پیشنهاد می‌شود. نشانگر را وسط متن یا نزدیک انتهای متن بگذار و «افزودن تصویر» را بزن.</p>
              </div>
              <div>
                <strong>فهرست «در این مقاله» خودکار است</strong>
                <p>هر عنوانی که با دکمه H2 بسازی، خودکار به فهرست کناری و لینک اسکرول همان بخش تبدیل می‌شود.</p>
                {tocHeadings.length ? <ol>{tocHeadings.map((heading, index) => <li key={`${heading}-${index}`}>{heading}</li>)}</ol> : null}
              </div>
              <div>
                <strong>جدول و لینک</strong>
                <p>برای لینک، ابتدا متن را انتخاب کن. دکمه «جدول» یک جدول ۳×۳ می‌سازد و وقتی نشانگر داخل جدول باشد، ابزارهای ردیف و ستون ظاهر می‌شوند.</p>
              </div>
            </div>
          </section>

          <section className="admin-panel admin-form-stack">
            <div>
              <h2>نکات کلیدی</h2>
              <p>
                برای جمع‌بندی سریع و استخراج بهتر پاسخ‌ها
              </p>
            </div>
            <div className="admin-list-editor">
              {takeaways.map((item, index) => (
                <div
                  key={`${index}-${item}`}
                  className="admin-list-editor__item"
                >
                  <input
                    value={item}
                    maxLength={400}
                    onChange={(event) => {
                      setTakeaways((current) =>
                        current.map(
                          (value, itemIndex) =>
                            itemIndex === index
                              ? event.target.value
                              : value,
                        ),
                      );
                    }}
                    aria-label={`نکته کلیدی ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="admin-list-editor__remove"
                    onClick={() => {
                      setTakeaways((current) =>
                        current.filter(
                          (_, itemIndex) =>
                            itemIndex !== index,
                        ),
                      );
                    }}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-button"
              onClick={() => {
                setTakeaways((current) => [
                  ...current,
                  "",
                ]);
              }}
            >
              افزودن نکته
            </button>
          </section>

          <section className="admin-panel admin-form-stack">
            <div>
              <h2>پرسش‌های متداول</h2>
              <p>
                پرسش‌های واقعی و پاسخ‌های مستقل، کوتاه و
                دقیق بنویس.
              </p>
            </div>
            <div className="admin-list-editor">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="admin-list-editor__item admin-list-editor__item--multi"
                >
                  <input
                    value={item.question}
                    placeholder="سؤال"
                    onChange={(event) => {
                      setFaqItems((current) =>
                        current.map(
                          (value, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...value,
                                  question:
                                    event.target.value,
                                }
                              : value,
                        ),
                      );
                    }}
                  />
                  <input
                    value={item.answer}
                    placeholder="پاسخ کوتاه"
                    onChange={(event) => {
                      setFaqItems((current) =>
                        current.map(
                          (value, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...value,
                                  answer:
                                    event.target.value,
                                }
                              : value,
                        ),
                      );
                    }}
                  />
                  <button
                    type="button"
                    className="admin-list-editor__remove"
                    onClick={() => {
                      setFaqItems((current) =>
                        current.filter(
                          (_, itemIndex) =>
                            itemIndex !== index,
                        ),
                      );
                    }}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-button"
              onClick={() => {
                setFaqItems((current) => [
                  ...current,
                  {
                    question: "",
                    answer: "",
                  },
                ]);
              }}
            >
              افزودن پرسش
            </button>
          </section>

          <section className="admin-panel admin-form-stack">
            <div>
              <h2>منابع و استنادها</h2>
              <p>
                برای ادعاهای مهم، منبع معتبر و مستقیم ثبت
                کن.
              </p>
            </div>
            <div className="admin-list-editor">
              {sources.map((item, index) => (
                <div
                  key={index}
                  className="admin-list-editor__item admin-list-editor__item--multi"
                >
                  <input
                    value={item.title}
                    placeholder="عنوان منبع"
                    onChange={(event) => {
                      setSources((current) =>
                        current.map(
                          (value, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...value,
                                  title:
                                    event.target.value,
                                }
                              : value,
                        ),
                      );
                    }}
                  />
                  <input
                    value={item.url}
                    placeholder="https://..."
                    dir="ltr"
                    onChange={(event) => {
                      setSources((current) =>
                        current.map(
                          (value, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...value,
                                  url: event.target.value,
                                }
                              : value,
                        ),
                      );
                    }}
                  />
                  <button
                    type="button"
                    className="admin-list-editor__remove"
                    onClick={() => {
                      setSources((current) =>
                        current.filter(
                          (_, itemIndex) =>
                            itemIndex !== index,
                        ),
                      );
                    }}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-button"
              onClick={() => {
                setSources((current) => [
                  ...current,
                  {
                    title: "",
                    url: "",
                  },
                ]);
              }}
            >
              افزودن منبع
            </button>
          </section>
        </div>

        <aside className="admin-editor-sidebar">
          <section className="admin-panel admin-form-stack">
            <h2>انتشار</h2>
            <label className="admin-field">
              <span>وضعیت</span>
              <select
                name="status"
                defaultValue={initialData.status}
              >
                <option value="draft">
                  پیش‌نویس
                </option>
                <option value="published">
                  منتشرشده
                </option>
                <option value="archived">
                  آرشیوشده
                </option>
              </select>
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={
                  initialData.isFeatured
                }
              />
              <span>نمایش به‌عنوان مقاله ویژه</span>
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="noIndex"
                defaultChecked={initialData.noIndex}
              />
              <span>عدم ایندکس در موتورهای جست‌وجو</span>
            </label>

            {state.message ? (
              <p
                className={
                  state.ok
                    ? "admin-alert admin-alert--success"
                    : "admin-alert admin-alert--error"
                }
                role="status"
              >
                {state.message}
              </p>
            ) : null}

            <button
              type="submit"
              className="admin-button admin-button--primary admin-button--wide"
              disabled={isPending || isUploading}
            >
              {isPending
                ? "در حال ذخیره..."
                : "ذخیره مقاله"}
            </button>
          </section>

          <section className="admin-panel admin-form-stack">
            <h2>دسته‌بندی و برچسب</h2>
            <label className="admin-field">
              <span>دسته‌بندی</span>
              <input
                name="category"
                defaultValue={initialData.category}
                required
              />
            </label>
            <label className="admin-field">
              <span>نشان کارت</span>
              <input
                name="badge"
                defaultValue={initialData.badge}
                required
              />
            </label>
            <label className="admin-field">
              <span>برچسب‌ها</span>
              <input
                name="tags"
                defaultValue={
                  initialData.tags.join("، ")
                }
              />
              <small>با ویرگول جدا کن.</small>
            </label>
          </section>

          <section className="admin-panel admin-form-stack">
            <h2>تصویر و رسانه</h2>
            {coverImageUrl ? (
              <div className="admin-media-upload__preview">
                <Image
                  src={coverImageUrl}
                  alt={
                    coverImageAlt ||
                    "پیش‌نمایش تصویر کاور"
                  }
                  width={800}
                  height={450}
                  unoptimized
                />
              </div>
            ) : null}
            <label className="admin-field">
              <span>متن جایگزین تصویر</span>
              <input
                value={uploadAlt}
                maxLength={260}
                onChange={(event) => {
                  setUploadAlt(event.target.value);
                }}
              />
            </label>
            <label className="admin-field">
              <span>کپشن اختیاری</span>
              <input
                value={uploadCaption}
                maxLength={1000}
                onChange={(event) => {
                  setUploadCaption(
                    event.target.value,
                  );
                }}
              />
            </label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadSelectedImage(
                    file,
                    "content",
                  );
                }
              }}
            />
            <label className="admin-button">
              انتخاب و آپلود کاور
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                hidden
                disabled={isUploading}
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];
                  if (file) {
                    void uploadSelectedImage(
                      file,
                      "cover",
                    );
                  }
                }}
              />
            </label>
            {coverImageUrl ? (
              <button
                type="button"
                className="admin-button admin-button--danger"
                onClick={() => {
                  setCoverImageUrl("");
                  setCoverImageAlt("");
                }}
              >
                حذف کاور از مقاله
              </button>
            ) : null}
            {uploadMessage ? (
              <p className="admin-alert">
                {uploadMessage}
              </p>
            ) : null}
          </section>

          <section className="admin-panel admin-form-stack">
            <h2>SEO و Canonical</h2>
            <label className="admin-field">
              <span>عنوان SEO</span>
              <input
                name="seoTitle"
                defaultValue={
                  initialData.seoTitle ?? ""
                }
                maxLength={75}
              />
            </label>
            <label className="admin-field">
              <span>توضیحات SEO</span>
              <textarea
                name="seoDescription"
                defaultValue={
                  initialData.seoDescription
                }
                minLength={50}
                maxLength={180}
                required
              />
            </label>
            <label className="admin-field">
              <span>Canonical اختیاری</span>
              <input
                name="canonicalUrl"
                defaultValue={
                  initialData.canonicalUrl ?? ""
                }
                dir="ltr"
              />
            </label>
          </section>
        </aside>
      </div>
    </form>
  );
}
