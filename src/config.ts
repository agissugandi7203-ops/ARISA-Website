// Site-wide configuration
export interface SiteConfig {
  language: string;
  siteName: string;
  siteDescription: string;
}

export const siteConfig: SiteConfig = {
  language: "id",
  siteName: "ARISA",
  siteDescription: "Sistem kecerdasan buatan komputasi tepi untuk pemantauan agronomi presisi",
};

// Hero Section
export interface HeroConfig {
  backgroundImage: string;
  backgroundAlt: string;
  title: string;
  subtitle: string;
}

export const heroConfig: HeroConfig = {
  backgroundImage: "/hero-home.webp",
  backgroundAlt: "Lahan persawahan hijau asri tempat penelitian agronomi ARISA dijalankan",
  title: "ARISA",
  subtitle: "PRECISION AGRONOMY INTELLIGENCE",
};

// Narrative Text Section
export interface NarrativeTextConfig {
  line1: string;
  line2: string;
  line3: string;
}

export const narrativeTextConfig: NarrativeTextConfig = {
  line1: "Teknologi komputasi tepi",
  line2: "untuk pemantauan tanaman yang lebih cerdas.",
  line3: "EDGE COMPUTING. PRECISION DETECTION. SUSTAINABLE AGRONOMY.",
};

// ZigZag Grid Section
export interface ZigZagGridItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse: boolean;
}

export interface ZigZagGridConfig {
  sectionLabel: string;
  sectionTitle: string;
  items: ZigZagGridItem[];
}

export const zigZagGridConfig: ZigZagGridConfig = {
  sectionLabel: "INNOVATION PILLARS",
  sectionTitle: "Pilar Inovasi ARISA",
  items: [
    {
      id: "pemantauan",
      title: "Pemantauan Berkelanjutan",
      subtitle: "EDGE-AI SYSTEM",
      description: "Seluruh pemrosesan AI berjalan langsung di perangkat Raspberry Pi tanpa koneksi internet. Kondisi daun padi dipindai dan dianalisis secara real-time di lokasi lahan.",
      image: "/science/rpi-field.webp",
      imageAlt: "Sistem Edge-AI di lahan pertanian",
      reverse: false,
    },
    {
      id: "analisis",
      title: "Analisis Presisi",
      subtitle: "DEEP LEARNING",
      description: "Model U-Net dan EfficientNet mengidentifikasi area daun yang sehat dan terinfeksi hingga tingkat piksel. Deteksi dini membantu mencegah penurunan hasil panen.",
      image: "/science/ai-segmentation.webp",
      imageAlt: "Pemrosesan citra digital tanaman padi",
      reverse: true,
    },
    {
      id: "risiko",
      title: "Indeks Risiko Agronomi",
      subtitle: "SCIENTIFIC INTEGRATION",
      description: "Hasil segmentasi citra diolah menjadi Disease Severity Index (DSI), sebuah skor kuantitatif yang membantu petani memahami tingkat keparahan penyakit tanaman.",
      image: "/science/leaf-mild.webp",
      imageAlt: "Visualisasi data indeks risiko agronomi",
      reverse: false,
    },
    {
      id: "aksesibilitas",
      title: "Akses untuk Semua",
      subtitle: "INCLUSIVE TECHNOLOGY",
      description: "Informasi teknis diterjemahkan ke dalam indikator warna sederhana (Hijau/Kuning/Merah) yang mudah dipahami oleh petani tanpa latar belakang teknologi.",
      image: "/science/farmer-testing.webp",
      imageAlt: "Antarmuka sederhana untuk petani",
      reverse: true,
    },
  ],
};

// Breath Section
export interface BreathSectionConfig {
  backgroundImage: string;
  backgroundAlt: string;
  title: string;
  subtitle: string;
  description: string;
}

export const breathSectionConfig: BreathSectionConfig = {
  backgroundImage: "/breath-bg.webp",
  backgroundAlt: "Panorama persawahan dan pegunungan",
  title: "Harmoni",
  subtitle: "NATURE & TECHNOLOGY",
  description: "ARISA menggabungkan teknologi komputasi tepi dengan ilmu agronomi untuk mendukung pemantauan tanaman yang lebih akurat, efisien, dan dapat diakses langsung oleh petani di lapangan.",
};

// Card Stack Section
export interface CardStackItem {
  id: number;
  image: string;
  title: string;
  description: string;
  rotation: number;
}

export interface CardStackConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  cards: CardStackItem[];
}

