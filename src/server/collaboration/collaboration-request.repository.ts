import "server-only";

import {
  and,
  count,
  eq,
  gte,
} from "drizzle-orm";

import { db } from "@/db";
import {
  collaborationRequests,
} from "@/db/schema";
import type {
  CollaborationDurationId,
  CollaborationProjectTypeId,
} from "@/features/home/contact/contact.types";

export type CreateCollaborationRequestInput =
  Readonly<{
    submissionId: string;
    trackingCode: string;
    fullName: string;
    phone: string;
    projectTypes:
      readonly CollaborationProjectTypeId[];
    proposedDuration:
      CollaborationDurationId;
    proposedBudgetToman: number | null;
    description: string | null;
    ipHash: string | null;
    userAgent: string | null;
  }>;

const collaborationRequestSelection = {
  id: collaborationRequests.id,
  submissionId:
    collaborationRequests.submissionId,
  trackingCode:
    collaborationRequests.trackingCode,
  fullName:
    collaborationRequests.fullName,
  phone: collaborationRequests.phone,
  projectTypes:
    collaborationRequests.projectTypes,
  proposedDuration:
    collaborationRequests.proposedDuration,
  proposedBudgetToman:
    collaborationRequests.proposedBudgetToman,
  description:
    collaborationRequests.description,
  telegramDeliveryStatus:
    collaborationRequests.telegramDeliveryStatus,
  createdAt:
    collaborationRequests.createdAt,
} as const;

export async function findCollaborationRequestBySubmissionId(
  submissionId: string,
) {
  const [request] = await db
    .select(
      collaborationRequestSelection,
    )
    .from(collaborationRequests)
    .where(
      eq(
        collaborationRequests.submissionId,
        submissionId,
      ),
    )
    .limit(1);

  return request ?? null;
}

export async function countRecentCollaborationRequestsByIpHash(
  ipHash: string,
  createdAfter: Date,
) {
  const [result] = await db
    .select({
      requestCount: count(),
    })
    .from(collaborationRequests)
    .where(
      and(
        eq(
          collaborationRequests.ipHash,
          ipHash,
        ),
        gte(
          collaborationRequests.createdAt,
          createdAfter,
        ),
      ),
    );

  return Number(
    result?.requestCount ?? 0,
  );
}

export async function createCollaborationRequestRecord(
  input: CreateCollaborationRequestInput,
) {
  const [createdRequest] = await db
    .insert(collaborationRequests)
    .values({
      submissionId: input.submissionId,
      trackingCode: input.trackingCode,
      fullName: input.fullName,
      phone: input.phone,
      projectTypes: [
        ...input.projectTypes,
      ],
      proposedDuration:
        input.proposedDuration,
      proposedBudgetToman:
        input.proposedBudgetToman,
      description: input.description,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
    })
    .onConflictDoNothing({
      target:
        collaborationRequests.submissionId,
    })
    .returning(
      collaborationRequestSelection,
    );

  return createdRequest ?? null;
}

export async function markTelegramDeliveryAsSent(
  requestId: string,
  telegramMessageId: number,
) {
  await db
    .update(collaborationRequests)
    .set({
      telegramDeliveryStatus: "sent",
      telegramMessageId,
      telegramLastError: null,
      updatedAt: new Date(),
    })
    .where(
      eq(
        collaborationRequests.id,
        requestId,
      ),
    );
}

export async function markTelegramDeliveryAsFailed(
  requestId: string,
  errorMessage: string,
) {
  await db
    .update(collaborationRequests)
    .set({
      telegramDeliveryStatus: "failed",
      telegramLastError:
        errorMessage.slice(0, 2000),
      updatedAt: new Date(),
    })
    .where(
      eq(
        collaborationRequests.id,
        requestId,
      ),
    );
}