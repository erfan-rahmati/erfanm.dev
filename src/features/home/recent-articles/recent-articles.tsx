"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { recentArticlesContent } from "./recent-articles.data";
import {
  RecentArticlesArrowIcon,
  RecentArticlesArticleIcon,
  RecentArticlesExternalIcon,
} from "./recent-articles.icons";
import type { RecentArticle } from "./recent-articles.types";

const articleNumberFormatter = new Intl.NumberFormat("fa-IR", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

export function RecentArticles({
  articles,
}: Readonly<{
  articles: readonly RecentArticle[];
}>) {
  const articlesTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [activeArticleIndex, setActiveArticleIndex] = useState(0);

  const updateActiveArticle = useCallback(() => {
    const articlesTrack = articlesTrackRef.current;

    if (!articlesTrack) {
      return;
    }

    const articleCards = Array.from(
      articlesTrack.querySelectorAll<HTMLElement>("[data-recent-article-card]"),
    );

    if (articleCards.length === 0) {
      return;
    }

    const trackRectangle = articlesTrack.getBoundingClientRect();

    const trackCenter = trackRectangle.left + trackRectangle.width / 2;

    let nearestArticleIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    articleCards.forEach((articleCard, index) => {
      const articleRectangle = articleCard.getBoundingClientRect();

      const articleCenter = articleRectangle.left + articleRectangle.width / 2;

      const articleDistance = Math.abs(articleCenter - trackCenter);

      if (articleDistance < nearestDistance) {
        nearestDistance = articleDistance;
        nearestArticleIndex = index;
      }
    });

    setActiveArticleIndex(nearestArticleIndex);
  }, []);

  const handleArticlesScroll = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      updateActiveArticle();
    });
  }, [updateActiveArticle]);

  const scrollToArticle = useCallback((articleIndex: number) => {
    const articlesTrack = articlesTrackRef.current;

    if (!articlesTrack) {
      return;
    }

    const articleCards = Array.from(
      articlesTrack.querySelectorAll<HTMLElement>("[data-recent-article-card]"),
    );

    if (articleCards.length === 0) {
      return;
    }

    const targetArticleIndex = Math.min(
      Math.max(articleIndex, 0),
      articleCards.length - 1,
    );

    const targetArticle = articleCards[targetArticleIndex];

    if (!targetArticle) {
      return;
    }

    const trackRectangle = articlesTrack.getBoundingClientRect();

    const articleRectangle = targetArticle.getBoundingClientRect();

    const horizontalDistance = articleRectangle.left - trackRectangle.left;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    articlesTrack.scrollBy({
      left: horizontalDistance,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    setActiveArticleIndex(targetArticleIndex);
  }, []);

  useEffect(() => {
    updateActiveArticle();

    const handleWindowResize = () => {
      updateActiveArticle();
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateActiveArticle]);

  const canShowPreviousArticle = activeArticleIndex > 0;

  const canShowNextArticle = activeArticleIndex < articles.length - 1;

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      id="blog"
      className="recent-articles"
      aria-labelledby="recent-articles-title"
    >
      <div className="recent-articles__background" aria-hidden="true">
        <span className="recent-articles__glow" />
        <span className="recent-articles__grid" />
      </div>

      <div className="recent-articles__container">
        <header className="recent-articles__header">
          <div className="recent-articles__heading">
            <span className="recent-articles__eyebrow">
              <span className="recent-articles__eyebrow-icon">
                <RecentArticlesArticleIcon />
              </span>

              {recentArticlesContent.eyebrow}
            </span>

            <h2 id="recent-articles-title" className="recent-articles__title">
              {recentArticlesContent.title}
            </h2>

            <p className="recent-articles__description">
              {recentArticlesContent.description}
            </p>
          </div>

          <div className="recent-articles__header-actions">
            <Link
              href={recentArticlesContent.archiveHref}
              className="recent-articles__archive-link"
            >
              <span>{recentArticlesContent.archiveLabel}</span>

              <RecentArticlesExternalIcon />
            </Link>

            <div
              className="recent-articles__controls"
              aria-label="کنترل مقالات اخیر"
            >
              <button
                type="button"
                className="recent-articles__control"
                onClick={() => {
                  scrollToArticle(activeArticleIndex - 1);
                }}
                disabled={!canShowPreviousArticle}
                aria-label="نمایش مقاله قبلی"
              >
                <RecentArticlesArrowIcon direction="previous" />
              </button>

              <button
                type="button"
                className="recent-articles__control"
                onClick={() => {
                  scrollToArticle(activeArticleIndex + 1);
                }}
                disabled={!canShowNextArticle}
                aria-label="نمایش مقاله بعدی"
              >
                <RecentArticlesArrowIcon direction="next" />
              </button>
            </div>
          </div>
        </header>

        <div
          ref={articlesTrackRef}
          className="recent-articles__track"
          dir="ltr"
          onScroll={handleArticlesScroll}
          aria-label="فهرست مقالات اخیر"
        >
          {articles.map((article, index) => {
            return (
              <article
                key={article.id}
                className="recent-articles__card"
                dir="rtl"
                data-recent-article-card
              >
                <div className="recent-articles__cover">
                  {article.coverImageUrl ? (
                    <Image
                      src={article.coverImageUrl}
                      alt={
                        article.coverImageAlt ??
                        article.title
                      }
                      fill
                      sizes="(max-width: 768px) 90vw, 42vw"
                      className="recent-articles__cover-image"
                      unoptimized
                    />
                  ) : (
                    <div className="recent-articles__cover-placeholder" aria-hidden="true">
                      <span>erfanm.dev</span>
                      <strong>{article.category}</strong>
                    </div>
                  )}

                  <span className="recent-articles__number">
                    {articleNumberFormatter.format(index + 1)}
                  </span>

                  <span className="recent-articles__badge">
                    {article.badge}
                  </span>

                </div>

                <div className="recent-articles__card-body">
                  <div className="recent-articles__meta">
                    <span>{article.category}</span>

                    <span aria-hidden="true">•</span>

                    <span>
                      {article.readingMinutes.toLocaleString(
                        "fa-IR",
                      )}{" "}
                      دقیقه مطالعه
                    </span>
                  </div>

                  <h3 className="recent-articles__card-title">
                    <Link href={article.href}>
                      {article.cardTitle}
                    </Link>
                  </h3>

                  <p className="recent-articles__excerpt">{article.excerpt}</p>

                  <footer className="recent-articles__card-footer">
                    <Link
                      href={article.href}
                      className="recent-articles__read-link"
                      aria-label={`مطالعه مقاله: ${article.title}`}
                    >
                      <span>مطالعه مقاله</span>
                      <RecentArticlesExternalIcon />
                    </Link>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>

        <div className="recent-articles__mobile-progress" aria-hidden="true">
          {articles.map((article, index) => (
            <span
              key={article.id}
              className={index === activeArticleIndex ? "is-active" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
