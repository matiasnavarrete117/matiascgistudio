
import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { Project } from '../types';
import { Loader2 } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { getYoutubeId } from '../constants';
import Magnetic from './Magnetic';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  lang: 'es' | 'en';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, lang }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Disable parallax on mobile to prevent jitter
  const y = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [-30, 30]);

  const isInView = useInView(cardRef, { 
    amount: 0.6, // Trigger when 60% of the card is visible
    once: false 
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const description = lang === 'es' 
    ? (project.descriptionEs || project.description) 
    : (project.descriptionEn || project.description);

  // Helper to determine if we should show the "active" state
  // Mobile: Active when in view
  // Desktop: Active when hovered
  const isActive = isMobile ? isInView : isHovered;

  const textColor = 'text-white';
  const subTextColor = 'text-white/70';
  const labelColor = 'text-white/40';
  const accentBg = 'bg-studio-accent/30';
  const buttonBg = 'bg-white/10';

  return (
    <motion.div 
      ref={cardRef}
      initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-studio-gray rounded-sm border border-zinc-900/50 will-change-transform"
      onClick={() => onClick(project)}
    >
      {project.videoUrl ? (
        <motion.div style={{ y }} className={`w-full h-full relative ${isMobile ? 'scale-105' : 'scale-115'}`}>
          <img 
            src={project.thumbnail} 
            alt={project.title}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-0 ${isActive ? 'opacity-0' : 'opacity-100'}`}
          />
          {project.videoUrl.endsWith('.mp4') ? (
            <>
              <VideoPlayer
                src={project.videoUrl}
                poster={project.thumbnail}
                autoPlay={isActive}
                loop={true}
                muted={true}
                showControlsEnabled={false}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onPlaying={() => setIsLoading(false)}
                className={`absolute inset-0 w-full h-full transition-all duration-700 z-10 ${isActive ? 'opacity-100 pointer-events-none' : 'opacity-0 pointer-events-none'}`}
              />
              {isLoading && isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity pointer-events-none z-20">
                  <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                </div>
              )}
            </>
          ) : project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be') ? (
            (() => {
              const videoId = getYoutubeId(project.videoUrl);
              
              return (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=${videoId}`}
                  className={`absolute inset-0 w-full h-full border-0 transition-all duration-700 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  allow="autoplay; encrypted-media"
                ></iframe>
              );
            })()
          ) : project.videoUrl.includes('vimeo.com') ? (
            <iframe
              src={`${project.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}?autoplay=1&muted=1&loop=1&background=1`}
              className={`absolute inset-0 w-full h-full border-0 transition-all duration-700 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}
            ></iframe>
          ) : null}
        </motion.div>
      ) : (
        <motion.div style={{ y }} className="w-full h-full scale-115">
          <img 
            src={project.thumbnail} 
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </motion.div>
      )}
      
      {/* Overlay for depth and readability - softer scrim */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}></div>
      
      {/* Technical Micro-labels */}
      <div className={`absolute top-6 left-6 flex flex-col gap-1 transition-opacity duration-500 delay-100 z-20 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`text-[7px] font-mono ${labelColor} uppercase tracking-widest`}>Resolution: 4K Master</span>
        <span className={`text-[7px] font-mono ${labelColor} uppercase tracking-widest`}>Color: ACES CG</span>
      </div>

      <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 w-full flex flex-col justify-end z-20 pointer-events-none">
        <div className={`flex items-center space-x-3 md:space-x-4 ${subTextColor} text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-black mb-2 md:mb-3`}>
          <span>{project.year}</span>
          <span className={`w-1 h-1 bg-white/20 rounded-full`}></span>
          <span>
            {Array.isArray(project.category) 
              ? project.category.join(' / ') 
              : project.category}
          </span>
        </div>
        
        <div className="space-y-1">
          <h3 className={`text-2xl md:text-3xl lg:text-4xl font-serif ${textColor} leading-none tracking-tighter transition-all duration-500 ${isActive ? 'text-glow' : ''}`}>
            {project.title}
          </h3>
          <div className={`h-px ${accentBg} transition-all duration-700 ease-in-out ${isMobile ? 'w-full' : (isActive ? 'w-full' : 'w-0')}`}></div>
        </div>

        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isMobile ? 'max-h-40 opacity-100 mt-4' : (isActive ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0')}`}>
          <p className={`${textColor} text-xs leading-relaxed max-w-xs font-normal italic drop-shadow-md`}>
            {description}
          </p>
        </div>
      </div>

      {/* Full-card click surface */}
      <div className="absolute inset-0 z-25"></div>
      
      {/* Action Indicator */}
      <div className={`absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        {isMobile ? (
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md ${buttonBg} shadow-xl`}>
            <span className={`${textColor} text-[10px] md:text-xs font-black tracking-tighter`}>VIEW</span>
          </div>
        ) : (
          <Magnetic strength={0.4}>
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md ${buttonBg} shadow-xl`}>
              <span className={`${textColor} text-[10px] md:text-xs font-black tracking-tighter`}>VIEW</span>
            </div>
          </Magnetic>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
