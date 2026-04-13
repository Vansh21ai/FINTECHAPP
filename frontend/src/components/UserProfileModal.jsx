import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToggleSwitch = ({ label }) => {
  const [active, setActive] = useState(true);
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/20 last:border-0">
      <span className="text-sm font-semibold text-slate-primary">{label}</span>
      <button 
        onClick={() => setActive(!active)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-success' : 'bg-slate-300'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
};

const UserProfileModal = ({ isOpen, onClose, onSignOut }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  
  const userEmail = currentUser.email || 'guest@evlove.ai';
  const rawPrefix = userEmail.split('@')[0];
  const derivedName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);
  const initials = derivedName.substring(0, 2).toUpperCase();

  const currentXp = currentUser.xp || 0;
  const currentTier = currentUser.tier || 1;
  const xpMax = currentTier * 500;
  
  const progressPercent = Math.min((currentXp / xpMax) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sliding Modal */}
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-sm h-full glass-panel shadow-2xl border-l border-white/50 rounded-none rounded-l-3xl p-6 flex flex-col"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center mt-8 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary p-1 shadow-lg mb-4">
                <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center text-white text-3xl font-bold bg-white/20 backdrop-blur-sm">
                  {initials}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-primary">{derivedName}</h2>
              <p className="text-sm text-slate-secondary">{userEmail}</p>
            </div>

            {/* Gamification Stats */}
            <div className="bg-white/40 rounded-2xl p-4 mb-8 border border-white/60 shadow-sm">
              <div className="flex justify-between text-sm font-bold text-slate-primary mb-2">
                <span>Level {currentTier} Investor</span>
                <span className="text-brand-primary">{currentXp} / {xpMax} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Settings Toggles */}
            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-secondary uppercase tracking-wider mb-4">Settings</h3>
              <div className="bg-white/30 rounded-2xl p-4 border border-white/40">
                <ToggleSwitch label="Auto-Invest Rewards" />
                <ToggleSwitch label="Push Notifications" />
                <ToggleSwitch label="Share Data for AI Insights" />
              </div>
            </div>

            {/* Sign Out Button */}
            <button 
              onClick={onSignOut}
              className="mt-6 w-full bg-danger/10 hover:bg-danger text-danger hover:text-white font-bold py-3.5 px-4 rounded-xl border border-danger/30 transition-all shadow-sm"
            >
              Sign Out
            </button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;
