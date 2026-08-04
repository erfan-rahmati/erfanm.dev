import "server-only";

import {
  collaborationRequestSubmissionSchema,
} from "@/features/home/contact/contact.schema";
import {
  createCollaborationTelegramMessage,
} from "@/server/telegram/telegram-message";
import {
  sendTelegramMessage,
} from "@/server/telegram/telegram.service";

import {
  createCollaborationRequestRecord,
  markTelegramDeliveryAsFailed,
  markTelegramDeliveryAsSent,
} from "./collaboration-request.repository";
import {
  createCollaborationTrackingCode,
} from "./tracking-code";

export type SubmitCollaborationRequestResult =
  | Readonly<{
      ok: true;
      trackingCode: string;
      telegramDelivered: boolean;
    }>
  | Readonly<{
      ok: false;
      code:
        | "VALIDATION_ERROR"
        | "SERVER_ERROR";
      message: string;
      fieldErrors?: Record<
        string,
        string[]
      >;
    }>;

type SubmitCollaborationRequestContext =
  Readonly<{
    userAgent: string | null;
    ipHash: string | null;
  }>;

export async function processCollaborationRequest(
  input: unknown,
  context: SubmitCollaborationRequestContext,
): Promise<SubmitCollaborationRequestResult> {
  const parsedInput =
    collaborationRequestSubmissionSchema.safeParse(
      input,
    );

  if (!parsedInput.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message:
        "اطلاعات فرم کامل یا معتبر نیست.",
      fieldErrors:
        parsedInput.error.flatten()
          .fieldErrors,
    };
  }

  const {
    website: _website,
    ...requestInput
  } = parsedInput.data;

  void _website;

  const trackingCode =
    createCollaborationTrackingCode();

  const createdRequest =
    await createCollaborationRequestRecord({
      ...requestInput,
      trackingCode,
      userAgent: context.userAgent,
      ipHash: context.ipHash,
    });

  const telegramMessage =
    createCollaborationTelegramMessage(
      createdRequest,
    );

  try {
    const telegramResult =
      await sendTelegramMessage(
        telegramMessage,
      );

    await markTelegramDeliveryAsSent(
      createdRequest.id,
      telegramResult.messageId,
    );

    return {
      ok: true,
      trackingCode,
      telegramDelivered: true,
    };
  }
  catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown Telegram delivery error.";

    await markTelegramDeliveryAsFailed(
      createdRequest.id,
      errorMessage,
    );

    console.error(
      "Telegram collaboration notification failed.",
      {
        trackingCode,
        error: errorMessage,
      },
    );

    return {
      ok: true,
      trackingCode,
      telegramDelivered: false,
    };
  }
}