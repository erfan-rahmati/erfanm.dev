import "server-only";

import { createHmac } from "node:crypto";
import { z } from "zod";

import { siteConfig } from "@/config/site";

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
    base64UrlSecretSchema.optional(),

  BETTER_AUTH_URL:
    betterAuthUrlSchema.optional(),

  BLOB_READ_WRITE_TOKEN: z
    .string()
    .trim()
    .min(1)
    .optional(),
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

    BLOB_READ_WRITE_TOKEN:
      process.env.BLOB_READ_WRITE_TOKEN,
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

function getBetterAuthUrl(
  configuredUrl?: string,
): string {
  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.VERCEL_ENV === "production") {
    return siteConfig.url;
  }

  const vercelUrl =
    process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return siteConfig.url;
}

function getBetterAuthSecret(
  configuredSecret: string | undefined,
  requestSecuritySecret: string,
): string {
  if (configuredSecret) {
    return configuredSecret;
  }

  // Domain separation keeps the auth signing key independent from the
  // request-security key while producing a stable secret on every deploy.
  return createHmac(
    "sha256",
    requestSecuritySecret,
  )
    .update("erfanm.dev/better-auth/v1")
    .digest("base64url");
}

const validatedEnvironment =
  parsedServerEnvironment.data;

export const serverEnvironment = {
  ...validatedEnvironment,
  BETTER_AUTH_SECRET: getBetterAuthSecret(
    validatedEnvironment.BETTER_AUTH_SECRET,
    validatedEnvironment.REQUEST_SECURITY_SECRET,
  ),
  BETTER_AUTH_URL: getBetterAuthUrl(
    validatedEnvironment.BETTER_AUTH_URL,
  ),
} as const;
