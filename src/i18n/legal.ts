/**
 * Privacy and Terms content as structured data rather than JSX.
 *
 * Both languages feed the same renderer, so the two versions cannot drift in
 * layout, only in wording. Blocks that need real links or live pricing are
 * their own type and the renderer supplies those.
 */
export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'dl'; defs: { term: string; detail: string }[] }
  /** Renders the live fleet rates from src/data/fleet.ts. */
  | { type: 'rates' }
  /** Renders the sentence with real mailto and WhatsApp links substituted in. */
  | { type: 'contact'; text: string };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}

export const privacyEn: LegalDocument = {
  title: 'Privacy Policy',
  description:
    'How Morfosa Transport handles the information you enter on this website and send through WhatsApp.',
  intro:
    'This website does not run analytics, does not set advertising cookies, and does not store your booking details on a server. What follows describes exactly what happens to the information you type here.',
  sections: [
    {
      heading: 'What the booking form does',
      blocks: [
        {
          type: 'p',
          text: 'The booking form runs entirely in your browser. When you submit it, the details are formatted into a WhatsApp message and WhatsApp opens with that message ready to send. Nothing is transmitted to Morfosa Transport until you press send inside WhatsApp yourself.',
        },
        {
          type: 'p',
          text: 'If you close the page without sending, the details are discarded. This website has no database and no account system.',
        },
      ],
    },
    {
      heading: 'Information you choose to send us',
      blocks: [
        { type: 'p', text: 'When you do send a booking request, the message contains the information you entered:' },
        {
          type: 'ul',
          items: [
            'Your name',
            'Your contact number',
            'The vehicle you selected',
            'Your rental start and end dates',
            'Your pickup location and destination',
            'The number of passengers',
            'Any additional message you wrote',
          ],
        },
        {
          type: 'p',
          text: 'We use this information to check availability, confirm the price, arrange a driver, and carry out the rental. We keep booking correspondence for as long as we need it for operational and accounting purposes.',
        },
      ],
    },
    {
      heading: 'Who else is involved',
      blocks: [
        {
          type: 'dl',
          defs: [
            {
              term: 'WhatsApp',
              detail:
                'Messages you send us travel through WhatsApp, which is operated by Meta and governed by its own privacy terms. We do not control how WhatsApp handles message data.',
            },
            {
              term: 'Email',
              detail:
                'If you write to us by email instead, that message is handled by our email provider.',
            },
            {
              term: 'Website hosting',
              detail:
                'Our host records standard server request logs, which may include IP addresses. These logs exist for security and reliability, not for profiling visitors.',
            },
          ],
        },
        {
          type: 'p',
          text: 'We do not sell your information, and we do not pass it to anyone who is not directly involved in delivering your rental.',
        },
      ],
    },
    {
      heading: 'Cookies',
      blocks: [
        {
          type: 'p',
          text: 'This site sets no cookies of its own and includes no third party tracking scripts. The only thing stored in your browser is your choice of light or dark theme, kept on your own device and never sent anywhere.',
        },
      ],
    },
    {
      heading: 'Your choices',
      blocks: [
        {
          type: 'contact',
          text: 'You can ask us what booking information we still hold about you, ask us to correct it, or ask us to delete it. Send the request to {email} or to our WhatsApp number {whatsapp} and we will respond.',
        },
      ],
    },
  ],
};

