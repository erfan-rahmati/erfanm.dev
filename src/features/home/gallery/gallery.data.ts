import type { GalleryRow } from "./gallery.types";

export const galleryRows = [
  {
    id: "primary",
    direction: "left",
    items: [
      {
        id: "fixboo-desktop-primary",
        projectName: "FixBoo",
        src: "/images/projects/fixboo/gallery-desktop.png",
        alt: "نمای دسکتاپ پروژه FixBoo",
        variant: "desktop",
      },
      {
        id: "fixboo-mobile-primary",
        projectName: "FixBoo",
        src: "/images/projects/fixboo/gallery-mobile.png",
        alt: "نمای موبایل پروژه FixBoo",
        variant: "mobile",
      },
      {
        id: "nirvana-desktop-primary",
        projectName: "Nirvana",
        src: "/images/projects/nirvana/gallery-desktop.png",
        alt: "نمای دسکتاپ پروژه Nirvana",
        variant: "desktop",
      },
      {
        id: "nirvana-mobile-primary",
        projectName: "Nirvana",
        src: "/images/projects/nirvana/gallery-mobile.png",
        alt: "نمای موبایل پروژه Nirvana",
        variant: "mobile",
      },
      {
        id: "pixshow-desktop-primary",
        projectName: "PixShow",
        src: "/images/projects/pixshow/gallery-desktop.png",
        alt: "نمای دسکتاپ پروژه PixShow",
        variant: "desktop",
      },
      {
        id: "pixshow-mobile-primary",
        projectName: "PixShow",
        src: "/images/projects/pixshow/gallery-mobile.png",
        alt: "نمای موبایل پروژه PixShow",
        variant: "mobile",
      },
      {
        id: "amaday-gasht-desktop-primary",
        projectName: "AmadayGasht",
        src: "/images/projects/amaday-gasht/gallery-desktop.png",
        alt: "نمای دسکتاپ پروژه AmadayGasht",
        variant: "desktop",
      },
      {
        id: "amaday-gasht-mobile-primary",
        projectName: "AmadayGasht",
        src: "/images/projects/amaday-gasht/gallery-mobile.png",
        alt: "نمای موبایل پروژه AmadayGasht",
        variant: "mobile",
      },
    ],
  },
  {
    id: "secondary",
    direction: "right",
    items: [
      {
        id: "amaday-gasht-mobile-secondary",
        projectName: "AmadayGasht",
        src: "/images/projects/amaday-gasht/gallery-mobile.png",
        alt: "نمای موبایل پروژه AmadayGasht",
        variant: "mobile",
      },
      {
        id: "amaday-gasht-desktop-secondary",
        projectName: "AmadayGasht",
        src: "/images/projects/amaday-gasht/gallery-desktop.png",
        alt: "نمای دسکتاپ پروژه AmadayGasht",
        variant: "desktop",
      },
      {
        id: "pixshow-mobile-secondary",
        projectName: "PixShow",
        src: "/images/projects/pixshow/gallery-mobile.png",
        alt: "نمای موبایل پروژه PixShow",
        variant: "mobile",
      },
      {
        id: "pixshow-desktop-secondary",
        projectName: "PixShow",
        src: "/images/projects/pixshow/gallery-desktop.png",
        alt: "نمای دسکتاپ پروژه PixShow",
        variant: "desktop",
      },
      {
        id: "nirvana-mobile-secondary",
        projectName: "Nirvana",
        src: "/images/projects/nirvana/gallery-mobile.png",
        alt: "نمای موبایل پروژه Nirvana",
        variant: "mobile",
      },
      {
        id: "nirvana-desktop-secondary",
        projectName: "Nirvana",
        src: "/images/projects/nirvana/gallery-desktop.png",
        alt: "نمای دسکتاپ پروژه Nirvana",
        variant: "desktop",
      },
    ],
  },
] as const satisfies readonly GalleryRow[];

export const galleryTechnologyBrands = [
  "React",
  "Next.js",
  "PWA",
  "REST API",
  "TypeScript",
  "Prisma",
  "Postman",
  "Tailwind",
  "Node.js",
  "ASP.NET",
] as const;