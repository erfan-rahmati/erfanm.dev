export const SITE_SECTION_IDS = [
  "home",
  "about",
  "projects",
  "skills",
  "blog",
  "contact",
] as const;

export type SiteSectionId =
  (typeof SITE_SECTION_IDS)[number];

export type SiteSectionHref =
  | "/"
  | "/blog"
  | "/projects"
  | `/#${SiteSectionId}`;

export const BOTTOM_NAVIGATION_ICON_IDS = [
  "home",
  "projects",
  "about",
  "blog",
  "contact",
] as const;

export type BottomNavigationIconId =
  (typeof BOTTOM_NAVIGATION_ICON_IDS)[number];

export type NavigationSocialId =
  | "github"
  | "instagram"
  | "telegram"
  | "linkedin";

export type SiteNavigationItem = Readonly<{
  id: SiteSectionId;
  label: string;
  href: SiteSectionHref;
  mobileStagger: 1 | 2 | 3 | 4;
}>;

export type BottomNavigationItem = Readonly<{
  id: BottomNavigationIconId;
  label: string;
  href: SiteSectionHref;
  icon: BottomNavigationIconId;
}>;

export type NavigationSocialLink = Readonly<{
  id: NavigationSocialId;
  label: string;
  href: `https://${string}`;
}>;

export type NavigationContent = Readonly<{
  logoLabel: string;
  collaborationLabel: string;
  resumeLabel: string;
  resumeHref: `/${string}`;
}>;
