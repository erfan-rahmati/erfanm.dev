"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

import type { PublicProject } from "@/server/projects/project.repository";
import { ProjectDetail } from "./project-detail";

export function ProjectsShowcase({ projects }: Readonly<{ projects: readonly PublicProject[] }>) {
  const [active, setActive] = useState<PublicProject | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback((updateHistory = true) => {
    setActive(null);
    document.body.classList.remove("project-modal-open");
    if (updateHistory) window.history.back();
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  function open(event: MouseEvent<HTMLAnchorElement>, project: PublicProject) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    triggerRef.current = event.currentTarget;
    setActive(project);
    document.body.classList.add("project-modal-open");
    window.history.pushState({ project: project.slug }, "", `/projects/${project.slug}`);
  }

  useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0]!; const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    function onPop() { close(false); }
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("popstate", onPop); document.body.classList.remove("project-modal-open"); };
  }, [active, close]);

  return (
    <>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <article key={project.id} className={`project-card ${index % 4 === 0 || index % 4 === 3 ? "project-card--large" : "project-card--compact"}`} style={{ "--project-accent": project.accentColor } as CSSProperties}>
            <Link className="project-card__detail-link" href={`/projects/${project.slug}`} onClick={(event) => open(event, project)} aria-label={`مشاهده جزئیات ${project.title}`}>
              <div className="project-card__top"><span>{project.category}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="project-card__copy"><h2>{project.title}</h2><p>{project.shortDescription}</p></div>
              <div className="project-card__image"><Image src={project.heroImageUrl} alt={project.heroImageAlt} fill sizes="(max-width: 660px) 92vw, (max-width: 1100px) 50vw, 58vw" loading={index === 0 ? "eager" : "lazy"} /></div>
            </Link>
            <div className="project-card__actions">
              <Link href={`/projects/${project.slug}`} onClick={(event) => open(event, project)}>مشاهده جزئیات</Link>
              {project.externalUrl ? <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">مشاهده زنده <span aria-hidden="true">↗</span></a> : <span>نسخه آنلاین به‌زودی</span>}
            </div>
          </article>
        ))}
      </div>

      {active ? (
        <div className="project-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div ref={dialogRef} className="project-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
            <button ref={closeRef} type="button" className="project-modal__close" onClick={() => close()} aria-label="بستن جزئیات پروژه">×</button>
            <ProjectDetail project={active} modal />
          </div>
        </div>
      ) : null}
    </>
  );
}
