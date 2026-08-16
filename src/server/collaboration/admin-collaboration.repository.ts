import "server-only";

import {
  and,
  count,
  desc,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import {
  collaborationRequestEvents,
  collaborationRequestNotes,
  collaborationRequests,
  users,
} from "@/db/schema";
import type { CollaborationRequestStatus } from "@/features/admin/requests/request.constants";

export async function listAdminCollaborationRequests(
  input: Readonly<{
    page?: number;
    pageSize?: number;
    query?: string;
    status?: CollaborationRequestStatus;
  }> = {},
) {
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(
    50,
    Math.max(1, input.pageSize ?? 20),
  );
  const filters: SQL[] = [];

  if (input.status) {
    filters.push(
      eq(
        collaborationRequests.status,
        input.status,
      ),
    );
  }

  if (input.query?.trim()) {
    const query = `%${input.query.trim()}%`;
    const searchCondition = or(
      ilike(
        collaborationRequests.fullName,
        query,
      ),
      ilike(
        collaborationRequests.phone,
        query,
      ),
      ilike(
        collaborationRequests.trackingCode,
        query,
      ),
    );

    if (searchCondition) {
      filters.push(searchCondition);
    }
  }

  const where =
    filters.length > 0
      ? and(...filters)
      : undefined;

  const [items, totalResult] =
    await Promise.all([
      db
        .select({
          id: collaborationRequests.id,
          trackingCode:
            collaborationRequests.trackingCode,
          fullName:
            collaborationRequests.fullName,
          phone: collaborationRequests.phone,
          projectTypes:
            collaborationRequests.projectTypes,
          status:
            collaborationRequests.status,
          createdAt:
            collaborationRequests.createdAt,
          updatedAt:
            collaborationRequests.updatedAt,
        })
        .from(collaborationRequests)
        .where(where)
        .orderBy(
          desc(collaborationRequests.createdAt),
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ value: count() })
        .from(collaborationRequests)
        .where(where),
    ]);

  const total = Number(
    totalResult[0]?.value ?? 0,
  );

  return {
    items,
    page,
    total,
    pageCount: Math.max(
      1,
      Math.ceil(total / pageSize),
    ),
  };
}

export const getAdminCollaborationRequest =
  cache(async (id: string) => {
    const [request] = await db
      .select()
      .from(collaborationRequests)
      .where(
        eq(collaborationRequests.id, id),
      )
      .limit(1);

    if (!request) {
      return null;
    }

    const [notes, events] =
      await Promise.all([
        db
          .select({
            id: collaborationRequestNotes.id,
            body: collaborationRequestNotes.body,
            createdAt:
              collaborationRequestNotes.createdAt,
            authorName: users.name,
          })
          .from(collaborationRequestNotes)
          .leftJoin(
            users,
            eq(
              collaborationRequestNotes.authorId,
              users.id,
            ),
          )
          .where(
            eq(
              collaborationRequestNotes.requestId,
              id,
            ),
          )
          .orderBy(
            desc(
              collaborationRequestNotes.createdAt,
            ),
          ),
        db
          .select({
            id: collaborationRequestEvents.id,
            previousStatus:
              collaborationRequestEvents.previousStatus,
            nextStatus:
              collaborationRequestEvents.nextStatus,
            createdAt:
              collaborationRequestEvents.createdAt,
            actorName: users.name,
          })
          .from(collaborationRequestEvents)
          .leftJoin(
            users,
            eq(
              collaborationRequestEvents.actorId,
              users.id,
            ),
          )
          .where(
            eq(
              collaborationRequestEvents.requestId,
              id,
            ),
          )
          .orderBy(
            desc(
              collaborationRequestEvents.createdAt,
            ),
          ),
      ]);

    return {
      request,
      notes,
      events,
    };
  });

export async function addCollaborationRequestNote(
  input: Readonly<{
    requestId: string;
    authorId: string;
    body: string;
  }>,
) {
  const [note] = await db
    .insert(collaborationRequestNotes)
    .values(input)
    .returning({
      id: collaborationRequestNotes.id,
    });

  return note ?? null;
}

export async function updateCollaborationRequestStatus(
  input: Readonly<{
    requestId: string;
    actorId: string;
    status: CollaborationRequestStatus;
  }>,
) {
  const [existing] = await db
    .select({
      status: collaborationRequests.status,
    })
    .from(collaborationRequests)
    .where(
      eq(
        collaborationRequests.id,
        input.requestId,
      ),
    )
    .limit(1);

  if (!existing) {
    return null;
  }

  if (existing.status === input.status) {
    return {
      previousStatus: existing.status,
      nextStatus: input.status,
    };
  }

  await db.batch([
    db
      .update(collaborationRequests)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(
        eq(
          collaborationRequests.id,
          input.requestId,
        ),
      ),
    db.insert(
      collaborationRequestEvents,
    ).values({
      requestId: input.requestId,
      actorId: input.actorId,
      eventType: "status_changed",
      previousStatus: existing.status,
      nextStatus: input.status,
    }),
  ]);

  return {
    previousStatus: existing.status,
    nextStatus: input.status,
  };
}

export async function getRequestDashboardCounts() {
  const grouped = await db
    .select({
      status: collaborationRequests.status,
      value: count(),
    })
    .from(collaborationRequests)
    .groupBy(collaborationRequests.status);

  return Object.fromEntries(
    grouped.map((row) => [
      row.status,
      Number(row.value),
    ]),
  ) as Partial<
    Record<CollaborationRequestStatus, number>
  >;
}
