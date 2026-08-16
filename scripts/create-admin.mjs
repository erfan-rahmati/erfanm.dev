import { randomUUID } from "node:crypto";

import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";
import { config } from "dotenv";

config({
  path: ".env.local",
  quiet: true,
});

const name =
  process.env.ADMIN_NAME?.trim() ?? "";
const email =
  process.env.ADMIN_EMAIL?.trim().toLowerCase() ??
  "";
const password =
  process.env.ADMIN_PASSWORD ?? "";
const databaseUrl =
  process.env.DATABASE_URL_DIRECT?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  "";

if (name.length < 2 || name.length > 120) {
  throw new Error(
    "ADMIN_NAME must contain 2 to 120 characters.",
  );
}

if (
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  )
) {
  throw new Error(
    "ADMIN_EMAIL must be a valid email address.",
  );
}

if (
  password.length < 12 ||
  password.length > 128
) {
  throw new Error(
    "ADMIN_PASSWORD must contain 12 to 128 characters.",
  );
}

if (
  !databaseUrl.startsWith("postgres://") &&
  !databaseUrl.startsWith("postgresql://")
) {
  throw new Error(
    "DATABASE_URL_DIRECT or DATABASE_URL is required.",
  );
}

const sql = neon(databaseUrl);
const userId = randomUUID();
const accountId = randomUUID();
const passwordHash = await hashPassword(password);
const now = new Date();

try {
  await sql.transaction((transaction) => [
    transaction`
      INSERT INTO users (
        id,
        name,
        email,
        email_verified,
        created_at,
        updated_at,
        role
      )
      VALUES (
        ${userId}::uuid,
        ${name},
        ${email},
        true,
        ${now},
        ${now},
        'admin'
      )
    `,
    transaction`
      INSERT INTO accounts (
        id,
        account_id,
        provider_id,
        user_id,
        password,
        created_at,
        updated_at
      )
      VALUES (
        ${accountId}::uuid,
        ${userId},
        'credential',
        ${userId}::uuid,
        ${passwordHash},
        ${now},
        ${now}
      )
    `,
  ]);

  console.log(
    `Admin account created for ${email}.`,
  );
}
catch (error) {
  if (
    error instanceof Error &&
    /duplicate key|unique constraint/i.test(
      error.message,
    )
  ) {
    throw new Error(
      "An account with this email already exists. No changes were made.",
    );
  }

  throw error;
}