export const termsEn: LegalDocument = {
  title: 'Terms and Rental Information',
  description:
    'How booking, pricing, drivers, fuel, and confirmation work when you rent a vehicle from Morfosa Transport in Yogyakarta.',
  intro:
    'These are the terms the rates on this website are based on. Anything specific to your trip is confirmed by our team on WhatsApp before the rental goes ahead.',
  sections: [
    {
      heading: 'How a booking is confirmed',
      blocks: [
        {
          type: 'p',
          text: 'Submitting the booking form prepares a message. It does not reserve a vehicle. A booking exists only once Morfosa Transport has replied to confirm that the vehicle is available for your dates and has agreed the itinerary with you.',
        },
        {
          type: 'p',
          text: 'This website shows no live availability, because availability is checked by our team against real bookings rather than by an automated system.',
        },
      ],
    },
    {
      heading: 'What the daily rate includes',
      blocks: [
        {
          type: 'p',
          text: 'Prices include driver and fuel. Additional charges may apply for out of town travel. Travel insurance is not included. Prices may change depending on itinerary and availability.',
        },
        {
          type: 'ul',
          items: [
            'A driver is included in every rate listed on this site.',
            'Fuel is included in every rate listed on this site.',
            'Air conditioning is included on every vehicle except the Grandmax Blindvan, which is a commercial delivery van.',
            'Travel insurance is not included.',
          ],
        },
      ],
    },
    {
      heading: 'Current daily rates',
      blocks: [
        {
          type: 'p',
          text: 'All prices are in Indonesian Rupiah, per day. The start date and the end date both count as rental days.',
        },
        { type: 'rates' },
      ],
    },
    {
      heading: 'Additional charges',
      blocks: [
        {
          type: 'p',
          text: 'Journeys outside the usual service area may carry an additional charge, and so may itineraries with unusual timing or distance. Any additional charge is quoted to you before the rental is confirmed. We do not add charges after the fact without telling you first.',
        },
      ],
    },
    {
      heading: 'Minimum rental period',
      blocks: [
        {
          type: 'p',
          text: 'The minimum rental period depends on the vehicle and on the itinerary. Contact our team on WhatsApp to confirm the minimum that applies to your trip.',
        },
      ],
    },
    {
      heading: 'Pickup and drop off',
      blocks: [
        {
          type: 'p',
          text: 'Send your pickup and drop off locations with your booking request. Our team confirms whether both are workable for the dates you want, and tells you if either affects the price.',
        },
      ],
    },
    {
      heading: 'Payment',
      blocks: [
        {
          type: 'p',
          text: 'After we have checked the itinerary and vehicle availability, our team sends you the final price and the payment instructions on WhatsApp. This website does not take payments and never asks for card or bank details.',
        },
      ],
    },
    {
      heading: 'Changes and cancellation',
      blocks: [
        {
          type: 'p',
          text: 'If your plans change, tell us as early as you can on WhatsApp. Because vehicles and drivers are scheduled against confirmed bookings, the terms for a change or a cancellation depend on how much notice we have and on what has already been arranged. Our team will tell you where you stand before anything is agreed.',
        },
      ],
    },
    {
      heading: 'Passengers and use of the vehicle',
      blocks: [
        {
          type: 'ul',
          items: [
            'Do not book more passengers than the vehicle seats. The seat count for each vehicle is listed above and in the fleet section.',
            'The Grandmax Blindvan is a goods vehicle with two seats in front. It is not for carrying passengers in the cargo area.',
            'Our drivers may decline a request that would be unsafe or unlawful, including overloading a vehicle.',
          ],
        },
      ],
    },
    {
      heading: 'Prices on this page',
      blocks: [
        {
          type: 'p',
          text: 'Rates may change depending on itinerary, season, and availability. The price you are given on WhatsApp for your specific dates is the price that applies to your booking.',
        },
      ],
    },
    {
      heading: 'Questions',
      blocks: [
        {
          type: 'contact',
          text: 'Anything not covered here is answered directly by our team. Message {whatsapp} or email {email}.',
        },
      ],
    },
  ],
};

