import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  X, 
  Cpu,
  Database,
  Smartphone
} from 'lucide-react';
import { gcsConfig } from '../config';

// TS Interfaces
interface SpecRow {
  model: string;
  objective: string;
  input: string;
  params: string;
  size: string;
  metric: string;
  tfliteUrl: string;
  rawUrl: string;
}

interface PathologyItem {
  id: string;
  name: string;
  pathogen: string;
  symptoms: string;
  vector: string;
  treatments: string;
  image: string;
  type: string;
}

// Data Sets definition
const SPEC_ROWS: SpecRow[] = [
  {
    model: "Attention U-Net",
    objective: "Segmentasi piksel lesi mikro penyakit daun padi",
    input: "256x256x3 RGB",
    params: "7,848,321",
    size: "7.66 MB (FP32: 85.7MB)",
    metric: "Dice / mIoU: 0.938",
    tfliteUrl: "/checkpoints/arisa_unet_quantized.tflite",
    rawUrl: gcsConfig.models.unet
  },
  {
    model: "EfficientNet-B0 Stage",
    objective: "Klasifikasi 4 fase pertumbuhan utama tanaman padi",
    input: "224x224x3 RGB",
    params: "4,049,564",
    size: "4.95 MB (FP32: 27.6MB)",
    metric: "Accuracy: 98.7%",
    tfliteUrl: "/checkpoints/arisa_classifier_quantized.tflite",
    rawUrl: gcsConfig.models.stageClassifier
  },
  {
    model: "AgroGuard-19K Classifier",
    objective: "Klasifikasi 7 kelas hama dan penyakit padi lokal",
    input: "224x224x3 RGB",
    params: "4,057,255",
    size: "4.96 MB (FP32: 49.1MB)",
    metric: "Accuracy: 96.4%",
    tfliteUrl: "/checkpoints/arisa_disease_quantized.tflite",
    rawUrl: gcsConfig.models.diseaseClassifier
  }
];

const PATHOLOGY_ITEMS: PathologyItem[] = [
  {
    id: "path-blast",
    name: "Blas Daun (Leaf Blast)",
    pathogen: "Pyricularia oryzae",
    symptoms: "Lesi berbentuk belah ketupat (spindle-shaped) lebar di tengah dengan ujung meruncing, pusat berwarna abu-abu atau keputihan dan tepi cokelat gelap.",
    vector: "Kelembapan udara tinggi (>90%), suhu malam hangat (24-28°C), serta pemupukan Nitrogen berlebih yang memperlunak dinding sel daun.",
    treatments: "Aplikasi fungisida Trisiklazol atau Difenokonazol. Kurangi pemupukan Nitrogen (Urea), lakukan penyiangan gulma inang, dan jalankan irigasi berkala.",
    image: "/science/dataset-blast.jpg",
    type: "Fungal Infection"
  },
  {
    id: "path-tungro",
    name: "Penyakit Virus Tungro",
    pathogen: "RTBV & RTSV Virus Complex",
    symptoms: "Daun mengalami klorosis menguning hingga oranye jingga dari ujung daun tua ke pangkal. Pertumbuhan rumpun padi sangat kerdil dengan anakan berkurang.",
    vector: "Ditularkan secara semi-persisten oleh hama Wereng Hijau (Nephotettix virescens) yang menusuk dan mengisap cairan pelepah padi.",
    treatments: "Eradikasi (cabut dan bakar) rumpun sakit. Kendalikan populasi wereng hijau dengan insektisida sistemik Imidakloprid dan serentakkan waktu tanam.",
    image: "/science/dataset-tungro.jpg",
    type: "Viral Complex"
  },
  {
    id: "path-scald",
    name: "Hawar Daun (Leaf Scald)",
    pathogen: "Microdochium oryzae (Gerlachia oryzae)",
    symptoms: "Bercak basah bergelombang mulai dari tepi atau ujung daun, berkembang menjadi pola pita melingkar konsentris cokelat muda kemerahan dan mengering abu-abu.",
    vector: "Tingginya gesekan fisis antardaun akibat angin kencang disertai hujan lebat, kondisi lahan lahan lembap, serta jarak tanam terlalu rapat.",
    treatments: "Gunakan fungisida berbahan aktif Tembaga Hidroksida. Pastikan kecukupan unsur Kalium (K) tanah dan hindari pemotongan ujung bibit saat pindah tanam.",
    image: "/science/dataset-scald.jpg",
    type: "Bacterial & Fungal Blight"
  }
];

