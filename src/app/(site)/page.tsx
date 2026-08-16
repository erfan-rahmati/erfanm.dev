import { About } from "@/features/home/about/about";
import { Contact } from "@/features/home/contact/contact";
import { Gallery } from "@/features/home/gallery/gallery";
import { Hero } from "@/features/home/hero/hero";
import { RecentArticles } from "@/features/home/recent-articles/recent-articles";
import { Skills } from "@/features/home/skills/skills";
import { listRecentPublishedArticles } from "@/server/articles/article.repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles =
    await listRecentPublishedArticles(4);

  return (
    <main id="main-content">
      <Hero />
      <Gallery />
      <About />
      <Skills />
      <RecentArticles
        articles={articles.map((article) => ({
          ...article,
          href: `/blog/${article.slug}`,
          publishedAt:
            article.publishedAt?.toISOString() ??
            null,
        }))}
      />
      <Contact />
    </main>
  );
}
