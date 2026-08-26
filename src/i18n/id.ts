import type { Dictionary } from './types';

/**
 * Indonesian copy.
 *
 * Typed as Dictionary, which is derived from the English file, so any key that
 * is missing, misspelled, or left over is a compile error rather than a gap on
 * the page.
 *
 * A note on the testimonials: the three reviews were supplied in English. The
 * Indonesian wording below is a translation of that supplied text, not a new
 * review, and no testimonial has been added or embellished.
 */
export const id: Dictionary = {
  code: 'id',
  htmlLang: 'id',
  name: 'Bahasa Indonesia',
  shortName: 'ID',

  meta: {
    title: 'Morfosa Transport | Sewa mobil dengan sopir di Yogyakarta',
    description:
      'Morfosa Transport menyediakan layanan sewa mobil yang aman, nyaman, dan terpercaya dengan sopir berpengalaman dan harga bersaing. Dipercaya di Yogyakarta sejak 2008 dan siap 24 jam.',
    keywords: [
      'sewa mobil Jogja',
      'rental mobil Yogyakarta',
      'sewa mobil dengan sopir',
      'sewa Hiace Jogja',
      'sewa Avanza Jogja',
      'antar jemput bandara Yogyakarta',
    ],
    ogAlt: 'Mobil tujuh penumpang berwarna hitam tiba di tempat menginap di perbukitan saat senja',
  },

  nav: {
    labels: {
      home: 'Beranda',
      fleet: 'Armada',
      about: 'Tentang',
      booking: 'Pemesanan',
      reviews: 'Ulasan',
      faq: 'Tanya Jawab',
      contact: 'Kontak',
    },
    bookNow: 'Pesan Sekarang',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    brandHome: '{name}, kembali ke atas',
    primary: 'Utama',
    primaryMobile: 'Utama, ponsel',
    footerNav: 'Footer',
    skip: 'Lewati ke konten utama',
    themeLabel: 'Tema warna',
    themeToDark: 'Ganti ke tema gelap',
    themeToLight: 'Ganti ke tema terang',
    languageLabel: 'Bahasa',
    switchLanguage: 'Read in English',
  },

  hero: {
    sectionLabel: 'Pengantar Morfosa Transport',
    brandLine: 'Morfosa Transport',
    headline: 'Setiap perjalanan, ditangani dengan benar.',
    supporting1: 'Sewa mobil dengan sopir berpengalaman, dipercaya di Yogyakarta sejak 2008.',
    supporting2:
      'Enam kendaraan, dari lima kursi sampai empat belas. Sopir dan bahan bakar sudah termasuk dalam setiap tarif harian.',
    closing: 'Siap saat perjalanan Anda dimulai.',
    ctaPrimary: 'Pesan Kendaraan',
    ctaSecondary: 'Lihat Armada',
    scrollHint: 'Gulir untuk mulai',
    loading: 'Memuat film',
    loadingAria: 'Film hero sedang dimuat',
    stillAlt:
      'Mobil tujuh penumpang berwarna hitam berhenti di pintu masuk vila perbukitan saat senja, dilihat dari depan',
  },

  trust: {
    statement: 'Melayani setiap perjalanan dengan sepenuh hati sejak 2008.',
    years: { label: 'Tahun pengalaman', detail: 'Beroperasi di Yogyakarta sejak 2008.' },
    vehicleTypes: {
      label: 'Jenis kendaraan',
      detail: 'Dari city car lima kursi sampai van empat belas kursi.',
    },
    availability: {
      label: 'Layanan siaga',
      detail: 'Keberangkatan dini hari dan kedatangan larut malam sama sama kami layani.',
    },
    drivers: {
      value: 'Semua trip',
      label: 'Sopir berpengalaman',
      detail: 'Setiap penyewaan di sini sudah termasuk sopir.',
    },
  },

  fleet: {
    eyebrow: 'Armada',
    title: 'Enam kendaraan, satu standar layanan.',
    lede:
      'Setiap tarif di bawah sudah termasuk sopir dan bahan bakar. Pilih berdasarkan jumlah penumpang dan jarak perjalanan Anda.',
    perDay: '/hari',
    includedNote: 'sopir dan bahan bakar termasuk',
    specSeats: 'Kursi',
    specTransmission: 'Transmisi',
    specIncluded: 'Termasuk',
    specFeatures: 'Fitur',
    bookButton: 'Pesan Kendaraan Ini',
    cardAlt: '{name}, tampilan studio',
    notice:
      'Harga sudah termasuk sopir dan bahan bakar. Biaya tambahan dapat berlaku untuk perjalanan luar kota. Asuransi perjalanan tidak termasuk. Harga dapat berubah tergantung rencana perjalanan dan ketersediaan.',
  },

  vehicles: {
    'agya-brio': {
      name: 'Toyota Agya atau Honda Brio',
      category: 'City Car',
      summary:
        'Tarif harian paling ringan di armada kami. Cocok untuk antar jemput bandara, pertemuan dalam kota, dan perjalanan singkat satu sampai lima penumpang dengan barang bawaan ringan.',
      transmission: 'Manual',
      includes: ['Sopir', 'Bahan bakar', 'Pendingin udara'],
      features: [],
    },
    'avanza-xenia': {
      name: 'Toyota Avanza atau Daihatsu Xenia',
      category: 'Mobil Keluarga',
      summary:
        'Pilihan sehari hari untuk keluarga. Tujuh kursi, dengan ruang barang yang memadai bila baris ketiga dilipat.',
      transmission: '',
      includes: ['Sopir', 'Bahan bakar', 'Pendingin udara'],
      features: [],
    },
    'innova-reborn': {
      name: 'Toyota Innova Reborn',
      category: 'MPV Premium',
      summary:
        'Kabin lebih lapang dan lebih senyap dibanding tujuh kursi standar. Biasanya dipilih untuk rute antarkota yang panjang dan untuk mengantar tamu perusahaan.',
      transmission: '',
      includes: ['Sopir', 'Bahan bakar', 'Pendingin udara'],
      features: ['Interior premium', 'Kabin nyaman'],
    },
    'hiace-commuter': {
      name: 'Toyota Hiace Commuter',
      category: 'Angkutan Rombongan',
      summary:
        'Menjaga satu rombongan tetap dalam satu kendaraan, bukan terpisah di beberapa mobil. Cocok untuk perjalanan kantor, rombongan wisata, dan acara keluarga besar.',
      transmission: '',
      includes: ['Sopir', 'Bahan bakar', 'Pendingin udara'],
      features: [],
    },
    'hiace-premio': {
      name: 'Toyota Hiace Premio',
      category: 'Van Premium',
      summary:
        'Empat belas kursi yang sama seperti Commuter dengan interior berspesifikasi lebih tinggi. Dipilih untuk tamu perusahaan dan perjalanan rombongan beberapa hari.',
      transmission: '',
      includes: ['Sopir', 'Bahan bakar', 'Pendingin udara'],
      features: ['Interior mewah'],
    },
    'grandmax-blindvan': {
      name: 'Grandmax Blindvan',
      category: 'Van Niaga',
      summary:
        'Ruang kargo tertutup dengan dua kursi di depan. Dibuat untuk mengangkut barang dan keperluan pengiriman, bukan untuk perjalanan penumpang.',
      transmission: '',
      includes: ['Sopir', 'Bahan bakar'],
      features: ['Ruang kargo tertutup'],
    },
  },

  recommender: {
    eyebrow: 'Memilih kendaraan',
    title: 'Belum yakin kendaraan mana yang cocok?',
    lede:
      'Pilih keterangan yang paling mendekati. Kami akan menunjukkan kendaraan yang paling sering dipesan untuk perjalanan seperti milik Anda.',
    legend: 'Perjalanan seperti apa yang Anda rencanakan?',
    empty: 'Pilih salah satu dan kendaraan yang cocok akan muncul di sini beserta tarif hariannya.',
    recommended: 'Direkomendasikan',
    bookCta: 'Pesan {name}',
    alternativeLabel: 'Layak dipertimbangkan juga',
    alternativeCta: 'Pesan yang ini saja',
    options: {
      city: {
        label: 'Perjalanan dalam kota untuk 1 sampai 5 penumpang',
        question: 'Perjalanan singkat di dalam Yogyakarta',
        reason:
          'City car memuat sampai lima orang dengan tarif harian paling ringan di armada kami, dan lebih mudah parkir di jalan yang sempit.',
        alternativeReason:
          'Naik ke pilihan ini bila barang bawaan Anda lebih banyak daripada muatan bagasi kecil.',
      },
      family: {
        label: 'Perjalanan keluarga sampai 7 penumpang',
        question: 'Perjalanan keluarga dengan barang bawaan',
        reason:
          'Tujuh kursi dengan tarif keluarga. Inilah kendaraan yang paling sering dipesan untuk perjalanan sehari dan akhir pekan.',
        alternativeReason:
          'Sepadan dengan selisihnya bila perjalanan lebih dari sekitar empat jam sekali jalan.',
      },
      premium: {
        label: 'Kenyamanan premium',
        question: 'Kabin yang lebih senyap dan lebih nyaman',
        reason:
          'Kendaraan tujuh kursi ternyaman yang kami operasikan. Dipilih ketika penumpangnya adalah tamu perusahaan, atau ketika rutenya jauh.',
        alternativeReason:
          'Pilih ini bila Anda butuh kenyamanan premium untuk lebih dari tujuh orang.',
      },
      group: {
        label: 'Perjalanan rombongan sampai 14 penumpang',
        question: 'Satu kendaraan untuk seluruh rombongan',
        reason:
          'Empat belas kursi menjaga rombongan tetap bersama dan lebih hemat daripada memesan dua mobil terpisah.',
        alternativeReason: 'Versi berspesifikasi lebih tinggi dari van empat belas kursi yang sama.',
      },
      cargo: {
        label: 'Angkutan barang atau niaga',
        question: 'Mengangkut barang, bukan orang',
        reason:
          'Ruang kargo tertutup dengan dua kursi di depan. Ini satu satunya kendaraan di armada kami yang dibuat untuk barang.',
        alternativeReason: '',
      },
    },
  },

  about: {
    eyebrow: 'Tentang Morfosa',
    title: 'Dibangun di atas kepercayaan sejak 2008.',
    paragraph:
      'Morfosa Transport didirikan pada tahun 2008 oleh {founder} dengan komitmen memberikan layanan transportasi yang profesional dan terpercaya. Perusahaan ini berawal dari keinginan membantu orang mendapatkan transportasi yang aman dan nyaman untuk perjalanan pribadi, keluarga, rombongan, dan bisnis.',
    quote:
      'Dengan visi menghadirkan transportasi yang aman, nyaman, dan terpercaya, {founder} mendirikan Morfosa Transport pada tahun 2008.',
    founderRole: 'Pendiri dan CEO',
    visionTitle: 'Visi',
    visionBody:
      'Menjadi penyedia layanan transportasi terdepan yang memberikan pengalaman perjalanan terbaik bagi setiap pelanggan.',
    missionTitle: 'Misi',
    missionBody:
      'Menyediakan layanan sewa mobil yang aman, nyaman, dan terpercaya dengan harga bersaing serta sopir berpengalaman.',
    valuesTitle: 'Nilai yang kami pegang',
    values: [
      {
        title: 'Kepercayaan',
        body: 'Membangun kepercayaan jangka panjang melalui layanan yang konsisten dan transparan.',
      },
      { title: 'Keselamatan', body: 'Mengutamakan keselamatan penumpang dalam setiap perjalanan.' },
      {
        title: 'Kualitas',
        body: 'Menjaga standar tinggi pada kendaraan, sopir, dan pelayanan pelanggan.',
      },
      {
        title: 'Inovasi',
        body: 'Terus memperbaiki cara pelanggan menemukan, memilih, dan memesan transportasi.',
      },
    ],
  },

  booking: {
    eyebrow: 'Pemesanan',
    title: 'Kirim detail perjalanan Anda.',
    lede:
      'Isi rencana perjalanan dan kami akan menyiapkan pesan WhatsApp berisi semua yang dibutuhkan tim kami. Tidak ada yang dipesan sampai Morfosa Transport membalas untuk memastikan ketersediaan.',
    primaryWhatsapp: 'WhatsApp utama',
    alternativeWhatsapp: 'WhatsApp alternatif',
    fieldName: 'Nama lengkap',
    fieldPhone: 'Nomor kontak',
    fieldPhoneHint: 'Sebaiknya nomor WhatsApp',
    fieldVehicle: 'Kendaraan',
    fieldVehiclePlaceholder: 'Pilih kendaraan',
    fieldVehicleOption: '{name} ({seats} kursi) {price}',
    fieldStart: 'Tanggal mulai sewa',
    fieldEnd: 'Tanggal selesai sewa',
    fieldPickup: 'Lokasi penjemputan',
    fieldDestination: 'Tujuan',
    fieldPassengers: 'Jumlah penumpang',
    fieldPassengersHint: 'Kendaraan ini memuat {seats} kursi',
    fieldNotes: 'Pesan tambahan',
    fieldNotesHint: 'Opsional. Catatan rencana perjalanan, barang bawaan, kursi anak, dan lainnya.',
    fieldAgreement: 'Persetujuan',

    errorName: 'Isi nama yang akan dipakai untuk pemesanan.',
    errorPhoneMissing: 'Isi nomor kontak yang bisa kami hubungi.',
    errorPhoneShort: 'Isi nomor telepon secara lengkap.',
    errorVehicle: 'Pilih kendaraan yang ingin Anda pesan.',
    errorStartMissing: 'Pilih hari pertama penyewaan.',
    errorStartPast: 'Tanggal mulai tidak boleh di masa lalu.',
    errorEndMissing: 'Pilih hari terakhir penyewaan.',
    errorEndBefore: 'Tanggal selesai harus sama dengan atau setelah tanggal mulai.',
    errorPickup: 'Beri tahu kami di mana sopir menjemput Anda.',
    errorDestination: 'Beri tahu kami ke mana Anda akan pergi.',
    errorPassengersMissing: 'Isi berapa orang yang ikut.',
    errorPassengersInvalid: 'Isi jumlah penumpang dalam angka bulat.',
    errorPassengersCapacity:
      '{vehicle} memuat {seats} kursi. Pilih kendaraan yang lebih besar atau kurangi jumlah penumpang.',
    errorAgreement:
      'Mohon konfirmasi bahwa Anda memahami ini adalah permintaan, bukan pemesanan yang sudah pasti.',
    errorSummaryOne: 'Ada satu hal yang perlu diperbaiki',
    errorSummaryMany: 'Ada {count} hal yang perlu diperbaiki',

    estimateLabel: 'Perkiraan harga dasar',
    estimateEmpty: 'Pilih kendaraan dan tanggal',
    estimateWorking:
      '{price} dikali {days} {dayWord}. Tanggal mulai dan tanggal selesai sama sama dihitung sebagai hari sewa.',
    dayWordOne: 'hari sewa',
    dayWordMany: 'hari sewa',
    disclaimer:
      'Perkiraan harga dasar. Harga akhir akan dipastikan oleh Morfosa Transport berdasarkan tujuan, ketersediaan, dan kebutuhan tambahan.',
    agreement:
      'Saya memahami bahwa formulir ini menyiapkan sebuah permintaan dan pemesanan baru pasti setelah Morfosa Transport membalas melalui WhatsApp.',
    submit: 'Siapkan permintaan lewat WhatsApp',
    statusTitle: 'Permintaan siap. Silakan kirim melalui WhatsApp untuk mendapatkan konfirmasi.',
    statusBody:
      'Permintaan Anda untuk {vehicle} sudah siap di WhatsApp. Jika tab tidak terbuka, gunakan tautan di bawah. Morfosa Transport akan membalas dengan ketersediaan dan harga akhir.',
    statusLink: 'Buka WhatsApp dengan permintaan ini',
  },

  message: {
    heading: 'Permintaan pemesanan untuk Morfosa Transport',
    name: 'Nama',
    contact: 'Nomor kontak',
    vehicle: 'Kendaraan',
    start: 'Mulai sewa',
    end: 'Selesai sewa',
    days: 'Jumlah hari sewa',
    passengers: 'Penumpang',
    pickup: 'Lokasi penjemputan',
    destination: 'Tujuan',
    notes: 'Pesan tambahan',
    estimate: 'Perkiraan harga dasar',
    toBeConfirmed: 'Menunggu konfirmasi',
    understanding:
      'Saya memahami ini adalah perkiraan dan harga akhir serta ketersediaan akan dipastikan oleh Morfosa Transport.',
    generalEnquiry: 'Halo Morfosa Transport, saya ingin bertanya tentang layanan sewa mobil Anda.',
  },

  reviews: {
    eyebrow: 'Ulasan',
    title: 'Yang pelanggan katakan setelahnya.',
    statsNote: 'Angka disediakan oleh Morfosa Transport dari catatan pemesanan mereka sendiri.',
    stats: {
      rating: 'Rata rata penilaian',
      total: 'Total ulasan',
      satisfaction: 'Kepuasan pelanggan',
    },
    quotes: {
      'ahmad-rizki':
        'Pelayanannya sangat memuaskan. Sopirnya ramah dan kendaraannya bersih. Saya pasti akan memakai Morfosa Transport lagi.',
      'sari-dewi':
        'Harganya terjangkau dan pelayanannya profesional. Sangat direkomendasikan untuk perjalanan keluarga.',
      'budi-santoso':
        'Kendaraannya nyaman dan sopirnya berpengalaman. Perjalanan jadi lebih menyenangkan.',
    },
    googleCta: 'Baca ulasan di Google',
  },

  faq: {
    eyebrow: 'Pertanyaan',
    title: 'Sebelum Anda memesan.',
    lede:
      'Jika jawaban yang Anda cari belum ada di sini, kirim pesan lewat WhatsApp dan tim kami akan menjawab langsung.',
    items: [
      {
        id: 'how-to-book',
        question: 'Bagaimana cara memesan kendaraan?',
        answer:
          'Anda dapat mengirim formulir pemesanan atau menghubungi nomor WhatsApp utama kami di {whatsapp}. Pemesanan Anda baru pasti setelah tim kami memeriksa ketersediaan kendaraan dan detail rencana perjalanan.',
      },
      {
        id: 'driver-and-fuel',
        question: 'Apakah harga sudah termasuk sopir dan bahan bakar?',
        answer:
          'Ya. Harga yang tercantum sudah termasuk sopir dan bahan bakar. Biaya tambahan dapat berlaku untuk tujuan luar kota atau kebutuhan rencana perjalanan khusus.',
      },
      {
        id: 'minimum-rental',
        question: 'Berapa masa sewa minimum?',
        answer:
          'Masa sewa minimum dapat bergantung pada kendaraan yang dipilih dan rencana perjalanan. Hubungi tim kami melalui WhatsApp untuk memastikannya.',
      },
      {
        id: 'pickup-dropoff',
        question: 'Apakah tersedia penjemputan dan pengantaran?',
        answer:
          'Kirimkan lokasi penjemputan dan pengantaran Anda melalui formulir pemesanan atau WhatsApp. Tim kami akan memastikan ketersediaan dan biaya tambahan yang berlaku.',
      },
      {
        id: 'payment',
        question: 'Bagaimana cara pembayarannya?',
        answer:
          'Setelah memeriksa rencana perjalanan dan ketersediaan kendaraan, tim kami akan memberikan harga akhir dan petunjuk pembayaran melalui WhatsApp.',
      },
      {
        id: 'insurance',
        question: 'Apakah asuransi perjalanan termasuk?',
        answer: 'Tidak. Asuransi perjalanan tidak termasuk dalam harga sewa yang tercantum.',
      },
    ],
  },

  contact: {
    eyebrow: 'Kontak',
    title: 'Bicara langsung dengan tim kami.',
    lede: 'WhatsApp adalah cara tercepat menghubungi kami. Salurannya terbuka setiap hari, kapan saja.',
    primaryWhatsapp: 'WhatsApp utama',
    alternativeWhatsapp: 'WhatsApp alternatif',
    email: 'Email',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    location: 'Lokasi',
    city: 'Yogyakarta, Indonesia',
    hours: 'Jam operasional',
    hoursValue: 'Senin sampai Minggu, 24 jam',
    ctaText:
      'Siap memesan, atau ingin mengecek tanggal lebih dulu? Kirim pesan dan tim kami akan membalas dengan ketersediaan.',
    ctaButton: 'Kirim pesan lewat WhatsApp',
  },

  footer: {
    tagline: 'Sewa mobil terpercaya dengan sopir berpengalaman sejak 2008.',
    sectionsTitle: 'Bagian',
    informationTitle: 'Informasi',
    followTitle: 'Ikuti',
    privacy: 'Kebijakan Privasi',
    terms: 'Ketentuan dan Informasi Sewa',
    whatsappCta: 'WhatsApp {number}',
    rights: '© {year} {name}. Seluruh hak cipta dilindungi.',
  },

  notFound: {
    eyebrow: '404',
    title: 'Halaman ini tidak ada.',
    body: 'Alamatnya mungkin salah ketik, atau halamannya sudah dipindahkan. Semua isi situs bisa dijangkau dari beranda.',
    otherLanguage: 'Open the site in English',
  },

  common: {
    backHome: 'Kembali ke beranda',
    lastUpdated: 'Terakhir diperbarui {date}',
    legalEyebrow: 'Legal',
    updatedDate: '24 Agustus 2026',
  },
};
