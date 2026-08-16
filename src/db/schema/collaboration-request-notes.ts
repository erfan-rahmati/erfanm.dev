import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import {
  collaborationRequests,
  collaborationRequestStatusEnum,
} from "./collaboration-requests";

export const collaborationRequestNotes =
  pgTable(
    "collaboration_request_notes",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      requestId: uuid("request_id")
        .notNull()
        .references(
          () => collaborationRequests.id,
          {
            onDelete: "cascade",
          },
        ),

      authorId: uuid("author_id").references(
        () => users.id,
        {
          onDelete: "set null",
        },
      ),

      body: varchar("body", {
        length: 2000,
      }).notNull(),

      createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
      })
        .defaultNow()
        .notNull(),
    },
    (table) => [
      index(
        "collaboration_request_notes_request_created_at_idx",
      ).on(table.requestId, table.createdAt),
    ],
  );

export const collaborationRequestEvents =
  pgTable(
    "collaboration_request_events",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      requestId: uuid("request_id")
        .notNull()
        .references(
          () => collaborationRequests.id,
          {
            onDelete: "cascade",
          },
        ),

      actorId: uuid("actor_id").references(
        () => users.id,
        {
          onDelete: "set null",
        },
      ),

      eventType: text("event_type", {
        enum: ["status_changed"],
      }).notNull(),

      previousStatus:
        collaborationRequestStatusEnum(
          "previous_status",
        ),

      nextStatus:
        collaborationRequestStatusEnum(
          "next_status",
        ),

      createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
      })
        .defaultNow()
        .notNull(),
    },
    (table) => [
      index(
        "collaboration_request_events_request_created_at_idx",
      ).on(table.requestId, table.createdAt),
    ],
  );

export const collaborationRequestNotesRelations =
  relations(
    collaborationRequestNotes,
    ({ one }) => ({
      request: one(collaborationRequests, {
        fields: [
          collaborationRequestNotes.requestId,
        ],
        references: [collaborationRequests.id],
      }),
      author: one(users, {
        fields: [
          collaborationRequestNotes.authorId,
        ],
        references: [users.id],
      }),
    }),
  );

export const collaborationRequestEventsRelations =
  relations(
    collaborationRequestEvents,
    ({ one }) => ({
      request: one(collaborationRequests, {
        fields: [
          collaborationRequestEvents.requestId,
        ],
        references: [collaborationRequests.id],
      }),
      actor: one(users, {
        fields: [
          collaborationRequestEvents.actorId,
        ],
        references: [users.id],
      }),
    }),
  );
