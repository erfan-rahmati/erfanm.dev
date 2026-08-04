import type { SkillCategoryId } from "./skills.types";

type SkillCategoryIconProps = Readonly<{
  id: SkillCategoryId;
}>;

export function SkillCategoryIcon({
  id,
}: SkillCategoryIconProps) {
  switch (id) {
    case "frontend-platform":
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
          <rect x="3" y="4" width="18" height="15" rx="2" />
          <path d="M3 8h18" />
          <path d="m9 12-2 2 2 2" />
          <path d="m15 12 2 2-2 2" />
          <path d="m13 11-2 6" />
        </svg>
      );

    case "backend-data":
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

    case "wordpress-design":
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
          <path d="M12 3 4 7v6c0 4.5 3.1 7.4 8 8 4.9-.6 8-3.5 8-8V7l-8-4Z" />
          <path d="m9 13 2 2 4-5" />
        </svg>
      );

    case "tooling-delivery":
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
          <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z" />
        </svg>
      );
  }
}

export function SkillsChevronIcon() {
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
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

export function SkillsCheckIcon() {
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
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
