CREATE TYPE "public"."collaboration_duration" AS ENUM('less-than-one-month', 'one-to-three-months', 'three-to-six-months', 'more-than-six-months');--> statement-breakpoint
CREATE TYPE "public"."collaboration_request_status" AS ENUM('new', 'reviewing', 'contacted', 'accepted', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."telegram_delivery_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TABLE "collaboration_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_code" varchar(32) NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"phone" varchar(16) NOT NULL,
	"project_types" text[] NOT NULL,
	"proposed_duration" "collaboration_duration" NOT NULL,
	"proposed_budget_toman" bigint,
	"description" text,
	"status" "collaboration_request_status" DEFAULT 'new' NOT NULL,
	"telegram_delivery_status" "telegram_delivery_status" DEFAULT 'pending' NOT NULL,
	"telegram_message_id" bigint,
	"telegram_last_error" text,
	"ip_hash" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "collaboration_requests_tracking_code_unique" ON "collaboration_requests" USING btree ("tracking_code");--> statement-breakpoint
CREATE INDEX "collaboration_requests_status_created_at_idx" ON "collaboration_requests" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "collaboration_requests_phone_idx" ON "collaboration_requests" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "collaboration_requests_telegram_status_idx" ON "collaboration_requests" USING btree ("telegram_delivery_status");