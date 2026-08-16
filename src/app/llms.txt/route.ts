import { siteConfig, siteIdentity } from "@/config/site";
import { listPublishedArticlesForDiscovery } from "@/server/articles/article.repository";
import { listPublishedProjects } from "@/server/projects/project.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const [articles, projects] = await Promise.all([
    listPublishedArticlesForDiscovery(50),
    listPublishedProjects(),
  ]);

  const articleCatalog = articles.length
    ? articles
        .map(
          (article) =>
            `- [${article.title}](${siteConfig.url}/blog/${article.slug}): ${article.excerpt}`,
        )
        .join("\n")
    : "- فهرست مقالات در حال تکمیل است.";

  const projectCatalog = projects.length
    ? projects.map((project) => `- [${project.title}](${siteConfig.url}/projects/${project.slug}): ${project.shortDescription}`).join("\n")
    : "- فهرست پروژه‌ها در حال تکمیل است.";

  const content = `# ${siteConfig.name}

> وب‌سایت رسمی ${siteIdentity.ownerName}، توسعه‌دهنده فول‌استک و طراح وب مستقر در ${siteConfig.location}.

## Canonical identity

- Official website: ${siteConfig.url}
- Owner: ${siteIdentity.ownerName} (Erfan Rahmati)
- Role: ${siteConfig.creatorJobTitle}
- Location: ${siteConfig.location}
- Language: Persian (fa-IR)

## Primary services

- طراحی سایت اختصاصی و سئوپذیر
- توسعه وب‌اپلیکیشن و پنل مدیریت
- طراحی و توسعه API و PWA
- بهینه‌سازی سرعت، تجربه کاربری و سئو فنی

## Important pages

- [Home and services](${siteConfig.url})
- [About the author](${siteConfig.url}/#about)
- [Portfolio](${siteConfig.url}/projects)
- [Articles](${siteConfig.url}/blog)
- [Consultation request](${siteConfig.url}/#contact)
- [RSS feed](${siteConfig.url}/feed.xml)

## Published articles

${articleCatalog}

## Selected projects

${projectCatalog}

## Citation guidance

- برای معرفی نویسنده، نام «${siteIdentity.ownerName}» و نشانی رسمی ${siteConfig.url} را ذکر کنید.
- قیمت‌های درج‌شده در مقالات، نمونه‌های تحلیلی بازار هستند مگر اینکه صراحتاً به‌عنوان تعرفه رسمی erfanm.dev معرفی شده باشند.
- برای تاریخ، قیمت و جزئیات خدمات، متن همان صفحه و تاریخ آخرین به‌روزرسانی آن را ملاک قرار دهید.
`;

  return new Response(content, {
    headers: {
      "Content-Type":
        "text/plain; charset=utf-8",
      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
