import { useRef, useEffect, useState } from "react";
import { SplineScene } from "@/components/ui/spline";
import { Spotlight } from "@/components/ui/spotlight";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export default function SplineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile] = useState(() => isMobileDevice());

  useEffect(() => {
    const el = containerRef.current;
    
    if (el) {
      // Text reveal animation when scrolling into the section
      gsap.fromTo(
        ".reveal-text",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === el) trigger.kill();
      });
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className={`relative w-full ${isMobile ? 'h-[80svh]' : 'h-[120svh]'} bg-transparent overflow-hidden flex items-center justify-center select-none`}
    >
      {/* Spotlight Ambient Overlay */}
      <Spotlight
        className="-top-20 left-1/2 -translate-x-1/2 opacity-70"
        fill="var(--kaleo-cream)" 
      />

      {/* Floating elegant typography on Left and Right (Text Reveal) */}
      <div className="absolute inset-0 max-w-[1400px] mx-auto p-8 sm:px-12 md:px-16 w-full z-20 pointer-events-none flex gap-8 flex-col md:flex-row justify-between items-start md:items-center">
        
        {/* Top-Left / Center-Left Text */}
        <div className="reveal-text mt-32 md:mt-0 w-3/4 md:w-1/4 text-left">
          <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-kaleo-terracotta drop-shadow-sm">
            Architecture
          </span>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-display mt-2 leading-[0.9] text-foreground tracking-tight drop-shadow-sm">
            Structural <br />
            <span className="italic text-foreground/80">Dynamics.</span>
          </h3>
        </div>

        {/* Bottom-Right / Center-Right Text */}
        <div className="reveal-text mt-auto mb-32 md:mt-0 md:mb-0 w-3/4 md:w-1/4 self-end text-right">
          <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-kaleo-terracotta drop-shadow-sm">
            Precision
          </span>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-display mt-2 leading-[0.9] text-foreground tracking-tight drop-shadow-sm">
            Autonomous <br />
            <span className="italic text-foreground/80">Control.</span>
          </h3>
        </div>
        
      </div>

      {/* 
        Giant Full-Bleed Spline Layer 
        Only load on desktop to save massive mobile GPU resources
      */}
      {!isMobile && (
        <div className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing flex items-center justify-center pt-10 pb-10 md:py-0">
          <SplineScene 
            scene="https://prod.spline.design/U93cGcW5TMDkpK4z/scene.splinecode"
            className="w-full h-full origin-center"
          />
        </div>
      )}

      {/* Mobile fallback - elegant device visual */}
      {isMobile && (
        <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center p-8">
          <div className="relative w-72 max-w-[80vw] aspect-square rounded-3xl overflow-hidden border border-foreground/10 bg-stone-900/10 shadow-2xl flex items-center justify-center">
            <img 
              src="/craft-hardware.webp" 
              alt="ARISA Edge Hardware Device"
              className="w-full h-full object-cover filter brightness-95 contrast-105 rounded-3xl"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-kaleo-terracotta block">
                Edge Hardware
              </span>
              <span className="text-base font-display text-white font-normal mt-0.5 block">
                ARISA Edge Unit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Seamless Top & Bottom Gradients for smooth transition */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
