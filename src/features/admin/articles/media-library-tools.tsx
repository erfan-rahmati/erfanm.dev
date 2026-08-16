"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { finalizeAdminUpload } from "@/features/admin/media/finalize-upload";
import { uploadWithPresignedUrl } from "@/features/admin/media/presigned-upload";

function safeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
  return `${crypto.randomUUID()}.${extension}`;
}

export function CopyMediaUrlButton({ url }: Readonly<{ url: string }>) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="admin-button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? "کپی شد" : "کپی آدرس تصویر"}
    </button>
  );
}

export function MediaLibraryUploader() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function onUpload(file: File) {
    if (alt.trim().length < 3) {
      setMessage("ابتدا متن جایگزین دقیق تصویر را وارد کن.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage("فقط JPG، PNG، WebP یا AVIF تا ۵ مگابایت قابل آپلود است.");
      return;
    }

    setPending(true);
    setMessage("");
    try {
      const uploadMetadata = {
        articleId: null,
        kind: "content" as const,
        alt: alt.trim(),
        caption: caption.trim() || null,
        sizeBytes: file.size,
      };

      const preparedUpload = await uploadWithPresignedUrl(
        "/api/admin/media/upload",
        `articles/${safeFileName(file.name)}`,
        file,
        uploadMetadata,
      );

      await finalizeAdminUpload(
        "/api/admin/media/finalize",
        {
          articleId: uploadMetadata.articleId,
          kind: uploadMetadata.kind,
          alt: uploadMetadata.alt,
          caption: uploadMetadata.caption,
          pathname: preparedUpload.pathname,
        },
      );

      setAlt("");
      setCaption("");
      setMessage("تصویر به کتابخانه افزوده شد و آماده استفاده در مقاله است.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "آپلود انجام نشد. اتصال Blob و نشست مدیریت را بررسی کن.",
      );
    } finally {
      setPending(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <section className="admin-panel admin-form-stack admin-media-uploader">
      <div>
        <h2>آپلود تصویر مقاله</h2>
        <p>فایل اینجا نگه‌داری می‌شود؛ بعداً می‌توانی آدرسش را کپی کنی یا آن را از داخل ویرایشگر مقاله درج کنی.</p>
      </div>
      <div className="admin-field-grid">
        <label className="admin-field">
          <span>متن جایگزین تصویر</span>
          <input value={alt} maxLength={260} onChange={(event) => setAlt(event.target.value)} placeholder="شرح دقیق آنچه در تصویر دیده می‌شود" />
        </label>
        <label className="admin-field">
          <span>کپشن اختیاری</span>
          <input value={caption} maxLength={1000} onChange={(event) => setCaption(event.target.value)} placeholder="توضیح کوتاه زیر تصویر" />
        </label>
      </div>
      <label className="admin-button admin-button--primary">
        {pending ? "در حال آپلود..." : "انتخاب و آپلود تصویر"}
        <input
          ref={fileRef}
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={pending}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onUpload(file);
          }}
        />
      </label>
      {message ? <p className="admin-alert" role="status">{message}</p> : null}
    </section>
  );
}
