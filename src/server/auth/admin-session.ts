import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth/auth";

export async function getSessionForHeaders(
  requestHeaders: Headers,
) {
  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export async function getRequestSession() {
  return getSessionForHeaders(
    await headers(),
  );
}

export type RequestSession = Awaited<
  ReturnType<typeof getRequestSession>
>;

export function isAdminSession(
  session: RequestSession,
): boolean {
  const role = session?.user.role;

  if (typeof role !== "string") {
    return false;
  }

  return role
    .split(",")
    .map((item) => item.trim())
    .includes("admin");
}

export async function requireAdminSession() {
  const session = await getRequestSession();

  if (!session || !isAdminSession(session)) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function requireAdminPageSession() {
  const session = await getRequestSession();

  if (!session || !isAdminSession(session)) {
    redirect("/admin/login");
  }

  return session;
}
