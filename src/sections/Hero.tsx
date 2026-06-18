import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null); // Changed ref from button to wrapper div
  const [isFirstVisit] = useState(() => {
    // Only show the big entrance animation on first page load ever
    if (sessionStorage.getItem('arisa-hero-seen')) return false;
    sessionStorage.setItem('arisa-hero-seen', 'true');
    return true;
  });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    const cta = ctaRef.current;

    if (!section || !title || !subtitle || !image || !overlay || !cta) return;

    const ctx = gsap.context(() => {
      // Entrance animations

      // ─── Entrance Animation ───
      // Only play the big cinematic entrance on very first page load.
      // On route changes back to Home, elements are already visible
      // and the Framer Motion page fade handles the transition.
      if (isFirstVisit) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          image,
          { scale: 1.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2 }
        )
        .fromTo(
          title,
          { scale: 1.05, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5 },
          '-=1.5'
        )
        .fromTo(
          subtitle,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.8'
        )
        .fromTo(
          cta,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.6'
        );
      }

      // Image parallax is removed for better performance and a clean, solid background.

      // Overlay darkens further as you scroll
      gsap.to(overlay, {
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // ─── Text Fade on Scroll (BIDIRECTIONAL) ───
      // CRITICAL: Using `fromTo` ensures the animation is fully reversible.
      // Without explicit "from" values, GSAP can't reverse back to the original state
      // when scrubbing backwards (scrolling up), causing text to permanently disappear.
      gsap.fromTo(
        [title, subtitle, cta],
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isFirstVisit]);

  if (!heroConfig.title && !heroConfig.backgroundImage) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[100vh] overflow-hidden"
    >
      {/* Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={heroConfig.backgroundImage}
          alt={heroConfig.backgroundAlt}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Gradient overlay for depth - starts at 0.5 for immediate contrast */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black opacity-50"
      />

      {/* Subtle fog effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-kaleo-sand/20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        {/* Main Title */}
        <h1
          ref={titleRef}
          className="font-display text-white text-display tracking-tight select-none"
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}
        >
          {heroConfig.title}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-white font-bold text-sm md:text-base uppercase tracking-[0.3em] mt-6 text-center select-none"
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {heroConfig.subtitle}
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center z-10"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white text-black font-body text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] min-w-[200px]"
          >
            EXPLORE SYSTEM
          </button>
          
          <Link
            to="/hub?tab=downloads"
            className="px-8 py-4 border-2 border-white text-white font-body text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 backdrop-blur-xs min-w-[200px] text-center"
          >
            DOWNLOAD DATA
          </Link>
        </div>
      </div>

      {/* Bottom gradient for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kaleo-sand to-transparent" />
    </section>
  );
};

export default Hero;
