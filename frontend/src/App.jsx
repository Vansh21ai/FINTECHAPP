import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';
import FloatingWidget from './components/FloatingWidget';
import OnboardingFlow from './components/OnboardingFlow';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SandboxPage from './components/SandboxPage';
import InsurancePage from './components/InsurancePage';
import InvestmentsPage from './components/InvestmentsPage';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import './index.css';

function App() {
  const [appState, setAppState] = useState('auth'); // 'auth', 'onboarding', 'dashboard'

  return (
    <>
      {/* Animated Blob Background Container */}
      <div className="blob-bg-container fixed inset-0 z-[-1] pointer-events-none">
        <div className="blob-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
          <div className="blob blob-5"></div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        
        {appState === 'auth' && (
          <motion.div 
            key="auth"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
            className="w-full h-screen relative z-10"
          >
            <AuthPage onAuthSuccess={(targetRoute) => setAppState(targetRoute || 'onboarding')} />
          </motion.div>
        )}

        {appState === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen relative z-10"
          >
            <OnboardingFlow onComplete={() => setAppState('dashboard')} />
          </motion.div>
        )}

        {appState === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="w-full h-full relative z-10"
          >
            <Routes>
              <Route path="/" element={<Dashboard onSignOut={() => setAppState('auth')} />} />
              <Route path="/sandbox" element={<SandboxPage />} />
              <Route path="/insurance" element={<InsurancePage />} />
              <Route path="/investments" element={<InvestmentsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <FloatingAIAssistant />
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}

export default App;