export default function Docs() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string | null>(null);

  // Smooth scroll to element and set active section
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check URL query params for target section on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secParam = params.get('sec');
    if (secParam) {
      setTimeout(() => {
        scrollToSection(secParam);
      }, 500);
    }
  }, []);

  // Set up intersection observer to highlight sidebar on scroll
  useEffect(() => {
    const sections = ['intro', 'registry', 'iari', 'pathology', 'benchmarks', 'varieties', 'downloads'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      }, { threshold: 0.2, rootMargin: '-10% 0px -60% 0px' });
      
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(item => {
        if (item) item.observer.unobserve(item.el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden flex flex-col transition-colors duration-500">
      
      {/* Lightbox Modal for Plots / Images */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-neutral-900 border border-white/5 rounded-3xl p-6 shadow-2xl text-white"
            >
              <button 
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-xl tracking-wide border-b border-white/5 pb-3 pr-10">
                  {lightboxTitle}
                </h3>
                <div className="flex items-center justify-center overflow-hidden bg-black/45 rounded-2xl p-2 max-h-[70vh]">
                  <img 
                    src={lightboxImg} 
                    alt={lightboxTitle || "Expanded plot"} 
                    className="object-contain max-h-[65vh] w-auto rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Header Section */}
      <div className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden border-b border-foreground/10">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Dark overlay to ensure contrast against background video */}
        <div className="absolute inset-0 bg-black/65 z-[1] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <span className="font-body text-white/50 text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 block">
            ARISA KNOWLEDGE BASE
          </span>
          <h1 className="font-display text-white text-5xl md:text-8xl leading-none tracking-tighter">
            {lang === 'id' ? "Dokumentasi & Arsitektur AI" : "AI Documentation & Architecture"}
          </h1>
          <p className="font-prose text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed mt-6 italic">
            {lang === 'id' 
              ? "Panduan referensi teknis lengkap mengenai spesifikasi model, formulasi matematis IARI, gejala patologi tanaman padi, latensi hardware, dan unduhan berkas biner."
              : "Comprehensive technical reference regarding model specifications, IARI mathematical formulation, rice leaf pathologies, hardware latency, and binary downloads."
            }
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex-grow flex flex-col lg:flex-row gap-12 pb-24">
        
        {/* Left Sticky Sidebar Navigation */}
        <aside className="lg:w-60 shrink-0 lg:sticky lg:top-32 h-fit flex flex-col gap-6 z-10">
          <div className="flex flex-col gap-1.5 pb-4 border-b border-foreground/10">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#A8644A] dark:text-[#BF785B] font-bold">
              CONTENTS
            </span>
            <h2 className="font-display text-lg font-normal text-foreground">
              Sistem ARISA
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 font-mono text-xs tracking-wider">
            {[
              { id: 'intro', labelId: '1. Pendahuluan', labelEn: '1. Introduction' },
              { id: 'registry', labelId: '2. Register Model', labelEn: '2. Model Specs' },
              { id: 'iari', labelId: '3. Formulasi IARI', labelEn: '3. IARI Formula' },
              { id: 'pathology', labelId: '4. Matriks Gejala', labelEn: '4. Pathology Matrix' },
              { id: 'benchmarks', labelId: '5. Latensi Hardware', labelEn: '5. Benchmarks' },
              { id: 'varieties', labelId: '6. Varietas Padi', labelEn: '6. Varieties' },
              { id: 'downloads', labelId: '7. Pusat Unduhan', labelEn: '7. Downloads' }
            ].map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center py-2.5 text-left transition-all duration-300 relative group w-full ${
                    isActive 
                      ? 'text-[#A8644A] dark:text-[#BF785B] font-semibold border-l border-[#A8644A] dark:border-[#BF785B] pl-4 -ml-[1px]' 
                      : 'text-foreground/60 hover:text-foreground pl-4 border-l border-foreground/5'
                  }`}
                >
                  <span>{lang === 'id' ? section.labelId : section.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Selector in Sidebar */}
          <div className="flex border-t border-foreground/10 pt-4 gap-4 items-center font-mono text-xs">
            <button 
              onClick={() => setLang('id')}
              className={`transition-colors duration-300 font-semibold ${
                lang === 'id' 
                  ? 'text-[#A8644A] dark:text-[#BF785B]' 
                  : 'text-foreground/40 hover:text-foreground'
              }`}
            >
              ID
            </button>
            <span className="text-foreground/20">|</span>
            <button 
              onClick={() => setLang('en')}
              className={`transition-colors duration-300 font-semibold ${
                lang === 'en' 
                  ? 'text-[#A8644A] dark:text-[#BF785B]' 
                  : 'text-foreground/40 hover:text-foreground'
              }`}
            >
              EN
            </button>
          </div>
        </aside>

        {/* Right Content Pane - Spacious, premium layout */}
        <main className="flex-grow lg:pl-12 border-t lg:border-t-0 lg:border-l border-foreground/10 pt-12 lg:pt-0 space-y-24">
          
          {/* SECTION 1: INTRODUCTION */}
          <section id="intro" className="scroll-mt-32 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8644A] dark:text-[#BF785B] font-bold block">
                01 / OVERVIEW
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-foreground leading-tight">
                {lang === 'id' ? "Sistem Informasi & Arsitektur AI" : "System Information & AI Architecture"}
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {lang === 'id'
                ? "ARISA (Agronomic Risk Intelligence System for Agriculture) dirancang sebagai sistem Edge-AI mandiri untuk mendeteksi penyakit daun padi secara offline. Integrasi deep learning pada perangkat hemat daya (seperti Raspberry Pi) memungkinkan petani di wilayah pelosok memonitor kesehatan tanaman tanpa bergantung pada jaringan internet."
                : "ARISA (Agronomic Risk Intelligence System for Agriculture) is engineered as an autonomous Edge-AI system for offline rice leaf pathology diagnostics. Integrating optimized deep learning models on resource-constrained micro-units (such as Raspberry Pi) allows rural farmers to monitor crop health locally and instantaneously."
              }
            </p>
            
            <div className="border-l-2 border-[#A8644A] dark:border-[#BF785B] pl-6 py-1 space-y-2 text-sm font-light leading-relaxed">
              <span className="font-semibold text-foreground block">{lang === 'id' ? "Konsep Pipeline Tiga Tahap" : "Modular Three-Stage Pipeline Concept"}</span>
              <p className="text-foreground/70">
                {lang === 'id'
                  ? "Pemrosesan berjalan secara sekuensial: Pertama, model Attention U-Net memisahkan masker piksel lesi daun. Kedua, model klasifikasi fase tumbuh mendiagnosis fase fisiologis tanaman. Ketiga, model klasifikasi penyakit mendeteksi jenis infeksi patologis."
                  : "Processing runs sequentially: First, the Attention U-Net model segments leaf lesion pixel masks. Second, the physiological growth stage model assesses plant age. Third, the pathology classification model diagnoses the specific type of crop disease."
                }
              </p>
            </div>
          </section>

          {/* SECTION 2: MODEL REGISTRY */}
          <section id="registry" className="scroll-mt-32 space-y-6 pt-4 border-t border-foreground/5">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8644A] dark:text-[#BF785B] font-bold block">
                02 / EMBEDDED MODELS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground">
                {lang === 'id' ? "Daftar & Spesifikasi Model AI" : "Model Specification Sheet"}
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {lang === 'id'
                ? "Spesifikasi model neural network terkompresi yang dioptimasi menggunakan Post-Training Quantization (PTQ) menjadi format INT8. Hal ini menurunkan beban memori RAM secara signifikan tanpa mengurangi akurasi fisis secara berarti."
                : "Granular parameters of our compressed neural networks optimized via Post-Training Quantization (PTQ) into INT8 formats. This dramatically minimizes RAM footprints while preserving diagnostic precision."
              }
            </p>

            {/* Model Spec Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20 text-foreground/50 uppercase tracking-widest text-[9px] h-12">
                    <th className="font-semibold pb-3 pr-4">{lang === 'id' ? "Nama Model" : "Model Name"}</th>
                    <th className="font-semibold pb-3 px-4">Input Size</th>
                    <th className="font-semibold pb-3 px-4">Params</th>
                    <th className="font-semibold pb-3 px-4">{lang === 'id' ? "Ukuran File (INT8)" : "Quant Size (INT8)"}</th>
                    <th className="font-semibold pb-3 px-4">{lang === 'id' ? "Metrik Utama" : "Primary Metric"}</th>
                    <th className="font-semibold pb-3 text-right">{lang === 'id' ? "Unduhan" : "Download"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5 text-foreground/80">
                  {SPEC_ROWS.map((row, idx) => (
                    <tr key={idx} className="h-16 hover:bg-foreground/5 transition-colors duration-300">
                      <td className="pr-4 py-3">
                        <div className="font-display text-base font-semibold text-foreground">{row.model}</div>
                        <div className="text-[9px] text-[#A8644A] dark:text-[#BF785B] font-mono mt-0.5 uppercase tracking-wider">
                          {idx === 0 ? "Segmentation" : "Classification"}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{row.input}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.params}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[#A8644A] dark:text-[#BF785B]">{row.size}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.metric}</td>
                      <td className="py-3 text-right">
                        <a 
                          href={row.tfliteUrl} 
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-semibold bg-[#A8644A] hover:bg-[#8D523A] dark:bg-[#BF785B] dark:hover:bg-[#A35E42] text-white transition-all duration-300 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>.tflite</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 3: CROP HEALTH INDEX (IARI) */}
          <section id="iari" className="scroll-mt-32 space-y-6 pt-4 border-t border-foreground/5">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8644A] dark:text-[#BF785B] font-bold block">
                03 / MATHEMATICAL FORMULATION
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground">
                {lang === 'id' ? "Indeks Kesehatan Tanaman (IARI)" : "ARISA Crop Health Index (IARI)"}
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {lang === 'id'
                ? "Formula IARI dirancang untuk mengintegrasikan persentase luas lesi visual (L_a) hasil keluaran Attention U-Net dengan koefisien penalti fase pertumbuhan tanaman (γ). Kerusakan daun bendera pada fase generatif dan pemasakan mendapat bobot penalti lebih besar karena berdampak krusial terhadap produktivitas bulir."
                : "The IARI formula integrates visual lesion percentages (L_a) segmented by the U-Net model with a dynamic growth stage penalty coefficient (γ). Leaf damage during generative or ripening phases triggers heavier index drops since flag-leaf anomalies directly stunt grain-filling and final yield."
              }
            </p>

            {/* Editorial Equation Box */}
            <div className="relative py-12 px-6 border border-foreground/15 rounded-2xl flex flex-col items-center justify-center bg-foreground/[0.02]">
              <div className="font-display text-3xl sm:text-4xl text-center text-foreground tracking-wide font-light select-none">
                <span className="text-[#A8644A] dark:text-[#BF785B] font-normal">IARI</span> = 100 × ( 1.0 − <span className="inline-block border-b border-foreground px-1.5 text-center align-middle"><span className="block pb-0.5 font-mono text-base italic">L<sub>a</sub></span><span className="block pt-0.5 font-mono text-xs italic">A<sub>t</sub></span></span> ) × <span className="font-mono text-xl italic font-normal text-[#A8644A] dark:text-[#BF785B]">γ</span>
              </div>
            </div>

            {/* Dynamic Stage Coeff. Grid */}
            <div className="space-y-4 pt-2">
              <h4 className="font-display text-lg font-normal text-foreground flex items-center gap-2">
                {lang === 'id' ? "Bobot Koefisien Skala Fase (γ)" : "Stage Scaling Coefficients (γ)"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs text-foreground/85 border-t border-foreground/10 pt-6">
                {[
                  {
                    num: "01",
                    titleId: "Vegetatif",
                    titleEn: "Vegetative",
                    coeff: "γ = 1.00",
                    descId: "Kapasitas fotosintesis nominal daun untuk pertumbuhan dasar tanaman.",
                    descEn: "Nominal leaf photosynthetic capacity for foundational plant development."
                  },
                  {
                    num: "02",
                    titleId: "Generatif",
                    titleEn: "Generative",
                    coeff: "γ = 0.85",
                    descId: "Inisiasi malai dan pembungaan. Daun bendera rentan terhadap patogen.",
                    descEn: "Panicle initiation and flowering. Flag leaf is vulnerable to pathogens."
                  },
                  {
                    num: "03",
                    titleId: "Pemasakan",
                    titleEn: "Ripening",
                    coeff: "γ = 0.70",
                    descId: "Pengisian bulir bulir padi, fase kritis penentu kualitas produktivitas hasil.",
                    descEn: "Grain-filling process, a critical phase determining yield productivity."
                  }
                ].map((stage, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <span className="font-mono text-[9px] text-[#A8644A] dark:text-[#BF785B] tracking-wider uppercase font-bold block">
                      {stage.num} / {lang === 'id' ? stage.titleId : stage.titleEn}
                    </span>
                    <span className="text-xl font-bold font-mono text-foreground block">
                      {stage.coeff}
                    </span>
                    <p className="text-[12px] font-normal leading-relaxed text-foreground/70">
                      {lang === 'id' ? stage.descId : stage.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: PATHOLOGY MATRIX */}
          <section id="pathology" className="scroll-mt-32 space-y-6 pt-4 border-t border-foreground/5">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8644A] dark:text-[#BF785B] font-bold block">
                04 / PATHOLOGY DICTIONARY
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground">
                {lang === 'id' ? "Matriks Gejala & Epidemiologi Daun" : "Leaf Symptoms & Pathology Matrix"}
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {lang === 'id'
                ? "Daftar visual penyakit tanaman padi lokal yang diintegrasikan langsung pada dataset AgroGuard-19K. Gambar di bawah ini diambil langsung dari dataset primer penelitian."
                : "Macroscopic catalog of primary local rice leaf anomalies mapped in the AgroGuard-19K dataset. Images below are sample inputs extracted directly from our database."
              }
            </p>

            {/* Editorial Grid with Dataset Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pt-2">
              {PATHOLOGY_ITEMS.map((item) => (
                <div 
                  key={item.id}
                  className="flex flex-col gap-4 pb-6 border-b border-foreground/10"
                >
                  <div 
                    onClick={() => {
                      setLightboxImg(item.image);
                      setLightboxTitle(item.name);
                    }}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5 border border-foreground/10 cursor-zoom-in"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="object-cover w-full h-full filter brightness-90 hover:brightness-95 transition-all duration-505"
                    />
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    <span className="font-mono text-[9px] tracking-widest text-[#A8644A] dark:text-[#BF785B] uppercase font-bold">
                      {item.type}
                    </span>
                    <h3 className="font-display text-xl text-foreground font-normal leading-tight">
                      {item.name}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-foreground/10 text-xs sm:text-sm font-normal text-foreground/80">
                    <div className="flex justify-between items-baseline border-b border-foreground/10 pb-2">
                      <span className="text-foreground/55 font-light">{lang === 'id' ? "Patogen" : "Pathogen"}</span>
                      <span className="font-mono text-[#A8644A] dark:text-[#BF785B] italic font-semibold">{item.pathogen}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-foreground/55 font-mono text-[9px] uppercase tracking-wider block font-bold">
                        {lang === 'id' ? "Gejala Visual" : "Symptoms"}
                      </span>
                      <p className="leading-relaxed font-light text-xs sm:text-xs">
                        {item.symptoms}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-foreground/55 font-mono text-[9px] uppercase tracking-wider block font-bold">
                        {lang === 'id' ? "Pemicu Alami" : "Vector & Trigger"}
                      </span>
                      <p className="leading-relaxed font-light text-xs sm:text-xs">
                        {item.vector}
                      </p>
                    </div>
                    
                    <div className="space-y-1.5 pt-1.5 border-t border-foreground/10">
                      <span className="text-[#A8644A] dark:text-[#BF785B] font-mono text-[9px] uppercase tracking-wider block font-bold">
                        {lang === 'id' ? "Penanganan Rekomendasi" : "Agricultural treatments"}
                      </span>
                      <p className="leading-relaxed font-normal text-xs sm:text-xs text-[#A8644A] dark:text-[#BF785B]">
                        {item.treatments}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: HARDWARE BENCHMARKS */}
          <section id="benchmarks" className="scroll-mt-32 space-y-6 pt-4 border-t border-foreground/5">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8644A] dark:text-[#BF785B] font-bold block">
                05 / HARDWARE LATENCY SPECTRA
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground">
                {lang === 'id' ? "Pengujian & Latensi Komputasi Hardware" : "Hardware Benchmarks & Performance"}
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {lang === 'id'
                ? "Hasil pengetesan fisis performa inferensi pipeline tiga tingkat ARISA secara offline di lapangan pada berbagai tipe spesifikasi komputasi prosesor."
                : "Granular physical profiling of the complete 3-stage model pipeline inference latency, RAM allocation, and processor thermal limits."
              }
            </p>

            {/* Editorial Benchmark Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-foreground/10 pt-8">
              {/* Laptop Core i7 */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline font-mono text-[9px] text-foreground/50 uppercase tracking-widest font-bold">
                  <span>CLASS 01</span>
                  <span>STATIONARY</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground font-normal">PC Laptop CPU</h3>
                  <span className="text-xs text-foreground/60 font-mono uppercase block mt-0.5">Intel Core i7-12700H</span>
                </div>
                <div className="divide-y divide-foreground/10 text-xs font-mono pt-2 text-foreground/80">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">{lang === 'id' ? "Latensi" : "Latency"}</span>
                    <span className="font-semibold text-foreground">~45 ms</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">RAM</span>
                    <span className="text-foreground">~3.2 GB (FP32)</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">{lang === 'id' ? "Suhu" : "Temp"}</span>
                    <span className="text-foreground">~42°C</span>
                  </div>
                </div>
              </div>

              {/* Rpi 4 */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline font-mono text-[9px] text-[#A8644A] dark:text-[#BF785B] uppercase tracking-widest font-bold">
                  <span>CLASS 02</span>
                  <span>EDGE UNIT</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl text-foreground font-normal">Raspberry Pi 4</h3>
                    <span className="text-[9px] font-mono text-[#A8644A] dark:text-[#BF785B] border border-[#A8644A]/30 px-1.5 py-0.5 rounded uppercase font-semibold">Primary</span>
                  </div>
                  <span className="text-xs text-foreground/60 font-mono uppercase block mt-0.5">Broadcom BCM2711 ARM</span>
                </div>
                <div className="divide-y divide-foreground/10 text-xs font-mono pt-2 text-foreground/80">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">{lang === 'id' ? "Latensi" : "Latency"}</span>
                    <span className="font-bold text-[#A8644A] dark:text-[#BF785B]">~280 ms</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">RAM</span>
                    <span className="text-[#A8644A] dark:text-[#BF785B] font-semibold">~412 MB (INT8)</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">{lang === 'id' ? "Suhu" : "Temp"}</span>
                    <span className="text-foreground">~58°C (Passive)</span>
                  </div>
                </div>
              </div>

              {/* Rpi 3 */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline font-mono text-[9px] text-foreground/50 uppercase tracking-widest font-bold">
                  <span>CLASS 03</span>
                  <span>LEGACY</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground font-normal">Raspberry Pi 3</h3>
                  <span className="text-xs text-foreground/60 font-mono uppercase block mt-0.5">Broadcom BCM2837 ARM</span>
                </div>
                <div className="divide-y divide-foreground/10 text-xs font-mono pt-2 text-foreground/80">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">{lang === 'id' ? "Latensi" : "Latency"}</span>
                    <span className="font-semibold text-foreground">~920 ms</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">RAM</span>
                    <span className="text-foreground">~424 MB (INT8)</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-foreground/55 font-light">{lang === 'id' ? "Suhu" : "Temp"}</span>
                    <span className="text-foreground">~67°C</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: VARIETIES */}
          <section id="varieties" className="scroll-mt-32 space-y-6 pt-4 border-t border-foreground/5">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8644A] dark:text-[#BF785B] font-bold block">
                06 / SPECTRUM CALIBRATION
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground">
                {lang === 'id' ? "Kompatibilitas & Kalibrasi Varietas" : "Indonesian Rice Variety Calibration"}
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {lang === 'id'
                ? "Adaptasi fisis dari kalibrasi ambang deteksi dan rona saturasi klorofil pada model neural network terhadap varietas padi lokal terkemuka di lapangan."
                : "Color and contrast offset adjustments of the neural network's visual input maps to adapt to leaf pigmentation and erectness across popular local rice cultivars."
              }
            </p>

            {/* Variety Editorial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {[
                {
                  name: "Ciherang",
                  morphology: "Hijau sedang, daun tegak, tekstur permukaan mulus.",
                  susceptibility: "Moderat terhadap Blas, peka terhadap Hawar Bakteri.",
                  calibration: "Kalibrasi warna default nominal"
                },
                {
                  name: "IR64",
                  morphology: "Hijau agak muda, helai daun tipis, ibu tulang menonjol.",
                  susceptibility: "Sangat rentan terhadap Tungro di daerah endemik.",
                  calibration: "Kompensasi refleksi cahaya tulang daun"
                },
                {
                  name: "Inpari 32",
                  morphology: "Hijau tua pekat, lebar daun lebar, postur sangat tegak.",
                  susceptibility: "Sangat tahan terhadap Hawar Bakteri strain III dan IV.",
                  calibration: "Filter tekstur penyesuai sudut kamera"
                },
                {
                  name: "Pandan Wangi",
                  morphology: "Hijau kekuningan, tekstur daun lemas, aroma pelepah khas.",
                  susceptibility: "Peka terhadap Blas Daun dan wereng hijau pemicu Tungro.",
                  calibration: "Offset rona saturation klorofil khusus"
                }
              ].map((row, idx) => (
                <div key={idx} className="pb-6 border-b border-foreground/10 flex flex-col gap-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-display text-xl text-foreground font-semibold">{row.name}</h3>
                    <span className="font-mono text-[9px] text-foreground/50 uppercase tracking-wider font-semibold">
                      {lang === 'id' ? "Kultivar Lokal" : "Local Cultivar"}
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="space-y-0.5">
                      <span className="text-foreground/55 font-mono text-[9px] uppercase tracking-wider block font-bold">{lang === 'id' ? "Morfologi Daun" : "Leaf Morphology"}</span>
                      <p className="text-foreground/80 leading-relaxed font-light">{row.morphology}</p>
                    </div>
                    
                    <div className="space-y-0.5">
                      <span className="text-foreground/55 font-mono text-[9px] uppercase tracking-wider block font-bold">{lang === 'id' ? "Kerentanan Alami" : "Natural Susceptibility"}</span>
                      <p className="text-foreground/80 leading-relaxed font-light">{row.susceptibility}</p>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs font-mono">
                      <span className="text-foreground/55 text-[9px] uppercase tracking-wider font-bold">{lang === 'id' ? "Metode Kalibrasi" : "Calibration Offset"}</span>
                      <span className="text-[#A8644A] dark:text-[#BF785B] font-semibold">{row.calibration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7: DOWNLOAD CENTER */}
          <section id="downloads" className="scroll-mt-32 space-y-8 pt-4 border-t border-foreground/5">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8644A] dark:text-[#BF785B] font-bold block">
                07 / CENTRAL REPOSITORY
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-foreground">
                {lang === 'id' ? "Pusat Unduhan Sumber Daya Penelitian" : "Scientific Repository & Download Center"}
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {lang === 'id'
                ? "Seluruh berkas model neural network (.tflite & .h5), dataset primer hasil annotasi lokal, rilis apk Android, serta proposal riset terperinci kami sajikan secara terbuka di bawah ini."
                : "Access our centralized file hub for models, primary annotated datasets, compiled mobile clients, and formal academic research documents."
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2 border-t border-foreground/10 pt-8">
              
              {/* Box 1: Models & Mobile Builds */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#A8644A] dark:text-[#BF785B] uppercase tracking-widest block font-bold">PIPELINE MODELS & CLIENTS</span>
                  <h3 className="font-display text-2xl text-foreground font-normal">{lang === 'id' ? "Model & Berkas Biner APK" : "Model Checkpoints & APK Binaries"}</h3>
                </div>

                <div className="flex flex-col divide-y divide-foreground/10 text-xs sm:text-sm">
                  {/* Item 1 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[#A8644A] dark:text-[#BF785B] shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">Android Mobile APK</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">Real-time TFLite offline diagnostics</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.releases.apk} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold bg-[#A8644A] hover:bg-[#8D523A] dark:bg-[#BF785B] dark:hover:bg-[#A35E42] text-white transition-all duration-300 shadow-xs shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>APK</span>
                    </a>
                  </div>

                  {/* Item 2 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-foreground/45 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">Attention U-Net (.h5)</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">Unquantized raw Keras model</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.models.unet} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#A8644A]/30 text-[#A8644A] dark:border-[#BF785B]/30 dark:text-[#BF785B] hover:bg-[#A8644A] hover:text-white dark:hover:bg-[#BF785B] dark:hover:text-background rounded-full font-mono text-xs font-bold transition-all duration-300 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.h5</span>
                    </a>
                  </div>

                  {/* Item 3 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-foreground/45 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">EfficientNet Classifier (.h5)</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">Unquantized physiological model</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.models.stageClassifier} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#A8644A]/30 text-[#A8644A] dark:border-[#BF785B]/30 dark:text-[#BF785B] hover:bg-[#A8644A] hover:text-white dark:hover:bg-[#BF785B] dark:hover:text-background rounded-full font-mono text-xs font-bold transition-all duration-300 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.h5</span>
                    </a>
                  </div>

                  {/* Item 4 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-foreground/45 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">AgroGuard Classifier (.h5)</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">Unquantized multi-disease model</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.models.diseaseClassifier} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#A8644A]/30 text-[#A8644A] dark:border-[#BF785B]/30 dark:text-[#BF785B] hover:bg-[#A8644A] hover:text-white dark:hover:bg-[#BF785B] dark:hover:text-background rounded-full font-mono text-xs font-bold transition-all duration-300 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.h5</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Box 2: Primary Datasets */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#A8644A] dark:text-[#BF785B] uppercase tracking-widest block font-bold">ANNOTATED ANOMALIES</span>
                  <h3 className="font-display text-2xl text-foreground font-normal">{lang === 'id' ? "Koleksi Dataset Agronomi" : "Curated Dataset Catalog"}</h3>
                </div>

                <div className="flex flex-col divide-y divide-foreground/10 text-xs sm:text-sm">
                  {/* Item 1 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-[#A8644A] dark:text-[#BF785B] shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">AgroGuard-19K Dataset</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">18.5k JPEG images | 7 classes</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.datasets.agroGuard19k} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold bg-[#A8644A] hover:bg-[#8D523A] dark:bg-[#BF785B] dark:hover:bg-[#A35E42] text-white transition-all duration-300 shadow-xs shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ZIP</span>
                    </a>
                  </div>

                  {/* Item 2 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-foreground/45 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">DataSet-Vegetasi-Enriched</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">495 local cultivar stage JPEGs</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.datasets.stageEnriched} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#A8644A]/30 text-[#A8644A] dark:border-[#BF785B]/30 dark:text-[#BF785B] hover:bg-[#A8644A] hover:text-white dark:hover:bg-[#BF785B] dark:hover:text-background rounded-full font-mono text-xs font-bold transition-all duration-300 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ZIP</span>
                    </a>
                  </div>

                  {/* Item 3 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-foreground/45 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">arisa_segmentation_dataset</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">Preprocessed NumPy array binaries (.npy)</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.datasets.segmentation} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#A8644A]/30 text-[#A8644A] dark:border-[#BF785B]/30 dark:text-[#BF785B] hover:bg-[#A8644A] hover:text-white dark:hover:bg-[#BF785B] dark:hover:text-background rounded-full font-mono text-xs font-bold transition-all duration-300 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ZIP</span>
                    </a>
                  </div>

                  {/* Item 4 */}
                  <div className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-foreground/45 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground block">RiceLeafDisease Dataset</span>
                        <span className="text-[10px] text-foreground/50 mt-0.5 block">XML annotations in Pascal VOC format</span>
                      </div>
                    </div>
                    <a 
                      href={gcsConfig.datasets.rawSegmentation} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#A8644A]/30 text-[#A8644A] dark:border-[#BF785B]/30 dark:text-[#BF785B] hover:bg-[#A8644A] hover:text-white dark:hover:bg-[#BF785B] dark:hover:text-background rounded-full font-mono text-xs font-bold transition-all duration-300 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ZIP</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
