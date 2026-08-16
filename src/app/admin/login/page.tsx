import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/admin/auth/login-form";
import {
  getRequestSession,
  isAdminSession,
} from "@/server/auth/admin-session";

export default async function AdminLoginPage() {
  const session = await getRequestSession();

  if (session && isAdminSession(session)) {
    redirect("/admin");
  }

  return (
    <main className="admin-login">
      <div
        className="admin-login__glow"
        aria-hidden="true"
      />

      <section
        className="admin-login__card"
        aria-labelledby="admin-login-title"
      >
        <LinkHome />

        <div className="admin-login__heading">
          <span>ADMIN CONSOLE</span>
          <h1 id="admin-login-title">
            ورود امن مدیر
          </h1>
          <p>
            مدیریت مقالات، رسانه‌ها و درخواست‌های
            مشاوره erfanm.dev
          </p>
        </div>

        <LoginForm />

        <p className="admin-login__security-note">
          ثبت‌نام عمومی غیرفعال است و دسترسی فقط
          برای حساب مدیر تأییدشده امکان‌پذیر است.
        </p>
      </section>
    </main>
  );
}

function LinkHome() {
  return (
    <Link
      href="/"
      className="admin-login__brand"
      aria-label="بازگشت به صفحه اصلی"
    >
      erfanm<span>.dev</span>
    </Link>
  );
}
