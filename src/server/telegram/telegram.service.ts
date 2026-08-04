import "server-only";

import {
  serverEnvironment,
} from "@/config/env.server";

type TelegramSendMessageResponse =
  Readonly<{
    ok: boolean;
    description?: string;
    result?: {
      message_id: number;
    };
  }>;

export async function sendTelegramMessage(
  message: string,
) {
  const response = await fetch(
    `https://api.telegram.org/bot${serverEnvironment.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "content-type":
          "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        chat_id:
          serverEnvironment.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );

  const responseBody =
    (await response.json()) as
      TelegramSendMessageResponse;

  if (
    !response.ok ||
    !responseBody.ok ||
    !responseBody.result
  ) {
    throw new Error(
      responseBody.description ??
        `Telegram request failed with status ${response.status}.`,
    );
  }

  return {
    messageId:
      responseBody.result.message_id,
  } as const;
}