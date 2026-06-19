import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import StatsCounter from '../sections/StatsCounter';
import ComparisonTable from '../sections/ComparisonTable';
import Testimonials from '../sections/Testimonials';
import ParallaxDepthField from '../sections/VerticalCarousel';

gsap.registerPlugin(ScrollTrigger);

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

const Story = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const imageScaleRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const revealedTextRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {

      // 2. Slow Text Reveal (Word by Word)
      if (textRevealRef.current) {
        const words = textRevealRef.current.querySelectorAll('.word');
        gsap.fromTo(words, 
          { opacity: 0.1 }, 
          {
            opacity: 1,
            stagger: 0.05,
            scrollTrigger: {
              trigger: textRevealRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: 1.5,
            }
          }
        );
      }

      // 3. Massive Image Shrink
      if (pinSectionRef.current && imageScaleRef.current && imageInnerRef.current && revealedTextRef.current) {
        const isMobile = window.innerWidth < 768;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
          }
        });

        tl.to(imageScaleRef.current, {
          width: isMobile ? '70vw' : '35vw',
          height: isMobile ? '40vh' : '65vh',
          borderRadius: '16px',
          duration: 1,
          ease: "power2.inOut"
        });

        tl.to(imageInnerRef.current, {
          scale: 1,
          duration: 1,
          ease: "power2.inOut"
        }, "<"); 

        tl.to(revealedTextRef.current, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.3");
      }

      // 4. Timeline Animation
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.timeline-item');
        items.forEach((item) => {
          gsap.fromTo(item, 
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 1,
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const storyText = "ARISA dirancang untuk menjembatani kesenjangan antara pemantauan pertanian konvensional dan kebutuhan pertanian presisi di era modern. Sistem ini menyatukan pendekatan agronomi lapangan dengan teknologi Edge-AI agar petani dapat mengambil keputusan berbasis data, tanpa bergantung pada koneksi internet.";

  return (
    <motion.div 
      ref={containerRef}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-background text-foreground pt-0 overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8">
          <span className="font-body text-white/50 text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 block">
            Landasan Riset
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-display text-white text-5xl md:text-8xl leading-none tracking-tighter"
            style={{ textShadow: '0 5px 20px rgba(0,0,0,0.5)' }}
          >
            Latar Belakang
          </motion.h1>
          <p className="font-prose text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed mt-6 italic">
            ARISA dirancang untuk menjembatani kesenjangan antara pemantauan pertanian konvensional dan kebutuhan pertanian presisi di era modern.
          </p>
        </div>
      </section>

      {/* Scrub Text Reveal */}
      <section className="py-20 md:py-56 px-6 max-w-5xl mx-auto flex items-center min-h-[50vh] md:min-h-[80vh]">
        <div ref={textRevealRef} className="font-display text-2xl md:text-6xl lg:text-7xl leading-[1.2] md:leading-[1.1] tracking-tight">
          {storyText.split(' ').map((word, i) => (
            <span key={i} className="word inline-block mr-[0.2em]">{word}</span>
          ))}
        </div>
      </section>

      {/* ═══ NEW: Stats Counter Section ═══ */}
      <StatsCounter />

      {/* Philosophy Grid */}
      <section className="py-24 md:py-32 bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24 text-left md:text-center">
            <h2 className="font-display text-4xl md:text-7xl mb-6">Landasan Penelitian</h2>
            <p className="font-prose text-foreground/70 max-w-xl md:mx-auto italic">Tiga prinsip utama yang mendasari pengembangan sistem ARISA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Akurasi", desc: "Deteksi penyakit berbasis pengolahan citra dan model deep learning, menghasilkan skor kuantitatif (DSI) yang lebih konsisten dari pengamatan visual manusia." },
              { title: "Kemandirian", desc: "Seluruh pemrosesan AI berjalan secara lokal di Raspberry Pi tanpa koneksi internet. Dirancang untuk kondisi infrastruktur di pelosok pedesaan." },
              { title: "Keterjangkauan", desc: "Biaya pembuatan alat di bawah Rp 2,5 juta menggunakan komponen yang tersedia di pasaran lokal. Investasi satu kali untuk manfaat jangka panjang." }
            ].map((item, i) => (
              <div key={i} className="value-card p-8 md:p-12 border border-border bg-foreground/5 rounded-3xl hover:bg-foreground/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <span className="text-kaleo-terracotta font-display text-3xl md:text-4xl mb-6 block italic">0{i+1}</span>
                <h3 className="font-display text-2xl md:text-3xl mb-4">{item.title}</h3>
                <p className="font-prose text-foreground/70 leading-relaxed text-sm md:text-base italic">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEW: ARISA vs Manual Comparison ═══ */}
      <ComparisonTable />

      {/* Scroll-Driven Parallax Depth Field - Research Insights */}
      <ParallaxDepthField />

      {/* Image Shrink Section */}
      <section 
        ref={pinSectionRef} 
        className="relative w-full h-screen flex items-center justify-center bg-background overflow-hidden"
      >
        <div 
          ref={imageScaleRef} 
          className="w-screen h-screen overflow-hidden relative z-10"
        >
          <img 
            ref={imageInnerRef}
            src="/story-field.webp" 
            className="absolute inset-0 w-full h-full object-cover scale-[1.2]"
            alt="Process"
          />
          <div className="absolute inset-0 bg-black/25 z-[11] pointer-events-none" />
        </div>

        <div 
          ref={revealedTextRef}
          className="absolute inset-x-0 bottom-10 md:inset-0 z-0 flex flex-col md:flex-row items-center justify-around md:justify-between px-6 md:px-32 opacity-0 translate-y-10 md:translate-x-10 pointer-events-none"
        >
          <div className="w-full md:w-1/4 text-center md:text-right md:pr-12">
            <h3 className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-50 mb-2 md:mb-4">Fondasi Ilmu</h3>
            <p className="font-display text-xl md:text-3xl leading-snug">Berbasis Agronomi Presisi.</p>
          </div>
          <div className="w-full md:w-1/4 text-center md:text-left md:pl-12">
            <h3 className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-50 mb-2 md:mb-4">Pendekatan</h3>
            <p className="font-display text-xl md:text-3xl leading-snug">Berpusat pada Kebutuhan Petani.</p>
          </div>
        </div>
      </section>

      {/* Workspace Spotlight */}
      <section className="py-24 md:py-48 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img src="/science/rpi-field.webp" alt="ARISA di lapangan" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-8 md:space-y-12">
            <h2 className="font-display text-4xl md:text-7xl tracking-tighter">Teknologi <br/> Di Lahan Petani.</h2>
            <p className="font-prose text-base md:text-lg text-foreground/70 leading-[1.85] italic">
              Penelitian ini berangkat langsung dari sawah. ARISA memanfaatkan pemrosesan Edge-AI agar hasil analisis tersedia secara real-time tanpa bergantung pada koneksi internet, karena keputusan penanganan penyakit tanaman tidak bisa menunggu sinyal.
            </p>
            <div className="flex gap-8 md:gap-12 border-t border-foreground/10 pt-8 md:pt-12">
              <div>
                <span className="block text-2xl md:text-3xl font-display mb-1 md:mb-2">2</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50">Siswa Peneliti</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-display mb-1 md:mb-2">50+</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50">Sampel Uji Coba</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-display mb-1 md:mb-2">8</span>
                <span className="text-[10px] uppercase tracking-widest opacity-50">Petani Mitra</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NEW: Testimonials ═══ */}
      <Testimonials />

      {/* Chronicles Timeline */}
      <section ref={timelineRef} className="py-20 md:py-32 bg-background text-foreground border-t border-foreground/10 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-4xl md:text-7xl mb-16 md:mb-24 text-center">Fase Eksekusi</h2>
          <div className="relative border-l border-foreground/20 pl-6 md:pl-0 md:border-none space-y-16 md:space-y-24">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-foreground/20 -translate-x-1/2" />
            
            {[
              { year: "Bulan 1", title: "Persiapan & Perakitan", desc: "Observasi lapangan awal, kajian pustaka, dan perakitan prototipe ARISA menggunakan Raspberry Pi 4 dan modul kamera.", pos: "left" },
              { year: "Bulan 2 - 3", title: "Akuisisi & Anotasi Data", desc: "Pengumpulan citra daun padi di sawah mitra, anotasi segmentasi oleh 2 anotator menggunakan LabelMe/CVAT, dan pelatihan model AI.", pos: "right" },
              { year: "Bulan 4 - 5", title: "Integrasi & Pengujian", desc: "Deployment model TFLite di Raspberry Pi, pengembangan antarmuka Flutter, dan uji lapangan dengan 50 sampel serta 8 petani mitra.", pos: "left" }
            ].map((item, i) => (
              <div key={i} className="timeline-item relative flex flex-col md:flex-row justify-between items-start group">
                <div className="hidden md:block absolute left-1/2 top-2 w-3 h-3 bg-foreground rounded-full -translate-x-1/2 transition-all group-hover:scale-150" />
                <div className={`md:w-[45%] ${item.pos === 'left' ? 'md:text-right md:pr-16' : 'md:order-2 md:pl-16'}`}>
                  <span className="font-body text-foreground/70 tracking-widest text-xs uppercase">{item.year}</span>
                  <h3 className="font-display text-2xl md:text-3xl mt-1 md:mt-2">{item.title}</h3>
                </div>
                <div className={`mt-2 md:mt-0 md:w-[45%] ${item.pos === 'left' ? 'md:pl-16' : 'md:order-1 md:text-right md:pr-16'}`}>
                  <p className="font-prose text-foreground/80 leading-relaxed text-sm italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Letter */}
      <section className="py-24 md:py-48 px-6 bg-background relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-prose text-xl md:text-3xl leading-[1.7] text-foreground/80 italic">
            "Kami percaya bahwa teknologi yang baik adalah teknologi yang bisa digunakan oleh siapa saja, termasuk petani yang belum pernah menyentuh komputer."
          </h2>
          <div className="w-12 md:w-16 h-px bg-foreground/20 mx-auto" />
          <p className="font-body uppercase tracking-[0.2em] text-[10px] md:text-xs text-foreground/70">
            Arief Fajar & Reza Arrofi, 2026
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default Story;
