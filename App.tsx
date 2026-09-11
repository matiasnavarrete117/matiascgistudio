import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import VideoPlayer from './components/VideoPlayer';
import Magnetic from './components/Magnetic';
import PageTransition from './components/PageTransition';
import CustomCursor from './components/CustomCursor';
import { PROJECTS, SKILLS, getYoutubeId } from './constants';
import { Project } from './types';
import { translations } from './translations';
import { Loader2, ExternalLink } from 'lucide-react';
import { InstagramIcon, ArtStationIcon } from './components/SocialIcons';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import SplitText from './components/SplitText';

const App: React.FC = () => {
  const [lang, setLang] = useState<'es' | 'en'>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      const savedLang = window.localStorage.getItem('user-lang');
      if (savedLang === 'es' || savedLang === 'en') return savedLang;
    } catch {
      // Browser privacy settings may disable storage.
    }
    const languages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    for (const language of languages) {
      const base = language.toLowerCase().split(/[-_]/)[0];
      if (base === 'es' || base === 'en') return base;
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleSetLang = (newLang: 'es' | 'en') => {
    setLang(newLang);
    try {
      window.localStorage.setItem('user-lang', newLang);
    } catch {
      // Keep the selection working even when storage is unavailable.
    }
  };
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [isModalVideoLoading, setIsModalVideoLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Product' | 'Advertising' | 'Marketing Visuals'>('All');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const t = translations[lang];
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
      prevent: (node) => node.nodeName === 'IFRAME',
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      setCurrentGalleryIndex(0);
      setLoopCount(0);
      
      // Use a small timeout to ensure Lenis stops after the current frame
      const timer = setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.stop();
        }
      }, 10);
      return () => clearTimeout(timer);
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    }
  }, [selectedProject]);

  const filteredProjects = PROJECTS.filter(project => {
    if (activeFilter === 'All') return true;
    if (Array.isArray(project.category)) {
      return project.category.includes(activeFilter);
    }
    return project.category === activeFilter;
  });

  return (
    <div className={`bg-studio-black min-h-screen w-full overflow-x-hidden text-zinc-300 selection:bg-white selection:text-black ${isTouchDevice ? 'cursor-auto' : 'cursor-none'}`}>
      <CustomCursor />
      <PageTransition />
      <Header lang={lang} setLang={handleSetLang} />
      
      <motion.main 
        className="relative"
        animate={{ 
          scale: selectedProject ? 0.95 : 1,
          filter: selectedProject ? 'brightness(0.5) blur(4px)' : 'brightness(1) blur(0px)'
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute top-0 left-0 w-64 h-64 wavy-pattern opacity-10 rotate-45 -translate-x-32 -translate-y-32 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 wavy-pattern opacity-10 -rotate-45 translate-x-32 translate-y-32 pointer-events-none"></div>
        
        <Hero lang={lang} />

        {/* Portfolio Section */}
        <section id="work" className="py-24 md:py-40 lg:py-60 px-6 md:px-12 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 lg:mb-32 gap-12 md:gap-16">
            <div className="space-y-6 md:space-y-8 relative">
              {/* Rotating Circular Text Badge */}
              <div className="absolute -top-16 -left-16 md:-top-20 md:-left-20 lg:-top-24 lg:-left-24 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 pointer-events-none flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative w-full h-full"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                    </defs>
                    <text className="text-[12px] font-black uppercase tracking-[0.4em] fill-studio-accent">
                      <textPath href="#circlePath">
                        3D ARTIST • MATIAS NAVARRETE • 3D ARTIST •
                      </textPath>
                    </text>
                  </svg>
                </motion.div>
                <div className="absolute inset-0 border border-studio-accent/5 rounded-full scale-90"></div>
              </div>

              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-zinc-700 text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em]"
              >
                {t.work.tagline}
              </motion.span>
              <SplitText 
                text={`${t.work.title1} ${t.work.title2}`}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[10rem] font-serif text-white tracking-tighter leading-[0.9] md:leading-[0.85] lg:leading-[0.8]"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-zinc-600 max-w-sm text-xs md:text-sm leading-relaxed border-l border-white/5 pl-6 md:pl-10 font-light italic"
            >
              {t.work.desc}
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-6 mb-16 md:mb-20 lg:mb-24">
            {[
              { id: 'All', label: t.work.filterAll },
              { id: 'Product', label: t.work.filterProduct },
              { id: 'Advertising', label: t.work.filterAdvertising },
              { id: 'Marketing Visuals', label: t.work.filterMarketing }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-6 py-3 md:px-10 md:py-4 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 border ${
                  activeFilter === filter.id 
                    ? 'bg-studio-accent text-black border-studio-accent shadow-[0_0_30px_rgba(241,229,172,0.2)]' 
                    : 'bg-transparent text-zinc-700 border-white/5 hover:border-white/20 hover:text-zinc-400'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  lang={lang}
                  onClick={(p) => setSelectedProject(p)} 
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Studio / About Section */}
        <section id="about" className="py-24 md:py-40 lg:py-60 bg-zinc-950/30 border-y border-white/5 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8 space-y-32">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-12 md:space-y-16 lg:space-y-20">
                <div className="space-y-6 md:space-y-8">
                  <span className="text-zinc-700 text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em]">{t.about.tagline}</span>
                  <SplitText 
                    text={`${t.about.title1} ${t.about.title2}`}
                    className="text-5xl sm:text-6xl md:text-7xl font-serif text-white tracking-tighter leading-none"
                  />
                </div>
                
                <div className="space-y-8">
                  <p className="text-zinc-300 leading-relaxed text-lg md:text-xl font-light italic">
                    {t.about.desc}
                  </p>
                  <p className="text-zinc-500 leading-relaxed text-sm md:text-base font-light">
                    {t.about.bio}
                  </p>
                </div>
                
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h5 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4">
                      {lang === 'es' ? 'Trayectoria' : 'Experience'}
                      <div className="h-px flex-1 bg-white/5"></div>
                    </h5>
                    <div className="space-y-6">
                      {[
                        { year: t.about.experience.postonDates, role: t.about.experience.poston, company: 'Poston Digital Arts' },
                        { year: t.about.experience.internshipDates, role: t.about.experience.internship, company: 'Estudio Lunes' },
                        { year: t.about.experience.educationDates, role: t.about.experience.education, company: 'U. Mayor' }
                      ].map((item, idx) => (
                        <div key={idx} className="group flex justify-between items-start border-b border-white/5 pb-4 last:border-0">
                          <div className="space-y-1">
                            <h4 className="text-white text-sm font-medium">{item.role}</h4>
                            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{item.company}</p>
                          </div>
                          <span className="text-studio-accent font-mono text-[9px] pt-1">{item.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h5 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4">
                      {lang === 'es' ? 'Especialidades' : 'Specialties'}
                      <div className="h-px flex-1 bg-white/5"></div>
                    </h5>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                      {Object.entries(t.about.skills).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-1 h-1 rounded-full bg-studio-accent shadow-[0_0_8px_rgba(241,229,172,0.8)]"></div>
                          <span className="text-white text-[11px] md:text-sm font-light tracking-tight">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Professional Path / Experience Section */}
            <div className="border-t border-white/5 pt-32">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                  <h3 className="text-studio-accent text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em] mb-4">
                    {t.about.experience.title}
                  </h3>
                  <div className="w-12 h-px bg-studio-accent/30"></div>
                </div>
                <div className="lg:col-span-8 space-y-12">
                  <div className="group space-y-4">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                      <h4 className="text-xl md:text-2xl font-serif text-white">{t.about.experience.poston}</h4>
                      <span className="text-zinc-600 font-mono text-[10px]">{t.about.experience.postonDates}</span>
                    </div>
                    <p className="text-zinc-500 text-sm md:text-base font-light italic max-w-2xl">
                      {t.about.experience.postonDesc}
                    </p>
                  </div>

                  <div className="group space-y-4">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                      <h4 className="text-xl md:text-2xl font-serif text-white">{t.about.experience.internship}</h4>
                      <span className="text-zinc-600 font-mono text-[10px]">{t.about.experience.internshipDates}</span>
                    </div>
                    <p className="text-zinc-500 text-sm md:text-base font-light italic max-w-2xl">
                      {t.about.experience.internshipDesc}
                    </p>
                  </div>

                  <div className="group space-y-4">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-t border-white/5 pt-12">
                      <h4 className="text-xl md:text-2xl font-serif text-white">{t.about.experience.education}</h4>
                    </div>
                    <p className="text-zinc-500 text-sm md:text-base font-light italic">
                      Universidad Mayor · {t.about.experience.educationDates}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-24 md:py-40 lg:py-60 px-6 md:px-12 lg:px-8 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 md:mb-32">
              <div className="space-y-6">
                <span className="text-zinc-700 text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em]">{t.methodology.tagline}</span>
                <SplitText 
                  text={`${t.methodology.title1} ${t.methodology.title2}`}
                  className="text-5xl sm:text-6xl md:text-7xl font-serif text-white tracking-tighter leading-none"
                />
              </div>
              <div className="hidden md:block w-32 h-px bg-white/10 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
              {t.methodology.steps.map((step, idx) => (
                <div key={idx} className="bg-studio-black p-8 md:p-12 space-y-8 group hover:bg-zinc-900/50 transition-colors duration-700">
                  <div className="flex justify-between items-start">
                    <span className="text-studio-accent font-mono text-xs">0{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-studio-accent/50 transition-colors duration-700">
                      <div className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-studio-accent transition-colors duration-700"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-serif text-white tracking-tight">{step.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed font-light italic">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 md:py-40 lg:py-60 px-6 md:px-8 max-w-3xl mx-auto text-center scroll-mt-24">
          <div className="space-y-8 md:space-y-12">
            <SplitText 
              text={`${t.contact.title1} ${t.contact.title2}`}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-serif text-white tracking-tighter leading-none justify-center"
            />
            <p className="text-zinc-500 text-lg md:text-xl font-light italic">
              {t.contact.desc}
            </p>
            <div className="pt-8 md:pt-12 flex justify-center">
              <Magnetic strength={0.2}>
                <a 
                  href="mailto:matiasnavarrete117@gmail.com" 
                  className="inline-block text-xl sm:text-3xl md:text-5xl font-serif text-white hover:text-studio-accent transition-all duration-500 border-b border-white/10 pb-2 md:pb-4"
                >
                  matiasnavarrete117@gmail.com
                </a>
              </Magnetic>
            </div>
          </div>
        </section>
      </motion.main>

      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="relative group/footer-logo h-10 w-auto flex items-center justify-center overflow-hidden cursor-pointer">
              <img 
                src="https://i.ibb.co/krv9LzL/mci-metallic-transparent-logo.png" 
                alt="Logo" 
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain brightness-110 grayscale group-hover/footer-logo:grayscale-0 group-hover/footer-logo:brightness-125 transition-all duration-1000 ease-out" 
              />
              {/* Metallic Reflection Layer - Sophisticated Liquid Metal Effect */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-0 group-hover/footer-logo:opacity-100 transition-opacity duration-500"
                style={{
                  maskImage: 'url(https://i.ibb.co/krv9LzL/mci-metallic-transparent-logo.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: 'url(https://i.ibb.co/krv9LzL/mci-metallic-transparent-logo.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center'
                }}
              >
                {/* Primary Sharp Reflection Sweep */}
                <div className="absolute inset-0 w-[300%] h-full bg-gradient-to-r from-transparent via-white/0 via-[45%] via-white/10 via-[49%] via-white/60 via-[50%] via-white/10 via-[51%] via-white/0 via-[55%] to-transparent -skew-x-[35deg] -translate-x-full group-hover/footer-logo:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                
                {/* Secondary Broad Ambient Sheen */}
                <div className="absolute inset-0 w-[300%] h-full bg-gradient-to-r from-transparent via-white/0 via-[40%] via-white/5 via-[50%] via-white/5 via-[60%] via-white/0 to-transparent -skew-x-[35deg] -translate-x-full group-hover/footer-logo:translate-x-[100%] transition-transform duration-1500 delay-75 ease-out"></div>
                
                {/* Subtle Inner Glow on Hover */}
                <div className="absolute inset-0 bg-white/5 blur-sm opacity-0 group-hover/footer-logo:opacity-100 transition-opacity duration-1000"></div>
              </div>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-700">© 2026 Matías Navarrete Studio</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <div className="flex items-center gap-6 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-12">
              <a 
                href="https://www.instagram.com/matiascgi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors duration-300 group"
              >
                <InstagramIcon size={12} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Instagram</span>
              </a>
              <a 
                href="https://www.artstation.com/matiasnavarrete" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors duration-300 group"
              >
                <ArtStationIcon size={12} className="group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">ArtStation</span>
              </a>
            </div>

          </div>
        </div>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-studio-black/95 backdrop-blur-2xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-studio-gray w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-sm border border-white/10 shadow-2xl overscroll-contain"
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-square lg:aspect-auto bg-black relative group min-h-[300px] md:min-h-[400px]">
                    {selectedProject.gallery && selectedProject.gallery.length > 0 ? (
                      <div className="w-full h-full relative">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${selectedProject.id}-${currentGalleryIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full"
                          >
                            {selectedProject.gallery[currentGalleryIndex].endsWith('.mp4') ? (
                              <VideoPlayer
                                key={`${selectedProject.id}-${currentGalleryIndex}`}
                                src={selectedProject.gallery[currentGalleryIndex]}
                                poster={selectedProject.thumbnail}
                                autoPlay={true}
                                loop={selectedProject.id !== 'go2store'}
                                muted={true}
                                showControlsEnabled={true}
                                loopTrigger={loopCount}
                                onWaiting={() => setIsModalVideoLoading(true)}
                                onCanPlay={() => setIsModalVideoLoading(false)}
                                onPlaying={() => setIsModalVideoLoading(false)}
                                onEnded={() => {
                                  if (selectedProject.id === 'go2store') {
                                    if (loopCount + 1 >= 2) {
                                      setCurrentGalleryIndex((prev) => (prev + 1) % selectedProject.gallery!.length);
                                      setLoopCount(0);
                                    } else {
                                      setLoopCount(prev => prev + 1);
                                    }
                                  }
                                }}
                                className="w-full h-full"
                              />
                            ) : (
                              <img 
                                src={selectedProject.gallery[currentGalleryIndex]} 
                                alt={`${selectedProject.title} - ${currentGalleryIndex}`} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Gallery Navigation */}
                        {selectedProject.gallery.length > 1 && (
                          <>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                              {selectedProject.gallery.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentGalleryIndex(idx)}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentGalleryIndex === idx ? 'bg-studio-accent w-6' : 'bg-white/20 hover:bg-white/40'
                                  }`}
                                />
                              ))}
                            </div>
                            <button 
                              onClick={() => setCurrentGalleryIndex((prev) => (prev - 1 + selectedProject.gallery!.length) % selectedProject.gallery!.length)}
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/60 hover:text-white hover:bg-black/60 transition-all z-20"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button 
                              onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % selectedProject.gallery!.length)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/60 hover:text-white hover:bg-black/60 transition-all z-20"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        {selectedProject.videoUrl ? (
                          selectedProject.videoUrl.endsWith('.mp4') ? (
                            <VideoPlayer
                              src={selectedProject.videoUrl}
                              poster={selectedProject.thumbnail}
                              autoPlay={true}
                              loop={true}
                              muted={true}
                              showControlsEnabled={true}
                              onWaiting={() => setIsModalVideoLoading(true)}
                              onCanPlay={() => setIsModalVideoLoading(false)}
                              onPlaying={() => setIsModalVideoLoading(false)}
                              className="w-full h-full"
                            />
                          ) : selectedProject.videoUrl.includes('youtube.com') || selectedProject.videoUrl.includes('youtu.be') ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${getYoutubeId(selectedProject.videoUrl)}`}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-view"
                              allowFullScreen
                            ></iframe>
                          ) : selectedProject.videoUrl.includes('vimeo.com') ? (
                            <iframe
                              src={selectedProject.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                              className="w-full h-full border-0"
                              allow="autoplay; fullscreen; picture-in-view"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <img 
                              src={selectedProject.thumbnail} 
                              alt={selectedProject.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <img 
                            src={selectedProject.thumbnail} 
                            alt={selectedProject.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}
                    
                    {isModalVideoLoading && (selectedProject.gallery?.[currentGalleryIndex]?.endsWith('.mp4') || selectedProject.videoUrl?.endsWith('.mp4')) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-none z-30">
                        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                      </div>
                    )}
                  </div>
                
                <div className="p-8 md:p-20 space-y-8 md:space-y-12">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 md:space-y-4">
                      <span className="text-zinc-600 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">{selectedProject.category}</span>
                      <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter leading-none">{selectedProject.title}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="text-zinc-500 hover:text-white transition-colors p-2"
                    >
                      <svg width="20" height="20" md:width="24" md:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    <h4 className="text-zinc-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 md:pb-4">{t.project.overview}</h4>
                    <p className="text-white text-base md:text-lg font-normal italic leading-relaxed drop-shadow-md">
                      {lang === 'es' 
                        ? (selectedProject.descriptionEs || selectedProject.description) 
                        : (selectedProject.descriptionEn || selectedProject.description)}
                    </p>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    <h4 className="text-zinc-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 md:pb-4">{t.project.pipeline}</h4>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {selectedProject.tools.map(tool => (
                        <span key={tool} className="px-3 py-1.5 md:px-5 md:py-2 bg-white/5 border border-white/5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-400 rounded-full">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 md:pt-12 border-t border-white/5">
                    <p className="text-zinc-600 text-[8px] md:text-[10px] font-light italic">
                      {t.project.aiNote}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grainy-overlay"></div>
    </div>
  );
};

export default App;
