import type {
  HeroBrowserTone,
  HeroTechnologyId,
} from "./hero.types";

type TechnologyAsset = Readonly<{
  src: `/${string}`;
  width: number;
  height: number;
}>;

export const heroTechnologyAssets = {
  "tailwind-css": {
    src: "/icons/technologies/tailwind-css.svg",
    width: 64,
    height: 64,
  },
  "rest-api": {
    src: "/icons/technologies/rest-api.svg",
    width: 64,
    height: 64,
  },
  typescript: {
    src: "/icons/technologies/typescript.svg",
    width: 64,
    height: 64,
  },
  react: {
    src: "/icons/technologies/react.svg",
    width: 64,
    height: 64,
  },
  aspnet: {
    src: "/icons/technologies/aspnet.svg",
    width: 64,
    height: 64,
  },
  javascript: {
    src: "/icons/technologies/javascript.svg",
    width: 64,
    height: 64,
  },
  nextjs: {
    src: "/icons/technologies/nextjs.svg",
    width: 394,
    height: 80,
  },
} as const satisfies Record<HeroTechnologyId, TechnologyAsset>;

export const heroBrowserToneClassNames = {
  default: "",
  violet: "hero__mockup-browser--violet",
  teal: "hero__mockup-browser--teal",
  amber: "hero__mockup-browser--amber",
} as const satisfies Record<HeroBrowserTone, string>;