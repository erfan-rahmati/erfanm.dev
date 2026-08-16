"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";

import { finalizeAdminUpload } from "@/features/admin/media/finalize-upload";
import { uploadWithPresignedUrl } from "@/features/admin/media/presigned-upload";
import type { ProjectGalleryImage, ProjectHighlight } from "@/features/projects/project.types";
import { saveProjectAction, type ProjectActionState } from "./project.actions";

export type ProjectEditorInitialData = Readonly<{
  id?: string; slug: string; title: string; eyebrow: string; shortDescription: string;
  overview: string; challenge: string; solution: string; category: string;
  services: readonly string[]; technologies: readonly string[]; highlights: readonly ProjectHighlight[];
  heroImageUrl: string; heroImageAlt: string; galleryImages: readonly ProjectGalleryImage[];
  accentColor: string; externalUrl: string | null; repositoryUrl: string | null;
  cardLayout: "featured" | "standard" | "wide"; sortOrder: number;
  status: "draft" | "published" | "archived"; isFeatured: boolean; noIndex: boolean;
  seoTitle: string | null; seoDescription: string; canonicalUrl: string | null;
}>;

const initialState: ProjectActionState = { ok: false, message: "" };
function cleanFileName(name: string) { const extension = name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "webp"; return `${crypto.randomUUID()}.${extension}`; }

