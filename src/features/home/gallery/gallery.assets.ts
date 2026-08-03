export const galleryImageAssets = {
  "/images/projects/fixboo/gallery-desktop.png": {
    width: 1536,
    height: 1024,
  },
  "/images/projects/fixboo/gallery-mobile.png": {
    width: 923,
    height: 1439,
  },
  "/images/projects/nirvana/gallery-desktop.png": {
    width: 1536,
    height: 1024,
  },
  "/images/projects/nirvana/gallery-mobile.png": {
    width: 941,
    height: 1396,
  },
  "/images/projects/pixshow/gallery-desktop.png": {
    width: 1536,
    height: 1024,
  },
  "/images/projects/pixshow/gallery-mobile.png": {
    width: 837,
    height: 1880,
  },
  "/images/projects/amaday-gasht/gallery-desktop.png": {
    width: 1536,
    height: 1024,
  },
  "/images/projects/amaday-gasht/gallery-mobile.png": {
    width: 872,
    height: 1804,
  },
} as const;

export type GalleryImageSource =
  keyof typeof galleryImageAssets;