export type SkillsContent = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export type SkillCategoryId =
  | "frontend-platform"
  | "backend-data"
  | "wordpress-design"
  | "tooling-delivery";

export type SkillCategory = Readonly<{
  id: SkillCategoryId;
  title: string;
  description: string;
  skills: readonly string[];
}>;
