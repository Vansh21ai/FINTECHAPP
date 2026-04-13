import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    id: 1,
    question: "What is your monthly income?",
    options: ["Below $2k", "$2k - $5k", "$5k+"]
  },
  {
    id: 2,
    question: "What is your biggest financial worry?",
    options: ["Losing money", "Not saving", "Don't understand investing"]
  },
  {
    id: 3,
    question: "Pick your first goal",
    options: ["Emergency fund", "Travel", "Start a business"]
  }
];

// Animation variants for sliding cards
const slideVariants = {
  enter: {
    x: 1000,
    opacity: 0,
    scale: 0.95
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      duration: 0.5,
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    zIndex: 0,
    x: -1000,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleSelect = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Trigger completion sequence (like a slight delay before unmounting)
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  }

  const currentQ = questions[currentStep];

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* We rely on App.jsx having the blob background behind us */}
      
      <div className="relative w-full max-w-md h-96 flex items-center justify-center overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 glass-panel p-8 flex flex-col justify-center items-center text-center shadow-xl border-white/60"
          >
            <div className="text-brand-primary font-bold text-xs uppercase tracking-widest mb-4">
              Step {currentStep + 1} of {questions.length}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-primary mb-8 leading-tight">
              {currentQ.question}
            </h2>

            <div className="w-full flex flex-col gap-3">
              {currentQ.options.map((option, i) => (
                <button
                  key={i}
                  onClick={handleSelect}
                  className="w-full py-4 px-6 rounded-[16px] text-slate-primary font-semibold text-sm transition-all duration-200
                           bg-white/65 backdrop-blur-md border border-white/40 hover:bg-white border hover:border-brand-primary shadow-sm
                           hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-1.5 justify-center">
              {questions.map((_, dotIndex) => (
                <div 
                  key={dotIndex} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    dotIndex === currentStep ? 'bg-brand-primary w-4' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingFlow;