export function ProjectEditorForm({ initialData }: Readonly<{ initialData: ProjectEditorInitialData }>) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveProjectAction, initialState);
  const [heroUrl, setHeroUrl] = useState(initialData.heroImageUrl);
  const [heroAlt, setHeroAlt] = useState(initialData.heroImageAlt);
  const [gallery, setGallery] = useState<ProjectGalleryImage[]>([...initialData.galleryImages]);
  const [highlights, setHighlights] = useState<ProjectHighlight[]>([...initialData.highlights]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (state.ok && state.projectId) {
      router.replace(`/admin/projects/${state.projectId}/edit`);
      router.refresh();
    }
  }, [router, state]);

  const highlightsJson = useMemo(() => JSON.stringify(highlights.filter((item) => item.title.trim() && item.description.trim())), [highlights]);
  const galleryJson = useMemo(() => JSON.stringify(gallery.filter((item) => item.url && item.alt.trim())), [gallery]);

  async function uploadImage(file: File, kind: "hero" | "gallery", alt: string) {
    if (alt.trim().length < 3) { setUploadMessage("ابتدا متن جایگزین دقیق تصویر را وارد کن."); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) { setUploadMessage("فقط JPG، PNG، WebP یا AVIF مجاز است."); return; }
    if (file.size > 8 * 1024 * 1024) { setUploadMessage("حجم تصویر باید کمتر از ۸ مگابایت باشد."); return; }
    if (kind === "gallery" && gallery.length >= 3) { setUploadMessage("برای هر پروژه حداکثر سه اسکرین‌شات کامل گالری ثبت می‌شود."); return; }
    setUploading(true); setUploadMessage("");
    try {
      const uploadMetadata = {
        projectId: initialData.id ?? null,
        kind,
        alt: alt.trim(),
        caption: null,
        sizeBytes: file.size,
      } as const;

      const preparedUpload = await uploadWithPresignedUrl(
        "/api/admin/project-media/upload",
        `projects/${cleanFileName(file.name)}`,
        file,
        uploadMetadata,
      );

      const blob = await finalizeAdminUpload(
        "/api/admin/project-media/finalize",
        {
          projectId: uploadMetadata.projectId,
          kind: uploadMetadata.kind,
          alt: uploadMetadata.alt,
          caption: uploadMetadata.caption,
          pathname: preparedUpload.pathname,
        },
      );

      if (kind === "hero") setHeroUrl(blob.url);
      else setGallery((current) => [...current, { url: blob.url, alt: alt.trim() }].slice(0, 3));
      setUploadMessage("تصویر با موفقیت آپلود شد.");
    } catch (error) {
      setUploadMessage(
        error instanceof Error
          ? error.message
          : "آپلود انجام نشد؛ اتصال Blob و نشست مدیریت را بررسی کن.",
      );
    }
    finally { setUploading(false); }
  }

  return (
    <form action={action} className="admin-editor-layout">
      {initialData.id ? <input type="hidden" name="id" value={initialData.id} /> : null}
      <input type="hidden" name="heroImageUrl" value={heroUrl} />
      <input type="hidden" name="highlightsJson" value={highlightsJson} />
      <input type="hidden" name="galleryImagesJson" value={galleryJson} />

      <div className="admin-editor-column">
        <section className="admin-panel admin-form-stack">
          <h2>هویت و معرفی پروژه</h2>
          <div className="admin-field-grid">
            <label className="admin-field"><span>عنوان پروژه</span><input name="title" defaultValue={initialData.title} required maxLength={200} /></label>
            <label className="admin-field"><span>اسلاگ انگلیسی</span><input name="slug" dir="ltr" defaultValue={initialData.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
            <label className="admin-field"><span>برچسب بالای عنوان</span><input name="eyebrow" defaultValue={initialData.eyebrow} required /></label>
            <label className="admin-field"><span>دسته‌بندی</span><input name="category" defaultValue={initialData.category} required /></label>
          </div>
          <label className="admin-field"><span>توضیح کوتاه کارت</span><textarea name="shortDescription" defaultValue={initialData.shortDescription} required maxLength={360} /></label>
          <label className="admin-field"><span>نمای کلی</span><textarea name="overview" defaultValue={initialData.overview} required rows={7} /></label>
          <div className="admin-field-grid">
            <label className="admin-field"><span>چالش</span><textarea name="challenge" defaultValue={initialData.challenge} required rows={9} /></label>
            <label className="admin-field"><span>راهکار</span><textarea name="solution" defaultValue={initialData.solution} required rows={9} /></label>
          </div>
        </section>

        <section className="admin-panel admin-form-stack">
          <h2>ویژگی‌های شاخص</h2>
          <div className="admin-list-editor">
            {highlights.map((item, index) => (
              <div className="admin-list-editor__item admin-list-editor__item--multi" key={index}>
                <input value={item.title} aria-label={`عنوان ویژگی ${index + 1}`} onChange={(event) => setHighlights((current) => current.map((entry, i) => i === index ? { ...entry, title: event.target.value } : entry))} />
                <input value={item.description} aria-label={`توضیح ویژگی ${index + 1}`} onChange={(event) => setHighlights((current) => current.map((entry, i) => i === index ? { ...entry, description: event.target.value } : entry))} />
                <button type="button" className="admin-list-editor__remove" onClick={() => setHighlights((current) => current.filter((_, i) => i !== index))}>حذف</button>
              </div>
            ))}
          </div>
          <button type="button" className="admin-button" onClick={() => setHighlights((current) => [...current, { title: "", description: "" }].slice(0, 6))}>افزودن ویژگی</button>
        </section>

        <section className="admin-panel admin-form-stack">
          <h2>تصویر کارت و اسکرین‌شات‌های پروژه</h2>
          <p>تصویر اصلی روی کارت صفحه پروژه‌ها و ابتدای جزئیات نمایش داده می‌شود. سه تصویر گالری را به‌صورت اسکرین‌شات تمام‌صفحه آپلود کن.</p>
          <label className="admin-field"><span>متن جایگزین تصویر شاخص کارت</span><input name="heroImageAlt" value={heroAlt} onChange={(event) => setHeroAlt(event.target.value)} required /></label>
          {heroUrl ? <div className="admin-media-upload__preview"><Image src={heroUrl} alt={heroAlt || "پیش‌نمایش تصویر اصلی"} fill sizes="520px" /></div> : null}
          <label className="admin-button">{uploading ? "در حال آپلود..." : "آپلود تصویر شاخص کارت"}<input hidden type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file, "hero", heroAlt); }} /></label>
          <div className="admin-field-grid">
            <label className="admin-field"><span>متن جایگزین اسکرین‌شات تمام‌صفحه ({gallery.length.toLocaleString("fa-IR")} از ۳)</span><input id="new-gallery-alt" placeholder="مثلاً صفحه اصلی پروژه در دسکتاپ" /></label>
            <label className="admin-button">آپلود اسکرین‌شات<input hidden type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading || gallery.length >= 3} onChange={(event) => { const file = event.target.files?.[0]; const alt = (document.getElementById("new-gallery-alt") as HTMLInputElement | null)?.value ?? ""; if (file) void uploadImage(file, "gallery", alt); }} /></label>
          </div>
          {uploadMessage ? <p className="admin-alert" role="status">{uploadMessage}</p> : null}
          <div className="admin-media-grid admin-project-gallery-editor">
            {gallery.map((image, index) => (
              <article className="admin-media-card" key={`${image.url}-${index}`}>
                <div className="admin-media-card__image"><Image src={image.url} alt={image.alt} fill sizes="240px" /></div>
                <div className="admin-media-card__body">
                  <input value={image.alt} aria-label={`متن جایگزین تصویر ${index + 1}`} onChange={(event) => setGallery((current) => current.map((entry, i) => i === index ? { ...entry, alt: event.target.value } : entry))} />
                  <input value={image.caption ?? ""} placeholder="کپشن اختیاری" onChange={(event) => setGallery((current) => current.map((entry, i) => i === index ? { ...entry, caption: event.target.value } : entry))} />
                  <button type="button" className="admin-button admin-button--danger" onClick={() => setGallery((current) => current.filter((_, i) => i !== index))}>حذف از پروژه</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <aside className="admin-editor-sidebar">
        <section className="admin-panel admin-form-stack">
          <h2>انتشار و چیدمان</h2>
          <label className="admin-field"><span>وضعیت</span><select name="status" defaultValue={initialData.status}><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option><option value="archived">آرشیوشده</option></select></label>
          <input type="hidden" name="cardLayout" value={initialData.cardLayout} />
          <p className="admin-alert">چیدمان کارت‌ها خودکار است: در هر ردیف دقیقاً دو پروژه با عرض ۷/۵ و ارتفاع یکسان نمایش داده می‌شوند.</p>
          <label className="admin-field"><span>ترتیب نمایش</span><input name="sortOrder" type="number" min={0} max={10000} defaultValue={initialData.sortOrder} /></label>
          <label className="admin-field"><span>رنگ تأکیدی</span><input name="accentColor" dir="ltr" defaultValue={initialData.accentColor} pattern="#[0-9A-Fa-f]{6}" /></label>
          <label className="admin-checkbox"><input type="checkbox" name="isFeatured" defaultChecked={initialData.isFeatured} />پروژه شاخص</label>
          <label className="admin-checkbox"><input type="checkbox" name="noIndex" defaultChecked={initialData.noIndex} />عدم ایندکس</label>
        </section>
        <section className="admin-panel admin-form-stack">
          <h2>خدمات و فناوری‌ها</h2>
          <label className="admin-field"><span>خدمات، جداشده با ویرگول</span><textarea name="services" defaultValue={initialData.services.join("، ")} required /></label>
          <label className="admin-field"><span>فناوری‌ها/توانمندی‌ها</span><textarea name="technologies" defaultValue={initialData.technologies.join("، ")} required /></label>
        </section>
        <section className="admin-panel admin-form-stack">
          <h2>لینک‌ها و SEO</h2>
          <label className="admin-field"><span>آدرس نسخه آنلاین (دکمه مشاهده زنده)</span><input name="externalUrl" dir="ltr" defaultValue={initialData.externalUrl ?? ""} placeholder="https://example.com" /></label>
          <label className="admin-field"><span>آدرس مخزن</span><input name="repositoryUrl" dir="ltr" defaultValue={initialData.repositoryUrl ?? ""} /></label>
          <label className="admin-field"><span>عنوان SEO</span><input name="seoTitle" defaultValue={initialData.seoTitle ?? ""} maxLength={75} /></label>
          <label className="admin-field"><span>توضیحات SEO</span><textarea name="seoDescription" defaultValue={initialData.seoDescription} minLength={50} maxLength={180} required /></label>
          <label className="admin-field"><span>Canonical اختیاری</span><input name="canonicalUrl" dir="ltr" defaultValue={initialData.canonicalUrl ?? ""} /></label>
        </section>
        {state.message ? <p className={`admin-alert ${state.ok ? "admin-alert--success" : "admin-alert--error"}`} role="status">{state.message}</p> : null}
        <button type="submit" className="admin-button admin-button--primary admin-button--wide" disabled={isPending || uploading}>{isPending ? "در حال ذخیره..." : "ذخیره پروژه"}</button>
      </aside>
    </form>
  );
}
