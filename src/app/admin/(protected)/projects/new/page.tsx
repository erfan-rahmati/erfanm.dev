import Link from "next/link";
import { ProjectEditorForm } from "@/features/admin/projects/project-editor-form";

export default function NewProjectPage() {
  return <main className="admin-page"><header className="admin-page__header"><div><span className="admin-page__eyebrow">پروژه جدید</span><h1>ساخت پروژه</h1><p>ابتدا پیش‌نویس را کامل و پیش‌نمایش را بررسی کن.</p></div><Link href="/admin/projects" className="admin-button">بازگشت</Link></header>
    <ProjectEditorForm initialData={{ slug: "", title: "", eyebrow: "طراحی و توسعه محصول دیجیتال", shortDescription: "", overview: "", challenge: "", solution: "", category: "وب‌اپلیکیشن", services: [], technologies: [], highlights: [{ title: "", description: "" }], heroImageUrl: "", heroImageAlt: "", galleryImages: [], accentColor: "#6D5CFF", externalUrl: null, repositoryUrl: null, cardLayout: "standard", sortOrder: 0, status: "draft", isFeatured: false, noIndex: false, seoTitle: null, seoDescription: "", canonicalUrl: null }} />
  </main>;
}
