import Link from "next/link";

import { formatAdminDate, formatAdminNumber } from "@/features/admin/admin-formatters";
import { ProjectDeleteForm } from "@/features/admin/projects/project-delete-form";
import { archiveProjectAction } from "@/features/admin/projects/project.actions";
import { PROJECT_STATUS_IDS, type ProjectStatus } from "@/features/admin/projects/project.schema";
import { listAdminProjects } from "@/server/projects/project.repository";

const labels: Record<ProjectStatus, string> = { draft: "پیش‌نویس", published: "منتشرشده", archived: "آرشیوشده" };
function isStatus(value?: string): value is ProjectStatus { return PROJECT_STATUS_IDS.some((item) => item === value); }
function href(page: number, query: string, status?: ProjectStatus) { const params = new URLSearchParams({ page: String(page) }); if (query) params.set("q", query); if (status) params.set("status", status); return `/admin/projects?${params}`; }

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.slice(0, 120) : "";
  const statusValue = typeof params.status === "string" ? params.status : undefined;
  const status = isStatus(statusValue) ? statusValue : undefined;
  const pageValue = Number(typeof params.page === "string" ? params.page : "1");
  const result = await listAdminProjects({ page: Number.isSafeInteger(pageValue) ? pageValue : 1, query, ...(status ? { status } : {}) });
  return <main className="admin-page">
    <header className="admin-page__header"><div><span className="admin-page__eyebrow">PORTFOLIO CMS</span><h1>مدیریت پروژه‌ها</h1><p>{formatAdminNumber(result.total)} پروژه در این فهرست است.</p></div><Link href="/admin/projects/new" className="admin-button admin-button--primary">پروژه جدید</Link></header>
    <form className="admin-filter-form"><input name="q" defaultValue={query} placeholder="عنوان، اسلاگ یا دسته‌بندی" /><select name="status" defaultValue={status ?? ""}><option value="">همه وضعیت‌ها</option><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option><option value="archived">آرشیوشده</option></select><button className="admin-button">اعمال فیلتر</button></form>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>پروژه</th><th>دسته‌بندی</th><th>ترتیب</th><th>وضعیت</th><th>آخرین ویرایش</th><th>عملیات</th></tr></thead><tbody>
      {result.items.map((project) => <tr key={project.id}><td><div className="admin-table__title"><strong>{project.title}</strong><small>/projects/{project.slug}</small></div></td><td>{project.category}</td><td>{formatAdminNumber(project.sortOrder)}</td><td><span className={`admin-status admin-status--${project.status}`}>{labels[project.status]}</span></td><td>{formatAdminDate(project.updatedAt)}</td><td><div className="admin-table__actions"><Link href={`/admin/projects/${project.id}/edit`}>ویرایش</Link><Link href={`/admin/projects/${project.id}/preview`} target="_blank">پیش‌نمایش</Link>{project.status !== "archived" ? <form action={archiveProjectAction}><input type="hidden" name="id" value={project.id} /><button>آرشیو</button></form> : null}</div><ProjectDeleteForm projectId={project.id} projectTitle={project.title} /></td></tr>)}
    </tbody></table>{!result.items.length ? <p className="admin-empty">پروژه‌ای پیدا نشد.</p> : null}</div>
    <nav className="admin-pagination" aria-label="صفحه‌بندی پروژه‌ها">{result.page > 1 ? <Link href={href(result.page - 1, query, status)}>صفحه قبل</Link> : null}<span>صفحه {formatAdminNumber(result.page)} از {formatAdminNumber(result.pageCount)}</span>{result.page < result.pageCount ? <Link href={href(result.page + 1, query, status)}>صفحه بعد</Link> : null}</nav>
  </main>;
}
