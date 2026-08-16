ALTER TABLE "media_assets" DROP CONSTRAINT "media_assets_article_id_articles_id_fk";
--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;