import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/features/admin/admin.css";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
