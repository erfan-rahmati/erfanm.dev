import { notFound } from "next/navigation";
import { ProjectDetail } from "@/features/projects/project-detail";
import { getAdminProjectById } from "@/server/projects/project.repository";

export const metadata = { robots: { index: false, follow: false } };
export default async function ProjectPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const project = await getAdminProjectById(id); if (!project) notFound();
  return <main className="project-page projects-container"><div className="admin-preview-banner">پیش‌نمایش امن — این صفحه ایندکس نمی‌شود.</div><ProjectDetail project={project} /></main>;
}
