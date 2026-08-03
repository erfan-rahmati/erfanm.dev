import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-[var(--radius-lg)] border border-[var(--color-surface-border)] bg-[var(--color-surface)] p-8 text-center backdrop-blur-xl md:p-12">
        <p
          className="mb-4 text-sm tracking-[0.2em] text-[var(--color-accent-secondary)]"
          dir="ltr"
        >
          {siteConfig.name}
        </p>

        <h1 className="text-3xl leading-tight font-bold md:text-5xl">
          زیرساخت اولیه پروژه آماده است
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)] md:text-lg">
          پروژه با Next.js، React، TypeScript و Tailwind CSS راه‌اندازی شده
          است. در مرحله بعد ساختار واقعی صفحه اصلی و مهاجرت Hero و Gallery را
          آغاز می‌کنیم.
        </p>

        <div
          className="mx-auto mt-8 h-1 w-24 rounded-full bg-[var(--color-accent)] shadow-[0_0_30px_var(--color-accent-soft)]"
          aria-hidden="true"
        />
      </section>
    </main>
  );
}