import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectEditorForm } from "@/features/admin/projects/project-editor-form";
import { getAdminProjectById } from "@/server/projects/project.repository";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const project = await getAdminProjectById(id); if (!project) notFound();
  return <main className="admin-page"><header className="admin-page__header"><div><span className="admin-page__eyebrow">ویرایش پروژه</span><h1>{project.title}</h1><p dir="ltr">/projects/{project.slug}</p></div><div className="admin-page__actions"><Link href={`/admin/projects/${project.id}/preview`} target="_blank" className="admin-button">پیش‌نمایش امن</Link><Link href="/admin/projects" className="admin-button">بازگشت</Link></div></header><ProjectEditorForm initialData={{ ...project }} /></main>;
}
