"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  addCollaborationRequestNote,
  updateCollaborationRequestStatus,
} from "@/server/collaboration/admin-collaboration.repository";
import { requireAdminSession } from "@/server/auth/admin-session";

import {
  REQUEST_STATUS_OPTIONS,
} from "./request.constants";

const requestIdSchema = z.string().uuid();

const requestStatusSchema = z.enum(
  REQUEST_STATUS_OPTIONS.map(
    (item) => item.id,
  ) as [
    (typeof REQUEST_STATUS_OPTIONS)[number]["id"],
    ...(typeof REQUEST_STATUS_OPTIONS)[number]["id"][],
  ],
);

export async function addRequestNoteAction(
  formData: FormData,
): Promise<void> {
  const session =
    await requireAdminSession();
  const requestId = requestIdSchema.parse(
    String(formData.get("requestId") ?? ""),
  );
  const body = z
    .string()
    .trim()
    .min(2)
    .max(2_000)
    .parse(
      String(formData.get("body") ?? ""),
    );

  await addCollaborationRequestNote({
    requestId,
    authorId: session.user.id,
    body,
  });

  revalidatePath(
    `/admin/requests/${requestId}`,
  );
}

export async function updateRequestStatusAction(
  formData: FormData,
): Promise<void> {
  const session =
    await requireAdminSession();
  const requestId = requestIdSchema.parse(
    String(formData.get("requestId") ?? ""),
  );
  const status = requestStatusSchema.parse(
    String(formData.get("status") ?? ""),
  );

  await updateCollaborationRequestStatus({
    requestId,
    actorId: session.user.id,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath(
    `/admin/requests/${requestId}`,
  );
}
