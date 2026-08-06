"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

import { heroBrowserToneClassNames, heroTechnologyAssets } from "./hero.assets";
import {
  heroContent,
  heroProjects,
  heroSocialLinks,
  heroTechnologyLabels,
} from "./hero.data";
import {
  CarouselArrowIcon,
  DownloadIcon,
  HeroSocialIcon,
  ProjectsArrowIcon,
} from "./hero.icons";

type HeroRevealStyle = CSSProperties & {
  "--stagger": number;
};

function createRevealStyle(stagger: number): HeroRevealStyle {
  return {
    "--stagger": stagger,
  };
}

function createBrowserClassName(toneClassName: string): string {
  return [
    "hero__mockup-browser",
    "hero__mockup-browser--primary",
    toneClassName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasProfileImageError, setHasProfileImageError] = useState(false);

  function goToScene(index: number) {
    const totalProjects = heroProjects.length;
    const normalizedIndex =
      ((index % totalProjects) + totalProjects) % totalProjects;

    setActiveIndex(normalizedIndex);
  }

  function showPreviousScene() {
    goToScene(activeIndex - 1);
  }

  function showNextScene() {
    goToScene(activeIndex + 1);
  }

  const profileClassName = [
    "hero__photo",
    "pf-box",
    hasProfileImageError ? "hero__photo--fallback" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="home" className="hero" aria-label="معرفی">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__glow hero__glow--primary" />
        <span className="hero__glow hero__glow--secondary" />
        <span className="hero__noise" />
        <span className="hero__shape hero__shape--one" />
        <span className="hero__shape hero__shape--two" />
        <span className="hero__shape hero__shape--three" />
      </div>

      <div className="hero__container">
        <div className="hero__content">
          <p
            className="hero__eyebrow hero__reveal"
            style={createRevealStyle(1)}
          >
            <span className="hero__eyebrow-dot" aria-hidden="true" />

            {heroContent.eyebrow}
          </p>

          <h1 className="hero__title hero__reveal" style={createRevealStyle(2)}>
            <span className="hero__title-line">
              {heroContent.titleFirstLine}
            </span>

            <span className="hero__title-line hero__title-accent">
              {heroContent.titleAccentLine}
            </span>

            <span className="hero__title-line">
              {heroContent.titleLastLine}
            </span>
          </h1>

          <p
            className="hero__description hero__reveal"
            style={createRevealStyle(3)}
          >
            {heroContent.description}
          </p>

          <ul
            className="hero__features hero__reveal"
            style={createRevealStyle(3.5)}
            aria-label="خدمات اصلی"
          >
            {heroContent.features.map((feature) => (
              <li key={feature} className="hero__feature">
                <span className="hero__feature-check" aria-hidden="true">
                  ✓
                </span>

                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div
            className="hero__actions hero__reveal"
            style={createRevealStyle(4)}
          >
            <a
              href={heroContent.resumeHref}
              download="Erfan-Resume.pdf"
              className="hero__btn hero__btn--primary"
            >
              <span>دانلود رزومه</span>
              <DownloadIcon />
            </a>

            <a
              href={heroContent.projectsHref}
              className="hero__btn hero__btn--secondary"
            >
              <span>مشاهده پروژه‌ها</span>
              <ProjectsArrowIcon />
            </a>
          </div>

          <div
            className="hero__social hero__reveal"
            style={createRevealStyle(5)}
          >
            <span className="hero__social-label">حضور من در</span>

            <ul className="hero__social-list">
              {heroSocialLinks.map((socialLink) => (
                <li key={socialLink.id}>
                  <a
                    href={socialLink.href}
                    className="hero__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLink.label}
                  >
                    <HeroSocialIcon id={socialLink.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="hero__visual hero__reveal pf-wraper"
          style={createRevealStyle(3)}
        >
          <div
            className="hero__visual-inner"
            role="region"
            aria-roledescription="carousel"
            aria-label="نمونه‌کارهای منتخب"
          >
            <span className="hero__visual-glow" aria-hidden="true" />

            <div className="hero__mockups">
              {heroProjects.map((project, index) => {
                const isActive = index === activeIndex;

                const sceneClassName = [
                  "hero__mockup-scene",
                  isActive ? "hero__mockup-scene--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                const browserClassName = createBrowserClassName(
                  heroBrowserToneClassNames[project.browserTone],
                );

                return (
                  <div
                    id={`hero-project-${project.id}`}
                    key={project.id}
                    className={sceneClassName}
                    data-scene={index}
                    role="group"
                    aria-roledescription="اسلاید"
                    aria-label={project.ariaLabel}
                    aria-hidden={!isActive}
                  >
                    <div className={browserClassName}>
                      <div className="hero__mockup-chrome" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>

                      <Image
                        className="project_img"
                        src={project.imageSrc}
                        alt={project.imageAlt}
                        width={project.imageWidth}
                        height={project.imageHeight}
                        sizes="(max-width: 450px) 320px, (max-width: 768px) 380px, (max-width: 1024px) 520px, 685px"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={profileClassName} data-fallback="عرفان رحمتی">
              {!hasProfileImageError && (
                <Image
                  src="/images/profile/erfan-rahmati.png"
                  alt="عکس عرفان رحمتی، توسعه‌دهنده Full-Stack"
                  width={640}
                  height={800}
                  sizes="(max-width: 380px) 220px, (max-width: 450px) 260px, (max-width: 768px) 320px, (max-width: 1024px) 460px, 600px"
                  loading="eager"
                  onError={() => {
                    setHasProfileImageError(true);
                  }}
                />
              )}
            </div>

            <div className="hero__tech">
              <span className="hero__tech-label">توسعه با فناوری‌های مدرن</span>

              {heroProjects.map((project, projectIndex) => (
                <ul
                  key={project.id}
                  className="hero__tech-list"
                  data-tech={projectIndex}
                  hidden={projectIndex !== activeIndex}
                >
                  {project.technologies.map((technologyId) => {
                    const technologyAsset = heroTechnologyAssets[technologyId];

                    return (
                      <li
                        key={technologyId}
                        className="hero__tech-badge"
                        aria-label={heroTechnologyLabels[technologyId]}
                      >
                        <Image
                          src={technologyAsset.src}
                          alt=""
                          width={technologyAsset.width}
                          height={technologyAsset.height}
                          aria-hidden="true"
                        />
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>

            <div className="hero__panel">
              <button
                type="button"
                className="hero__panel-arrow hero__panel-arrow--prev"
                aria-label="پروژه قبلی"
                onClick={showPreviousScene}
              >
                <CarouselArrowIcon direction="previous" />
              </button>

              <ul
                className="hero__panel-dots"
                role="tablist"
                aria-label="انتخاب پروژه"
              >
                {heroProjects.map((project, index) => {
                  const isActive = index === activeIndex;

                  const dotClassName = [
                    "hero__panel-dot-btn",
                    isActive ? "hero__panel-dot-btn--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <li key={project.id} role="presentation">
                      <button
                        type="button"
                        className={dotClassName}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`hero-project-${project.id}`}
                        aria-label={`نمایش پروژه ${index + 1}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          goToScene(index);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                className="hero__panel-arrow hero__panel-arrow--next"
                aria-label="پروژه بعدی"
                onClick={showNextScene}
              >
                <CarouselArrowIcon direction="next" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
