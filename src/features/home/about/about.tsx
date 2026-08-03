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
          <span className="about__eyebrow">
            <span className="about__eyebrow-dot" aria-hidden="true" />
            {aboutContent.eyebrow}
          </span>

          <h2 id="about-title" className="about__title">
            {aboutContent.title}
          </h2>

          <div className="about__identity">
            <strong>{aboutContent.name}</strong>

            <span className="about__identity-separator" aria-hidden="true" />

            <span className="about__role" dir="ltr">
              {aboutContent.role}
            </span>
          </div>
        </header>

        <div className="about__overview">
          <article className="about__story">
            <div className="about__story-label">
              <span aria-hidden="true">01</span>
              <span>مسیر و تجربه</span>
            </div>

            <div className="about__story-content">
              {aboutContent.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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
              <div className="about__monogram" aria-hidden="true">
                ER
              </div>

              <div>
                <span className="about__profile-status">
                  آماده همکاری
                </span>

                <strong>{aboutContent.name}</strong>
              </div>
            </div>

            <dl className="about__statistics">
              {aboutStatistics.map((statistic) => (
                <div
                  key={statistic.id}
                  className="about__statistic"
                >
                  <dt>{statistic.label}</dt>
                  <dd>{statistic.value}</dd>
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

        <article className="about__philosophy">
          <div className="about__philosophy-icon">
            <AboutPhilosophyIcon />
          </div>

          <div className="about__philosophy-heading">
            <span>Product Thinking</span>
            <h3>{aboutContent.philosophyTitle}</h3>
          </div>

          <div className="about__philosophy-content">
            {aboutContent.philosophy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <div className="about__expertise-section">
          <div className="about__section-heading">
            <div>
              <span>توانمندی‌ها</span>
              <h3>تخصص‌های اصلی</h3>
            </div>

            <p>
              ترکیبی از توسعه رابط کاربری، Back-End و معماری محصول
              برای ساخت راهکارهای کامل و قابل توسعه.
            </p>
          </div>

          <ul className="about__expertise-list">
            {aboutExpertise.map((expertise, index) => (
              <li key={expertise.id} className="about__expertise-card">
                <div className="about__expertise-card-header">
                  <span className="about__expertise-icon">
                    <AboutExpertiseIcon id={expertise.id} />
                  </span>

                  <span className="about__expertise-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h4>{expertise.title}</h4>
                <p>{expertise.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="about__project-types">
          <div className="about__project-types-heading">
            <span>حوزه همکاری</span>
            <h3>پروژه‌هایی که انجام می‌دهم</h3>
          </div>

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