export type AboutAction = Readonly<{
  label: string;
  href: `#${string}`;
}>;

export type AboutContent = Readonly<{
  eyebrow: string;
  name: string;
  role: string;
  title: string;
  introduction: readonly string[];
  philosophyTitle: string;
  philosophy: readonly string[];
  primaryAction: AboutAction;
  secondaryAction: AboutAction;
}>;

export type AboutStatisticId =
  | "experience"
  | "projects";

export type AboutStatistic = Readonly<{
  id: AboutStatisticId;
  value: string;
  label: string;
}>;

export type AboutDetailId =
  | "location"
  | "availability";

export type AboutDetail = Readonly<{
  id: AboutDetailId;
  label: string;
  value: string;
}>;

export type AboutExpertiseId =
  | "frontend"
  | "interface-design"
  | "backend"
  | "architecture"
  | "pwa"
  | "wordpress";

export type AboutExpertise = Readonly<{
  id: AboutExpertiseId;
  title: string;
  description: string;
}>;

export type AboutProjectTypeId =
  | "custom-applications"
  | "dashboards"
  | "saas"
  | "ecommerce"
  | "corporate"
  | "wordpress"
  | "wordpress-development";

export type AboutProjectType = Readonly<{
  id: AboutProjectTypeId;
  label: string;
}>;