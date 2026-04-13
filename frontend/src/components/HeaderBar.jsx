import React, { useState, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import UserProfileModal from './UserProfileModal';

const HeaderBar = ({ onSignOut }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const [xp, setXp] = useState(currentUser.xp || 0);
  const [level, setLevel] = useState(currentUser.tier || 1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const userEmail = currentUser.email || 'guest@evlove.ai';
  const rawPrefix = userEmail.split('@')[0];
  const derivedName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);
  const initials = derivedName.substring(0, 2).toUpperCase();

  // Strip letters (e.g. "Bronze1") leaving only the numeric part
  const numericLevel = parseInt(String(level).replace(/\D/g, '')) || 1;
  const xpMax = numericLevel * 500;

  // ── Add XP button ─────────────────────────────────────────────
  const handleAddXp = () => {
    setXp(prev => prev + 500);
  };

  // ── Level-Up detector ─────────────────────────────────────────
  // Runs whenever xp changes. Uses the current level from render scope (not stale).
  useEffect(() => {
    const maxXP = (parseInt(String(level).replace(/\D/g, '')) || 1) * 500;
    if (xp >= maxXP) {
      setShowLevelUp(true);           // 🎉 trigger Lottie
      setXp(prev => prev - maxXP);   // roll over remainder
      setLevel(prev => prev + 1);    // increment tier
    }
  }, [xp]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Lottie auto-dismiss ────────────────────────────────────────
  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp]);

  // ── Persist xp & level to localStorage ────────────────────────
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user')) || {};
    localStorage.setItem('user', JSON.stringify({ ...stored, xp, tier: level }));
  }, [xp, level]);

  const progressPercent = Math.min((xp / xpMax) * 100, 100);

  return (
    <>
      <div className="glass-panel w-full p-4 flex items-center justify-between col-span-1 md:col-span-12 relative overflow-hidden">
        
        {/* Profile Avatar & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary p-0.5 shadow-md hover:scale-105 hover:shadow-lg transition-all focus:outline-none"
          >
            <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center text-white font-bold bg-white/20 backdrop-blur-sm">
              {initials}
            </div>
          </button>
          <span className="text-slate-primary font-bold text-xl tracking-tight hidden sm:block">Evlove<span className="text-brand-primary">AI</span></span>
        </div>

        {/* Financial XP Progress Bar */}
        <div className="hidden md:flex flex-col items-center gap-1.5 w-1/3">
          <div className="flex justify-between w-full text-sm text-slate-secondary font-medium px-1">
            <span>Level {level} Investor</span>
            <span className="text-brand-primary font-semibold">{xp} / {xpMax} XP</span>
          </div>
          <div className="relative w-full h-2.5 rounded-full bg-black/5 overflow-hidden border border-black/5 block">
            <div 
              className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Badges / Controls */}
        <div className="flex items-center gap-4">
          
          {/* Demo Button */}
          <button 
            onClick={handleAddXp}
            className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-brand-primary/20"
          >
            Demo: Add XP
          </button>

          {/* Trust Score Badge */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs text-slate-secondary font-medium uppercase tracking-wider">Trust Score</span>
              <span className="text-slate-primary font-bold leading-tight">Excellent</span>
            </div>
            <div className="w-12 h-12 rounded-full border-[3px] border-success flex items-center justify-center text-success font-bold text-lg bg-success/10 shadow-sm relative">
              98
              <span className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full animate-ping opacity-75"></span>
              <span className="absolute top-0 right-0 w-3 h-3 bg-success rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Level Up Lottie Overlay */}
        {showLevelUp && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm transition-opacity duration-500">
            <div className="animate-[fade-in-up_0.5s_ease-out]">
              <Player
                autoplay
                keepLastFrame
                src="https://lottie.host/eec00bb0-30dd-4d7a-8fbb-ec104d41e2a0/pZntbM3JqI.json"
                style={{ height: '150px', width: '150px' }}
              />
            </div>
            <div className="absolute font-black text-2xl text-brand-primary tracking-widest drop-shadow-md top-[20%]">
              LEVEL UP!
            </div>
          </div>
        )}

      </div>

      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        xp={xp}
        level={level}
        xpMax={xpMax}
        onSignOut={onSignOut}
      />
    </>
  );
};

export default HeaderBar;
