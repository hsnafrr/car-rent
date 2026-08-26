import { company } from '@/data/company';
import { primaryWhatsapp, alternativeWhatsapp } from '@/lib/whatsapp';
import type { Dictionary } from '@/i18n/types';
import { WhatsAppIcon, MailIcon, InstagramIcon, TikTokIcon, PinIcon, ClockIcon } from './Icons';
import styles from './Contact.module.css';

export function Contact({ dict }: { dict: Dictionary }) {
  const enquiry = dict.message.generalEnquiry;

  const channels = [
    {
      key: 'primary',
      icon: <WhatsAppIcon className={styles.icon} />,
      label: dict.contact.primaryWhatsapp,
      value: company.whatsappPrimaryDisplay,
      href: primaryWhatsapp(enquiry),
      external: true,
    },
    {
      key: 'alternative',
      icon: <WhatsAppIcon className={styles.icon} />,
      label: dict.contact.alternativeWhatsapp,
      value: company.whatsappAlternativeDisplay,
      href: alternativeWhatsapp(enquiry),
      external: true,
    },
    {
      key: 'email',
      icon: <MailIcon className={styles.icon} />,
      label: dict.contact.email,
      value: company.email,
      href: `mailto:${company.email}`,
      external: false,
    },
    {
      key: 'instagram',
      icon: <InstagramIcon className={styles.icon} />,
      label: dict.contact.instagram,
      value: `@${company.instagram}`,
      href: `https://www.instagram.com/${company.instagram}`,
      external: true,
    },
    {
      key: 'tiktok',
      icon: <TikTokIcon className={styles.icon} />,
      label: dict.contact.tiktok,
      value: `@${company.tiktok}`,
      href: `https://www.tiktok.com/@${company.tiktok}`,
      external: true,
    },
    {
      key: 'location',
      icon: <PinIcon className={styles.icon} />,
      label: dict.contact.location,
      value: dict.contact.city,
      // Linked only when a verified Google Business Profile URL is configured.
      // No embedded map and no invented pin.
      href: company.googleMapsUrl,
      external: true,
    },
    {
      key: 'hours',
      icon: <ClockIcon className={styles.icon} />,
      label: dict.contact.hours,
      value: dict.contact.hoursValue,
      href: null,
      external: false,
    },
  ];

  return (
    <section id="contact" className="section section--dark">
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className="eyebrow">{dict.contact.eyebrow}</p>
            <h2 className={`display ${styles.title}`}>{dict.contact.title}</h2>
            <p className="lede">{dict.contact.lede}</p>
          </div>

          <ul className={styles.channels}>
            {channels.map((channel) => (
              <li key={channel.key} className={styles.channel}>
                {channel.icon}
                <div className={styles.channelBody}>
                  <span className={styles.channelLabel}>{channel.label}</span>
                  {channel.href ? (
                    <a
                      className={styles.channelValue}
                      href={channel.href}
                      target={channel.external ? '_blank' : undefined}
                      rel={channel.external ? 'noopener noreferrer' : undefined}
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <span className={styles.channelValue}>{channel.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaText}>{dict.contact.ctaText}</p>
          <a
            className="btn btn--primary"
            href={primaryWhatsapp(enquiry)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            {dict.contact.ctaButton}
          </a>
        </div>
      </div>
    </section>
  );
}
