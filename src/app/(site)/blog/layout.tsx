import type { ReactNode } from "react";

import "@/features/blog/blog.css";

export default function BlogLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
