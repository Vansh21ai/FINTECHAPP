import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Inline Sparkles SVG replacing lucide-react to avoid Vite restart requirement
const SparklesIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

const insights = [
  "Based on your 42% loss probability, consider moving $500 to a liquid asset.",
  "You are 750 XP away from 'Money Master' tier. Invest your $45 weekly goal to level up!",
  "Warning: Your laptop is currently vulnerable. Tap the Insurance Visualizer to add coverage for $4/mo."
];

const slideVariants = {
  enter: {
    y: 20,
    opacity: 0,
    filter: 'blur(4px)'
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      y: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
      filter: { duration: 0.4 }
    }
  },
  exit: {
    zIndex: 0,
    y: -20,
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      y: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      filter: { duration: 0.3 }
    }
  }
};

const AiInsightsFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="col-span-1 lg:col-span-12 w-full mt-2">
      <div className="glass-panel p-4 lg:p-5 flex items-center justify-between overflow-hidden relative border-white/60 shadow-xl shadow-brand-primary/5 rounded-[20px] group">
        
        {/* Subtle Inner Glow Effect */}
        <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_0_20px_rgba(255,255,255,0.7)] pointer-events-none"></div>

        <div className="flex items-center gap-4 w-full px-2">
          
          {/* Sparkle Icon Box */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 flex justify-center items-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
             <SparklesIcon className="text-brand-primary w-5 h-5 animate-pulse drop-shadow-sm" />
          </div>

          <div className="flex font-bold text-sm tracking-wide text-brand-primary items-center">
            EvloveAI Insight <span className="opacity-40 mx-2">|</span>
          </div>

          {/* Sliding Text Area */}
          <div className="relative flex-1 h-6 overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex items-center text-slate-primary font-medium text-sm md:text-base leading-none truncate"
              >
                {insights[currentIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AiInsightsFeed;
