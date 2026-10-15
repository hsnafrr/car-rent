/**
 * Morfosa chat assistant: a deterministic keyword engine.
 * No network, no AI service, no cost. Same input always gives the same answer.
 * Pure TypeScript with no local imports so it can be unit tested on its own.
 */
export type Lang = 'id' | 'en';

export interface BotVehicle {
  slug: string;
  name: string;
  seats: number;
  price: number;
}

export interface BotContext {
  lang: Lang;
  vehicles: BotVehicle[];
  /** International format, digits only. */
  whatsapp: string;
  whatsappDisplay: string;
  /** Absolute or hash URL of the booking section. */
  bookingUrl: string;
}

export type BotAction =
  | { type: 'book'; label: string; vehicle?: string }
  | { type: 'link'; label: string; href: string }
  | { type: 'whatsapp'; label: string; href: string };

export interface BotReply {
  /** Plain text. Line breaks are kept. */
  text: string;
  actions: BotAction[];
  chips: string[];
  intents: string[];
}

/* ---------------------------------------------------------------- text helpers */

export function normalize(input: string): string {
  return ` ${String(input ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

function editDistanceAtMostOne(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (la > lb) i++;
    else if (lb > la) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (la - i) + (lb - j) <= 1;
}

/** Does the keyword (single word or phrase) occur in the normalised text? */
function hit(text: string, tokens: string[], keyword: string): boolean {
  if (keyword.includes(' ')) return text.includes(` ${keyword} `);
  if (tokens.includes(keyword)) return true;
  if (keyword.length < 5) return false;
  return tokens.some((t) => t.length >= 4 && editDistanceAtMostOne(t, keyword));
}

const rp = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID');

/* ---------------------------------------------------------------- intents */

interface Intent {
  id: string;
  /** Higher wins when the same message matches several. */
  weight: number;
  keywords: Record<Lang, string[]>;
}

const INTENTS: Intent[] = [
  {
    id: 'price',
    weight: 5,
    keywords: {
      id: ['harga', 'tarif', 'biaya', 'price', 'pricelist', 'price list', 'rate', 'ongkos', 'murah', 'termurah', 'cost'],
      en: ['price', 'prices', 'pricing', 'pricelist', 'price list', 'rate', 'rates', 'cost', 'how much', 'tariff', 'cheap', 'cheapest', 'fee', 'harga', 'tarif'],
    },
  },
  {
    id: 'booking',
    weight: 6,
    keywords: {
      id: ['booking', 'book', 'pesan', 'pesanan', 'pemesanan', 'order', 'reservasi', 'reserve', 'mau sewa', 'mau rental', 'ingin sewa', 'daftar', 'form', 'formulir', 'link booking', 'cara pesan', 'cara booking', 'cara sewa', 'link'],
      en: ['booking', 'book', 'reserve', 'reservation', 'order', 'want to rent', 'form', 'link', 'how to book', 'how to rent', 'sign up', 'booking link', 'booking form', 'pesan', 'i want to rent', 'want to rent'],
    },
  },
  {
    id: 'fleet',
    weight: 3,
    keywords: {
      id: ['armada', 'mobil', 'kendaraan', 'unit', 'tipe', 'jenis', 'pilihan', 'fleet', 'list mobil', 'daftar mobil', 'apa saja'],
      en: ['fleet', 'cars', 'car', 'vehicles', 'vehicle', 'types', 'options', 'models', 'available', 'what do you have', 'armada', 'mobil'],
    },
  },
  {
    id: 'included',
    weight: 4,
    keywords: {
      id: ['sopir', 'supir', 'driver', 'bbm', 'bensin', 'bahan bakar', 'solar', 'termasuk', 'include', 'lepas kunci', 'tanpa sopir', 'self drive', 'selfdrive'],
      en: ['driver', 'fuel', 'petrol', 'gas', 'included', 'include', 'includes', 'self drive', 'selfdrive', 'without driver', 'sopir', 'bbm'],
    },
  },
  {
    id: 'payment',
    weight: 4,
    keywords: {
      id: ['bayar', 'pembayaran', 'dp', 'uang muka', 'rekening', 'lunas', 'tunai', 'cash', 'qris', 'cicil', 'down payment', 'metode pembayaran', 'transfer bank'],
      en: ['pay', 'payment', 'deposit', 'down payment', 'transfer', 'bank', 'cash', 'qris', 'installment', 'how to pay', 'payment method', 'dp'],
    },
  },
  {
    id: 'insurance',
    weight: 4,
    keywords: {
      id: ['asuransi', 'insurance', 'kecelakaan', 'garansi', 'jaminan', 'klaim'],
      en: ['insurance', 'insured', 'accident', 'warranty', 'guarantee', 'claim', 'asuransi'],
    },
  },
  {
    id: 'minimum',
    weight: 4,
    keywords: {
      id: ['minimal', 'minimum', 'durasi', 'berapa hari', 'sehari', 'harian', 'mingguan', 'bulanan', 'per jam', 'half day', 'setengah hari', 'lama sewa', 'masa sewa'],
      en: ['minimum', 'duration', 'how long', 'daily', 'weekly', 'monthly', 'hourly', 'per hour', 'half day', 'rental period', 'days'],
    },
  },
  {
    id: 'pickup',
    weight: 4,
    keywords: {
      id: ['jemput', 'penjemputan', 'antar', 'pengantaran', 'bandara', 'yia', 'stasiun', 'hotel', 'airport', 'lokasi jemput', 'drop off', 'dropoff'],
      en: ['pickup', 'pick up', 'drop off', 'dropoff', 'airport', 'station', 'hotel', 'transfer', 'jemput', 'bandara'],
    },
  },
  {
    id: 'outoftown',
    weight: 4,
    keywords: {
      id: ['luar kota', 'antar kota', 'antarkota', 'jauh', 'biaya tambahan', 'tambahan', 'overtime', 'lembur', 'tol', 'parkir', 'menginap', 'inap'],
      en: ['out of town', 'intercity', 'long distance', 'extra charge', 'additional', 'overtime', 'toll', 'parking', 'overnight', 'extra cost'],
    },
  },
  {
    id: 'cancel',
    weight: 4,
    keywords: {
      id: ['batal', 'pembatalan', 'cancel', 'refund', 'kembali uang', 'ubah jadwal', 'reschedule', 'ganti tanggal', 'perpanjang', 'extend'],
      en: ['cancel', 'cancellation', 'refund', 'reschedule', 'change date', 'change booking', 'extend', 'batal'],
    },
  },
  {
    id: 'hours',
    weight: 3,
    keywords: {
      id: ['buka', 'tutup', 'jam operasional', 'operasional', '24 jam', 'malam', 'subuh', 'dini hari', 'weekend', 'libur', 'hari minggu'],
      en: ['open', 'close', 'closed', 'opening hours', 'business hours', 'hours', '24 hours', 'night', 'early morning', 'sunday', 'weekend', 'holiday'],
    },
  },
  {
    id: 'contact',
    weight: 3,
    keywords: {
      id: ['kontak', 'hubungi', 'whatsapp', 'wa', 'telepon', 'telpon', 'nomor', 'email', 'instagram', 'tiktok', 'cs', 'admin', 'manusia', 'bicara', 'komplain', 'keluhan', 'telp', 'hp'],
      en: ['contact', 'whatsapp', 'phone', 'number', 'call', 'email', 'instagram', 'tiktok', 'human', 'agent', 'admin', 'talk', 'speak', 'complaint', 'support', 'wa'],
    },
  },
  {
    id: 'location',
    weight: 3,
    keywords: {
      id: ['alamat', 'lokasi', 'dimana', 'di mana', 'kantor', 'garasi', 'yogyakarta', 'jogja', 'yogya', 'diy'],
      en: ['address', 'location', 'where', 'office', 'garage', 'yogyakarta', 'jogja', 'yogya'],
    },
  },
  {
    id: 'about',
    weight: 2,
    keywords: {
      id: ['tentang', 'siapa', 'perusahaan', 'pendiri', 'sejak', 'pengalaman', 'terpercaya', 'aman', 'ulasan', 'review', 'testimoni', 'rating'],
      en: ['about', 'who', 'company', 'founder', 'since', 'experience', 'trusted', 'safe', 'reviews', 'review', 'testimonial', 'rating'],
    },
  },
  {
    id: 'greeting',
    weight: 1,
    keywords: {
      id: ['halo', 'hai', 'hi', 'hello', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'pagi', 'siang', 'sore', 'permisi', 'assalamualaikum', 'salam', 'p', 'tes', 'test', 'bantuan', 'help', 'tolong', 'menu'],
      en: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'help', 'menu', 'start', 'test', 'halo', 'hai'],
    },
  },
  {
    id: 'thanks',
    weight: 1,
    keywords: {
      id: ['terima kasih', 'makasih', 'thanks', 'thank you', 'thx', 'oke', 'ok', 'siap', 'sip', 'mantap', 'baik', 'sama sama'],
      en: ['thanks', 'thank you', 'thx', 'ok', 'okay', 'great', 'nice', 'cool', 'got it', 'terima kasih'],
    },
  },
];

const VEHICLE_WORDS: Record<string, string[]> = {
  'agya-brio': ['agya', 'brio', 'city car', 'citycar', 'kecil', 'hatchback', 'small'],
  'avanza-xenia': ['avanza', 'xenia', 'family car', 'keluarga', 'family'],
  'innova-reborn': ['innova', 'reborn', 'premium mpv', 'mpv', 'zenix'],
  'hiace-commuter': ['commuter', 'hiace commuter', 'elf', 'rombongan', 'group', 'bus kecil'],
  'hiace-premio': ['premio', 'hiace premio', 'premium van', 'van premium', 'luxury'],
  'grandmax-blindvan': ['grandmax', 'blindvan', 'blind van', 'barang', 'kargo', 'cargo', 'pickup box', 'box', 'delivery'],
};

const BOOKING_ID = /mrf-\d{6}-\d{4}/i;

function findVehicles(text: string, tokens: string[], ctx: BotContext): BotVehicle[] {
  const found: BotVehicle[] = [];
  for (const v of ctx.vehicles) {
    const words = VEHICLE_WORDS[v.slug] ?? [];
    if (words.some((w) => hit(text, tokens, w))) found.push(v);
  }
  return found;
}

function passengerCount(text: string): number | null {
  const m = text.match(/(\d{1,2})\s*(orang|org|penumpang|pax|seat|seater|kursi|people|person|passengers?)/);
  if (m) return Number(m[1]);
  const m2 = text.match(/(?:untuk|for|buat|sama)\s+(\d{1,2})\b/);
  return m2 ? Number(m2[1]) : null;
}

/* ---------------------------------------------------------------- answers */

function T(ctx: BotContext, id: string, en: string): string {
  return ctx.lang === 'id' ? id : en;
}

function priceLines(ctx: BotContext, list: BotVehicle[]): string {
  const per = T(ctx, '/hari', '/day');
  const s = T(ctx, 'kursi', 'seats');
  return list.map((v) => `• ${v.name} (${v.seats} ${s}): ${rp(v.price)}${per}`).join('\n');
}

function answer(intent: string, text: string, tokens: string[], ctx: BotContext): Omit<BotReply, 'intents'> {
  const wa = `https://wa.me/${ctx.whatsapp}`;
  const mentioned = findVehicles(text, tokens, ctx);
  const bookAction = (vehicle?: string): BotAction => ({ type: 'book', label: T(ctx, 'Buka formulir pemesanan', 'Open the booking form'), vehicle });
  const waAction: BotAction = { type: 'whatsapp', label: `WhatsApp ${ctx.whatsappDisplay}`, href: wa };

  switch (intent) {
    case 'price': {
      const list = mentioned.length ? mentioned : ctx.vehicles;
      const head = mentioned.length
        ? T(ctx, 'Tarif harian yang Anda tanyakan:', 'Daily rate you asked about:')
        : T(ctx, 'Daftar harga sewa per hari:', 'Daily rental prices:');
      return {
        text: `${head}\n${priceLines(ctx, list)}\n\n${T(
          ctx,
          'Sudah termasuk sopir dan BBM. Perjalanan luar kota bisa ada biaya tambahan.',
          'Driver and fuel are included. Out of town trips may carry extra charges.',
        )}`,
        actions: [bookAction(mentioned.length === 1 ? mentioned[0].slug : undefined)],
        chips: T(ctx, 'Cara booking|Apa saja armadanya?|Cara pembayaran', 'How to book|What vehicles do you have?|How to pay').split('|'),
      };
    }
    case 'booking': {
      const one = mentioned.length === 1 ? mentioned[0] : null;
      return {
        text: `${T(ctx, 'Siap! Isi formulir pemesanan di sini:', 'Great! Fill in the booking form here:')}\n${ctx.bookingUrl}\n\n${T(
          ctx,
          'Pilih tanggal dan kendaraan, lalu kirim. Ketersediaan dicek otomatis dan tim kami langsung diberi tahu. Pemesanan baru pasti setelah kami membalas di WhatsApp.',
          'Pick your dates and vehicle, then send. Availability is checked automatically and our team is notified at once. The booking is only confirmed once we reply on WhatsApp.',
        )}${one ? `\n\n${T(ctx, `Saya pilihkan ${one.name} untuk Anda.`, `I will preselect ${one.name} for you.`)}` : ''}`,
        actions: [bookAction(one?.slug), waAction],
        chips: T(ctx, 'Harga sewa|Cara pembayaran|Biaya luar kota', 'Prices|How to pay|Out of town cost').split('|'),
      };
    }
    case 'fleet': {
      const per = T(ctx, '/hari', '/day');
      const s = T(ctx, 'kursi', 'seats');
      return {
        text: `${T(ctx, 'Enam kendaraan, semuanya dengan sopir:', 'Six vehicles, all with a driver:')}\n${ctx.vehicles
          .map((v) => `• ${v.name}, ${v.seats} ${s}, ${rp(v.price)}${per}`)
          .join('\n')}\n\n${T(ctx, 'Sebutkan jumlah penumpang dan saya sarankan yang cocok.', 'Tell me how many passengers and I will suggest the right one.')}`,
        actions: [bookAction()],
        chips: T(ctx, 'Untuk 5 orang|Untuk 10 orang|Harga sewa', 'For 5 people|For 10 people|Prices').split('|'),
      };
    }
    case 'included':
      return {
        text: T(
          ctx,
          'Semua sewa sudah termasuk sopir berpengalaman dan bahan bakar untuk itinerary standar. Kami tidak menyediakan lepas kunci. Biaya tambahan bisa berlaku untuk luar kota, tol, dan parkir.',
          'Every rental includes an experienced driver and fuel for standard itineraries. We do not offer self drive. Extra charges may apply for out of town trips, tolls and parking.',
        ),
        actions: [bookAction()],
        chips: T(ctx, 'Harga sewa|Biaya luar kota', 'Prices|Out of town cost').split('|'),
      };
    case 'payment':
      return {
        text: T(
          ctx,
          'Setelah tim kami memeriksa rencana perjalanan dan ketersediaan, kami kirim harga akhir dan petunjuk pembayaran lewat WhatsApp. Biasanya ada DP untuk mengunci jadwal, sisanya sesuai kesepakatan.',
          'After our team checks your itinerary and availability, we send the final price and payment instructions on WhatsApp. A deposit usually locks the schedule, the rest as agreed.',
        ),
        actions: [bookAction(), waAction],
        chips: T(ctx, 'Cara booking|Harga sewa', 'How to book|Prices').split('|'),
      };
    case 'insurance':
      return {
        text: T(ctx, 'Asuransi perjalanan tidak termasuk dalam harga sewa yang tercantum.', 'Travel insurance is not included in the listed rental price.'),
        actions: [],
        chips: T(ctx, 'Harga sewa|Cara booking', 'Prices|How to book').split('|'),
      };
    case 'minimum':
      return {
        text: T(
          ctx,
          'Tarif dihitung per hari. Masa sewa minimum bisa bergantung pada kendaraan dan rencana perjalanan. Untuk sewa setengah hari, per jam, atau mingguan, tanyakan langsung ke tim kami.',
          'Rates are per day. The minimum period can depend on the vehicle and itinerary. For half day, hourly or weekly rentals, ask our team directly.',
        ),
        actions: [waAction],
        chips: T(ctx, 'Harga sewa|Cara booking', 'Prices|How to book').split('|'),
      };
    case 'pickup':
      return {
        text: T(
          ctx,
          'Penjemputan dan pengantaran tersedia, termasuk bandara YIA, stasiun, dan hotel. Tulis lokasi jemput dan tujuan di formulir pemesanan, tim kami akan mengonfirmasi biaya tambahan jika ada.',
          'Pickup and drop off are available, including YIA airport, stations and hotels. Enter your pickup and destination in the booking form and our team will confirm any extra charge.',
        ),
        actions: [bookAction()],
        chips: T(ctx, 'Biaya luar kota|Harga sewa', 'Out of town cost|Prices').split('|'),
      };
    case 'outoftown':
      return {
        text: T(
          ctx,
          'Perjalanan luar kota, menginap, tol, dan parkir dapat dikenakan biaya tambahan sesuai tujuan. Harga akhir kami pastikan setelah tahu rencana perjalanan Anda.',
          'Out of town trips, overnight stays, tolls and parking can carry extra charges depending on the destination. We confirm the final price once we know your itinerary.',
        ),
        actions: [bookAction(), waAction],
        chips: T(ctx, 'Harga sewa|Cara booking', 'Prices|How to book').split('|'),
      };
    case 'cancel':
      return {
        text: T(
          ctx,
          'Untuk pembatalan, perubahan tanggal, atau perpanjangan sewa, hubungi tim kami di WhatsApp dengan menyebut Booking ID Anda agar cepat ditangani.',
          'To cancel, change dates or extend a rental, message our team on WhatsApp with your Booking ID so we can help quickly.',
        ),
        actions: [waAction],
        chips: T(ctx, 'Cara booking|Kontak', 'How to book|Contact').split('|'),
      };
    case 'hours':
      return {
        text: T(
          ctx,
          'Kami melayani setiap hari, 24 jam. Keberangkatan dini hari dan kedatangan larut malam juga kami layani.',
          'We are open every day, 24 hours. Early departures and late arrivals are covered.',
        ),
        actions: [waAction],
        chips: T(ctx, 'Harga sewa|Cara booking', 'Prices|How to book').split('|'),
      };
    case 'contact':
      return {
        text: T(
          ctx,
          `WhatsApp adalah cara tercepat menghubungi kami: ${ctx.whatsappDisplay}. Saluran terbuka setiap hari, kapan saja.`,
          `WhatsApp is the fastest way to reach us: ${ctx.whatsappDisplay}. The line is open every day, at any hour.`,
        ),
        actions: [waAction],
        chips: T(ctx, 'Harga sewa|Cara booking', 'Prices|How to book').split('|'),
      };
    case 'location':
      return {
        text: T(
          ctx,
          'Morfosa Transport berbasis di Yogyakarta dan melayani perjalanan dari dan ke seluruh area DIY serta sekitarnya.',
          'Morfosa Transport is based in Yogyakarta and serves trips to and from all of DIY and the surrounding area.',
        ),
        actions: [bookAction()],
        chips: T(ctx, 'Penjemputan bandara|Harga sewa', 'Airport pickup|Prices').split('|'),
      };
    case 'about':
      return {
        text: T(
          ctx,
          'Morfosa Transport didirikan tahun 2008 oleh Mr. Salim Jefry. Lebih dari 15 tahun melayani sewa mobil dengan sopir berpengalaman di Yogyakarta, dengan penilaian rata-rata 4,8.',
          'Morfosa Transport was founded in 2008 by Mr. Salim Jefry. Over 15 years of car rental with experienced drivers in Yogyakarta, with an average rating of 4.8.',
        ),
        actions: [bookAction()],
        chips: T(ctx, 'Apa saja armadanya?|Harga sewa', 'What vehicles do you have?|Prices').split('|'),
      };
    case 'greeting':
      return {
        text: T(
          ctx,
          'Halo! Saya asisten Morfosa Transport. Tanyakan harga, armada, atau cara booking, saya jawab langsung.',
          'Hello! I am the Morfosa Transport assistant. Ask about prices, vehicles or how to book and I will answer right away.',
        ),
        actions: [],
        chips: T(ctx, 'Harga sewa|Cara booking|Apa saja armadanya?', 'Prices|How to book|What vehicles do you have?').split('|'),
      };
    case 'thanks':
      return {
        text: T(ctx, 'Sama-sama! Kabari saya kalau ada yang ingin ditanyakan lagi.', 'You are welcome! Let me know if you need anything else.'),
        actions: [bookAction()],
        chips: T(ctx, 'Harga sewa|Cara booking', 'Prices|How to book').split('|'),
      };
    default:
      return fallback(ctx);
  }
}

