import { company } from '@/data/company';

/**
 * Builds a wa.me link. The phone number must be in international format with no
 * plus sign, spaces, or dashes, which is what data/company.ts stores.
 */
export function whatsappUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Primary booking line. Every booking request goes here. */
export function primaryWhatsapp(message?: string): string {
  return whatsappUrl(company.whatsappPrimary, message);
}

/** Secondary contact line only. Never used for form submissions. */
export function alternativeWhatsapp(message?: string): string {
  return whatsappUrl(company.whatsappAlternative, message);
}

export interface BookingMessageInput {
  labels: {
    heading: string;
    name: string;
    contact: string;
    vehicle: string;
    start: string;
    end: string;
    days: string;
    passengers: string;
    pickup: string;
    destination: string;
    notes: string;
    estimate: string;
    understanding: string;
  };
  name: string;
  phone: string;
  vehicleName: string;
  pricePerDayLabel: string;
  startDate: string;
  endDate: string;
  days: number;
  estimateLabel: string;
  pickup: string;
  destination: string;
  passengers: string;
  notes: string;
}

/**
 * Formats the booking request that gets handed to WhatsApp, in the language the
 * visitor is reading.
 *
 * The wording deliberately says "request" throughout. Nothing here may read as
 * a confirmation, because availability is only settled once Morfosa replies.
 */
export function buildBookingMessage(input: BookingMessageInput): string {
  const l = input.labels;
  const lines = [
    l.heading,
    '',
    `${l.name}: ${input.name}`,
    `${l.contact}: ${input.phone}`,
    `${l.vehicle}: ${input.vehicleName} (${input.pricePerDayLabel})`,
    `${l.start}: ${input.startDate}`,
    `${l.end}: ${input.endDate}`,
    `${l.days}: ${input.days}`,
    `${l.passengers}: ${input.passengers}`,
    `${l.pickup}: ${input.pickup}`,
    `${l.destination}: ${input.destination}`,
  ];

  if (input.notes.trim()) {
    lines.push(`${l.notes}: ${input.notes.trim()}`);
  }

  lines.push('', `${l.estimate}: ${input.estimateLabel}`, l.understanding);

  return lines.join('\n');
}
