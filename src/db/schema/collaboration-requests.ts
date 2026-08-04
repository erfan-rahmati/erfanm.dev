import {
  bigint,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const collaborationDurationEnum = pgEnum(
  "collaboration_duration",
  [
    "less-than-one-month",
    "one-to-three-months",
    "three-to-six-months",
    "more-than-six-months",
  ],
);

export const collaborationRequestStatusEnum =
  pgEnum(
    "collaboration_request_status",
    [
      "new",
      "reviewing",
      "contacted",
      "accepted",
      "rejected",
      "archived",
    ],
  );

export const telegramDeliveryStatusEnum =
  pgEnum(
    "telegram_delivery_status",
    [
      "pending",
      "sent",
      "failed",
    ],
  );

export const collaborationRequests =
  pgTable(
    "collaboration_requests",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      submissionId: uuid(
        "submission_id",
      )
        .defaultRandom()
        .notNull(),

      trackingCode: varchar(
        "tracking_code",
        {
          length: 32,
        },
      ).notNull(),

      fullName: varchar(
        "full_name",
        {
          length: 120,
        },
      ).notNull(),

      phone: varchar(
        "phone",
        {
          length: 16,
        },
      ).notNull(),

      projectTypes: text(
        "project_types",
      )
        .array()
        .notNull(),

      proposedDuration:
        collaborationDurationEnum(
          "proposed_duration",
        ).notNull(),

      proposedBudgetToman: bigint(
        "proposed_budget_toman",
        {
          mode: "number",
        },
      ),

      description: text("description"),

      status:
        collaborationRequestStatusEnum(
          "status",
        )
          .default("new")
          .notNull(),

      telegramDeliveryStatus:
        telegramDeliveryStatusEnum(
          "telegram_delivery_status",
        )
          .default("pending")
          .notNull(),

      telegramMessageId: bigint(
        "telegram_message_id",
        {
          mode: "number",
        },
      ),

      telegramLastError: text(
        "telegram_last_error",
      ),

      ipHash: varchar(
        "ip_hash",
        {
          length: 64,
        },
      ),

      userAgent: text("user_agent"),

      createdAt: timestamp(
        "created_at",
        {
          withTimezone: true,
          mode: "date",
        },
      )
        .defaultNow()
        .notNull(),

      updatedAt: timestamp(
        "updated_at",
        {
          withTimezone: true,
          mode: "date",
        },
      )
        .defaultNow()
        .notNull(),
    },
    (table) => [
      uniqueIndex(
        "collaboration_requests_submission_id_unique",
      ).on(table.submissionId),

      uniqueIndex(
        "collaboration_requests_tracking_code_unique",
      ).on(table.trackingCode),

      index(
        "collaboration_requests_status_created_at_idx",
      ).on(
        table.status,
        table.createdAt,
      ),

      index(
        "collaboration_requests_phone_idx",
      ).on(table.phone),

      index(
        "collaboration_requests_telegram_status_idx",
      ).on(
        table.telegramDeliveryStatus,
      ),
    ],
  );

export type CollaborationRequest =
  typeof collaborationRequests.$inferSelect;

export type NewCollaborationRequest =
  typeof collaborationRequests.$inferInsert;