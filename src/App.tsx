import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';

import useLenis from './hooks/useLenis';
import { siteConfig } from './config';

import Navbar from './components/Navbar';
import Footer from './sections/Footer';

// Pages
import Home from './pages/Home';
import Story from './pages/Story';
import Craft from './pages/Craft';
import Journey from './pages/Journey';
import Contact from './pages/Contact';
import About from './pages/About';
import Docs from './pages/Docs';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  // Initialize Lenis smooth scrolling (automatically handles scroll-to-top on route change)
  useLenis();
  const location = useLocation();

  useEffect(() => {
    // Set document language if configured
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }
  }, []);

  return (
    <div className="relative bg-kaleo-sand min-h-screen flex flex-col overflow-x-hidden">
      {/* Navbar overlaying everywhere */}
      <Navbar />

      {/* Pages Content */}
      <main className="flex-grow relative">
        <AnimatePresence 
          mode="wait" 
          initial={false}
          onExitComplete={() => {
            // GSAP ScrollTrigger needs a refresh after page transition
            ScrollTrigger.refresh();
          }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Story />} />
            <Route path="/methodology" element={<Craft />} />
            <Route path="/field-test" element={<Journey />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
