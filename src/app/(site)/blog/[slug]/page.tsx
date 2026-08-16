import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig, siteIdentity } from "@/config/site";
import { BlogArticleView } from "@/features/blog/blog-article-view";
import { collectArticleImageUrls, extractArticlePlainText } from "@/features/blog/article-content.utils";
import { getPublishedArticleBySlug } from "@/server/articles/article.repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article =
    await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "مقاله پیدا نشد",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical =
    article.canonicalUrl ??
    `${siteConfig.url}/blog/${article.slug}`;
  const socialImageUrl =
    article.coverImageUrl ??
    `${siteConfig.url}/opengraph-image`;
  const images = [
    {
      url: socialImageUrl,
      alt:
        article.coverImageAlt ??
        article.title,
    },
  ];

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription,
    keywords: [...article.tags],
    alternates: {
      canonical,
    },
    authors: [
      {
        name:
          article.authorName ??
          siteIdentity.ownerName,
        url: `${siteConfig.url}/#about`,
      },
    ],
    robots: {
      index: !article.noIndex,
      follow: !article.noIndex,
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: article.title,
      description: article.seoDescription,
      publishedTime:
        article.publishedAt?.toISOString(),
      modifiedTime:
        article.updatedAt.toISOString(),
      authors: [siteIdentity.ownerName],
      tags: [...article.tags],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.seoDescription,
      images: [socialImageUrl],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article =
    await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const canonical =
    article.canonicalUrl ??
    `${siteConfig.url}/blog/${article.slug}`;
  const authorName =
    article.authorName ?? siteIdentity.ownerName;
  const articleText =
    extractArticlePlainText(article.content);
  const wordCount = articleText
    .split(/\s+/u)
    .filter(Boolean).length;
  const articleImage =
    article.coverImageUrl ??
    `${siteConfig.url}/opengraph-image`;
  const articleImages = [
    articleImage,
    ...collectArticleImageUrls(article.content),
  ].filter((url, index, values) => values.indexOf(url) === index);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: article.title,
        description: article.seoDescription,
        abstract: article.summary,
        url: canonical,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
        image: articleImages,
        datePublished:
          article.publishedAt?.toISOString(),
        dateModified:
          article.updatedAt.toISOString(),
        inLanguage: "fa-IR",
        keywords: article.tags.join(", "),
        articleSection: article.category,
        wordCount,
        timeRequired: `PT${article.readingMinutes}M`,
        isAccessibleForFree: true,
        about: article.tags.map((tag) => ({
          "@type": "Thing",
          name: tag,
        })),
        ...(article.sources.length > 0
          ? {
              citation: article.sources.map(
                (source) => source.url,
              ),
            }
          : {}),
        author: {
          "@type": "Person",
          "@id": `${siteConfig.url}/#person`,
          name: authorName,
          url: `${siteConfig.url}/#about`,
        },
        publisher: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "خانه",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "مقالات",
            item: `${siteConfig.url}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: canonical,
          },
        ],
      },
      ...(article.faqItems.length > 0
        ? [{
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            mainEntity: article.faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <BlogArticleView
        article={{
          ...article,
          authorName,
        }}
      />
    </>
  );
}
