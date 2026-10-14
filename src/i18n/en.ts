import type { VehicleSlug, RecommendationId } from '@/data/fleet';
import type { ReviewId, ReviewStatId } from '@/data/reviews';
import type { NavId } from '@/data/navigation';

/**
 * English copy. This file is the reference: the Indonesian dictionary is typed
 * against it, so a missing or misspelled key is a build error rather than a
 * blank space on the page.
 *
 * Strings in braces are placeholders filled by format() in src/lib/format.ts.
 * Nothing here is a function, because dictionaries are handed to client
 * components as props and functions do not survive that boundary.
 */
export const en = {
  code: 'en' as 'en' | 'id',
  htmlLang: 'en',
  name: 'English',
  shortName: 'EN',

  meta: {
    title: 'Morfosa Transport | Car rental with drivers in Yogyakarta',
    description:
      'Morfosa Transport provides safe, comfortable, and reliable car rental services with experienced drivers and competitive prices. Trusted in Yogyakarta since 2008 and available 24/7.',
    keywords: [
      'car rental Yogyakarta',
      'rental mobil Jogja',
      'car rental with driver',
      'Hiace rental Yogyakarta',
      'Avanza rental Yogyakarta',
      'airport transfer Yogyakarta',
    ],
    ogAlt: 'A black seven seater arriving at a hillside destination at golden hour',
  },

  nav: {
    labels: {
      home: 'Home',
      fleet: 'Fleet',
      about: 'About',
      booking: 'Booking',
      reviews: 'Reviews',
      faq: 'FAQ',
      contact: 'Contact',
    } as Record<NavId, string>,
    bookNow: 'Book Now',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    brandHome: '{name}, back to top',
    primary: 'Primary',
    primaryMobile: 'Primary, mobile',
    footerNav: 'Footer',
    skip: 'Skip to main content',
    themeLabel: 'Colour theme',
    themeToDark: 'Switch to the dark theme',
    themeToLight: 'Switch to the light theme',
    languageLabel: 'Language',
    switchLanguage: 'Baca dalam Bahasa Indonesia',
  },

  hero: {
    sectionLabel: 'Morfosa Transport introduction',
    brandLine: 'Morfosa Transport',
    headline: 'Every journey, properly handled.',
    supporting1: 'Car rental with experienced drivers, trusted in Yogyakarta since 2008.',
    supporting2:
      'Six vehicles, from five seats to fourteen. Driver and fuel are included in every daily rate.',
    closing: 'Ready when your journey begins.',
    ctaPrimary: 'Book Your Vehicle',
    ctaSecondary: 'Explore the Fleet',
    scrollHint: 'Scroll to begin',
    loading: 'Loading the film',
    loadingAria: 'Hero film loading',
    stillAlt:
      'A black seven seater standing at the entrance of a hillside villa at golden hour, seen from the front',
  },

  trust: {
    statement: 'Serving every journey with dedication since 2008.',
    years: { label: 'Years of experience', detail: 'Operating in Yogyakarta since 2008.' },
    vehicleTypes: {
      label: 'Vehicle types',
      detail: 'From a five seat city car to a fourteen seat van.',
    },
    availability: {
      label: 'Standby service',
      detail: 'Early departures and late arrivals are both covered.',
    },
    drivers: {
      value: 'All trips',
      label: 'Experienced drivers',
      detail: 'Every rental listed here is supplied with a driver.',
    },
  },

  fleet: {
    eyebrow: 'The fleet',
    title: 'Six vehicles, one standard of service.',
    lede:
      'Every rate below includes a driver and fuel. Choose by how many people you are moving and how far you are going.',
    perDay: '/day',
    includedNote: 'driver and fuel included',
    specSeats: 'Seats',
    specTransmission: 'Transmission',
    specIncluded: 'Included',
    specFeatures: 'Features',
    bookButton: 'Book This Vehicle',
    cardAlt: '{name}, studio view',
    notice:
      'Prices include driver and fuel. Additional charges may apply for out of town travel. Travel insurance is not included. Prices may change depending on itinerary and availability.',
  },

  vehicles: {
    'agya-brio': {
      name: 'Toyota Agya or Honda Brio',
      category: 'City Car',
      summary:
        'The lowest daily rate in the fleet. Suited to airport transfers, city meetings, and short trips for one to five passengers travelling with light luggage.',
      transmission: 'Manual',
      includes: ['Driver', 'Fuel', 'Air conditioning'],
      features: [],
    },
    'avanza-xenia': {
      name: 'Toyota Avanza or Daihatsu Xenia',
      category: 'Family Car',
      summary:
        'The everyday choice for families. Seven seats, with room for moderate luggage when the third row is folded down.',
      transmission: '',
      includes: ['Driver', 'Fuel', 'Air conditioning'],
      features: [],
    },
    'innova-reborn': {
      name: 'Toyota Innova Reborn',
      category: 'Premium MPV',
      summary:
        'More cabin space and a quieter ride than the standard seven seater. Usually chosen for longer intercity routes and for transporting clients.',
      transmission: '',
      includes: ['Driver', 'Fuel', 'Air conditioning'],
      features: ['Premium interior', 'Comfortable cabin'],
    },
    'hiace-commuter': {
      name: 'Toyota Hiace Commuter',
      category: 'Group Transport',
      summary:
        'Keeps a whole group in one vehicle instead of splitting across several cars. Suited to office trips, tour groups, and large family gatherings.',
      transmission: '',
      includes: ['Driver', 'Fuel', 'Air conditioning'],
      features: [],
    },
    'hiace-premio': {
      name: 'Toyota Hiace Premio',
      category: 'Premium Van',
      summary:
        'The same fourteen seats as the Commuter with a higher specification interior. Chosen for corporate guests and for group journeys that run over several days.',
      transmission: '',
      includes: ['Driver', 'Fuel', 'Air conditioning'],
      features: ['Luxury interior'],
    },
    'grandmax-blindvan': {
      name: 'Grandmax Blindvan',
      category: 'Commercial Delivery Van',
      summary:
        'Enclosed cargo space with two seats in front. Built for moving goods and delivery work rather than passenger travel.',
      transmission: '',
      includes: ['Driver', 'Fuel'],
      features: ['Enclosed cargo space'],
    },
  } as Record<
    VehicleSlug,
    {
      name: string;
      category: string;
      summary: string;
      transmission: string;
      includes: string[];
      features: string[];
    }
  >,

  recommender: {
    eyebrow: 'Choosing a vehicle',
    title: 'Not sure which vehicle fits your journey?',
    lede:
      'Pick the closest description. We will point you at the vehicle most bookings like yours end up using.',
    legend: 'What kind of journey is it?',
    empty: 'Choose an option and the matching vehicle appears here with its daily rate.',
    recommended: 'Recommended',
    bookCta: 'Book the {name}',
    alternativeLabel: 'Also worth considering',
    alternativeCta: 'Book this instead',
    options: {
      city: {
        label: 'City travel for 1 to 5 passengers',
        question: 'Short trips inside Yogyakarta',
        reason:
          'A city car carries up to five people at the lowest daily rate in the fleet, and it is easier to park in narrow streets.',
        alternativeReason:
          'Move up to this if you are carrying more luggage than a small boot will take.',
      },
      family: {
        label: 'Family travel for up to 7 passengers',
        question: 'A family trip with luggage',
        reason:
          'Seven seats at a family rate. This is the vehicle most often booked for day trips and weekend travel.',
        alternativeReason:
          'Worth the difference if the journey runs longer than about four hours each way.',
      },
      premium: {
        label: 'Premium comfort',
        question: 'A quieter, more comfortable cabin',
        reason:
          'The most comfortable seven seater we run. Chosen when the passengers are clients, or when the route is long.',
        alternativeReason:
          'Choose this instead if you need premium comfort for more than seven people.',
      },
      group: {
        label: 'Group travel for up to 14 passengers',
        question: 'One vehicle for the whole group',
        reason:
          'Fourteen seats keeps the group together and costs less than booking two separate cars.',
        alternativeReason: 'The higher specification version of the same fourteen seat van.',
      },
      cargo: {
        label: 'Commercial or cargo transport',
        question: 'Moving goods rather than people',
        reason:
          'Enclosed cargo space with two seats in front. This is the only vehicle in the fleet built for goods.',
        alternativeReason: '',
      },
    } as Record<
      RecommendationId,
      { label: string; question: string; reason: string; alternativeReason: string }
    >,
  },

  about: {
    eyebrow: 'About Morfosa',
    title: 'Built on trust since 2008.',
    paragraph:
      'Morfosa Transport was founded in 2008 by {founder} with a commitment to providing professional and reliable transportation services. The company began from a desire to help people access safe and comfortable transportation for personal, family, group, and business journeys.',
    quote:
      'With a vision to provide safe, comfortable, and reliable transportation, {founder} founded Morfosa Transport in 2008.',
    founderRole: 'Founder and CEO',
    visionTitle: 'Vision',
    visionBody:
      'To become a leading transportation service provider that delivers the best travel experience for every customer.',
    missionTitle: 'Mission',
    missionBody:
      'To provide safe, comfortable, and reliable car rental services at competitive prices with experienced drivers.',
    valuesTitle: 'What the company holds to',
    values: [
      { title: 'Trust', body: 'Building lasting trust through consistent and transparent service.' },
      { title: 'Safety', body: 'Prioritizing passenger safety in every journey.' },
      {
        title: 'Quality',
        body: 'Maintaining high standards across vehicles, drivers, and customer service.',
      },
      {
        title: 'Innovation',
        body: 'Continuously improving how customers discover, choose, and book transportation.',
      },
    ],
  },

  booking: {
    eyebrow: 'Booking',
    title: 'Send your journey details.',
    lede:
      'Choose your dates and vehicle. Availability is checked for you and our team is notified at once. Nothing is reserved until Morfosa Transport replies on WhatsApp to confirm.',
    primaryWhatsapp: 'Primary WhatsApp',
    alternativeWhatsapp: 'Alternative WhatsApp',
    fieldName: 'Full name',
    fieldPhone: 'Contact number',
    fieldPhoneHint: 'WhatsApp number preferred',
    fieldVehicle: 'Vehicle',
    fieldVehiclePlaceholder: 'Choose a vehicle',
    fieldVehicleOption: '{name} ({seats} seats) {price}',
    fieldStart: 'Rental start date',
    fieldEnd: 'Rental end date',
    fieldPickup: 'Pickup location',
    fieldDestination: 'Destination',
    fieldPassengers: 'Number of passengers',
    fieldPassengersHint: 'This vehicle seats {seats}',
    fieldNotes: 'Additional message',
    fieldNotesHint: 'Optional. Itinerary notes, luggage, child seats, anything else.',
    fieldAgreement: 'Agreement',

    errorName: 'Enter the name the booking should be under.',
    errorPhoneMissing: 'Enter a contact number we can reach you on.',
    errorPhoneShort: 'Enter a complete phone number.',
    errorVehicle: 'Choose which vehicle you want to book.',
    errorStartMissing: 'Choose the first day of the rental.',
    errorStartPast: 'The start date cannot be in the past.',
    errorEndMissing: 'Choose the last day of the rental.',
    errorEndBefore: 'The end date must be on or after the start date.',
    errorPickup: 'Tell us where the driver should collect you.',
    errorDestination: 'Tell us where you are travelling to.',
    errorPassengersMissing: 'Enter how many people are travelling.',
    errorPassengersInvalid: 'Enter the number of passengers as a whole number.',
    errorPassengersCapacity:
      'The {vehicle} seats {seats}. Choose a larger vehicle or reduce the number of passengers.',
    errorAgreement:
      'Please confirm you understand this is a request, not a confirmed booking.',
    errorSummaryOne: 'There is one thing to fix',
    errorSummaryMany: 'There are {count} things to fix',

    estimateLabel: 'Estimated base price',
    estimateEmpty: 'Select a vehicle and dates',
    estimateWorking:
      '{price} times {days} {dayWord}. The start and end dates both count as rental days.',
    dayWordOne: 'rental day',
    dayWordMany: 'rental days',
    disclaimer:
      'Estimated base price. Final pricing will be confirmed by Morfosa Transport based on destination, availability, and additional requirements.',
    agreement:
      'I understand this form prepares a request and that the booking is only confirmed once Morfosa Transport replies on WhatsApp.',
    submit: 'Prepare request on WhatsApp',
    statusTitle: 'Request prepared. Please send it through WhatsApp to receive confirmation.',
    statusBody:
      'Your request for the {vehicle} is ready in WhatsApp. If the tab did not open, use the link below. Morfosa Transport will reply with availability and the final price.',
    statusLink: 'Open WhatsApp with this request',
  },

  message: {
    heading: 'Booking request for Morfosa Transport',
    name: 'Name',
    contact: 'Contact number',
    vehicle: 'Vehicle',
    start: 'Rental start',
    end: 'Rental end',
    days: 'Rental days',
    passengers: 'Passengers',
    pickup: 'Pickup location',
    destination: 'Destination',
    notes: 'Additional message',
    estimate: 'Estimated base price',
    toBeConfirmed: 'To be confirmed',
    understanding:
      'I understand this is an estimate and that the final price and availability will be confirmed by Morfosa Transport.',
    generalEnquiry: 'Hello Morfosa Transport, I would like to ask about your car rental service.',
  },

  reviews: {
    eyebrow: 'Reviews',
    title: 'What customers say afterwards.',
    statsNote: 'Figures supplied by Morfosa Transport from their own booking records.',
    stats: {
      rating: 'Average rating',
      total: 'Total reviews',
      satisfaction: 'Customer satisfaction',
    } as Record<ReviewStatId, string>,
    quotes: {
      'ahmad-rizki':
        'Very satisfying service. The driver was friendly and the vehicle was clean. I will definitely use Morfosa Transport again.',
      'sari-dewi':
        'Affordable pricing and professional service. Highly recommended for family trips.',
      'budi-santoso':
        'The vehicle was comfortable and the driver was experienced. The journey became more enjoyable.',
    } as Record<ReviewId, string>,
    googleCta: 'Read reviews on Google',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you book.',
    lede:
      'If the answer you need is not here, send a message on WhatsApp and our team will answer directly.',
    items: [
      {
        id: 'how-to-book',
        question: 'How can I book a vehicle?',
        answer:
          'You can submit the booking form or contact our primary WhatsApp number at {whatsapp}. Your booking is confirmed only after our team verifies vehicle availability and itinerary details.',
      },
      {
        id: 'driver-and-fuel',
        question: 'Does the price include a driver and fuel?',
        answer:
          'Yes. The listed prices include a driver and fuel. Additional charges may apply for out of town destinations or special itinerary requirements.',
      },
      {
        id: 'minimum-rental',
        question: 'What is the minimum rental period?',
        answer:
          'The minimum rental period may depend on the selected vehicle and itinerary. Contact our team through WhatsApp for confirmation.',
      },
      {
        id: 'pickup-dropoff',
        question: 'Is pickup and drop off available?',
        answer:
          'Send us your pickup and drop off locations through the booking form or WhatsApp. Our team will confirm availability and any applicable additional charges.',
      },
      {
        id: 'payment',
        question: 'How does payment work?',
        answer:
          'After checking the itinerary and vehicle availability, our team will provide the final price and payment instructions through WhatsApp.',
      },
      {
        id: 'insurance',
        question: 'Is travel insurance included?',
        answer: 'No. Travel insurance is not included in the listed rental price.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Talk to the team directly.',
    lede: 'WhatsApp is the fastest way to reach us. The line is open every day, at any hour.',
    primaryWhatsapp: 'Primary WhatsApp',
    alternativeWhatsapp: 'Alternative WhatsApp',
    email: 'Email',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    location: 'Location',
    city: 'Yogyakarta, Indonesia',
    hours: 'Business hours',
    hoursValue: 'Monday to Sunday, 24 hours',
    ctaText:
      'Ready to book, or want to check a date first? Send a message and our team will reply with availability.',
    ctaButton: 'Message on WhatsApp',
  },

  footer: {
    tagline: 'Trusted car rental with experienced drivers since 2008.',
    sectionsTitle: 'Sections',
    informationTitle: 'Information',
    followTitle: 'Follow',
    privacy: 'Privacy Policy',
    terms: 'Terms and Rental Information',
    whatsappCta: 'WhatsApp {number}',
    rights: '© {year} {name}. All rights reserved.',
  },

  notFound: {
    eyebrow: '404',
    title: 'This page is not here.',
    body: 'The address may be mistyped, or the page may have moved. Everything on the site is reachable from the home page.',
    otherLanguage: 'Buka situs dalam Bahasa Indonesia',
  },

  common: {
    backHome: 'Back to the home page',
    lastUpdated: 'Last updated {date}',
    legalEyebrow: 'Legal',
    updatedDate: '24 August 2026',
  },
};
