"use server";

import { headers } from "next/headers";

import {
  processCollaborationRequest,
  type SubmitCollaborationRequestResult,
} from "@/server/collaboration/collaboration-request.service";

export async function submitCollaborationRequest(
  input: unknown,
): Promise<SubmitCollaborationRequestResult> {
  try {
    const requestHeaders =
      await headers();

    return await processCollaborationRequest(
      input,
      {
        userAgent:
          requestHeaders.get(
            "user-agent",
          ),
        ipHash: null,
      },
    );
  }
  catch (error) {
    console.error(
      "Collaboration request submission failed.",
      error,
    );

    return {
      ok: false,
      code: "SERVER_ERROR",
      message:
        "ثبت درخواست با خطا مواجه شد. لطفاً چند دقیقه دیگر دوباره تلاش کن.",
    };
  }
}