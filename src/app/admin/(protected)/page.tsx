import Link from "next/link";

import {
  formatAdminNumber,
} from "@/features/admin/admin-formatters";
import { getArticleDashboardCounts } from "@/server/articles/article.repository";
import { getRequestDashboardCounts } from "@/server/collaboration/admin-collaboration.repository";
import { getProjectDashboardCounts } from "@/server/projects/project.repository";

export default async function AdminDashboardPage() {
  const [articleCounts, projectCounts, requestCounts] =
    await Promise.all([
      getArticleDashboardCounts(),
      getProjectDashboardCounts(),
      getRequestDashboardCounts(),
    ]);

  const cards = [
    {
      label: "مقالات منتشرشده",
      value: articleCounts.published,
      href: "/admin/articles?status=published",
    },
    {
      label: "پیش‌نویس‌ها",
      value: articleCounts.draft,
      href: "/admin/articles?status=draft",
    },
    {
      label: "درخواست‌های جدید",
      value: requestCounts.new ?? 0,
      href: "/admin/requests?status=new",
    },
    {
      label: "پروژه‌های منتشرشده",
      value: projectCounts.published,
      href: "/admin/projects?status=published",
    },
  ];

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            نمای کلی
          </span>
          <h1>داشبورد مدیریت</h1>
          <p>
            وضعیت محتوا و درخواست‌های ورودی را از
            یک نقطه مدیریت کن.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="admin-button admin-button--primary"
        >
          مقاله جدید
        </Link>
      </header>

      <section
        className="admin-stat-grid"
        aria-label="آمار پنل"
      >
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-stat-card"
          >
            <span>{card.label}</span>
            <strong>
              {formatAdminNumber(card.value)}
            </strong>
          </Link>
        ))}
      </section>

      <section className="admin-panel admin-dashboard-actions">
        <div>
          <h2>میان‌بُرها</h2>
          <p>
            عملیات پرتکرار مدیریت محتوا و سرنخ‌ها
          </p>
        </div>
        <div>
          <Link href="/admin/articles/new">
            نوشتن مقاله
          </Link>
          <Link href="/admin/articles">
            مدیریت مقالات
          </Link>
          <Link href="/admin/projects">
            مدیریت پروژه‌ها
          </Link>
          <Link href="/admin/requests">
            بررسی درخواست‌ها
          </Link>
          <Link href="/admin/media">
            کتابخانه رسانه
          </Link>
        </div>
      </section>
    </main>
  );
}
