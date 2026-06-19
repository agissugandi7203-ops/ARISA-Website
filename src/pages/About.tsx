import { useRef } from 'react';
import { motion } from 'framer-motion';
import { School, MapPin, GraduationCap, Mail, Phone } from 'lucide-react';
import SDGSection from '../sections/SDGSection';
import FAQ from '../sections/FAQ';
import FutureWork from '../sections/FutureWork';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeInOut' as const }
  }
};

interface TeamMember {
  name: string;
  role: string;
  subtitle: string;
  image: string;
  details: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: "Arief Fajar",
    role: "Lead Researcher & AI Developer",
    subtitle: "Kelas 11 - Rekayasa Perangkat Lunak",
    image: "/assets/team/arief.webp",
    details: [
      "Pengembangan model AI (U-Net, EfficientNet)",
      "Arsitektur sistem Edge-AI",
      "Antarmuka aplikasi Flutter",
      "Integrasi TFLite & Raspberry Pi",
    ],
  },
  {
    name: "Reza Arrofi",
    role: "Hardware Engineer & Field Tester",
    subtitle: "Anggota Tim ARISA-CHAN",
    image: "/assets/team/reza.webp",
    details: [
      "Perakitan perangkat keras ARISA",
      "Pengujian lapangan di sawah mitra",
      "Akuisisi data citra daun padi",
      "Uji ketahanan & stabilitas sistem",
    ],
  },
  {
    name: "Muhammad Taufiq Azhari",
    role: "Pembimbing Penelitian",
    subtitle: "Guru - SMK Marhas Margahayu",
    image: "/assets/team/taufiq.webp",
    details: [
      "Supervisi metodologi penelitian",
      "Bimbingan teknis & akademis",
      "Koordinasi dengan pihak sekolah",
      "Validasi arah riset",
    ],
  },
];

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-background text-foreground overflow-x-hidden relative"
    >
      {/* Hero */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center z-10">
        {/* Video Background (absolute, z-0) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden scale-[1.08] origin-center pointer-events-none">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 1.25;
            }}
          />
          <div className="absolute inset-0 bg-black/60 z-[1]" />
        </div>

        <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-body text-white/50 text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 block"
          >
            Tim Peneliti
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-display text-white text-5xl md:text-8xl leading-none tracking-tighter"
            style={{ textShadow: '0 5px 30px rgba(0,0,0,0.5)' }}
          >
            Tentang Kami
          </motion.h1>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <span className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-foreground/70 mb-4 block">
              Research Team
            </span>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-4">
              Di Balik <span className="italic">ARISA</span>
            </h2>
            <p className="font-prose text-foreground/70 max-w-xl mx-auto italic text-sm md:text-base">
              Tim ARISA-CHAN dari SMK Marhas Margahayu, Kabupaten Bandung. Siswa peneliti muda yang berkomitmen pada inovasi pertanian.
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group"
              >
                <div className="rounded-2xl border border-foreground/10 overflow-hidden hover:border-foreground/20 transition-all duration-500">
                  {/* Photo */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-foreground/5">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-2xl md:text-3xl text-white">{member.name}</h3>
                      <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-1">{member.role}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <p className="font-body text-xs text-foreground/70 mb-4">{member.subtitle}</p>
                    <ul className="space-y-2">
                      {member.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 mt-1.5 flex-shrink-0" />
                          <span className="font-body text-xs text-foreground/70">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Profile */}
      <section className="py-24 md:py-32 bg-muted/50 text-foreground border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-kaleo-terracotta mb-4 block">
                Basis Penelitian
              </span>
              <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-6">
                SMK Marhas <span className="italic">Margahayu</span>
              </h2>
              <p className="font-prose text-muted-foreground text-sm md:text-base leading-[1.85] italic mb-8">
                Sekolah Menengah Kejuruan swasta di Kabupaten Bandung yang menjadi basis pengembangan ARISA. 
                Berlokasi strategis dekat kawasan pertanian aktif Kecamatan Margaasih, memudahkan akses langsung ke lahan uji dan mitra petani.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
                    <School className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-body text-xs text-muted-foreground block">NPSN</span>
                    <span className="font-body text-sm">20259586</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-body text-xs text-muted-foreground block">Alamat</span>
                    <span className="font-body text-sm">Jl. Ters. Kopo No. 385/299, Kec. Margahayu, Kab. Bandung</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-body text-xs text-muted-foreground block">Email</span>
                    <span className="font-body text-sm">smkmarhasmargahayu2004@gmail.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-body text-xs text-muted-foreground block">Telepon</span>
                    <span className="font-body text-sm">54419331</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 border border-border flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="font-body text-xs text-muted-foreground block">Bidang Lomba</span>
                    <span className="font-body text-sm">Fisika Terapan & Rekayasa - Sistem Pengukuran & Monitoring Cerdas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Competition Info Card */}
            <div className="rounded-2xl border border-border p-8 bg-background">
              <span className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-kaleo-terracotta mb-6 block">
                Status Kompetisi
              </span>
              
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-kaleo-terracotta" />
                  <span className="font-body text-sm font-medium">Lolos Seleksi Proposal</span>
                </div>
                <p className="font-body text-xs text-muted-foreground">OPSI SMA/MA/SMK 2026 - Tahap Nasional</p>
              </div>

              <div className="space-y-4 border-t border-border pt-6">
                <div>
                  <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Nama Tim</span>
                  <span className="font-body text-sm">ARISA-CHAN</span>
                </div>
                <div>
                  <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Kode Pendaftaran</span>
                  <span className="font-body text-xs text-muted-foreground break-all tracking-wider">OPSISMA2026-&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
                </div>
                <div>
                  <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Judul Penelitian</span>
                  <span className="font-body text-xs text-foreground/70 leading-relaxed">
                    ARISA (Agronomic Risk Intelligence System for Agriculture): Sistem Monitoring Penyakit Padi Berbasis Edge-AI dan Indeks Risiko Agronomi untuk Evaluasi Efektivitas Metode Pemantauan Manual oleh Petani
                  </span>
                </div>
              </div>

              {/* Reviewer feedback */}
              <div className="mt-6 rounded-xl bg-muted/50 p-5 border border-border">
                <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Catatan Tim Reviu OPSI</span>
                <p className="font-prose text-xs text-muted-foreground leading-relaxed italic">
                  "Pendahuluan sudah ditulis dengan baik dan jelas. Landasan teori dan studi pustaka menggunakan rujukan yang mutakhir. 
                  Metode Penelitian sudah ditulis dengan baik dan sistematis."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDGs Section */}
      <SDGSection />

      {/* FAQ Section */}
      <FAQ />

      {/* Future Work Section */}
      <FutureWork />

      {/* Final Quote */}
      <section className="py-24 md:py-32 bg-muted/50 text-foreground border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-prose text-xl md:text-3xl leading-[1.7] text-foreground/70 italic">
            "Penelitian ini berangkat dari keresahan nyata di lapangan dan bermuara pada solusi yang bisa dirasakan langsung oleh petani."
          </h2>
          <div className="w-12 md:w-16 h-px bg-border mx-auto" />
          <p className="font-body uppercase tracking-[0.2em] text-[10px] md:text-xs text-muted-foreground">
            Tim ARISA-CHAN - SMK Marhas Margahayu, 2026
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
