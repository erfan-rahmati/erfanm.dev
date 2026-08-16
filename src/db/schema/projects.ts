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
  ProjectGalleryImage,
  ProjectHighlight,
} from "@/features/projects/project.types";

import { users } from "./auth";

export const projectStatusEnum = pgEnum(
  "project_status",
  ["draft", "published", "archived"],
);

export const projectCardLayoutEnum = pgEnum(
  "project_card_layout",
  ["featured", "standard", "wide"],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    eyebrow: varchar("eyebrow", { length: 100 }).notNull(),
    shortDescription: varchar("short_description", { length: 360 }).notNull(),
    overview: text("overview").notNull(),
    challenge: text("challenge").notNull(),
    solution: text("solution").notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    services: text("services").array().default([]).notNull(),
    technologies: text("technologies").array().default([]).notNull(),
    highlights: jsonb("highlights")
      .$type<readonly ProjectHighlight[]>()
      .default([])
      .notNull(),
    heroImageUrl: text("hero_image_url").notNull(),
    heroImageAlt: varchar("hero_image_alt", { length: 260 }).notNull(),
    galleryImages: jsonb("gallery_images")
      .$type<readonly ProjectGalleryImage[]>()
      .default([])
      .notNull(),
    accentColor: varchar("accent_color", { length: 9 }).default("#6D5CFF").notNull(),
    externalUrl: text("external_url"),
    repositoryUrl: text("repository_url"),
    cardLayout: projectCardLayoutEnum("card_layout").default("standard").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    status: projectStatusEnum("status").default("draft").notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    noIndex: boolean("no_index").default(false).notNull(),
    seoTitle: varchar("seo_title", { length: 75 }),
    seoDescription: varchar("seo_description", { length: 180 }).notNull(),
    canonicalUrl: text("canonical_url"),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    updatedById: uuid("updated_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("projects_slug_unique").on(table.slug),
    index("projects_status_sort_idx").on(table.status, table.sortOrder),
    index("projects_featured_idx").on(table.isFeatured, table.publishedAt),
  ],
);

export const projectMediaKindEnum = pgEnum(
  "project_media_kind",
  ["hero", "gallery"],
);

export const projectMediaAssets = pgTable(
  "project_media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
    uploadedById: uuid("uploaded_by_id").references(() => users.id, { onDelete: "set null" }),
    kind: projectMediaKindEnum("kind").default("gallery").notNull(),
    url: text("url").notNull(),
    pathname: text("pathname").notNull(),
    contentType: varchar("content_type", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes"),
    alt: varchar("alt", { length: 260 }).notNull(),
    caption: text("caption"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("project_media_url_unique").on(table.url),
    uniqueIndex("project_media_path_unique").on(table.pathname),
    index("project_media_project_idx").on(table.projectId, table.createdAt),
  ],
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  author: one(users, { fields: [projects.authorId], references: [users.id], relationName: "projectAuthor" }),
  updatedBy: one(users, { fields: [projects.updatedById], references: [users.id], relationName: "projectUpdater" }),
  mediaAssets: many(projectMediaAssets),
}));

export const projectMediaRelations = relations(projectMediaAssets, ({ one }) => ({
  project: one(projects, { fields: [projectMediaAssets.projectId], references: [projects.id] }),
  uploadedBy: one(users, { fields: [projectMediaAssets.uploadedById], references: [users.id] }),
}));

export type Project = typeof projects.$inferSelect;
export type ProjectMediaAsset = typeof projectMediaAssets.$inferSelect;
