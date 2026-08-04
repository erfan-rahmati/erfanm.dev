"use client";

import Image from "next/image";

import {
  galleryImageAssets,
} from "./gallery.assets";
import {
  galleryRows,
  galleryTechnologyBrands,
} from "./gallery.data";
import { GalleryArrowIcon } from "./gallery.icons";
import type {
  GalleryItemVariant,
  GalleryRow,
} from "./gallery.types";
import {
  useGalleryMarquee,
} from "./use-gallery-marquee";

type GalleryMarqueeRowProps = Readonly<{
  row: GalleryRow;
}>;

function getTrackId(
  rowId: GalleryRow["id"],
): "trackLeft" | "trackRight" {
  return rowId === "primary"
    ? "trackLeft"
    : "trackRight";
}

function getImageSizes(
  variant: GalleryItemVariant,
): string {
  if (variant === "desktop") {
    return "(max-width: 600px) 330px, (max-width: 768px) 390px, 430px";
  }

  return "(max-width: 600px) 145px, (max-width: 768px) 165px, 180px";
}

function GalleryMarqueeRow({
  row,
}: GalleryMarqueeRowProps) {
  const {
    rowRef,
    trackRef,
  } = useGalleryMarquee(row.direction);

  const rowClassName = [
    "gallery__row",
    `gallery__row--${row.id}`,
  ].join(" ");

  function renderItems(isFallbackCopy: boolean) {
    return row.items.map((item) => {
      const imageAsset =
        galleryImageAssets[item.src];

      return (
        <li
          key={`${isFallbackCopy ? "fallback" : "original"}-${item.id}`}
          className={[
            "gallery__item",
            `gallery__item--${item.variant}`,
          ].join(" ")}
          data-gallery-fallback-copy={
            isFallbackCopy ? "true" : undefined
          }
          aria-hidden={isFallbackCopy ? true : undefined}
        >
          <div className="gallery__card">
            <Image
              src={item.src}
              alt={isFallbackCopy ? "" : item.alt}
              width={imageAsset.width}
              height={imageAsset.height}
              sizes={getImageSizes(
                item.variant,
              )}
              loading="lazy"
              draggable={false}
            />
          </div>
        </li>
      );
    });
  }

  return (
    <div
      ref={rowRef}
      className={rowClassName}
      data-direction={row.direction}
      aria-hidden={row.id === "secondary" ? true : undefined}
    >
      <ul
        ref={trackRef}
        className="gallery__track"
        id={getTrackId(row.id)}
      >
        {renderItems(false)}
        {renderItems(true)}
      </ul>
    </div>
  );
}

export function Gallery() {
  return (
    <section
      id="projects"
      className="gallery"
      aria-label="نمونه‌کارهای منتخب"
    >
      <div className="gallery__container">
        <header className="gallery__header">
          <h2 className="gallery__title">
            نمونه‌کارهای من
          </h2>

          <a
            href="#projects"
            className="gallery__cta"
          >
            <span>مشاهده همه پروژه‌ها</span>
            <GalleryArrowIcon />
          </a>
        </header>

        <div className="gallery__ticker-wrapper">
          <div
            className="gallery__ticker"
            id="galleryTicker"
          >
            {galleryRows.map((row) => (
              <GalleryMarqueeRow
                key={row.id}
                row={row}
              />
            ))}
          </div>
        </div>

        <div className="gallery__brands">
          <span className="gallery__brands-label">
            تکنولوژی‌های استفاده شده
          </span>

          <div className="gallery__brands-logos">
            {galleryTechnologyBrands.map(
              (technology) => (
                <span
                  key={technology}
                  className="gallery__brand"
                >
                  {technology}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
