
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { translations } from '../translations';
import { PROJECTS } from '../constants';
import { Loader2 } from 'lucide-react';
import Magnetic from './Magnetic';
import SplitText from './SplitText';

interface HeroProps {
  lang: 'es' | 'en';
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = translations[lang].hero;
  const featuredProjects = PROJECTS.filter(p => p.featured).length > 0 
    ? PROJECTS.filter(p => p.featured) 
    : PROJECTS;
    
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBgLoading, setIsBgLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "15%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsBgLoading(true);
    if (featuredProjects.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredProjects.length]);

  const currentProject = featuredProjects[currentIndex];

  if (!currentProject) return null;

  return (
    <section ref={containerRef} className="relative h-screen h-[100dvh] w-full bg-black overflow-hidden">
      {/* Ambient Blurred Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentProject.id}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.7,
              scale: isMobile ? [1.05, 1.1, 1.05] : [1.2, 1.3, 1.2],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 2 },
              scale: { 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
            className="absolute inset-0"
          >
            {currentProject.videoUrl && currentProject.videoUrl.endsWith('.mp4') ? (
              <>
                <video
                  src={currentProject.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster={currentProject.thumbnail}
                  onWaiting={() => setIsBgLoading(true)}
                  onCanPlay={() => setIsBgLoading(false)}
                  onPlaying={() => setIsBgLoading(false)}
                  className="w-full h-full object-cover blur-[120px] brightness-75"
                />
                {isBgLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white/10 animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div 
                className="w-full h-full bg-cover bg-center blur-[120px] brightness-75"
                style={{ backgroundImage: `url(${currentProject.thumbnail})` }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Content Overlay */}
      <motion.div style={{ y: contentY, opacity }} className="relative z-10 h-full w-full flex flex-col">
        {/* Text Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 lg:p-24 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none">
          <div className="max-w-7xl mx-auto w-full space-y-6 md:space-y-8 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-2"
            >
              <span className="text-studio-accent text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em]">
                {lang === 'es' ? 'CGI Artist' : 'CGI Artist'}
              </span>
              <SplitText 
                key={`headline-${lang}`}
                text={t.tagline}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-white tracking-tighter leading-[0.9] md:leading-[0.85]"
              />
              <p className="text-white/60 text-xs md:text-base lg:text-lg font-light italic max-w-2xl drop-shadow-md leading-relaxed">
                {t.desc}
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              <Magnetic strength={0.3}>
                <a
                  href="#work"
                  className="group inline-flex items-center gap-4 px-8 py-4 md:px-12 md:py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[8px] md:text-[9px] rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                >
                  {t.cta}
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </Magnetic>
              <div className="flex gap-3 md:gap-4">
                {featuredProjects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 md:w-12 h-1px transition-all duration-500 ${
                      currentIndex === idx ? 'bg-studio-accent w-12 md:w-20' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="flex flex-col items-center gap-4 md:hidden pt-4"
            >
              <span className="text-[7px] text-white/40 uppercase tracking-[0.5em] font-black whitespace-nowrap">
                {t.scroll}
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-studio-accent/40 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Subtle Branding */}
      <div className="absolute top-32 left-12 z-30 hidden md:block">
        <div className="flex items-center gap-6">
          <div className="w-12 h-px bg-studio-accent/30"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40">
            Matias Navarrete Studio
          </span>
        </div>
      </div>

      {/* Technical Details Overlay */}
      <div className="absolute bottom-12 left-12 z-30 hidden lg:block">
        <div className="flex flex-col gap-1 text-[8px] font-mono text-white/30 uppercase tracking-[0.4em]">
          <span>© 2026 MN.STUDIO</span>
          <span>SANTIAGO / CL / GLOBAL</span>
        </div>
      </div>

      {/* Desktop Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-12 right-12 z-30 hidden md:flex flex-col items-end gap-4"
      >
        <span className="text-[9px] text-white/40 uppercase tracking-[0.5em] font-black [writing-mode:vertical-lr] rotate-180 whitespace-nowrap">
          {t.scroll}
        </span>
        <div className="w-px h-24 bg-gradient-to-b from-studio-accent/40 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
