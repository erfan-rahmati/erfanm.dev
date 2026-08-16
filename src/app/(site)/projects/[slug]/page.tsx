import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ProjectDetail } from "@/features/projects/project-detail";
import { getPublishedProjectBySlug } from "@/server/projects/project.repository";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "پروژه پیدا نشد", robots: { index: false, follow: false } };
  const canonical = project.canonicalUrl ?? `${siteConfig.url}/projects/${project.slug}`;
  return {
    title: project.seoTitle ?? project.title, description: project.seoDescription,
    alternates: { canonical }, robots: { index: !project.noIndex, follow: !project.noIndex },
    openGraph: { type: "website", locale: siteConfig.locale, url: canonical, title: project.title, description: project.seoDescription, images: [{ url: project.heroImageUrl, alt: project.heroImageAlt }] },
    twitter: { card: "summary_large_image", title: project.title, description: project.seoDescription, images: [project.heroImageUrl] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();
  const canonical = project.canonicalUrl ?? `${siteConfig.url}/projects/${project.slug}`;
  const jsonLd = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "CreativeWork", "@id": `${canonical}#project`, name: project.title, headline: project.title, description: project.seoDescription, url: canonical, image: [project.heroImageUrl, ...project.galleryImages.map((image) => image.url)], creator: { "@id": `${siteConfig.url}/#person` }, inLanguage: "fa-IR", keywords: [...project.services, ...project.technologies].join(", ") },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "پروژه‌ها", item: `${siteConfig.url}/projects` },
        { "@type": "ListItem", position: 3, name: project.title, item: canonical },
      ] },
    ],
  };
  return (
    <main className="project-page projects-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProjectDetail project={project} />
    </main>
  );
}
