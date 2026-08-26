import { trustFigures } from '@/data/company';
import type { Dictionary } from '@/i18n/types';
import styles from './TrustIntro.module.css';

/**
 * The statement that follows the hero. Presented as an editorial figures row
 * with hairline rules rather than four floating cards, so it reads as one
 * statement about the business instead of four decorated tiles.
 */
export function TrustIntro({ dict }: { dict: Dictionary }) {
  const stats = [
    { value: trustFigures.years, ...dict.trust.years },
    { value: trustFigures.vehicleTypes, ...dict.trust.vehicleTypes },
    { value: trustFigures.availability, ...dict.trust.availability },
    { value: dict.trust.drivers.value, label: dict.trust.drivers.label, detail: dict.trust.drivers.detail },
  ];

  return (
    <section className={`section section--dark section--tight ${styles.trust}`}>
      <div className="container">
        <h2 className={`display ${styles.statement}`}>{dict.trust.statement}</h2>

        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
              <dd className={styles.statDetail}>{stat.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
