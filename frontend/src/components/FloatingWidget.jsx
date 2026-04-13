import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Initial log seed
const initialLogs = [
  { id: 3, time: "10:35 AM", action: "Phone model checked", reason: "Insurance eligibility", status: "advisory" },
  { id: 2, time: "10:33 AM", action: "Spending data read", reason: "Building investment tip", status: "safe" },
  { id: 1, time: "10:32 AM", action: "Location checked", reason: "Fraud prevention", status: "sensitive" }
];

const mockEvents = [
  { action: "Camera accessed", reason: "Identity verification", status: "sensitive" },
  { action: "Background GPS sync", reason: "Travel insurance tracking", status: "advisory" },
  { action: "App cache cleared", reason: "Performance optimization", status: "safe" },
  { action: "Microphone enabled", reason: "Voice assistance ready", status: "sensitive" },
  { action: "Spotify data polled", reason: "Entertainment budgeting", status: "safe" }
];

const FloatingWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState(initialLogs);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sensitive': return 'bg-danger';
      case 'advisory':  return 'bg-warning';
      case 'safe':      return 'bg-success';
      default:          return 'bg-slate-300';
    }
  };

  const handleTriggerEvent = () => {
    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = {
      id: Date.now(), // unique ID for framer-motion key tracking
      time: timeString,
      ...randomEvent
    };

    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <motion.div 
      layout
      className="fixed bottom-6 right-6 z-50 glass-panel shadow-2xl border-white/60 overflow-hidden flex flex-col"
      animate={{ width: expanded ? 360 : 220 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      
      {/* Header / Toggle Button */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 focus:outline-none hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
          <span className="font-bold text-sm text-slate-primary whitespace-nowrap">
            {expanded ? "Privacy Consent Ledger" : "Privacy Ledger: Active"}
          </span>
        </div>
        <motion.div
           animate={{ rotate: expanded ? 180 : 0 }}
           transition={{ duration: 0.3 }}
           className="text-slate-secondary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.div>
      </button>

      {/* Expanded Content Area */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 350 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col border-t border-white/30 bg-white/20"
          >
            {/* Demo Trigger Button placed at top inside expanded view */}
            <div className="p-3 pb-1">
               <button 
                onClick={handleTriggerEvent}
                className="w-full bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-brand-primary/20"
              >
                Demo: Trigger Event
              </button>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex flex-col gap-1 bg-white/60 p-3 rounded-xl shadow-sm border border-white/40 group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full shadow-sm ${getStatusColor(log.status)}`}></div>
                         <span className="font-semibold text-slate-primary text-xs">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wide">{log.time}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-secondary text-[11px] leading-tight block">
                        Reason: {log.reason}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingWidget;
