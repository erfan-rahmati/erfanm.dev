import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="site-not-found">
      <div className="site-not-found__glow" />
      <section>
        <span>ERROR / 404</span>
        <h1>این صفحه پیدا نشد</h1>
        <p>
          ممکن است آدرس تغییر کرده باشد یا مقاله هنوز
          منتشر نشده باشد. از صفحه اصلی یا فهرست مقالات
          ادامه بده.
        </p>
        <div>
          <Link href="/">بازگشت به خانه</Link>
          <Link href="/blog">مشاهده مقالات</Link>
        </div>
      </section>
    </main>
  );
}
