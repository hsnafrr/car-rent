import { company } from '@/data/company';
import { format } from '@/lib/format';
import type { Dictionary } from '@/i18n/types';
import { PlusIcon } from './Icons';
import styles from './Faq.module.css';

/**
 * Built on details and summary rather than a scripted button and panel pair.
 *
 * The brief asked for real buttons with correct ARIA state and keyboard
 * support. A summary element is exposed to assistive technology as a button
 * carrying its own expanded state, handles Enter and Space natively, and keeps
 * every answer readable if JavaScript never runs. Recreating that with a div,
 * useState, and hand written aria attributes would be strictly worse.
 */
export function Faq({ dict }: { dict: Dictionary }) {
  /*
   * The booking answer quotes the primary WhatsApp number. It is filled from
   * data/company.ts rather than typed into the copy, so changing which line is
   * primary cannot leave a stale number in one language.
   */
  const items = dict.faq.items.map((item) => ({
    ...item,
    answer: format(item.answer, { whatsapp: company.whatsappPrimaryDisplay }),
  }));

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <section id="faq" className={`section ${styles.faq}`}>
      <div className="container">
        <div className={styles.layout}>
          <header className={styles.header}>
            <p className="eyebrow">{dict.faq.eyebrow}</p>
            <h2 className={`display ${styles.title}`}>{dict.faq.title}</h2>
            <p className="lede">{dict.faq.lede}</p>
          </header>

          <div className={styles.list}>
            {items.map((item) => (
              <details key={item.id} className={styles.item} name="morfosa-faq">
                <summary className={styles.summary}>
                  <span className={styles.question}>{item.question}</span>
                  <PlusIcon className={styles.marker} />
                </summary>
                <div className={styles.panel}>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
