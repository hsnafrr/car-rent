"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
import { ArrowRight, ChatCircleDots, PaperPlaneRight, WhatsappLogo, X } from '@phosphor-icons/react';
import { fleet } from '@/data/fleet';
import { company } from '@/data/company';
import { scrollToSection } from '@/lib/scroll';
import { greeting, reply, type BotAction, type BotContext } from '@/lib/chatbot/engine';
import type { VehicleSlug } from '@/data/fleet';
import type { Dictionary, Locale } from '@/i18n/types';
import { useBooking } from './BookingContext';
import styles from './Chatbot.module.css';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  actions?: BotAction[];
  chips?: string[];
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const REPLY_DELAY = 480;

/** Turns bare URLs in a bot answer into real links. Everything else stays plain text. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_PATTERN).map((part, index) =>
        /^https?:\/\//.test(part) ? (
          <a key={index} href={part} className={styles.link} rel="noopener noreferrer">
            {part.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function Chatbot({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { bookVehicle } = useBooking();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [origin, setOrigin] = useState('');

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const ctx = useMemo<BotContext>(
    () => ({
      lang: 'en',
      vehicles: fleet.map((item) => ({
        slug: item.slug,
        name: dict.vehicles[item.slug].name.replace(/atau/g, 'or'),
        seats: item.seats,
        price: item.pricePerDay,
      })),
      whatsapp: company.whatsappPrimary,
      whatsappDisplay: company.whatsappPrimaryDisplay,
      bookingUrl: `${origin}${locale === 'id' ? '/id/' : '/'}#booking`,
    }),
    [locale, dict, origin],
  );

  const push = useCallback((message: Omit<Message, 'id'>) => {
    idRef.current += 1;
    setMessages((list) => [...list, { ...message, id: idRef.current }]);
  }, []);

  /* First open: greet in the visitor's language. Language switch restarts the conversation. */
  useEffect(() => {
    setMessages([]);
    idRef.current = 0;
  }, [locale]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const g = greeting(ctx);
      push({ from: 'bot', text: g.text, chips: g.chips });
    }
  }, [open, messages.length, ctx, push]);

  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 220);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, 200);
      if (!text || typing) return;
      push({ from: 'user', text });
      setInput('');
      setTyping(true);
      timerRef.current = setTimeout(() => {
        try {
          const r = reply(text, ctx);
          push({ from: 'bot', text: r.text, actions: r.actions, chips: r.chips });
        } catch {
          // The engine is pure and tested, but a chat widget must never break the page.
          push({
            from: 'bot',
            text: 'Sorry, something went wrong. Please reach us on WhatsApp.',
            actions: [{ type: 'whatsapp', label: `WhatsApp ${company.whatsappPrimaryDisplay}`, href: `https://wa.me/${company.whatsappPrimary}` }],
          });
        }
        setTyping(false);
      }, REPLY_DELAY);
    },
    [ctx, locale, push, typing],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(input);
  };

  const runAction = (action: BotAction) => {
    if (action.type !== 'book') return;
    setOpen(false);
    if (action.vehicle) bookVehicle(action.vehicle as VehicleSlug);
    else scrollToSection('booking');
  };

  const t = { open: 'Open chat assistant', close: 'Close chat', title: 'Morfosa Assistant', status: 'Instant replies', placeholder: 'Type your question', send: 'Send', log: 'Conversation' };

  const last = messages[messages.length - 1];
  const showChips = last && last.from === 'bot' && last.chips && !typing;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div className={styles.root}>
          <AnimatePresence>
            {open ? (
              <m.section
                key="panel"
                className={styles.panel}
                role="dialog"
                aria-label={t.title}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              >
                <header className={styles.header}>
                  <span className={styles.avatar} aria-hidden="true">M</span>
                  <div className={styles.headText}>
                    <b>{t.title}</b>
                    <span>{t.status}</span>
                  </div>
                  <button type="button" className={styles.iconBtn} onClick={() => { setOpen(false); launcherRef.current?.focus(); }} aria-label={t.close}>
                    <X size={20} weight="bold" aria-hidden="true" />
                  </button>
                </header>

                <div className={styles.log} ref={logRef} role="log" aria-live="polite" aria-label={t.log}>
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <m.div
                        key={message.id}
                        className={`${styles.row} ${message.from === 'user' ? styles.rowUser : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className={`${styles.bubble} ${message.from === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                          <p className={styles.text}>{message.from === 'bot' ? <RichText text={message.text} /> : message.text}</p>
                          {message.actions && message.actions.length ? (
                            <div className={styles.actions}>
                              {message.actions.map((action, index) =>
                                action.type === 'book' ? (
                                  <button key={index} type="button" className={`${styles.action} ${styles.actionPrimary}`} onClick={() => runAction(action)}>
                                    {action.label}
                                    <ArrowRight size={16} weight="bold" aria-hidden="true" />
                                  </button>
                                ) : (
                                  <a key={index} className={styles.action} href={action.href} target="_blank" rel="noopener noreferrer">
                                    {action.type === 'whatsapp' ? <WhatsappLogo size={18} weight="fill" aria-hidden="true" /> : null}
                                    {action.label}
                                  </a>
                                ),
                              )}
                            </div>
                          ) : null}
                        </div>
                      </m.div>
                    ))}
                    {typing ? (
                      <m.div key="typing" className={styles.row} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true">
                        <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}>
                          {[0, 1, 2].map((dot) => (
                            <m.span key={dot} animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }} />
                          ))}
                        </div>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {showChips ? (
                  <div className={styles.chips}>
                    {last.chips!.map((chip) => (
                      <button key={chip} type="button" className={styles.chip} onClick={() => send(chip)}>
                        {chip}
                      </button>
                    ))}
                  </div>
                ) : null}

                <form className={styles.form} onSubmit={onSubmit}>
                  <input
                    ref={inputRef}
                    className={styles.input}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={t.placeholder}
                    aria-label={t.placeholder}
                    maxLength={200}
                    autoComplete="off"
                    enterKeyHint="send"
                  />
                  <button type="submit" className={styles.send} disabled={!input.trim() || typing} aria-label={t.send}>
                    <PaperPlaneRight size={20} weight="fill" aria-hidden="true" />
                  </button>
                </form>
              </m.section>
            ) : null}
          </AnimatePresence>

          <m.button
            ref={launcherRef}
            type="button"
            className={styles.launcher}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t.close : t.open}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span key={open ? 'x' : 'chat'} className={styles.launcherIcon} initial={{ rotate: -60, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 60, opacity: 0 }} transition={{ duration: 0.18 }}>
                {open ? <X size={26} weight="bold" aria-hidden="true" /> : <ChatCircleDots size={28} weight="fill" aria-hidden="true" />}
              </m.span>
            </AnimatePresence>
          </m.button>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
