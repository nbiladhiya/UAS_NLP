export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FlowerDetail {
  id: string;
  name: string;
  scientificName: string;
  meaning: string;
  colors: { color: string; meaning: string; hex: string }[];
  careTips: string[];
  imageUrl: string;
  season: string;
}

export interface QuizAnswers {
  event: string;
  color: string;
  budget: string;
  recipient: string;
}

export interface RecommendedBouquet {
  bouquetName: string;
  description: string;
  flowersUsed: {
    name: string;
    meaning: string;
    count: string;
  }[];
  estimatedCost: string;
  careTips: string[];
  isDemo?: boolean;
}

export interface GiftCardResult {
  title: string;
  content: string;
}

// A beautiful curation of elite floristry flowers
export const FLOWER_CATALOG: FlowerDetail[] = [
  {
    id: 'rose',
    name: 'Mawar (Rose)',
    scientificName: 'Rosa',
    meaning: 'Simbol abadi cinta, kecantikan, rasa hormat, dan kemurnian jiwa.',
    colors: [
      { color: 'Merah (Red)', meaning: 'Cinta mendalam, gairah romantis, dan keberanian.', hex: '#E05B5C' },
      { color: 'Merah Muda (Pastel Pink)', meaning: 'Rasa syukur, kelembutan, kebahagiaan, dan kekaguman manis.', hex: '#FFAEBC' },
      { color: 'Putih (White)', meaning: 'Kemurnian hati, awal baru, ketulusan suci, dan kedamaian.', hex: '#FFF2F2' },
      { color: 'Kuning (Yellow)', meaning: 'Persahabatan sejati, keceriaan hangat, dan selamat datang.', hex: '#FFE79A' }
    ],
    careTips: [
      'Potong batang bunga miring 45 derajat agar asupan air maksimal.',
      'Ganti air vas setiap hari dan potong daun yang terendam air agar terhindar dari bakteri.',
      'Tambahkan satu sendok teh gula pasir sebagai nutrisi alami bunga.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    season: 'Sepanjang Tahun'
  },
  {
    id: 'tulip',
    name: 'Tulip',
    scientificName: 'Tulipa',
    meaning: 'Melambangkan cinta sempurna, kesucian, dan deklarasi perasaan tulus.',
    colors: [
      { color: 'Ungu (Purple)', meaning: 'Kehormatan bangsawan, kemakmuran, dan keanggunan eksklusif.', hex: '#D1ACDB' },
      { color: 'Merah Muda (Pink)', meaning: 'Kasih sayang murni, perhatian hangat, dan harapan baik.', hex: '#FFCAD4' },
      { color: 'Kuning (Yellow)', meaning: 'Pikiran ceria, senyuman menyala, dan kebahagiaan berseri.', hex: '#FDFBBE' },
      { color: 'Putih (White)', meaning: 'Permohonan maaf, kedamaian hati, keikhlasan, dan spiritualitas.', hex: '#F7F4EF' }
    ],
    careTips: [
      'Masukkan dalam air ekstra dingin. Tulip sangat menyukai air dingin dan vas es.',
      'Letakkan di wadah kokoh karena tulip terus tumbuh meninggi meski sudah dipotong.',
      'Jauhkan dari buah matang (misal pisang) karena etilen membuat tulip layu lebih cepat.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=600&auto=format&fit=crop',
    season: 'Musim Semi (Spring)'
  },
  {
    id: 'hydrangea',
    name: 'Hortensia (Hydrangea)',
    scientificName: 'Hydrangea macrophylla',
    meaning: 'Simbol rasa syukur yang mendalam, kelimpahan emosi, dan pengertian tulus.',
    colors: [
      { color: 'Biru (Blue)', meaning: 'Ketulusan hati, keteguhan hati, permohonan maaf, dan ketenangan.', hex: '#B8C0FF' },
      { color: 'Merah Muda (Pink)', meaning: 'Energi cinta tulus, romansa lembut, dan pernikahan abadi.', hex: '#FBB1BD' },
      { color: 'Putih (White)', meaning: 'Kesombongan anggun, keanggunan murni, dan kepolosan.', hex: '#F0ECE9' },
      { color: 'Ungu (Purple)', meaning: 'Hasrat mendalam, kekayaan rohani, dan pemahaman bersama.', hex: '#E8C5E5' }
    ],
    careTips: [
      'Potong tangkai lalu rendam kepala bunga ke dalam air dingin selama 10-15 menit jika mulai layu.',
      'Hortensia menyerap air juga melalui kelopak bunganya, semprot halus kelopak kelopak setiap pagi.',
      'Potong batang berkayunya secara vertikal di ujung bawah agar menyerap air melimpah.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=600&auto=format&fit=crop',
    season: 'Musim Panas (Summer)'
  },
  {
    id: 'babybreath',
    name: "Baby's Breath",
    scientificName: 'Gypsophila',
    meaning: 'Lambang ketulusan abadi, kemurnian cinta sejati, kelembutan hati, dan kebahagiaan abadi.',
    colors: [
      { color: 'Putih (White)', meaning: 'Ketulusan tak bernoda, kepolosan bayi, kesetiaan abadi.', hex: '#F9F6F0' },
      { color: 'Merah Muda (Pink)', meaning: 'Romansa lembut, cinta baru yang manis, kekaguman remaja.', hex: '#FFE5EC' },
      { color: 'Lavender/Violet', meaning: 'Keunikan ekspresi, kebebasan, dan kedalaman spiritual.', hex: '#E2D8EB' }
    ],
    careTips: [
      'Bunga ini sangat tahan lama. Jika mengering, tetap cantik sebagai bunga kering (dried flower).',
      'Hindari menyemprot air langsung pada kelopaknya karena bisa membuatnya kecokelatan.',
      'Pastikan sirkulasi udara baik dan batang tidak terendam air terlalu tinggi.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1615560641178-5a2bad796ad3?q=80&w=600&auto=format&fit=crop',
    season: 'Sepanjang Tahun'
  },
  {
    id: 'carnation',
    name: 'Anyelir (Carnation)',
    scientificName: 'Dianthus caryophyllus',
    meaning: 'Simbol daya tarik yang memikat, perbedaan artistik, cinta yang mendalam, dan kasih sayang ibu.',
    colors: [
      { color: 'Merah Muda (Pink)', meaning: 'Cinta abadi seorang ibu, rasa terima kasih terdalam, dan kelembutan.', hex: '#FFA4B5' },
      { color: 'Putih (White)', meaning: 'Semoga sukses, ketulusan cinta sejati, dan keberuntungan murni.', hex: '#FDFBF7' },
      { color: 'Merah Terang (Red)', meaning: 'Kekaguman tinggi, gairah membara, hati yang merindu.', hex: '#D64545' }
    ],
    careTips: [
      'Selalu potong batang di atas ruas buku (node) batang agar penyerapan optimal.',
      'Anyelir sangat sensitif terhadap gas etilen kelopak buah matang.',
      'Bunga anyelir bisa bertahan segar di vas hingga 2-3 minggu dengan penggantian air teratur.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=600&auto=format&fit=crop',
    season: 'Musim Gugur (Autumn)'
  },
  {
    id: 'peony',
    name: 'Peony',
    scientificName: 'Paeonia',
    meaning: 'Lambang kehormatan tertinggi, kemakmuran, kemewahan berkelas, dan asmara pernikahan bahagia.',
    colors: [
      { color: 'Merah Muda (Blush Pink)', meaning: 'Keindahan feminin, asmara bahagia, pemalu, kemuliaan.', hex: '#FFB5C2' },
      { color: 'Putih (White)', meaning: 'Sosok anggun, kesederhanaan mewah, kemurnian berkelas tinggi.', hex: '#FFF5F6' },
      { color: 'Merah Tua (Burgundy)', meaning: 'Kemakmuran melimpah, kekayaan, rasa hormat yang mendalam.', hex: '#9E2A2B' }
    ],
    careTips: [
      'Saat membeli tipe kuncup sebesar bola golf, bilas kuncup perlahan di air hangat hangat kuku jika ingin mekar cepat.',
      'Peony menyukai vas lebar dan banyak air bersih sejuk.',
      'Potong batang bawah setiap 2 hari sekali untuk mempertahankan kesegaran.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?q=80&w=600&auto=format&fit=crop',
    season: 'Akhir Musim Semi (Late Spring)'
  }
];
