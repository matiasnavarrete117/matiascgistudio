
import React from 'react';
import MetallicLogo from './MetallicLogo';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { InstagramIcon, ArtStationIcon } from './SocialIcons';
import { translations } from '../translations';
import Magnetic from './Magnetic';

interface HeaderProps {
  lang: 'es' | 'en';
  setLang: (l: 'es' | 'en') => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const t = translations[lang].nav;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-40 bg-black/40 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-5 min-w-0">
          <MetallicLogo lang={lang} className="h-12 w-[74px] md:h-14 md:w-[86px]" />
          <div className="hidden min-[375px]:flex flex-col gap-1 border-l border-white/15 pl-3 md:pl-5 py-1">
            <span className="text-base md:text-xl font-serif font-bold tracking-tighter text-white leading-none">Matías Navarrete</span>
            <span className="hidden sm:block text-[9px] font-medium tracking-[0.15em] text-zinc-300 uppercase mt-1">CGI Advertising Specialist</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 lg:gap-8 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-[0.15em] uppercase text-zinc-300">
            <Magnetic strength={0.2}>
              <a href="#work" className="hover:text-white transition-all duration-300 relative group block py-2">
                {t.work}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="#about" className="hover:text-white transition-all duration-300 relative group block py-2">
                {t.about}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="#contact" className="hover:text-white transition-all duration-300 relative group block py-2">
                {t.contact}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </Magnetic>
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 border-r border-white/10 pr-6">
              <Magnetic strength={0.3}>
                <a 
                  aria-label="Instagram" href="https://www.instagram.com/matiascgi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white transition-colors duration-300"
                >
                  <InstagramIcon size={14} />
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a 
                  aria-label="ArtStation" href="https://www.artstation.com/matiasnavarrete" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white transition-colors duration-300"
                >
                  <ArtStationIcon size={14} />
                </a>
              </Magnetic>
            </div>
            <div className="flex bg-zinc-900/50 rounded-full p-1 border border-white/5">
              <button 
                aria-label="Español" aria-pressed={lang === 'es'} onClick={() => setLang('es')}
                className={`min-h-10 min-w-10 px-3 py-2 text-[11px] font-black rounded-full transition-all duration-500 ${lang === 'es' ? 'bg-studio-accent text-black shadow-lg' : 'text-zinc-300 hover:text-white'}`}
              >ES</button>
              <button 
                aria-label="English" aria-pressed={lang === 'en'} onClick={() => setLang('en')}
                className={`min-h-10 min-w-10 px-3 py-2 text-[11px] font-black rounded-full transition-all duration-500 ${lang === 'en' ? 'bg-studio-accent text-black shadow-lg' : 'text-zinc-300 hover:text-white'}`}
              >EN</button>
            </div>
          </div>
        </div>
      </div>
      <nav aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'} className="flex lg:hidden items-center justify-center gap-6 border-t border-white/10 px-4 text-xs font-medium text-zinc-200">
        <a href="#work" className="py-3">{t.work}</a>
        <a href="#about" className="py-3">{t.about}</a>
        <a href="#contact" className="py-3">{t.contact}</a>
      </nav>
    </motion.header>
  );
};

export default Header;
