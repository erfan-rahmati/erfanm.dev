import "server-only";

import { drizzle } from "drizzle-orm/neon-http";

import { serverEnvironment } from "@/config/env.server";

import * as schema from "./schema";

export const db = drizzle(
  serverEnvironment.DATABASE_URL,
  {
    schema,
  },
);