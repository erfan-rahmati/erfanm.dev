import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { listPublishedArticleSlugs } from "@/server/articles/article.repository";
import { listPublishedProjectSlugs } from "@/server/projects/project.repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/projects`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  try {
    const [articles, projects] = await Promise.all([
      listPublishedArticleSlugs(),
      listPublishedProjectSlugs(),
    ]);

    return [
      ...staticPages,
      ...articles.map((article) => ({
        url: `${siteConfig.url}/blog/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...projects.map((project) => ({
        url: `${siteConfig.url}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  }
  catch (error) {
    console.error(
      "Sitemap article lookup failed.",
      error,
    );
    return staticPages;
  }
}
