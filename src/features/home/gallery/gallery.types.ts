export const GALLERY_DIRECTIONS = ["left", "right"] as const;

export type GalleryDirection = (typeof GALLERY_DIRECTIONS)[number];

export const GALLERY_ITEM_VARIANTS = ["desktop", "mobile"] as const;

export type GalleryItemVariant = (typeof GALLERY_ITEM_VARIANTS)[number];

export type GalleryItem = Readonly<{
  id: string;
  projectName: string;
  src: `/${string}`;
  alt: string;
  variant: GalleryItemVariant;
}>;

export type GalleryRow = Readonly<{
  id: "primary" | "secondary";
  direction: GalleryDirection;
  items: readonly GalleryItem[];
}>;