"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/features/admin/auth/auth-client";

const adminNavigation = [
  {
    href: "/admin",
    label: "داشبورد",
    exact: true,
  },
  {
    href: "/admin/articles",
    label: "مقالات",
  },
  {
    href: "/admin/projects",
    label: "پروژه‌ها",
  },
  {
    href: "/admin/media",
    label: "رسانه‌ها",
  },
  {
    href: "/admin/requests",
    label: "درخواست‌ها",
  },
] as const;

type AdminShellProps = Readonly<{
  children: ReactNode;
  userName: string;
}>;

export function AdminShell({
  children,
  userName,
}: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link href="/admin">
            erfanm<span>.dev</span>
          </Link>
          <small>مدیریت محتوا</small>
        </div>

        <nav aria-label="ناوبری پنل مدیریت">
          {adminNavigation.map((item) => {
            const isActive =
              "exact" in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "admin-sidebar__link is-active"
                    : "admin-sidebar__link"
                }
                aria-current={
                  isActive ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <div>
            <small>واردشده با حساب</small>
            <strong>{userName}</strong>
          </div>

          <Link
            href="/"
            target="_blank"
            className="admin-sidebar__site-link"
          >
            مشاهده سایت
          </Link>

          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={async () => {
              await authClient.signOut();
              window.location.assign(
                "/admin/login",
              );
            }}
          >
            خروج امن
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-mobile-header">
          <Link href="/admin">
            erfanm.dev
          </Link>
          <nav aria-label="ناوبری موبایل مدیریت">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </div>
  );
}
