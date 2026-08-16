export type ProjectHighlight = Readonly<{
  title: string;
  description: string;
}>;

export type ProjectGalleryImage = Readonly<{
  url: string;
  alt: string;
  caption?: string;
}>;

export type ProjectCardLayout =
  | "featured"
  | "standard"
  | "wide";
