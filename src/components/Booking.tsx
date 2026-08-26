"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { fleet, fleetBySlug, type VehicleSlug } from '@/data/fleet';
import { company } from '@/data/company';
import { format, formatDate, formatIDR, formatPerDay, rentalDays, todayValue } from '@/lib/format';
import { buildBookingMessage, primaryWhatsapp, alternativeWhatsapp } from '@/lib/whatsapp';
import type { Dictionary, Locale } from '@/i18n/types';
import { useBooking } from './BookingContext';
import { WhatsAppIcon } from './Icons';
import styles from './Booking.module.css';

type FieldName =
  | 'name'
  | 'phone'
  | 'vehicle'
  | 'startDate'
  | 'endDate'
  | 'pickup'
  | 'destination'
  | 'passengers'
  | 'agreement';

type Errors = Partial<Record<FieldName, string>>;

interface PreparedRequest {
  url: string;
  vehicleName: string;
}

export function Booking({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { selectedVehicle, setSelectedVehicle, registerVehicleField } = useBooking();
  const t = dict.booking;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState('');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<Errors>({});
  const [prepared, setPrepared] = useState<PreparedRequest | null>(null);
  const [minDate, setMinDate] = useState('');

  const summaryRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});

  /* Resolved on the client so a statically built page never ships a stale date. */
  useEffect(() => {
    setMinDate(todayValue());
  }, []);

  const vehicle = selectedVehicle ? fleetBySlug[selectedVehicle] : null;
  const vehicleName = selectedVehicle ? dict.vehicles[selectedVehicle].name : '';
  const days = useMemo(() => rentalDays(startDate, endDate), [startDate, endDate]);
  const estimate = vehicle && days > 0 ? vehicle.pricePerDay * days : null;

  const fieldLabels: Record<FieldName, string> = {
    name: t.fieldName,
    phone: t.fieldPhone,
    vehicle: t.fieldVehicle,
    startDate: t.fieldStart,
    endDate: t.fieldEnd,
    pickup: t.fieldPickup,
    destination: t.fieldDestination,
    passengers: t.fieldPassengers,
    agreement: t.fieldAgreement,
  };

  const setFieldRef = (field: FieldName) => (element: HTMLElement | null) => {
    fieldRefs.current[field] = element;
    if (field === 'vehicle') {
      registerVehicleField(element as HTMLSelectElement | null);
    }
  };

  function validate(): Errors {
    const next: Errors = {};

    if (!name.trim()) next.name = t.errorName;

    const phoneDigits = phone.replace(/[^\d]/g, '');
    if (!phone.trim()) next.phone = t.errorPhoneMissing;
    else if (phoneDigits.length < 8) next.phone = t.errorPhoneShort;

    if (!selectedVehicle) next.vehicle = t.errorVehicle;

    if (!startDate) next.startDate = t.errorStartMissing;
    else if (minDate && startDate < minDate) next.startDate = t.errorStartPast;

    if (!endDate) next.endDate = t.errorEndMissing;
    else if (startDate && endDate < startDate) next.endDate = t.errorEndBefore;

    if (!pickup.trim()) next.pickup = t.errorPickup;
    if (!destination.trim()) next.destination = t.errorDestination;

    const passengerCount = Number(passengers);
    if (!passengers.trim()) next.passengers = t.errorPassengersMissing;
    else if (!Number.isInteger(passengerCount) || passengerCount < 1) {
      next.passengers = t.errorPassengersInvalid;
    } else if (vehicle && passengerCount > vehicle.seats) {
      next.passengers = format(t.errorPassengersCapacity, {
        vehicle: vehicleName,
        seats: vehicle.seats,
      });
    }

    if (!agreed) next.agreement = t.errorAgreement;

    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPrepared(null);
      // Move focus to the summary so the whole list is announced at once.
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    if (!vehicle) return;

    const message = buildBookingMessage({
      labels: dict.message,
      name: name.trim(),
      phone: phone.trim(),
      vehicleName,
      pricePerDayLabel: formatPerDay(vehicle.pricePerDay, dict.fleet.perDay),
      // Sent as readable dates. The team reads these on a phone, and
      // "10 September 2026" is harder to misread than "2026-09-10".
      startDate: formatDate(startDate, locale),
      endDate: formatDate(endDate, locale),
      days,
      estimateLabel: estimate !== null ? formatIDR(estimate) : dict.message.toBeConfirmed,
      pickup: pickup.trim(),
      destination: destination.trim(),
      passengers: passengers.trim(),
      notes,
    });

    const url = primaryWhatsapp(message);
    setPrepared({ url, vehicleName });
    // Popup blockers can stop this. The status panel below keeps a real link so
    // the request is never stranded.
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const errorEntries = (Object.keys(errors) as FieldName[]).filter((key) => errors[key]);

  return (
    <section id="booking" className={`section ${styles.booking}`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className={`display ${styles.title}`}>{t.title}</h2>
            <p className="lede">{t.lede}</p>

            <dl className={styles.contactAside}>
              <div>
                <dt>{t.primaryWhatsapp}</dt>
                <dd>
                  <a className="textLink" href={primaryWhatsapp()}>
                    {company.whatsappPrimaryDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t.alternativeWhatsapp}</dt>
                <dd>
                  <a className="textLink" href={alternativeWhatsapp()}>
                    {company.whatsappAlternativeDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div
              ref={summaryRef}
              tabIndex={-1}
              className={errorEntries.length ? styles.errorSummary : styles.hiddenSummary}
              role={errorEntries.length ? 'alert' : undefined}
              aria-labelledby={errorEntries.length ? 'booking-error-heading' : undefined}
            >
              {errorEntries.length ? (
                <>
                  <h3 id="booking-error-heading" className={styles.errorSummaryTitle}>
                    {errorEntries.length === 1
                      ? t.errorSummaryOne
                      : format(t.errorSummaryMany, { count: errorEntries.length })}
                  </h3>
                  <ul className={styles.errorSummaryList}>
                    {errorEntries.map((field) => (
                      <li key={field}>
                        <button
                          type="button"
                          className={styles.errorSummaryLink}
                          onClick={() => fieldRefs.current[field]?.focus()}
                        >
                          {fieldLabels[field]}: {errors[field]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            <div className={styles.grid}>
              <Field id="booking-name" label={t.fieldName} error={errors.name} className={styles.spanHalf}>
                <input
                  ref={setFieldRef('name')}
                  id="booking-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={styles.input}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'booking-name-error' : undefined}
                  required
                />
              </Field>

              <Field
                id="booking-phone"
                label={t.fieldPhone}
                hint={t.fieldPhoneHint}
                error={errors.phone}
                className={styles.spanHalf}
              >
                <input
                  ref={setFieldRef('phone')}
                  id="booking-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={styles.input}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={
                    ['booking-phone-hint', errors.phone ? 'booking-phone-error' : null]
                      .filter(Boolean)
                      .join(' ') || undefined
                  }
                  required
                />
              </Field>

              <Field id="booking-vehicle" label={t.fieldVehicle} error={errors.vehicle} className={styles.spanFull}>
                <select
                  ref={setFieldRef('vehicle')}
                  id="booking-vehicle"
                  name="vehicle"
                  className={styles.input}
                  value={selectedVehicle}
                  onChange={(event) => setSelectedVehicle(event.target.value as VehicleSlug | '')}
                  aria-invalid={errors.vehicle ? true : undefined}
                  aria-describedby={errors.vehicle ? 'booking-vehicle-error' : undefined}
                  required
                >
                  <option value="">{t.fieldVehiclePlaceholder}</option>
                  {fleet.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {format(t.fieldVehicleOption, {
                        name: dict.vehicles[item.slug].name,
                        seats: item.seats,
                        price: formatPerDay(item.pricePerDay, dict.fleet.perDay),
                      })}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="booking-start" label={t.fieldStart} error={errors.startDate} className={styles.spanHalf}>
                <input
                  ref={setFieldRef('startDate')}
                  id="booking-start"
                  name="startDate"
                  type="date"
                  className={styles.input}
                  value={startDate}
                  min={minDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  aria-invalid={errors.startDate ? true : undefined}
                  aria-describedby={errors.startDate ? 'booking-start-error' : undefined}
                  required
                />
              </Field>

              <Field id="booking-end" label={t.fieldEnd} error={errors.endDate} className={styles.spanHalf}>
                <input
                  ref={setFieldRef('endDate')}
                  id="booking-end"
                  name="endDate"
                  type="date"
                  className={styles.input}
                  value={endDate}
                  min={startDate || minDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  aria-invalid={errors.endDate ? true : undefined}
                  aria-describedby={errors.endDate ? 'booking-end-error' : undefined}
                  required
                />
              </Field>

              <Field id="booking-pickup" label={t.fieldPickup} error={errors.pickup} className={styles.spanHalf}>
                <input
                  ref={setFieldRef('pickup')}
                  id="booking-pickup"
                  name="pickup"
                  type="text"
                  className={styles.input}
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                  aria-invalid={errors.pickup ? true : undefined}
                  aria-describedby={errors.pickup ? 'booking-pickup-error' : undefined}
                  required
                />
              </Field>

              <Field
                id="booking-destination"
                label={t.fieldDestination}
                error={errors.destination}
                className={styles.spanHalf}
              >
                <input
                  ref={setFieldRef('destination')}
                  id="booking-destination"
                  name="destination"
                  type="text"
                  className={styles.input}
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  aria-invalid={errors.destination ? true : undefined}
                  aria-describedby={errors.destination ? 'booking-destination-error' : undefined}
                  required
                />
              </Field>

              <Field
                id="booking-passengers"
                label={t.fieldPassengers}
                hint={vehicle ? format(t.fieldPassengersHint, { seats: vehicle.seats }) : undefined}
                error={errors.passengers}
                className={styles.spanHalf}
              >
                <input
                  ref={setFieldRef('passengers')}
                  id="booking-passengers"
                  name="passengers"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={vehicle?.seats}
                  step={1}
                  className={styles.input}
                  value={passengers}
                  onChange={(event) => setPassengers(event.target.value)}
                  aria-invalid={errors.passengers ? true : undefined}
                  aria-describedby={
                    [
                      vehicle ? 'booking-passengers-hint' : null,
                      errors.passengers ? 'booking-passengers-error' : null,
                    ]
                      .filter(Boolean)
                      .join(' ') || undefined
                  }
                  required
                />
              </Field>

              <Field
                id="booking-notes"
                label={t.fieldNotes}
                hint={t.fieldNotesHint}
                className={styles.spanFull}
              >
                <textarea
                  id="booking-notes"
                  name="notes"
                  rows={4}
                  className={`${styles.input} ${styles.textarea}`}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  aria-describedby="booking-notes-hint"
                />
              </Field>
            </div>

            <div className={styles.estimate} aria-live="polite">
              <div className={styles.estimateRow}>
                <span className={styles.estimateLabel}>{t.estimateLabel}</span>
                <span className={styles.estimateValue}>
                  {estimate !== null ? formatIDR(estimate) : t.estimateEmpty}
                </span>
              </div>
              {vehicle && days > 0 ? (
                <p className={styles.estimateWorking}>
                  {format(t.estimateWorking, {
                    price: formatPerDay(vehicle.pricePerDay, dict.fleet.perDay),
                    days,
                    dayWord: days === 1 ? t.dayWordOne : t.dayWordMany,
                  })}
                </p>
              ) : null}
              <p className={styles.estimateDisclaimer}>{t.disclaimer}</p>
            </div>

            <div className={styles.agreementWrap}>
              <label className={styles.agreement} htmlFor="booking-agreement">
                <input
                  ref={setFieldRef('agreement')}
                  id="booking-agreement"
                  name="agreement"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  aria-invalid={errors.agreement ? true : undefined}
                  aria-describedby={errors.agreement ? 'booking-agreement-error' : undefined}
                  required
                />
                <span>{t.agreement}</span>
              </label>
              {errors.agreement ? (
                <p id="booking-agreement-error" className={styles.error}>
                  {errors.agreement}
                </p>
              ) : null}
            </div>

            <button type="submit" className={`btn btn--primary ${styles.submit}`}>
              <WhatsAppIcon />
              {t.submit}
            </button>

            <div aria-live="polite">
              {prepared ? (
                <div className={styles.status}>
                  <p className={styles.statusTitle}>{t.statusTitle}</p>
                  <p className={styles.statusBody}>
                    {format(t.statusBody, { vehicle: prepared.vehicleName })}
                  </p>
                  <a
                    className={`btn btn--secondary ${styles.statusLink}`}
                    href={prepared.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.statusLink}
                  </a>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/** Shared field wrapper. Labels are always visible, errors sit next to the input. */
function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
