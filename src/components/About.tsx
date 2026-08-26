import { company } from '@/data/company';
import { format } from '@/lib/format';
import type { Dictionary } from '@/i18n/types';
import styles from './About.module.css';

export function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="about" className="section section--dark">
      <div className="container">
        <div className={styles.opening}>
          <div className={styles.openingHead}>
            <p className="eyebrow">{dict.about.eyebrow}</p>
            <h2 className={`display ${styles.title}`}>{dict.about.title}</h2>
          </div>
          <div className={styles.openingBody}>
            <p className={styles.paragraph}>
              {format(dict.about.paragraph, { founder: company.founder })}
            </p>
          </div>
        </div>

        <div className={styles.founder}>
          <blockquote className={styles.quote}>
            <p>{format(dict.about.quote, { founder: company.founder })}</p>
          </blockquote>
          <p className={styles.founderName}>
            <span className={styles.founderNameText}>{company.founder}</span>
            <span className={styles.founderRole}>{dict.about.founderRole}</span>
          </p>
        </div>

        <div className={styles.pillars}>
          <div className={styles.pillar}>
            <h3 className={styles.pillarTitle}>{dict.about.visionTitle}</h3>
            <p className={styles.pillarBody}>{dict.about.visionBody}</p>
          </div>
          <div className={styles.pillar}>
            <h3 className={styles.pillarTitle}>{dict.about.missionTitle}</h3>
            <p className={styles.pillarBody}>{dict.about.missionBody}</p>
          </div>
        </div>

        <div className={styles.values}>
          <h3 className={styles.valuesTitle}>{dict.about.valuesTitle}</h3>
          <ol className={styles.valuesList}>
            {dict.about.values.map((value, index) => (
              <li key={value.title} className={styles.value}>
                <span className={styles.valueIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className={styles.valueTitle}>{value.title}</h4>
                <p className={styles.valueBody}>{value.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
