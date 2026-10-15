"use client";

import dynamic from 'next/dynamic';
import type { Dictionary, Locale } from '@/i18n/types';

/* Loaded after the page is interactive, so the assistant never costs first paint. */
const Chatbot = dynamic(() => import('./Chatbot').then((mod) => mod.Chatbot), { ssr: false });

export function ChatbotLoader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return <Chatbot dict={dict} locale={locale} />;
}
