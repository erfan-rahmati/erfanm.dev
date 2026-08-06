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

const base64UrlSecretSchema = z
  .string()
  .trim()
  .min(
    43,
    "Secret must contain at least 43 characters.",
  )
  .max(
    256,
    "Secret is unexpectedly long.",
  )
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "Secret must be Base64URL-compatible.",
  );

const betterAuthUrlSchema = z
  .string()
  .trim()
  .url("Better Auth URL must be a valid URL.")
  .refine(
    (value) => {
      const protocol = new URL(value).protocol;

      return (
        protocol === "http:" ||
        protocol === "https:"
      );
    },
    {
      message:
        "Better Auth URL must use HTTP or HTTPS.",
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

  REQUEST_SECURITY_SECRET:
    base64UrlSecretSchema,

  BETTER_AUTH_SECRET:
    base64UrlSecretSchema,

  BETTER_AUTH_URL:
    betterAuthUrlSchema,
});

const parsedServerEnvironment =
  serverEnvironmentSchema.safeParse({
    DATABASE_URL:
      process.env.DATABASE_URL,

    TELEGRAM_BOT_TOKEN:
      process.env.TELEGRAM_BOT_TOKEN,

    TELEGRAM_CHAT_ID:
      process.env.TELEGRAM_CHAT_ID,

    REQUEST_SECURITY_SECRET:
      process.env.REQUEST_SECURITY_SECRET,

    BETTER_AUTH_SECRET:
      process.env.BETTER_AUTH_SECRET,

    BETTER_AUTH_URL:
      process.env.BETTER_AUTH_URL,
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