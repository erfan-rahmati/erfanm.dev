import type { ReactNode } from "react";

import { AdminShell } from "@/features/admin/layout/admin-shell";
import { requireAdminPageSession } from "@/server/auth/admin-session";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session =
    await requireAdminPageSession();

  return (
    <AdminShell userName={session.user.name}>
      {children}
    </AdminShell>
  );
}
