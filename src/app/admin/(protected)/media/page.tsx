import Image from "next/image";

import {
  formatAdminDate,
  formatAdminNumber,
} from "@/features/admin/admin-formatters";
import { deleteMediaAction } from "@/features/admin/articles/article.actions";
import { CopyMediaUrlButton, MediaLibraryUploader } from "@/features/admin/articles/media-library-tools";
import { deleteProjectMediaAction } from "@/features/admin/projects/project.actions";
import { listMediaAssets } from "@/server/articles/media.repository";
import { listProjectMediaAssets } from "@/server/projects/project-media.repository";

export default async function AdminMediaPage() {
  const [assets, projectAssets] = await Promise.all([
    listMediaAssets(),
    listProjectMediaAssets(),
  ]);

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            کتابخانه فایل
          </span>
          <h1>رسانه‌ها</h1>
          <p>
            تصاویر از ویرایشگر مقاله و پروژه آپلود می‌شوند.
            {" "}
            {formatAdminNumber(assets.length + projectAssets.length)} تصویر اخیر
            نمایش داده شده است.
          </p>
        </div>
      </header>

      <MediaLibraryUploader />

      <header className="admin-section-header">
        <div><h2>رسانه‌های مقاله‌ها</h2><p>تصاویر کاور و تصاویر قابل استفاده داخل متن</p></div>
      </header>

      {assets.length > 0 ? (
        <section className="admin-media-grid">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="admin-media-card"
            >
              <div className="admin-media-card__image">
                <Image
                  src={asset.url}
                  alt={asset.alt}
                  width={640}
                  height={480}
                  unoptimized
                />
              </div>
              <div className="admin-media-card__body">
                <strong title={asset.alt}>
                  {asset.alt}
                </strong>
                <small>
                  {asset.kind === "cover"
                    ? "کاور مقاله"
                    : "تصویر داخل مقاله"}
                  {" · "}
                  {formatAdminDate(
                    asset.createdAt,
                  )}
                </small>
                {asset.articleId ? (
                  <small>
                    متصل به مقاله — برای حذف، مقاله را
                    ویرایش یا حذف کن.
                  </small>
                ) : (
                  <form action={deleteMediaAction}>
                    <input
                      type="hidden"
                      name="id"
                      value={asset.id}
                    />
                    <button
                      type="submit"
                      className="admin-button admin-button--danger"
                    >
                      حذف فایل بلااستفاده
                    </button>
                  </form>
                )}
                <CopyMediaUrlButton url={asset.url} />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className="admin-empty">
          هنوز تصویری آپلود نشده است.
        </p>
      )}

      <header className="admin-section-header">
        <div><h2>رسانه‌های پروژه‌ها</h2><p>تصاویر اصلی و گالری پورتفولیو</p></div>
      </header>
      {projectAssets.length ? (
        <section className="admin-media-grid">
          {projectAssets.map((asset) => (
            <article key={asset.id} className="admin-media-card">
              <div className="admin-media-card__image"><Image src={asset.url} alt={asset.alt} width={640} height={480} unoptimized /></div>
              <div className="admin-media-card__body">
                <strong title={asset.alt}>{asset.alt}</strong>
                <small>{asset.kind === "hero" ? "تصویر اصلی پروژه" : "گالری پروژه"} · {formatAdminDate(asset.createdAt)}</small>
                {asset.projectId ? <small>متصل به پروژه — برای حذف، پروژه را ویرایش یا حذف کن.</small> : <form action={deleteProjectMediaAction}><input type="hidden" name="id" value={asset.id} /><button className="admin-button admin-button--danger">حذف فایل بلااستفاده</button></form>}
                <CopyMediaUrlButton url={asset.url} />
              </div>
            </article>
          ))}
        </section>
      ) : <p className="admin-empty">هنوز رسانه‌ای برای پروژه آپلود نشده است.</p>}
    </main>
  );
}
