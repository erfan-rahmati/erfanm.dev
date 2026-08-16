CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('cover', 'content');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(240) NOT NULL,
	"card_title" varchar(190) NOT NULL,
	"excerpt" text NOT NULL,
	"summary" text NOT NULL,
	"category" varchar(90) NOT NULL,
	"badge" varchar(90) NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"cover_image_url" text,
	"cover_image_alt" varchar(260),
	"content" jsonb NOT NULL,
	"key_takeaways" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faq_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"seo_title" varchar(75),
	"seo_description" varchar(180) NOT NULL,
	"canonical_url" text,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"no_index" boolean DEFAULT false NOT NULL,
	"reading_minutes" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"author_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid,
	"uploaded_by_id" uuid,
	"kind" "media_kind" DEFAULT 'content' NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"size_bytes" integer,
	"alt" varchar(260) NOT NULL,
	"caption" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaboration_request_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"actor_id" uuid,
	"event_type" text NOT NULL,
	"previous_status" "collaboration_request_status",
	"next_status" "collaboration_request_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaboration_request_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"author_id" uuid,
	"body" varchar(2000) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_request_events" ADD CONSTRAINT "collaboration_request_events_request_id_collaboration_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."collaboration_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_request_events" ADD CONSTRAINT "collaboration_request_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_request_notes" ADD CONSTRAINT "collaboration_request_notes_request_id_collaboration_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."collaboration_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_request_notes" ADD CONSTRAINT "collaboration_request_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "articles_slug_unique" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_status_published_at_idx" ON "articles" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "articles_category_status_idx" ON "articles" USING btree ("category","status");--> statement-breakpoint
CREATE INDEX "articles_featured_published_at_idx" ON "articles" USING btree ("is_featured","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_url_unique" ON "media_assets" USING btree ("url");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_pathname_unique" ON "media_assets" USING btree ("pathname");--> statement-breakpoint
CREATE INDEX "media_assets_article_created_at_idx" ON "media_assets" USING btree ("article_id","created_at");--> statement-breakpoint
CREATE INDEX "collaboration_request_events_request_created_at_idx" ON "collaboration_request_events" USING btree ("request_id","created_at");--> statement-breakpoint
CREATE INDEX "collaboration_request_notes_request_created_at_idx" ON "collaboration_request_notes" USING btree ("request_id","created_at");
