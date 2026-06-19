import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import CostBenefit from '../sections/CostBenefit';
import Downloads from '../sections/Downloads';

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

const Journey = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const largeTextRef = useRef<HTMLHeadingElement>(null);
  const parallaxImgRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Horizontal Scroll
      const section = horizontalSectionRef.current;
      const wrapper = horizontalWrapperRef.current;

      if (section && wrapper) {
        const getScrollAmount = () => {
          let wrapperWidth = wrapper.scrollWidth;
          return -(wrapperWidth - window.innerWidth);
        };

        gsap.to(wrapper, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerWidth * 3}`, 
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }

      // Marquee Text
      if (largeTextRef.current) {
        gsap.fromTo(largeTextRef.current,
          { x: '10%' },
          {
            x: '-30%',
            scrollTrigger: {
              trigger: largeTextRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            }
          }
        );
      }

      // Parallax Spotlight
      if (parallaxImgRef.current) {
        gsap.to(parallaxImgRef.current.querySelector('img'), {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxImgRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // Research Timeline Animation
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.research-step');
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

  const scenes = [
    { title: "Pagi Hari", d: "Pengujian akurasi model saat suhu rendah dan pencahayaan bias di pagi hari.", img: "/science/leaf-healthy.webp" },
    { title: "Siang Terik", d: "Validasi performa Edge-AI di bawah intensitas cahaya dan suhu tinggi.", img: "/science/leaf-mild.webp" },
    { title: "Kanopi Rapat", d: "Identifikasi lesi daun pada jarak tanam rapat sistem jajar legowo.", img: "/science/ai-segmentation.webp" },
    { title: "Sore Mendung", d: "Pengujian stabilitas segmentasi saat intensitas cahaya menurun.", img: "/science/leaf-severe.webp" }
  ];

  const researchSteps = [
    {
      phase: "Fase 1",
      title: "Perakitan Perangkat Keras",
      desc: "Perakitan Raspberry Pi 4, modul kamera, baterai backup, dan casing weatherproof IP65 dengan sistem pendingin aktif.",
      image: "/craft-hardware.webp",
    },
    {
      phase: "Fase 2",
      title: "Pengambilan Data Lapangan",
      desc: "Pengumpulan citra daun padi di sawah mitra Kec. Margaasih dengan variasi 3 kondisi cahaya, 3 sudut pengambilan, dan minimal 3 varietas.",
      image: "/science/farmer-testing.webp",
    },
    {
      phase: "Fase 3",
      title: "Anotasi & Pelatihan Model",
      desc: "Anotasi segmentasi piksel oleh 2 anotator independen menggunakan LabelMe/CVAT. Pelatihan U-Net+MobileNetV2 dan EfficientNet-B0.",
      image: "/craft-algorithm.webp",
    },
    {
      phase: "Fase 4",
      title: "Uji Lapangan & Usability",
      desc: "Uji akurasi dan latensi AI dengan 50 sampel citra baru. Validasi matriks skor risiko bersama BPP. Uji usability oleh 8 petani mitra.",
      image: "/craft-vision.webp",
    },
  ];

  return (
    <motion.div 
      ref={containerRef}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-background text-foreground min-h-screen overflow-x-hidden relative"
    >
      {/* Hero */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/60 z-[1] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center text-white">
          <span className="font-body text-white/50 text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 block">
            Uji Lapangan
          </span>
          <h1 className="font-display text-white text-5xl md:text-8xl leading-none tracking-tighter">
            Eksplorasi Nyata
          </h1>
          <p className="font-prose text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed mt-6 italic">
            Laboratorium kami adalah realitas. Sistem ARISA menjelajahi variabilitas ekosistem padi untuk memastikan AI mampu beradaptasi pada segala skenario operasional.
          </p>
        </div>
      </div>

      <section className="py-24 md:py-48 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="order-2 md:order-1 space-y-8 md:space-y-12">
                <h2 className="font-display text-4xl md:text-7xl tracking-tighter">Catatan <br/> Lapangan.</h2>
                <div className="space-y-6 md:space-y-8 font-prose text-base md:text-lg leading-[1.85] text-foreground/70 italic">
                    <p>"Raspberry Pi pada pukul 2 siang - suhu sistem stabil optimal, berkat modul fan khusus."</p>
                    <p>"Bercak hawar daun terdeteksi bahkan di balik bayangan rumput ilalang pelindung tanah."</p>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <div ref={parallaxImgRef} className="relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
                    <img src="/science/rpi-field.webp" className="absolute inset-x-0 top-0 w-full h-[120%] object-cover" alt="ARISA di lapangan" loading="lazy" />
                </div>
            </div>
        </div>
      </section>

      {/* ═══ NEW: Research Process Timeline ═══ */}
      <section ref={timelineRef} className="py-24 md:py-32 bg-muted/50 text-foreground border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <span className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-kaleo-terracotta mb-4 block">
              Proses Penelitian
            </span>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-4">
              Jurnal <span className="italic">Riset</span>
            </h2>
            <p className="font-prose text-muted-foreground max-w-xl mx-auto italic text-sm">
              Dokumentasi proses riset - dari perakitan perangkat keras hingga pengujian di sawah mitra Kec. Margaasih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {researchSteps.map((step, i) => (
              <div key={i} className="research-step group rounded-2xl border border-border bg-background overflow-hidden hover:border-foreground/20 transition-all duration-500">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="font-body text-xs uppercase tracking-wider text-kaleo-terracotta mb-2 block">{step.phase}</span>
                  <h3 className="font-display text-xl md:text-2xl mb-2">{step.title}</h3>
                  <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Process caption */}
          <div className="mt-10 text-center">
            <p className="font-prose text-xs text-muted-foreground italic max-w-xl mx-auto">
              "ARISA dikembangkan melalui kolaborasi langsung dengan petani dan divalidasi oleh ahli agronomis BPP setempat."
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Gallery */}
      <section ref={horizontalSectionRef} className="h-screen w-full overflow-hidden bg-background border-y border-foreground/10 relative flex items-center">
        <div ref={horizontalWrapperRef} className="flex h-[70vh] items-center gap-10 md:gap-32 px-6 md:px-32 w-[fit-content]">
          {scenes.map((scene, i) => (
            <div key={i} className="flex-shrink-0 w-[85vw] md:w-[60vw] max-w-[800px] h-full flex flex-col justify-center">
              <div className="relative w-full h-1/2 md:h-2/3 overflow-hidden rounded-lg shadow-lg mb-6">
                <img src={scene.img} className="w-full h-full object-cover" alt={scene.title} loading="lazy" />
              </div>
              <h2 className="font-display text-3xl md:text-6xl mb-2 tracking-tighter">{scene.title}</h2>
              <p className="font-prose text-foreground/70 text-sm md:text-base leading-relaxed italic">{scene.d}</p>
            </div>
          ))}
          <div className="w-[10vw]" />
        </div>
      </section>

      <section className="py-24 md:py-48 px-6 bg-muted/50 text-foreground text-center border-y border-border">
        <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-display text-4xl md:text-7xl tracking-tighter italic">"Membaca isyarat tanaman."</h2>
            <p className="font-prose text-base md:text-xl text-muted-foreground leading-[1.85] italic">
                Mengubah gejala visual pada daun menjadi indeks risiko kuantitatif untuk pengambilan keputusan agronomi.
            </p>
        </div>
      </section>

      {/* ═══ NEW: Cost-Benefit Analysis ═══ */}
      <CostBenefit />

      {/* ═══ NEW: Downloads Section ═══ */}
      <Downloads />

      <section className="py-24 md:py-48 overflow-hidden bg-background relative flex flex-col items-center min-h-[60vh] md:min-h-[80vh] justify-center px-6">
        <h2 ref={largeTextRef} className="font-display text-[25vw] md:text-[20vw] leading-none whitespace-nowrap text-foreground opacity-5 uppercase tracking-tighter absolute select-none pointer-events-none">
          DEDIKASI PERTANIAN
        </h2>
        <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="font-display text-4xl md:text-8xl tracking-tighter">Berkolaborasi?</h3>
          <p className="font-prose text-base md:text-lg text-foreground/70 leading-[1.85] italic">Bergabunglah dalam revolusi Komputasi Edge-AI untuk masa depan agrikultur presisi.</p>
          <a href="/contact" className="inline-block px-10 py-5 border border-foreground/20 rounded-full hover:bg-foreground hover:text-background transition-all duration-500 font-display text-lg tracking-tight">
              Hubungi Peneliti
          </a>
        </div>
      </section>
    </motion.div>
  );
};

export default Journey;
