import type {
  BottomNavigationIconId,
  NavigationSocialId,
} from "./site-navigation.types";

export function NavigationArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function NavigationCloseIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function NavigationDownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

type NavigationSocialIconProps = Readonly<{
  id: NavigationSocialId;
}>;

export function NavigationSocialIcon({
  id,
}: NavigationSocialIconProps) {
  switch (id) {
    case "github":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
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
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21.9 4.3 18.6 20c-.25 1.1-.9 1.37-1.83.85l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16L18.2 6.2c.4-.36-.09-.56-.62-.2L6.1 13.2 1.1 11.6c-1.08-.34-1.1-1.08.23-1.6L20.5 2.8c.9-.33 1.68.2 1.4 1.5Z" />
        </svg>
      );

    case "linkedin":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.98 1.83-2.02 3.76-2.02 4.02 0 4.76 2.55 4.76 5.87V21h-4v-5.56c0-1.33-.02-3.03-1.84-3.03-1.85 0-2.13 1.44-2.13 2.93V21h-4V9Z" />
        </svg>
      );
  }
}

type BottomNavigationIconProps = Readonly<{
  id: BottomNavigationIconId;
}>;

export function BottomNavigationIcon({
  id,
}: BottomNavigationIconProps) {
  switch (id) {
    case "home":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m3 12 9-9 9 9" />
          <path d="M5 10v10a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V10" />
        </svg>
      );

    case "projects":
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M26 27H6c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h20c1.1 0 2 .9 2 2v13c0 1.1-.9 2-2 2Z" />
          <path d="M22.6 18H9.4C6.4 18 4 15.6 4 12.6V12c0-1.1.9-2 2-2h20c1.1 0 2 .9 2 2v.6c0 3-2.4 5.4-5.4 5.4Z" />
          <path d="M10 20v-2" />
          <path d="M22 20v-2" />
          <path d="M9.3 10C10.2 7.1 12.8 5 16 5s5.8 2.1 6.7 5" />
        </svg>
      );

    case "about":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="6" r="4" />
          <path d="M19.997 18c.003-.164.003-.331.003-.5C20 15.015 16.418 13 12 13s-8 2.015-8 4.5S4 22 12 22c2.231 0 3.84-.157 5-.437" />
        </svg>
      );

    case "blog":
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M42 57H22A15 15 0 0 1 7 42V22A15 15 0 0 1 22 7h13a15 15 0 0 1 15 15v.5a2.5 2.5 0 0 0 2.5 2.5 4.5 4.5 0 0 1 4.5 4.5V42a15 15 0 0 1-15 15Z" />
          <path d="M35.5 27h-11a4.5 4.5 0 0 1 0-9h11a4.5 4.5 0 0 1 0 9Z" />
          <path d="M41.5 45h-17a4.5 4.5 0 0 1 0-9h17a4.5 4.5 0 0 1 0 9Z" />
        </svg>
      );

    case "contact":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
  }
}