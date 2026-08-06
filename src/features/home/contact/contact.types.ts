export const COLLABORATION_PROJECT_TYPE_IDS = [
  "custom-website",
  "custom-web-application",
  "wordpress-website",
  "website-administration-support",
  "seo-optimization",
  "website-redesign-development",
  "other",
] as const;

export type CollaborationProjectTypeId =
  (typeof COLLABORATION_PROJECT_TYPE_IDS)[number];

export const COLLABORATION_DURATION_IDS = [
  "less-than-one-month",
  "one-to-three-months",
  "three-to-six-months",
  "more-than-six-months",
] as const;

export type CollaborationDurationId =
  (typeof COLLABORATION_DURATION_IDS)[number];

export type CollaborationProjectTypeOption =
  Readonly<{
    id: CollaborationProjectTypeId;
    label: string;
  }>;

export type CollaborationDurationOption =
  Readonly<{
    id: CollaborationDurationId;
    label: string;
  }>;

export type ContactSectionContent = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  formTitle: string;
  formDescription: string;
  communicationTitle: string;
  communicationDescription: string;
  submitLabel: string;
  submittingLabel: string;
  trustItems: readonly string[];
}>;

export type CollaborationRequestFormValues =
  Readonly<{
    fullName: string;
    phone: string;
    projectTypes:
      readonly CollaborationProjectTypeId[];
    proposedDuration:
      CollaborationDurationId | "";
    proposedBudgetToman: string;
    description: string;
  }>;