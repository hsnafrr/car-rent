import Link from 'next/link';
import { company } from '@/data/company';
import { fleet } from '@/data/fleet';
import { format, formatPerDay } from '@/lib/format';
import { primaryWhatsapp } from '@/lib/whatsapp';
import { localePath, type Locale } from '@/i18n';
import type { LegalDocument } from '@/i18n/legal';
import type { Dictionary } from '@/i18n/types';
import styles from '@/app/legal.module.css';

/**
 * Renders a legal document from structured data, so both languages share one
 * layout and can only differ in wording.
 */
export function LegalPage({
  doc,
  dict,
  locale,
}: {
  doc: LegalDocument;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <div className={styles.page}>
      <article className={`container ${styles.inner}`}>
        <p className="eyebrow">{dict.common.legalEyebrow}</p>
        <h1 className={`display ${styles.title}`}>{doc.title}</h1>
        <p className={styles.updated}>
          {format(dict.common.lastUpdated, { date: dict.common.updatedDate })}
        </p>
        <p className={styles.intro}>{doc.intro}</p>

        <div className={styles.body}>
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.blocks.map((block, index) => {
                if (block.type === 'p') return <p key={index}>{block.text}</p>;

                if (block.type === 'ul') {
                  return (
                    <ul key={index}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === 'dl') {
                  return (
                    <dl key={index}>
                      {block.defs.map((def) => (
                        <div key={def.term}>
                          <dt>{def.term}</dt>
                          <dd>{def.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  );
                }

                if (block.type === 'rates') {
                  return (
                    <dl key={index}>
                      {fleet.map((vehicle) => {
                        const copy = dict.vehicles[vehicle.slug];
                        return (
                          <div key={vehicle.slug}>
                            <dt>
                              {copy.name}, {formatPerDay(vehicle.pricePerDay, dict.fleet.perDay)}
                            </dt>
                            <dd>
                              {copy.category}. {dict.fleet.specSeats} {vehicle.seats}.{' '}
                              {dict.fleet.specIncluded} {copy.includes.join(', ').toLowerCase()}.
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  );
                }

                return <ContactLine key={index} text={block.text} />;
              })}
            </section>
          ))}
        </div>

        <Link className={`btn btn--secondary ${styles.backLink}`} href={localePath(locale, 'home')}>
          {dict.common.backHome}
        </Link>
      </article>
    </div>
  );
}

/** Substitutes real, working links into a sentence from the dictionary. */
function ContactLine({ text }: { text: string }) {
  const parts = text.split(/(\{email\}|\{whatsapp\})/g);
  return (
    <p>
      {parts.map((part, index) => {
        if (part === '{email}') {
          return (
            <a key={index} className="textLink" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          );
        }
        if (part === '{whatsapp}') {
          return (
            <a key={index} className="textLink" href={primaryWhatsapp()}>
              {company.whatsappPrimaryDisplay}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}
