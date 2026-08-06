export type AboutAction = Readonly<{
  label: string;
  href: `#${string}`;
}>;

export type AboutContent = Readonly<{
  eyebrow: string;
  name: string;
  role: string;
  title: string;
  summary: string;
  productMindset: string;
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
  technologies: readonly string[];
  description: string;
}>;

export type AboutProjectTypeId =
  | "custom-website"
  | "pwa"
  | "saas-dashboard"
  | "ecommerce"
  | "crm-system"
  | "admin-dashboard"
  | "enterprise-system"
  | "corporate-website"
  | "landing-page";
  
export type AboutProjectType = Readonly<{
  id: AboutProjectTypeId;
  label: string;
}>;
