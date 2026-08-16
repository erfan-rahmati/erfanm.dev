import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { ProjectsShowcase } from "@/features/projects/projects-showcase";
import { listPublishedProjects } from "@/server/projects/project.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروژه‌ها و نمونه‌کارهای طراحی و توسعه وب",
  description: "منتخبی از پروژه‌های طراحی سایت، وب‌اپلیکیشن، فروشگاه آنلاین و پنل‌های مدیریتی عرفان رحمتی با جزئیات مسئله، راهکار و تجربه کاربری.",
  alternates: { canonical: "/projects" },
  openGraph: { type: "website", url: "/projects", title: "پروژه‌های عرفان رحمتی | erfanm.dev", description: "نمونه‌کارهای طراحی و توسعه محصولات دیجیتال، وب‌اپلیکیشن و پنل مدیریت." },
};

export default async function ProjectsPage() {
  const projects = await listPublishedProjects();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/projects#collection`,
    name: "پروژه‌ها و نمونه‌کارهای عرفان رحمتی",
    description: "نمونه‌کارهای طراحی و توسعه وب‌اپلیکیشن، فروشگاه آنلاین و پنل مدیریت.",
    url: `${siteConfig.url}/projects`,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `${siteConfig.url}/projects/${project.slug}`,
      })),
    },
  };
  return (
    <main className="projects-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="projects-hero">
        <div className="projects-container">
          <span className="projects-eyebrow">SELECTED WORK / PORTFOLIO</span>
          <h1>پروژه‌هایی که مسئله را به تجربه‌ای روشن تبدیل می‌کنند</h1>
          <p>مجموعه‌ای از محصولات دیجیتال با تمرکز بر معماری قابل‌توسعه، رابط کاربری دقیق و تجربه‌ای سریع و ساده برای کاربر نهایی.</p>
          <div className="projects-hero__meta"><span>{projects.length.toLocaleString("fa-IR")} پروژه منتخب</span><span>طراحی محصول و توسعه فول‌استک</span></div>
        </div>
      </section>
      <section className="projects-container projects-content">
        {projects.length ? <ProjectsShowcase projects={projects} /> : <div className="projects-empty"><h2>پروژه‌ها در حال آماده‌سازی‌اند</h2><p>به‌زودی جزئیات نمونه‌کارها در این صفحه منتشر می‌شود.</p></div>}
        <section className="projects-method" aria-labelledby="projects-method-title">
          <div className="projects-method__heading"><span className="projects-eyebrow">HOW I BUILD</span><h2 id="projects-method-title">رویکرد من در طراحی و توسعه پروژه‌های وب</h2><p>هر پروژه از شناخت مسئله شروع می‌شود و با معماری فنی، طراحی رابط و سنجش کیفیت در چند مرحله به یک محصول قابل‌استفاده تبدیل می‌شود.</p></div>
          <div className="projects-method__grid">
            <article><span>01</span><h3>شناخت مسئله و کاربر</h3><p>نیاز کسب‌وکار، مسیرهای اصلی کاربر و محدودیت‌های محصول پیش از طراحی مشخص می‌شوند.</p></article>
            <article><span>02</span><h3>معماری و طراحی منسجم</h3><p>ساختار داده، مسیرهای رابط و سیستم بصری با هدف توسعه‌پذیری و تجربه‌ای روشن شکل می‌گیرند.</p></article>
            <article><span>03</span><h3>توسعه، کنترل کیفیت و بهینه‌سازی</h3><p>پیاده‌سازی واکنش‌گرا با بررسی امنیت، دسترس‌پذیری، سرعت، SEO و رفتار واقعی رابط تکمیل می‌شود.</p></article>
          </div>
        </section>
      </section>
    </main>
  );
}
