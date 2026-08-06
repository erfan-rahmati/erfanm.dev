import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer/site-footer";
import { SiteNavigation } from "@/components/layout/site-navigation/site-navigation";

type SiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function SiteLayout({
  children,
}: SiteLayoutProps) {
  return (
    <>
      <SiteNavigation />
      {children}
      <SiteFooter />
    </>
  );
}