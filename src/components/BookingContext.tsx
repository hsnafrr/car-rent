'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { VehicleSlug } from '@/data/fleet';
import { scrollToSection } from '@/lib/scroll';

interface BookingContextValue {
  /** Empty string means "no vehicle chosen yet", matching the select's value. */
  selectedVehicle: VehicleSlug | '';
  setSelectedVehicle: (slug: VehicleSlug | '') => void;
  /** Preselects a vehicle, then moves focus and scroll to the booking form. */
  bookVehicle: (slug: VehicleSlug) => void;
  /** The booking form registers its vehicle select here so focus can land on it. */
  registerVehicleField: (element: HTMLSelectElement | null) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSlug | ''>('');
  const vehicleFieldRef = useRef<HTMLSelectElement | null>(null);

  const registerVehicleField = useCallback((element: HTMLSelectElement | null) => {
    vehicleFieldRef.current = element;
  }, []);

  const bookVehicle = useCallback((slug: VehicleSlug) => {
    setSelectedVehicle(slug);

    // Same GSAP driven scroll the nav uses, so the hero scrub is never fighting
    // a second scroll animation. Focus lands on the vehicle select rather than
    // the section, because that field is what just changed.
    scrollToSection('booking');
    vehicleFieldRef.current?.focus({ preventScroll: true });
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({ selectedVehicle, setSelectedVehicle, bookVehicle, registerVehicleField }),
    [selectedVehicle, bookVehicle, registerVehicleField],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used inside a BookingProvider');
  }
  return context;
}
