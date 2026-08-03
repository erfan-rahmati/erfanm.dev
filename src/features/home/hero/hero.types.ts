export const HERO_PROJECT_IDS = [
  "fixboo",
  "pixshow",
  "nirvana",
  "amaday-gasht",
] as const;

export type HeroProjectId = (typeof HERO_PROJECT_IDS)[number];

export const HERO_TECHNOLOGY_IDS = [
  "tailwind-css",
  "rest-api",
  "typescript",
  "react",
  "aspnet",
  "javascript",
  "nextjs",
] as const;

export type HeroTechnologyId = (typeof HERO_TECHNOLOGY_IDS)[number];

export const HERO_BROWSER_TONES = [
  "default",
  "violet",
  "teal",
  "amber",
] as const;

export type HeroBrowserTone = (typeof HERO_BROWSER_TONES)[number];

export type HeroProject = Readonly<{
  id: HeroProjectId;
  name: string;
  imageSrc: `/${string}`;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  ariaLabel: string;
  browserTone: HeroBrowserTone;
  technologies: readonly HeroTechnologyId[];
}>;

export type HeroSocialLink = Readonly<{
  id: "github" | "instagram" | "telegram" | "linkedin";
  label: string;
  href: `https://${string}`;
}>;

export type HeroContent = Readonly<{
  eyebrow: string;
  titleFirstLine: string;
  titleAccentLine: string;
  titleLastLine: string;
  description: string;
  resumeHref: `/${string}`;
  projectsHref: `/${string}` | `#${string}`;
}>;