"use client";

import { useId, useState } from 'react';
import { recommendationRules, fleetBySlug, type RecommendationRule } from '@/data/fleet';
import { format, formatPerDay } from '@/lib/format';
import type { Dictionary } from '@/i18n/types';
import { useBooking } from './BookingContext';
import { ArrowRightIcon } from './Icons';
import styles from './Recommender.module.css';

/**
 * A rule based decision aid, not a chatbot. Each option maps to one vehicle in
 * data/fleet.ts, with written reasoning that lives in the dictionaries.
 */
export function Recommender({ dict }: { dict: Dictionary }) {
  const groupId = useId();
  const [selected, setSelected] = useState<RecommendationRule | null>(null);
  const { bookVehicle } = useBooking();

  const primary = selected ? fleetBySlug[selected.primary] : null;
  const alternative = selected?.alternative ? fleetBySlug[selected.alternative] : null;
  const copy = selected ? dict.recommender.options[selected.id] : null;
  const primaryName = selected ? dict.vehicles[selected.primary].name : '';
  const alternativeName = selected?.alternative ? dict.vehicles[selected.alternative].name : '';

  return (
    <section className="section section--raised">
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className="eyebrow">{dict.recommender.eyebrow}</p>
            <h2 className={`display ${styles.title}`}>{dict.recommender.title}</h2>
            <p className="lede">{dict.recommender.lede}</p>
          </div>

          <div className={styles.tool}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>{dict.recommender.legend}</legend>
              <div className={styles.options}>
                {recommendationRules.map((rule) => (
                  <label
                    key={rule.id}
                    className={`${styles.option} ${
                      selected?.id === rule.id ? styles.optionActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={groupId}
                      value={rule.id}
                      className={styles.optionInput}
                      checked={selected?.id === rule.id}
                      onChange={() => setSelected(rule)}
                    />
                    <span className={styles.optionLabel}>
                      {dict.recommender.options[rule.id].label}
                    </span>
                    <span className={styles.optionHint}>
                      {dict.recommender.options[rule.id].question}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.result} aria-live="polite">
              {selected && primary && copy ? (
                <div className={styles.resultCard}>
                  <p className={styles.resultEyebrow}>{dict.recommender.recommended}</p>
                  <h3 className={styles.resultName}>{primaryName}</h3>
                  <p className={styles.resultPrice}>
                    {formatPerDay(primary.pricePerDay, dict.fleet.perDay)}
                  </p>
                  <p className={styles.resultReason}>{copy.reason}</p>

                  <button
                    type="button"
                    className={`btn btn--primary ${styles.resultCta}`}
                    onClick={() => bookVehicle(primary.slug)}
                  >
                    {format(dict.recommender.bookCta, { name: primaryName })}
                    <ArrowRightIcon />
                  </button>

                  {alternative && copy.alternativeReason ? (
                    <p className={styles.alternative}>
                      <span className={styles.alternativeLabel}>
                        {dict.recommender.alternativeLabel}
                      </span>
                      <strong className={styles.alternativeName}>{alternativeName}</strong>
                      <span>
                        {formatPerDay(alternative.pricePerDay, dict.fleet.perDay)}.{' '}
                        {copy.alternativeReason}
                      </span>
                      <button
                        type="button"
                        className={`btn btn--quiet ${styles.alternativeCta}`}
                        onClick={() => bookVehicle(alternative.slug)}
                      >
                        {dict.recommender.alternativeCta}
                      </button>
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className={styles.resultEmpty}>{dict.recommender.empty}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
