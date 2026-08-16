import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer/site-footer";
import { SiteNavigation } from "@/components/layout/site-navigation/site-navigation";
import { siteConfig, siteIdentity } from "@/config/site";

type SiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function SiteLayout({
  children,
}: SiteLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteIdentity.ownerName,
        alternateName: siteConfig.creator,
        url: siteConfig.url,
        image: `${siteConfig.url}/images/profile/erfan-rahmati.png`,
        jobTitle: siteConfig.creatorJobTitle,
        description: siteConfig.description,
        homeLocation: {
          "@type": "Place",
          name: siteConfig.location,
        },
        knowsAbout: [...siteConfig.topics],
        sameAs: [...siteConfig.socialProfiles],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: "وب‌سایت عرفان رحمتی",
        description: siteConfig.description,
        inLanguage: "fa-IR",
        publisher: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <SiteNavigation />
      {children}
      <SiteFooter />
    </>
  );
}
