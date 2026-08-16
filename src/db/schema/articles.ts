import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type {
  ArticleDocument,
  ArticleFaqItem,
  ArticleSourceItem,
} from "@/features/blog/article-content.types";

import { users } from "./auth";

export const articleStatusEnum = pgEnum(
  "article_status",
  ["draft", "published", "archived"],
);

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    slug: varchar("slug", {
      length: 180,
    }).notNull(),

    title: varchar("title", {
      length: 240,
    }).notNull(),

    cardTitle: varchar("card_title", {
      length: 190,
    }).notNull(),

    excerpt: text("excerpt").notNull(),

    summary: text("summary").notNull(),

    category: varchar("category", {
      length: 90,
    }).notNull(),

    badge: varchar("badge", {
      length: 90,
    }).notNull(),

    tags: text("tags")
      .array()
      .default([])
      .notNull(),

    coverImageUrl: text("cover_image_url"),

    coverImageAlt: varchar(
      "cover_image_alt",
      {
        length: 260,
      },
    ),

    content: jsonb("content")
      .$type<ArticleDocument>()
      .notNull(),

    keyTakeaways: jsonb(
      "key_takeaways",
    )
      .$type<readonly string[]>()
      .default([])
      .notNull(),

    faqItems: jsonb("faq_items")
      .$type<readonly ArticleFaqItem[]>()
      .default([])
      .notNull(),

    sources: jsonb("sources")
      .$type<readonly ArticleSourceItem[]>()
      .default([])
      .notNull(),

    seoTitle: varchar("seo_title", {
      length: 75,
    }),

    seoDescription: varchar(
      "seo_description",
      {
        length: 180,
      },
    ).notNull(),

    canonicalUrl: text("canonical_url"),

    status: articleStatusEnum("status")
      .default("draft")
      .notNull(),

    isFeatured: boolean("is_featured")
      .default(false)
      .notNull(),

    noIndex: boolean("no_index")
      .default(false)
      .notNull(),

    readingMinutes: integer(
      "reading_minutes",
    )
      .default(1)
      .notNull(),

    publishedAt: timestamp(
      "published_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    authorId: uuid("author_id").references(
      () => users.id,
      {
        onDelete: "set null",
      },
    ),

    updatedById: uuid(
      "updated_by_id",
    ).references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex(
      "articles_slug_unique",
    ).on(table.slug),

    index(
      "articles_status_published_at_idx",
    ).on(table.status, table.publishedAt),

    index(
      "articles_category_status_idx",
    ).on(table.category, table.status),

    index(
      "articles_featured_published_at_idx",
    ).on(
      table.isFeatured,
      table.publishedAt,
    ),
  ],
);

export const mediaKindEnum = pgEnum(
  "media_kind",
  ["cover", "content"],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    articleId: uuid("article_id").references(
      () => articles.id,
      {
        onDelete: "cascade",
      },
    ),

    uploadedById: uuid(
      "uploaded_by_id",
    ).references(() => users.id, {
      onDelete: "set null",
    }),

    kind: mediaKindEnum("kind")
      .default("content")
      .notNull(),

    url: text("url").notNull(),

    pathname: text("pathname").notNull(),

    contentType: varchar("content_type", {
      length: 100,
    }).notNull(),

    sizeBytes: integer("size_bytes"),

    alt: varchar("alt", {
      length: 260,
    }).notNull(),

    caption: text("caption"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex(
      "media_assets_url_unique",
    ).on(table.url),

    uniqueIndex(
      "media_assets_pathname_unique",
    ).on(table.pathname),

    index(
      "media_assets_article_created_at_idx",
    ).on(table.articleId, table.createdAt),
  ],
);

export const articlesRelations = relations(
  articles,
  ({ one, many }) => ({
    author: one(users, {
      fields: [articles.authorId],
      references: [users.id],
      relationName: "articleAuthor",
    }),
    updatedBy: one(users, {
      fields: [articles.updatedById],
      references: [users.id],
      relationName: "articleUpdater",
    }),
    mediaAssets: many(mediaAssets),
  }),
);

export const mediaAssetsRelations = relations(
  mediaAssets,
  ({ one }) => ({
    article: one(articles, {
      fields: [mediaAssets.articleId],
      references: [articles.id],
    }),
    uploadedBy: one(users, {
      fields: [mediaAssets.uploadedById],
      references: [users.id],
    }),
  }),
);

export type Article =
  typeof articles.$inferSelect;

export type NewArticle =
  typeof articles.$inferInsert;

export type MediaAsset =
  typeof mediaAssets.$inferSelect;
