import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Research Base', href: '/research' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Field Test', href: '/field-test' },
  { label: 'ARISA Hub', href: '/hub' },
  { label: 'About Us', href: '/about' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  // Mounted check for next-themes to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle resize to close mobile menu when switching to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Determine colors based on state
  const textColorClass = 'text-foreground';
  const hoverColorClass = 'hover:text-foreground/80';

  const mobileMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: -20,
      transition: { duration: 0.4, ease: 'easeInOut' as const } 
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 sm:px-6">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between w-full ${
            isScrolled
              ? 'mt-4 max-w-[92vw] xl:max-w-[1360px] py-3 px-8 navbar-glass rounded-full border shadow-soft'
              : 'mt-0 max-w-[95vw] xl:max-w-[1440px] py-6 px-4 bg-transparent border-transparent shadow-none'
          }`}
        >
          {/* 1. Left: Logo */}
          <div className="flex-none lg:w-48">
            <Link
              to="/"
              className="group relative flex items-center gap-2.5 w-max"
            >
              <img
                src="/assets/logo/logo-icon.webp"
                alt="ARISA Logo"
                className={`transition-all duration-700 object-contain ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'} group-hover:scale-105`}
              />
              <span className={`font-display tracking-[0.15em] text-xl transition-colors duration-500 ${textColorClass}`}>
                ARISA
              </span>
            </Link>
          </div>

          {/* 2. Middle: Centered Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative py-2 font-body text-xs xl:text-sm uppercase tracking-[0.2em] transition-all duration-500 group whitespace-nowrap ${
                    isActive
                      ? `${textColorClass} font-medium`
                      : `${textColorClass} opacity-70 ${hoverColorClass} hover:opacity-100`
                  }`}
                >
                  {link.label}
                  
                  {/* Indicator for active or hover */}
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-500 bg-primary ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* 3. Right: CTA Button & Theme Toggle */}
          <div className="hidden lg:flex flex-none lg:w-48 justify-end items-center gap-4">
            
            {/* Theme Switcher Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full transition-all duration-500 hover:scale-110 text-foreground hover:bg-primary/5"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}

            <Link
              to="/contact"
              className="whitespace-nowrap flex-shrink-0 px-6 py-2.5 rounded-full font-body text-xs xl:text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 border border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex-1 flex justify-end gap-3 items-center">
             {/* Mobile Theme Switcher */}
             {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full transition-colors text-foreground"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
              aria-label="Toggle navigation menu"
            >
              <motion.span
                animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }}
                className="block h-[1.5px] w-6 rounded-full origin-center transition-colors bg-foreground"
              />
              <motion.span
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                className="block h-[1.5px] w-5 rounded-full transition-colors bg-foreground"
              />
              <motion.span
                animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }}
                className="block h-[1.5px] w-6 rounded-full origin-center transition-colors bg-foreground"
              />
            </button>
          </div>

        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[45] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md origin-top"
          >
            <div className="flex flex-col items-center gap-6 w-full px-6">
              <img
                src="/assets/logo/logo-text.webp"
                alt="ARISA"
                className="h-12 object-contain mb-4"
              />

              <div className="w-12 h-[1px] bg-primary/20 mb-2" />

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-display text-3xl tracking-wider transition-all duration-300 ${
                      location.pathname === link.href
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="w-12 h-[1px] bg-primary/20 mt-2" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  to="/contact"
                  className="px-8 py-3 rounded-full border border-primary/20 font-body text-sm uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Start Collaborating
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