export const privacyId: LegalDocument = {
  title: 'Kebijakan Privasi',
  description:
    'Bagaimana Morfosa Transport menangani informasi yang Anda isi di situs ini dan Anda kirim melalui WhatsApp.',
  intro:
    'Situs ini tidak menjalankan analitik, tidak memasang cookie iklan, dan tidak menyimpan detail pemesanan Anda di server. Berikut penjelasan tepat mengenai apa yang terjadi pada informasi yang Anda ketik di sini.',
  sections: [
    {
      heading: 'Apa yang dilakukan formulir pemesanan',
      blocks: [
        {
          type: 'p',
          text: 'Formulir pemesanan berjalan sepenuhnya di peramban Anda. Saat Anda mengirimkannya, detailnya disusun menjadi pesan WhatsApp dan WhatsApp terbuka dengan pesan tersebut siap dikirim. Tidak ada yang dikirim ke Morfosa Transport sampai Anda sendiri menekan kirim di dalam WhatsApp.',
        },
        {
          type: 'p',
          text: 'Jika Anda menutup halaman tanpa mengirim, detailnya hilang. Situs ini tidak memiliki basis data dan tidak memiliki sistem akun.',
        },
      ],
    },
    {
      heading: 'Informasi yang Anda pilih untuk dikirim',
      blocks: [
        { type: 'p', text: 'Ketika Anda mengirim permintaan pemesanan, pesannya berisi informasi yang Anda isi:' },
        {
          type: 'ul',
          items: [
            'Nama Anda',
            'Nomor kontak Anda',
            'Kendaraan yang Anda pilih',
            'Tanggal mulai dan selesai sewa',
            'Lokasi penjemputan dan tujuan',
            'Jumlah penumpang',
            'Pesan tambahan yang Anda tulis',
          ],
        },
        {
          type: 'p',
          text: 'Kami memakai informasi ini untuk memeriksa ketersediaan, memastikan harga, menyiapkan sopir, dan menjalankan penyewaan. Kami menyimpan korespondensi pemesanan selama masih diperlukan untuk keperluan operasional dan pembukuan.',
        },
      ],
    },
    {
      heading: 'Pihak lain yang terlibat',
      blocks: [
        {
          type: 'dl',
          defs: [
            {
              term: 'WhatsApp',
              detail:
                'Pesan yang Anda kirim kepada kami melewati WhatsApp, yang dioperasikan oleh Meta dan tunduk pada ketentuan privasinya sendiri. Kami tidak mengendalikan cara WhatsApp menangani data pesan.',
            },
            {
              term: 'Email',
              detail:
                'Jika Anda menulis kepada kami lewat email, pesan tersebut ditangani oleh penyedia email kami.',
            },
            {
              term: 'Hosting situs',
              detail:
                'Penyedia hosting kami mencatat log permintaan server standar, yang dapat memuat alamat IP. Log ini ada untuk keamanan dan keandalan, bukan untuk membuat profil pengunjung.',
            },
          ],
        },
        {
          type: 'p',
          text: 'Kami tidak menjual informasi Anda, dan kami tidak meneruskannya kepada siapa pun yang tidak terlibat langsung dalam melayani penyewaan Anda.',
        },
      ],
    },
    {
      heading: 'Cookie',
      blocks: [
        {
          type: 'p',
          text: 'Situs ini tidak memasang cookie sendiri dan tidak memuat skrip pelacak pihak ketiga. Satu satunya hal yang disimpan di peramban Anda adalah pilihan tema terang atau gelap, yang tersimpan di perangkat Anda sendiri dan tidak pernah dikirim ke mana pun.',
        },
      ],
    },
    {
      heading: 'Hak Anda',
      blocks: [
        {
          type: 'contact',
          text: 'Anda dapat menanyakan informasi pemesanan apa yang masih kami simpan, meminta kami memperbaikinya, atau meminta kami menghapusnya. Kirim permintaan tersebut ke {email} atau ke nomor WhatsApp kami {whatsapp} dan kami akan menanggapinya.',
        },
      ],
    },
  ],
};

