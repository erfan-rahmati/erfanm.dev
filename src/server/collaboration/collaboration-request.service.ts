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
  countRecentCollaborationRequestsByIpHash,
  createCollaborationRequestRecord,
  findCollaborationRequestBySubmissionId,
  markTelegramDeliveryAsFailed,
  markTelegramDeliveryAsSent,
} from "./collaboration-request.repository";
import {
  createCollaborationTrackingCode,
} from "./tracking-code";

const RATE_LIMIT_WINDOW_MS =
  30 * 60 * 1000;

const MAX_REQUESTS_PER_WINDOW = 3;

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
        | "RATE_LIMITED"
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

  const existingRequest =
    await findCollaborationRequestBySubmissionId(
      parsedInput.data.submissionId,
    );

  if (existingRequest) {
    return {
      ok: true,
      trackingCode:
        existingRequest.trackingCode,
      telegramDelivered:
        existingRequest.telegramDeliveryStatus ===
        "sent",
    };
  }

  if (context.ipHash) {
    const rateLimitWindowStart =
      new Date(
        Date.now() -
          RATE_LIMIT_WINDOW_MS,
      );

    const recentRequestCount =
      await countRecentCollaborationRequestsByIpHash(
        context.ipHash,
        rateLimitWindowStart,
      );

    if (
      recentRequestCount >=
      MAX_REQUESTS_PER_WINDOW
    ) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message:
          "تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً ۳۰ دقیقه دیگر دوباره تلاش کن.",
      };
    }
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

  if (!createdRequest) {
    const concurrentRequest =
      await findCollaborationRequestBySubmissionId(
        requestInput.submissionId,
      );

    if (!concurrentRequest) {
      throw new Error(
        "Idempotent collaboration request could not be resolved.",
      );
    }

    return {
      ok: true,
      trackingCode:
        concurrentRequest.trackingCode,
      telegramDelivered:
        concurrentRequest.telegramDeliveryStatus ===
        "sent",
    };
  }

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
      trackingCode:
        createdRequest.trackingCode,
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
        trackingCode:
          createdRequest.trackingCode,
        error: errorMessage,
      },
    );

    return {
      ok: true,
      trackingCode:
        createdRequest.trackingCode,
      telegramDelivered: false,
    };
  }
}