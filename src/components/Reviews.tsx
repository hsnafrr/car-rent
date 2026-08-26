import { reviews, reviewStats } from '@/data/reviews';
import { company } from '@/data/company';
import { formatDate } from '@/lib/format';
import type { Dictionary, Locale } from '@/i18n/types';
import styles from './Reviews.module.css';

export function Reviews({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section id="reviews" className="section section--raised">
      <div className="container">
        <header className={styles.header}>
          <p className="eyebrow">{dict.reviews.eyebrow}</p>
          <h2 className={`display ${styles.title}`}>{dict.reviews.title}</h2>
        </header>

        <dl className={styles.stats}>
          {reviewStats.map((stat) => (
            <div key={stat.id} className={styles.stat}>
              <dt className={styles.statLabel}>{dict.reviews.stats[stat.id]}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.statsNote}>{dict.reviews.statsNote}</p>

        <ul className={styles.list}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.item}>
              <figure className={styles.figure}>
                <blockquote className={styles.quote}>
                  <p>{dict.reviews.quotes[review.id]}</p>
                </blockquote>
                <figcaption className={styles.caption}>
                  <span className={styles.name}>{review.name}</span>
                  <time className={styles.date} dateTime={review.date}>
                    {formatDate(review.date, locale)}
                  </time>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/*
          Rendered only when a verified Google Business Profile URL has been set
          in data/company.ts. With no verified link the button stays out of the
          page rather than pointing somewhere unconfirmed.
        */}
        {company.googleMapsUrl ? (
          <a
            className={`btn btn--secondary ${styles.externalLink}`}
            href={company.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.reviews.googleCta}
          </a>
        ) : null}
      </div>
    </section>
  );
}