export const termsId: LegalDocument = {
  title: 'Ketentuan dan Informasi Sewa',
  description:
    'Cara kerja pemesanan, harga, sopir, bahan bakar, dan konfirmasi saat Anda menyewa kendaraan dari Morfosa Transport di Yogyakarta.',
  intro:
    'Berikut ketentuan yang menjadi dasar harga di situs ini. Hal apa pun yang khusus untuk perjalanan Anda dipastikan oleh tim kami melalui WhatsApp sebelum penyewaan berjalan.',
  sections: [
    {
      heading: 'Bagaimana pemesanan dipastikan',
      blocks: [
        {
          type: 'p',
          text: 'Mengirim formulir pemesanan hanya menyiapkan sebuah pesan. Formulir ini tidak memesan kendaraan. Pemesanan baru ada setelah Morfosa Transport membalas untuk memastikan kendaraan tersedia pada tanggal Anda dan menyepakati rencana perjalanan bersama Anda.',
        },
        {
          type: 'p',
          text: 'Situs ini tidak menampilkan ketersediaan langsung, karena ketersediaan diperiksa tim kami terhadap pemesanan yang nyata, bukan oleh sistem otomatis.',
        },
      ],
    },
    {
      heading: 'Yang sudah termasuk dalam tarif harian',
      blocks: [
        {
          type: 'p',
          text: 'Harga sudah termasuk sopir dan bahan bakar. Biaya tambahan dapat berlaku untuk perjalanan luar kota. Asuransi perjalanan tidak termasuk. Harga dapat berubah tergantung rencana perjalanan dan ketersediaan.',
        },
        {
          type: 'ul',
          items: [
            'Sopir sudah termasuk dalam setiap tarif yang tercantum di situs ini.',
            'Bahan bakar sudah termasuk dalam setiap tarif yang tercantum di situs ini.',
            'Pendingin udara tersedia pada semua kendaraan kecuali Grandmax Blindvan, yang merupakan kendaraan niaga.',
            'Asuransi perjalanan tidak termasuk.',
          ],
        },
      ],
    },
    {
      heading: 'Tarif harian saat ini',
      blocks: [
        {
          type: 'p',
          text: 'Semua harga dalam Rupiah, per hari. Tanggal mulai dan tanggal selesai sama sama dihitung sebagai hari sewa.',
        },
        { type: 'rates' },
      ],
    },
    {
      heading: 'Biaya tambahan',
      blocks: [
        {
          type: 'p',
          text: 'Perjalanan di luar area layanan biasa dapat dikenakan biaya tambahan, begitu pula rencana perjalanan dengan waktu atau jarak yang tidak biasa. Setiap biaya tambahan disampaikan kepada Anda sebelum penyewaan dipastikan. Kami tidak menambahkan biaya di belakang tanpa memberi tahu Anda lebih dulu.',
        },
      ],
    },
    {
      heading: 'Masa sewa minimum',
      blocks: [
        {
          type: 'p',
          text: 'Masa sewa minimum bergantung pada kendaraan dan rencana perjalanan. Hubungi tim kami melalui WhatsApp untuk memastikan minimum yang berlaku bagi perjalanan Anda.',
        },
      ],
    },
    {
      heading: 'Penjemputan dan pengantaran',
      blocks: [
        {
          type: 'p',
          text: 'Sertakan lokasi penjemputan dan pengantaran Anda dalam permintaan pemesanan. Tim kami memastikan apakah keduanya memungkinkan pada tanggal yang Anda inginkan, dan memberi tahu jika salah satunya memengaruhi harga.',
        },
      ],
    },
    {
      heading: 'Pembayaran',
      blocks: [
        {
          type: 'p',
          text: 'Setelah kami memeriksa rencana perjalanan dan ketersediaan kendaraan, tim kami mengirimkan harga akhir dan petunjuk pembayaran melalui WhatsApp. Situs ini tidak menerima pembayaran dan tidak pernah meminta data kartu atau rekening.',
        },
      ],
    },
    {
      heading: 'Perubahan dan pembatalan',
      blocks: [
        {
          type: 'p',
          text: 'Jika rencana Anda berubah, beri tahu kami sedini mungkin melalui WhatsApp. Karena kendaraan dan sopir dijadwalkan berdasarkan pemesanan yang sudah pasti, ketentuan perubahan atau pembatalan bergantung pada seberapa awal kami diberi tahu dan pada apa yang sudah disiapkan. Tim kami akan menjelaskan posisi Anda sebelum apa pun disepakati.',
        },
      ],
    },
    {
      heading: 'Penumpang dan penggunaan kendaraan',
      blocks: [
        {
          type: 'ul',
          items: [
            'Jangan memesan penumpang melebihi kapasitas kursi kendaraan. Jumlah kursi setiap kendaraan tercantum di atas dan di bagian armada.',
            'Grandmax Blindvan adalah kendaraan barang dengan dua kursi di depan. Kendaraan ini bukan untuk mengangkut penumpang di ruang kargo.',
            'Sopir kami dapat menolak permintaan yang tidak aman atau melanggar aturan, termasuk kelebihan muatan.',
          ],
        },
      ],
    },
    {
      heading: 'Harga pada halaman ini',
      blocks: [
        {
          type: 'p',
          text: 'Tarif dapat berubah tergantung rencana perjalanan, musim, dan ketersediaan. Harga yang diberikan kepada Anda melalui WhatsApp untuk tanggal Anda adalah harga yang berlaku untuk pemesanan Anda.',
        },
      ],
    },
    {
      heading: 'Pertanyaan',
      blocks: [
        {
          type: 'contact',
          text: 'Hal apa pun yang belum tercakup di sini dijawab langsung oleh tim kami. Kirim pesan ke {whatsapp} atau email ke {email}.',
        },
      ],
    },
  ],
};
