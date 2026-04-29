
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onWaiting?: () => void;
  onCanPlay?: () => void;
  onPlaying?: () => void;
  onEnded?: () => void;
  loopTrigger?: number;
  showControlsEnabled?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  className = '',
  onWaiting,
  onCanPlay,
  onPlaying,
  onEnded,
  loopTrigger = 0,
  showControlsEnabled = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(0.3);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (onEnded) onEnded();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      // Ensure video is muted for autoplay to work reliably
      video.muted = muted || true;
      video.play().catch((err) => {
        console.warn("Video autoplay failed:", err);
      });
    } else {
      video.pause();
    }
  }, [autoPlay, src, muted]);

  // Handle loop trigger to restart video without remounting
  useEffect(() => {
    const video = videoRef.current;
    if (video && loopTrigger > 0) {
      video.currentTime = 0;
      video.play().catch(err => console.warn("Video restart failed:", err));
    }
  }, [loopTrigger]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showControlsEnabled) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (Number(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative group/player overflow-hidden bg-black ${className}`}
      onMouseEnter={() => showControlsEnabled && setShowControls(true)}
      onMouseLeave={() => showControlsEnabled && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        referrerPolicy="no-referrer"
        onWaiting={onWaiting}
        onCanPlay={onCanPlay}
        onPlaying={onPlaying}
        className={`w-full h-full ${isFullScreen ? 'object-contain' : 'object-cover'}`}
      />

      {/* Custom Controls Overlay */}
      <AnimatePresence>
        {showControlsEnabled && (showControls || isTouch) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-6 z-30 pointer-events-none"
          >
            <div className="flex flex-col gap-3 pointer-events-auto max-w-full">
              {/* Progress Bar */}
              <div className="relative w-full h-1 group/progress cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="absolute inset-0 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-studio-accent"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 md:gap-4">
                  <button 
                    onClick={togglePlay}
                    className="text-white hover:text-studio-accent transition-colors"
                  >
                    {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  </button>

                  <div className="flex items-center gap-2 group/volume">
                    <button 
                      onClick={toggleMute}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300 flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          const newVol = parseFloat(e.target.value);
                          setVolume(newVol);
                          if (videoRef.current) videoRef.current.volume = newVol;
                          if (newVol > 0) setIsMuted(false);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  </div>

                  <div className="text-[9px] md:text-[10px] font-mono text-white/50 tracking-tighter whitespace-nowrap">
                    {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  <button 
                    onClick={toggleFullScreen}
                    className="text-white/70 hover:text-white transition-colors p-1"
                  >
                    {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Button (Visible when paused and not hovering) */}
      {showControlsEnabled && !isPlaying && !showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Play size={32} className="text-white translate-x-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
