import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
});

const directDatabaseUrl =
  process.env.DATABASE_URL_DIRECT?.trim();

if (!directDatabaseUrl) {
  throw new Error(
    "DATABASE_URL_DIRECT is not configured in .env.local.",
  );
}

if (
  !directDatabaseUrl.startsWith("postgres://") &&
  !directDatabaseUrl.startsWith("postgresql://")
) {
  throw new Error(
    "DATABASE_URL_DIRECT must be a PostgreSQL connection string.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: directDatabaseUrl,
  },
  schemaFilter: ["public"],
  verbose: true,
});