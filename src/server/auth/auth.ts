import "server-only";

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";

import { serverEnvironment } from "@/config/env.server";
import { siteConfig } from "@/config/site";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  appName: "erfanm.dev",

  baseURL:
    serverEnvironment.BETTER_AUTH_URL,

  secret:
    serverEnvironment.BETTER_AUTH_SECRET,

  trustedOrigins: [
    new URL(
      serverEnvironment.BETTER_AUTH_URL,
    ).origin,
    siteConfig.url,
  ],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        required: true,
        defaultValue: "user",
        input: false,
      },
    },
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});

export type AuthSession =
  typeof auth.$Infer.Session;
