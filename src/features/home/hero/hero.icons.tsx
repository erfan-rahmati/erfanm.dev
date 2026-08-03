import type { HeroSocialLink } from "./hero.types";

type SocialIconId = HeroSocialLink["id"];

type SocialIconProps = Readonly<{
  id: SocialIconId;
}>;

export function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="currentColor"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="M90 54a5.9966 5.9966 0 0 0-6 6v18H12V60a6 6 0 0 0-12 0v24a5.9966 5.9966 0 0 0 6 6h84a5.9966 5.9966 0 0 0 6-6V60a5.9966 5.9966 0 0 0-6-6Z" />

      <path d="M43.7578 64.2422a5.9979 5.9979 0 0 0 8.4844 0l18-18a5.9994 5.9994 0 0 0-8.4844-8.4844L54 45.5156V12a6 6 0 0 0-12 0v33.5156l-7.7578-7.7578a5.9994 5.9994 0 0 0-8.4844 8.4844Z" />
    </svg>
  );
}

export function ProjectsArrowIcon() {
  return (
    <svg
      className="hero__btn-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M11 18 5 12l6-6" />
    </svg>
  );
}

type CarouselArrowIconProps = Readonly<{
  direction: "previous" | "next";
}>;

export function CarouselArrowIcon({
  direction,
}: CarouselArrowIconProps) {
  const path =
    direction === "previous"
      ? "M15 18l-6-6 6-6"
      : "M9 18l6-6-6-6";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export function HeroSocialIcon({ id }: SocialIconProps) {
  switch (id) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.77 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.65 1.24 3.3.95.1-.73.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.66.79.55A11.03 11.03 0 0 0 23 11.52C23 5.24 18.27.5 12 .5Z" />
        </svg>
      );

    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.4"
            cy="6.6"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "telegram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.9 4.3 18.6 20c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16L18.2 6.2c.4-.36-.09-.56-.62-.2L6.1 13.2 1.1 11.6c-1.08-.34-1.1-1.08.23-1.6L20.5 2.8c.9-.33 1.68.2 1.4 1.5Z" />
        </svg>
      );

    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.98 1.83-2.02 3.76-2.02 4.02 0 4.76 2.55 4.76 5.87V21h-4v-5.56c0-1.33-.02-3.03-1.84-3.03-1.85 0-2.13 1.44-2.13 2.93V21h-4V9Z" />
        </svg>
      );
  }
}