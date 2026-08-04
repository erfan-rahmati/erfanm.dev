import "server-only";

import { eq } from "drizzle-orm";

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

export async function createCollaborationRequestRecord(
  input: CreateCollaborationRequestInput,
) {
  const [createdRequest] = await db
    .insert(collaborationRequests)
    .values({
      trackingCode: input.trackingCode,
      fullName: input.fullName,
      phone: input.phone,
      projectTypes: [...input.projectTypes],
      proposedDuration:
        input.proposedDuration,
      proposedBudgetToman:
        input.proposedBudgetToman,
      description: input.description,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
    })
    .returning({
      id: collaborationRequests.id,
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
      createdAt:
        collaborationRequests.createdAt,
    });

  if (!createdRequest) {
    throw new Error(
      "Collaboration request could not be created.",
    );
  }

  return createdRequest;
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