import Image from "next/image";

import {
  aboutContent,
  aboutDetails,
  aboutExpertise,
  aboutProjectTypes,
  aboutStatistics,
} from "./about.data";
import {
  AboutArrowIcon,
  AboutDetailIcon,
  AboutExpertiseIcon,
  AboutPhilosophyIcon,
} from "./about.icons";

export function About() {
  return (
    <section
      id="about"
      className="about"
      aria-labelledby="about-title"
    >
      <div className="about__background" aria-hidden="true">
        <span className="about__glow about__glow--primary" />
        <span className="about__glow about__glow--secondary" />
        <span className="about__grid-pattern" />
      </div>

      <div className="about__container">
        <header className="about__header">
          <div className="about__heading">
            <span className="about__eyebrow">
              <span className="about__eyebrow-dot" aria-hidden="true" />
              {aboutContent.eyebrow}
            </span>

            <h2 id="about-title" className="about__title">
              {aboutContent.title}
            </h2>
          </div>

          <p className="about__role" dir="ltr">
            {aboutContent.role}
          </p>
        </header>

        <div className="about__overview">
          <article className="about__story">
            <p className="about__summary">
              {aboutContent.summary}
            </p>

            <div className="about__mindset">
              <span className="about__mindset-icon">
                <AboutPhilosophyIcon />
              </span>

              <div>
                <strong>Product Thinking</strong>
                <p>{aboutContent.productMindset}</p>
              </div>
            </div>

            <div className="about__actions">
              <a
                href={aboutContent.primaryAction.href}
                className="about__button about__button--primary"
              >
                <span>{aboutContent.primaryAction.label}</span>
                <AboutArrowIcon />
              </a>

              <a
                href={aboutContent.secondaryAction.href}
                className="about__button about__button--secondary"
              >
                <span>{aboutContent.secondaryAction.label}</span>
                <AboutArrowIcon />
              </a>
            </div>
          </article>

          <aside className="about__profile-card" aria-label="اطلاعات حرفه‌ای">
            <div className="about__profile-heading">
              <div className="about__profile-photo">
                <Image
                  src="/images/profile/erfan-rahmati.png"
                  alt="تصویر عرفان رحمتی"
                  width={640}
                  height={800}
                  sizes="(max-width: 768px) 72px, 92px"
                />
              </div>

              <div className="about__profile-copy">
                <span className="about__profile-status">
                  آماده همکاری
                </span>

                <strong>{aboutContent.name}</strong>
                <span>فریلنس، پروژه‌ای و دورکاری</span>
              </div>
            </div>

            <dl className="about__statistics">
              {aboutStatistics.map((statistic) => (
                <div
                  key={statistic.id}
                  className="about__statistic"
                >
                  <dd>{statistic.value}</dd>
                  <dt>{statistic.label}</dt>
                </div>
              ))}
            </dl>

            <dl className="about__details">
              {aboutDetails.map((detail) => (
                <div key={detail.id} className="about__detail">
                  <span className="about__detail-icon">
                    <AboutDetailIcon id={detail.id} />
                  </span>

                  <div>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="about__expertise-section">
          <div className="about__section-heading">
            <div>
              <span>تخصص‌های اصلی</span>
              <h3>یک مسیر کامل؛ از رابط کاربری تا محصول نهایی</h3>
            </div>

            <p>
              شش حوزه‌ای که بیشترین نقش را در پروژه‌های من دارند.
            </p>
          </div>

          <ul className="about__expertise-list">
            {aboutExpertise.map((expertise) => (
              <li key={expertise.id} className="about__expertise-card">
                <span className="about__expertise-icon">
                  <AboutExpertiseIcon id={expertise.id} />
                </span>

                <div className="about__expertise-copy">
                  <h4>{expertise.title}</h4>

                  <div className="about__expertise-technologies">
                    {expertise.technologies.map((technology) => (
                      <span key={technology} dir="ltr">
                        {technology}
                      </span>
                    ))}
                  </div>

                  <p>{expertise.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="about__project-types">
          <strong>پروژه‌هایی که انجام می‌دهم</strong>

          <ul className="about__project-types-list">
            {aboutProjectTypes.map((projectType) => (
              <li key={projectType.id}>
                <span className="about__project-type-dot" aria-hidden="true" />
                {projectType.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
