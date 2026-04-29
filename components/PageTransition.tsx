import React from 'react';
import { motion } from 'motion/react';

const PageTransition: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        document.body.style.overflow = 'auto';
      }}
      className="fixed inset-0 z-[100] bg-studio-black flex items-center justify-center pointer-events-none"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img 
            src="https://i.ibb.co/krv9LzL/mci-metallic-transparent-logo.png" 
            alt="Logo" 
            className="h-16 w-auto brightness-150 grayscale-0"
          />
        </motion.div>
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-0 bg-studio-accent"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PageTransition;