function fallback(ctx: BotContext): Omit<BotReply, 'intents'> {
  return {
    text: T(
      ctx,
      'Maaf, saya belum menangkap maksudnya. Coba kata kunci seperti harga, booking, armada, atau pembayaran. Atau bicara langsung dengan tim kami di WhatsApp.',
      'Sorry, I did not catch that. Try keywords like price, booking, vehicles or payment. Or talk to our team directly on WhatsApp.',
    ),
    actions: [{ type: 'whatsapp', label: `WhatsApp ${ctx.whatsappDisplay}`, href: `https://wa.me/${ctx.whatsapp}` }],
    chips: T(ctx, 'Harga sewa|Cara booking|Apa saja armadanya?', 'Prices|How to book|What vehicles do you have?').split('|'),
  };
}

/* ---------------------------------------------------------------- main */

export function reply(input: string, ctx: BotContext): BotReply {
  const raw = String(input ?? '').slice(0, 300);
  const text = normalize(raw);
  const tokens = text.trim().split(' ').filter(Boolean);
  if (!tokens.length) return { ...fallback(ctx), intents: ['fallback'] };

  // A booking reference: we cannot look it up here, send them to the right place.
  if (BOOKING_ID.test(raw)) {
    return {
      text: T(
        ctx,
        'Untuk cek status booking, kirim Booking ID Anda ke WhatsApp kami dan tim akan membalas dengan status terbaru.',
        'To check a booking status, send your Booking ID to our WhatsApp and the team will reply with the latest status.',
      ),
      actions: [{ type: 'whatsapp', label: `WhatsApp ${ctx.whatsappDisplay}`, href: `https://wa.me/${ctx.whatsapp}?text=${encodeURIComponent(raw.trim())}` }],
      chips: T(ctx, 'Cara booking|Harga sewa', 'How to book|Prices').split('|'),
      intents: ['status'],
    };
  }

  // Passenger count: recommend the smallest vehicle that fits.
  const pax = passengerCount(text);
  const wantsPriceOrBook = INTENTS.filter((i) => (i.id === 'price' || i.id === 'booking') && i.keywords[ctx.lang].some((k) => hit(text, tokens, k)));
  if (pax !== null && pax >= 1 && wantsPriceOrBook.length === 0) {
    const fit = [...ctx.vehicles].filter((v) => v.seats >= pax && v.slug !== 'grandmax-blindvan').sort((a, b) => a.seats - b.seats || a.price - b.price)[0];
    if (!fit) {
      return {
        text: T(
          ctx,
          `Untuk ${pax} orang kami sarankan dibagi ke dua kendaraan atau hubungi tim kami untuk pengaturan khusus.`,
          `For ${pax} people we suggest splitting across two vehicles, or contact our team for a special arrangement.`,
        ),
        actions: [{ type: 'whatsapp', label: `WhatsApp ${ctx.whatsappDisplay}`, href: `https://wa.me/${ctx.whatsapp}` }],
        chips: T(ctx, 'Harga sewa|Cara booking', 'Prices|How to book').split('|'),
        intents: ['recommend'],
      };
    }
    return {
      text: `${T(ctx, `Untuk ${pax} orang, yang paling pas:`, `For ${pax} people, the best fit is:`)}\n• ${fit.name} (${fit.seats} ${T(ctx, 'kursi', 'seats')}): ${rp(fit.price)}${T(ctx, '/hari', '/day')}\n\n${T(
        ctx,
        'Sudah termasuk sopir dan BBM.',
        'Driver and fuel included.',
      )}`,
      actions: [{ type: 'book', label: T(ctx, `Pesan ${fit.name}`, `Book ${fit.name}`), vehicle: fit.slug }],
      chips: T(ctx, 'Harga sewa|Cara pembayaran', 'Prices|How to pay').split('|'),
      intents: ['recommend'],
    };
  }

  const scored = INTENTS.map((intent) => {
    const matches = intent.keywords[ctx.lang].filter((k) => hit(text, tokens, k)).length;
    return { intent, matches, score: matches ? intent.weight * 10 + matches : 0 };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // A vehicle name on its own is a price question.
  const named = findVehicles(text, tokens, ctx);
  if (!scored.length && named.length) {
    const a = answer('price', text, tokens, ctx);
    return { ...a, intents: ['price'] };
  }
  if (!scored.length) return { ...fallback(ctx), intents: ['fallback'] };

  // Greetings and thanks never override a real question.
  const real = scored.filter((s) => s.intent.id !== 'greeting' && s.intent.id !== 'thanks');
  const pool = real.length ? real : scored;
  const picked = [pool[0], ...(pool[1] && pool[1].intent.weight >= 4 ? [pool[1]] : [])];

  if (picked.length === 1) {
    const a = answer(picked[0].intent.id, text, tokens, ctx);
    return { ...a, intents: [picked[0].intent.id] };
  }

  // Two intents in one message (for example "harga dan booking"): answer both, one CTA.
  const first = answer(picked[0].intent.id, text, tokens, ctx);
  const second = answer(picked[1].intent.id, text, tokens, ctx);
  const actions: BotAction[] = [...first.actions, ...second.actions].filter(
    (a, i, all) => all.findIndex((b) => b.type === a.type && (b as { vehicle?: string }).vehicle === (a as { vehicle?: string }).vehicle) === i,
  );
  return {
    text: `${first.text}\n\n${second.text}`,
    actions: actions.slice(0, 3),
    chips: first.chips,
    intents: picked.map((p) => p.intent.id),
  };
}

export function greeting(ctx: BotContext): BotReply {
  return { ...answer('greeting', '', [], ctx), intents: ['greeting'] };
}
