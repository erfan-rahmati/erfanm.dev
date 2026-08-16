import Image from "next/image";
import Link from "next/link";

import type { PublicProject } from "@/server/projects/project.repository";
import { ScrollingProjectImage } from "./scrolling-project-image";

export function ProjectDetail({ project, modal = false }: Readonly<{ project: PublicProject; modal?: boolean }>) {
  const Title = modal ? "h2" : "h1";
  return (
    <article className={modal ? "project-detail project-detail--modal" : "project-detail"}>
      <header className="project-detail__header">
        <div>
          <span className="projects-eyebrow">{project.eyebrow}</span>
          <Title id={modal ? "project-modal-title" : undefined}>{project.title}</Title>
          <p>{project.shortDescription}</p>
          <div className="project-detail__links">
            {project.externalUrl ? <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="projects-button projects-button--primary">مشاهده زنده پروژه <span aria-hidden="true"></span></a> : null}
            <Link href="/#contact" className={`projects-button${project.externalUrl ? "" : " projects-button--primary"}`}>شروع یک پروژه مشابه</Link>
            {project.repositoryUrl ? <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="projects-button">مخزن پروژه</a> : null}
          </div>
        </div>
        <ul className="project-detail__facts" aria-label="خلاصه پروژه">
          {project.services.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </header>

      <div className="project-detail__hero">
        <Image src={project.heroImageUrl} alt={project.heroImageAlt} fill sizes={modal ? "(max-width: 800px) 92vw, 1050px" : "(max-width: 800px) 92vw, 1200px"} priority={!modal} />
      </div>

      <section className="project-detail__intro">
        <div><span>نمای کلی</span><h2>محصولی منسجم برای یک تجربه واقعی</h2></div>
        <p>{project.overview}</p>
      </section>

      {project.highlights.length ? (
        <section className="project-detail__highlights" aria-label="ویژگی‌های شاخص">
          {project.highlights.map((item, index) => (
            <article key={`${item.title}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="project-detail__story">
        <article><span>چالش</span><h2>صورت مسئله</h2><p>{project.challenge}</p></article>
        <article><span>راهکار</span><h2>تصمیم طراحی و توسعه</h2><p>{project.solution}</p></article>
      </section>

      {project.galleryImages.length ? (
        <section className="project-detail__gallery" aria-label={`تصاویر ${project.title}`}>
          {project.galleryImages.slice(0, 3).map((image, index) => (
            <figure key={`${image.url}-${index}`}>
              <ScrollingProjectImage src={image.url} alt={image.alt} />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </section>
      ) : null}

      <footer className="project-detail__footer">
        <div><span>توانمندی‌های به‌کاررفته</span><h2>از معماری تا تجربه کاربری</h2></div>
        <ul>{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul>
      </footer>
    </article>
  );
}
