import Link from 'next/link';
import { getDictionary, localePath } from '@/i18n';
import styles from './NotFound.module.css';

/**
 * The body of the 404.
 *
 * A static export produces a single 404.html, so it is written in the default
 * language, with a quiet link across to the Indonesian side for anyone who
 * landed here from there.
 */
export function NotFoundContent() {
  const dict = getDictionary('en');

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">{dict.notFound.eyebrow}</p>
        <h1 className={`display ${styles.title}`}>{dict.notFound.title}</h1>
        <p className={styles.body}>{dict.notFound.body}</p>

        <div className={styles.actions}>
          <Link className="btn btn--primary" href={localePath('en', 'home')}>
            {dict.common.backHome}
          </Link>
          <Link className="textLink" href={localePath('id', 'home')} hrefLang="id" lang="id">
            {dict.notFound.otherLanguage}
          </Link>
        </div>
      </div>
    </div>
  );
}
