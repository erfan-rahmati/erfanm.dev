import "server-only";

import { z } from "zod";

const postgresConnectionSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) =>
      value.startsWith("postgres://") ||
      value.startsWith("postgresql://"),
    {
      message:
        "A valid PostgreSQL connection string is required.",
    },
  );

const serverEnvironmentSchema = z.object({
  DATABASE_URL: postgresConnectionSchema,
  TELEGRAM_BOT_TOKEN: z
    .string()
    .trim()
    .regex(
      /^\d+:[A-Za-z0-9_-]{30,}$/,
      "Telegram Bot Token is invalid.",
    ),
  TELEGRAM_CHAT_ID: z
    .string()
    .trim()
    .regex(
      /^-?\d+$/,
      "Telegram Chat ID is invalid.",
    ),
});

const parsedServerEnvironment =
  serverEnvironmentSchema.safeParse({
    DATABASE_URL:
      process.env.DATABASE_URL,
    TELEGRAM_BOT_TOKEN:
      process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID:
      process.env.TELEGRAM_CHAT_ID,
  });

if (!parsedServerEnvironment.success) {
  const environmentErrors =
    parsedServerEnvironment.error.issues
      .map(
        (issue) =>
          `${issue.path.join(".")}: ${issue.message}`,
      )
      .join("; ");

  throw new Error(
    `Invalid server environment: ${environmentErrors}`,
  );
}

export const serverEnvironment =
  parsedServerEnvironment.data;