import {
  skillCategories,
  skillsContent,
} from "./skills.data";
import {
  SkillCategoryIcon,
  SkillsCheckIcon,
  SkillsChevronIcon,
} from "./skills.icons";

const CATEGORY_PREVIEW_COUNT = 4;

export function Skills() {
  return (
    <section
      id="skills"
      className="skills"
      aria-labelledby="skills-title"
    >
      <div className="skills__background" aria-hidden="true">
        <span className="skills__orb skills__orb--primary" />
        <span className="skills__orb skills__orb--secondary" />
        <span className="skills__pattern" />
      </div>

      <div className="skills__container">
        <header className="skills__header">
          <div className="skills__heading">
            <span className="skills__eyebrow">
              <span className="skills__eyebrow-icon">
                <SkillsCheckIcon />
              </span>

              {skillsContent.eyebrow}
            </span>

            <h2 id="skills-title" className="skills__title">
              {skillsContent.title}
            </h2>
          </div>

          <p className="skills__description">
            {skillsContent.description}
          </p>
        </header>

        <div className="skills__categories">
          {skillCategories.map((category) => {
            const previewSkills = category.skills.slice(
              0,
              CATEGORY_PREVIEW_COUNT,
            );

            const remainingCount =
              category.skills.length - previewSkills.length;

            return (
              <details
                key={category.id}
                className="skills__category"
              >
                <summary className="skills__category-summary">
                  <span className="skills__category-icon">
                    <SkillCategoryIcon id={category.id} />
                  </span>

                  <span className="skills__category-copy">
                    <strong>{category.title}</strong>
                    <span>{category.description}</span>
                  </span>

                  <span className="skills__category-count">
                    {category.skills.length}
                  </span>

                  <span className="skills__category-chevron">
                    <SkillsChevronIcon />
                  </span>
                </summary>

                <div className="skills__category-preview">
                  {previewSkills.map((skill) => (
                    <span key={skill} dir="auto">
                      {skill}
                    </span>
                  ))}

                  {remainingCount > 0 ? (
                    <span className="skills__category-more">
                      +{remainingCount}
                    </span>
                  ) : null}
                </div>

                <ul className="skills__category-list">
                  {category.skills.map((skill) => (
                    <li key={skill}>
                      <span aria-hidden="true">
                        <SkillsCheckIcon />
                      </span>

                      <bdi>{skill}</bdi>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
