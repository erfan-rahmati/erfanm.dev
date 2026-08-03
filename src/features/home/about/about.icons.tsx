import type {
  AboutDetailId,
  AboutExpertiseId,
} from "./about.types";

export function AboutArrowIcon() {
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
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function AboutPhilosophyIcon() {
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
      <path d="M12 3a6 6 0 0 0-3.65 10.76c.7.53 1.15 1.31 1.15 2.19V17h5v-1.05c0-.88.45-1.66 1.15-2.19A6 6 0 0 0 12 3Z" />
      <path d="M9.5 20h5" />
      <path d="M10 17h4" />
      <path d="M12 3V1" />
      <path d="m5.64 5.64-1.42-1.42" />
      <path d="m18.36 5.64 1.42-1.42" />
    </svg>
  );
}

type AboutDetailIconProps = Readonly<{
  id: AboutDetailId;
}>;

export function AboutDetailIcon({
  id,
}: AboutDetailIconProps) {
  switch (id) {
    case "location":
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
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );

    case "availability":
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
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
          <path d="M10 12v2h4v-2" />
        </svg>
      );
  }
}

type AboutExpertiseIconProps = Readonly<{
  id: AboutExpertiseId;
}>;

export function AboutExpertiseIcon({
  id,
}: AboutExpertiseIconProps) {
  switch (id) {
    case "frontend":
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
          <path d="m8 9-4 3 4 3" />
          <path d="m16 9 4 3-4 3" />
          <path d="m14 5-4 14" />
        </svg>
      );

    case "interface-design":
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
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 18v3" />
          <path d="M7 8h5" />
          <path d="M7 12h10" />
        </svg>
      );

    case "backend":
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
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
          <path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
        </svg>
      );

    case "architecture":
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
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
          <path d="M6.5 10v2h11v-2" />
          <path d="M12 12v2" />
        </svg>
      );

    case "pwa":
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
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M10 5h4" />
          <path d="M11 18h2" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "wordpress":
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
          <circle cx="12" cy="12" r="9" />
          <path d="M6.5 8.5h3" />
          <path d="m8 8.5 3.2 8" />
          <path d="m10.4 8.5 3.2 8" />
          <path d="m13.6 8.5 2.2 5.5" />
          <path d="M16.8 7.7c1.5 2.6.6 5.9-1 9.1" />
        </svg>
      );
  }
}