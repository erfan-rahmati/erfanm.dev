"use server";

import { headers } from "next/headers";

import {
  processCollaborationRequest,
  type SubmitCollaborationRequestResult,
} from "@/server/collaboration/collaboration-request.service";
import {
  createRequestIpHash,
  getRequestIpAddress,
} from "@/server/security/request-security";

export async function submitCollaborationRequest(
  input: unknown,
): Promise<SubmitCollaborationRequestResult> {
  try {
    const requestHeaders =
      await headers();

    const ipAddress =
      getRequestIpAddress(
        requestHeaders,
      );

    const userAgent =
      requestHeaders
        .get("user-agent")
        ?.slice(0, 500) ?? null;

    return await processCollaborationRequest(
      input,
      {
        userAgent,
        ipHash:
          createRequestIpHash(
            ipAddress,
          ),
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