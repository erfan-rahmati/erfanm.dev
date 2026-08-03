import { About } from "@/features/home/about/about";
import { Gallery } from "@/features/home/gallery/gallery";
import { Hero } from "@/features/home/hero/hero";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Gallery />
      <About />
    </main>
  );
}