
import React from 'react';
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
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="relative group/logo h-10 md:h-12 w-auto flex items-center justify-center overflow-hidden cursor-pointer">
             <img 
               src="https://i.ibb.co/krv9LzL/mci-metallic-transparent-logo.png" 
               alt="matias cgi logo" 
               referrerPolicy="no-referrer"
               className="h-full w-auto object-contain brightness-110 grayscale group-hover/logo:grayscale-0 group-hover/logo:brightness-125 transition-all duration-1000 ease-out"
             />
             {/* Metallic Reflection Layer - Sophisticated Liquid Metal Effect */}
             <div 
               className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
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
               <div className="absolute inset-0 w-[300%] h-full bg-gradient-to-r from-transparent via-white/0 via-[45%] via-white/10 via-[49%] via-white/60 via-[50%] via-white/10 via-[51%] via-white/0 via-[55%] to-transparent -skew-x-[35deg] -translate-x-full group-hover/logo:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
               
               {/* Secondary Broad Ambient Sheen */}
               <div className="absolute inset-0 w-[300%] h-full bg-gradient-to-r from-transparent via-white/0 via-[40%] via-white/5 via-[50%] via-white/5 via-[60%] via-white/0 to-transparent -skew-x-[35deg] -translate-x-full group-hover/logo:translate-x-[100%] transition-transform duration-1500 delay-75 ease-out"></div>
               
               {/* Subtle Inner Glow on Hover */}
               <div className="absolute inset-0 bg-white/5 blur-sm opacity-0 group-hover/logo:opacity-100 transition-opacity duration-1000"></div>
             </div>
          </div>
          <div className="flex flex-col -space-y-1 border-l border-white/10 pl-4 md:pl-6 py-1">
            <span className="text-lg md:text-xl font-serif font-bold tracking-tighter text-white leading-none">Matías Navarrete</span>
            <span className="text-[6px] md:text-[7px] font-black tracking-[0.5em] text-zinc-600 uppercase mt-1">CGI Advertising Specialist</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 md:space-x-12">
          <nav className="hidden lg:flex items-center space-x-12 text-[9px] font-black tracking-[0.3em] uppercase text-zinc-500">
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
                  href="https://www.instagram.com/matiascgi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors duration-300"
                >
                  <InstagramIcon size={14} />
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a 
                  href="https://www.artstation.com/matiasnavarrete" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors duration-300"
                >
                  <ArtStationIcon size={14} />
                </a>
              </Magnetic>
            </div>
            <div className="flex bg-zinc-900/50 rounded-full p-1 border border-white/5">
              <button 
                onClick={() => setLang('es')}
                className={`px-4 py-1.5 text-[8px] font-black rounded-full transition-all duration-500 ${lang === 'es' ? 'bg-studio-accent text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
              >ES</button>
              <button 
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 text-[8px] font-black rounded-full transition-all duration-500 ${lang === 'en' ? 'bg-studio-accent text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
              >EN</button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