export const cardStackConfig: CardStackConfig = {
  sectionTitle: "Esensi Sistem",
  sectionSubtitle: "ENGINEERED FOR THE FIELD",
  cards: [
    {
      id: 1,
      image: "/craft-hardware.webp",
      title: "Perangkat Tangguh",
      description: "Casing IP65 tahan air dan debu melindungi unit komputasi di kondisi lapangan. Sistem pendingin aktif menjaga suhu operasi tetap stabil sepanjang hari.",
      rotation: -2,
    },
    {
      id: 2,
      image: "/craft-algorithm.webp",
      title: "Kecerdasan Mandiri",
      description: "Model deep learning dilatih untuk mengenali pola penyakit dan kondisi agronomis pada daun padi dengan tingkat akurasi yang konsisten dan terukur.",
      rotation: 1,
    },
    {
      id: 3,
      image: "/craft-vision.webp",
      title: "Antarmuka Sederhana",
      description: "Hasil analisis AI ditampilkan dalam format visual yang mudah dipahami. Petani mendapat rekomendasi tindakan langsung tanpa perlu memahami teknologi di baliknya.",
      rotation: -1,
    },
  ],
};

// Footer Section
export interface FooterContactItem {
  type: "email" | "phone";
  label: string;
  value: string;
  href: string;
}

export interface FooterSocialItem {
  platform: string;
  href: string;
}

export interface FooterConfig {
  heading: string;
  description: string;
  ctaText: string;
  contact: FooterContactItem[];
  locationLabel: string;
  address: string[];
  socialLabel: string;
  socials: FooterSocialItem[];
  logoText: string;
  copyright: string;
  links: { label: string; href: string }[];
  schoolName: string;
  tagline: string;
}

export const footerConfig: FooterConfig = {
  heading: "Hubungi Kami",
  description: "ARISA dikembangkan oleh tim peneliti SMK Marhas Margahayu, Kabupaten Bandung. Jika Anda tertarik untuk berkolaborasi atau ingin mengetahui lebih lanjut tentang penelitian ini, silakan hubungi kami.",
  ctaText: "Hubungi Peneliti",
  contact: [
    {
      type: "email",
      label: "arisachan2026@gmail.com",
      value: "arisachan2026@gmail.com",
      href: "mailto:arisachan2026@gmail.com",
    },
    {
      type: "phone",
      label: "+62-881-4554-581",
      value: "+62-881-4554-581",
      href: "tel:+628814554581",
    },
  ],
  locationLabel: "Research Base",
  address: ["SMK Marhas Margahayu", "Kabupaten Bandung, Jawa Barat"],
  socialLabel: "Follow Us",
  socials: [
    {
      platform: "instagram",
      href: "https://www.instagram.com/arisachan.agritech",
    },
    {
      platform: "github",
      href: "https://github.com/arisa-opsi",
    },
  ],
  logoText: "ARISA",
  copyright: "© 2026 ARISA - SMK Marhas Margahayu. All rights reserved.",
  links: [
    { label: "Research Base", href: "/research" },
    { label: "Methodology", href: "/methodology" },
    { label: "Field Test", href: "/field-test" },
    { label: "About Us", href: "/about" },
  ],
  schoolName: "SMK Marhas Margahayu",
  tagline: "Precision Agronomy Intelligence",
};

// GCS Buckets & Downloads Configuration
export interface GCSConfig {
  bucketName: string;
  baseUrl: string;
  datasets: {
    agroGuard19k: string;
    stageEnriched: string;
    segmentation: string;
    rawSegmentation: string;
  };
  models: {
    unet: string;
    stageClassifier: string;
    diseaseClassifier: string;
  };
  releases: {
    apk: string;
    sourceZip: string;
  };
}

export const gcsConfig: GCSConfig = {
  bucketName: "arisa-opsi-bucket-2026",
  baseUrl: "https://storage.googleapis.com/arisa-opsi-bucket-2026",
  datasets: {
    agroGuard19k: "https://storage.googleapis.com/arisa-opsi-bucket-2026/dataset/AgroGuard-19K-Dataset.zip",
    stageEnriched: "https://storage.googleapis.com/arisa-opsi-bucket-2026/dataset/DataSet-Vegetasi-Enriched.zip",
    segmentation: "https://storage.googleapis.com/arisa-opsi-bucket-2026/dataset/arisa_segmentation_dataset.zip",
    rawSegmentation: "https://storage.googleapis.com/arisa-opsi-bucket-2026/dataset/RiceLeafDisease-Dataset.zip",
  },
  models: {
    unet: "https://storage.googleapis.com/arisa-opsi-bucket-2026/models-raw/arisa_unet_best.h5",
    stageClassifier: "https://storage.googleapis.com/arisa-opsi-bucket-2026/models-raw/arisa_classifier_best.h5",
    diseaseClassifier: "https://storage.googleapis.com/arisa-opsi-bucket-2026/models-raw/arisa_disease_best.h5",
  },
  releases: {
    apk: "https://storage.googleapis.com/arisa-opsi-bucket-2026/releases/ARISA-Mobile-Client.apk",
    sourceZip: "https://storage.googleapis.com/arisa-opsi-bucket-2026/releases/mobile_app.zip",
  },
};

