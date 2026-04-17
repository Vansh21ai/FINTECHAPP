import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, MicOff, Volume2 } from 'lucide-react';
import { API_BASE } from '../api';

// ─── Orb ring colors per state ──────────────────────────────────────────────
const STATE_META = {
  idle:      { label: 'Tap orb to speak',  ringColor: 'rgba(108,99,255,0.18)' },
  listening: { label: '● Listening...',    ringColor: 'rgba(0,212,170,0.22)'  },
  thinking:  { label: '◌ Processing...',   ringColor: 'rgba(200,200,255,0.22)' },
  speaking:  { label: '▶ Speaking',        ringColor: 'rgba(0,212,170,0.18)'  },
};

// ─── Expanding wave ring ────────────────────────────────────────────────────
const WaveRing = ({ delay, color }) => (
  <motion.span
    className="absolute inset-0 rounded-full"
    style={{ border: `1.5px solid ${color}` }}
    initial={{ opacity: 0.7, scale: 1 }}
    animate={{ opacity: 0, scale: 2.6 }}
    transition={{ duration: 2.4, delay, repeat: Infinity, ease: 'easeOut' }}
  />
);

// ───────────────────────────────────────────────────────────────────────────
const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen]         = useState(false);
  const [orbState, setOrbState]     = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('How can I help you today?');
  const [inputValue, setInputValue] = useState('');
  const [showText, setShowText]     = useState(false);

  // ── Cleanup on close ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel();
      setOrbState('idle');
      setTranscript('');
    }
  }, [isOpen]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // ── TTS ─────────────────────────────────────────────────────
  const speakText = (text, isVoice) => {
    window.speechSynthesis?.cancel();
    if (!isVoice) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.onstart = () => setOrbState('speaking');
    utter.onend   = () => setOrbState('idle');
    utter.onerror = () => setOrbState('idle');
    window.speechSynthesis.speak(utter);
  };

  // ── Backend call with auto-retry ────────────────────────────
  const sendMessage = async (text, isVoice = false) => {
    if (!text.trim()) return;
    setTranscript(text);
    setAiResponse('');
    setOrbState('thinking');

    const MAX_RETRIES = 3;
    let attempt = 0;
    while (attempt <= MAX_RETRIES) {
      try {
        const res  = await fetch(`${API_BASE}/api/voice/ask`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ spoken_text: text, mode: 'present' }),
        });
        const data = await res.json();

        const rateLimited =
          data?.answer?.toLowerCase().includes('rate limit') ||
          data?.answer?.toLowerCase().includes('quota')      ||
          data?.answer?.toLowerCase().includes('retry in');

        if (rateLimited && attempt < MAX_RETRIES) {
          const wait = Math.pow(2, attempt + 1);
          setAiResponse(`⏳ API busy — retrying in ${wait}s...`);
          await new Promise(r => setTimeout(r, wait * 1000));
          attempt++; continue;
        }

        const answer = data.success ? data.answer : (data.error || 'Sorry, unable to process that.');
        setAiResponse(answer);
        speakText(answer, isVoice);
        if (!isVoice) setOrbState('idle');
        return;
      } catch {
        if (attempt < MAX_RETRIES) {
          const wait = Math.pow(2, attempt + 1);
          setAiResponse(`⏳ Reconnecting in ${wait}s...`);
          await new Promise(r => setTimeout(r, wait * 1000));
          attempt++;
        } else {
          setAiResponse('Network error. Is the backend running on port 3001?');
          setOrbState('idle'); return;
        }
      }
    }
    setAiResponse('AI temporarily overloaded. Please try again shortly.');
    setOrbState('idle');
  };

  // ── Voice recognition ────────────────────────────────────────
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition requires Chrome.'); return; }
    window.speechSynthesis?.cancel();
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onstart  = () => setOrbState('listening');
    rec.onresult = e => { rec.stop(); sendMessage(e.results[0][0].transcript, true); };
    rec.onerror  = () => setOrbState('idle');
    rec.onend    = () => { if (orbState === 'listening') setOrbState('idle'); };
    rec.start();
  };

  const handleClose = () => {
    window.speechSynthesis?.cancel();
    setIsOpen(false);
  };

  const meta = STATE_META[orbState];
  const showWaves = orbState === 'listening' || orbState === 'speaking';

  return (
    <>
      {/* ── Trigger button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.09 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/60 overflow-hidden"
            style={{ boxShadow: '0 0 35px 8px rgba(108,99,255,0.5)' }}
          >
            {/* smudged orb mini */}
            <div className="absolute inset-0" style={{
              background: 'conic-gradient(from 180deg at 50% 50%, #0D1B2A 0deg, #6C63FF 120deg, #00D4AA 240deg, #0D1B2A 360deg)',
              filter: 'blur(6px)', transform: 'scale(1.3)',
            }} />
            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-15" />
            <Mic size={24} className="relative z-10 text-white drop-shadow-lg" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Full-screen overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{
              background: 'rgba(6, 5, 20, 0.9)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
            }}
          >
            {/* ambient blobs */}
            <div className="pointer-events-none absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
                 style={{ background: '#6C63FF' }} />
            <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-[380px] h-[380px] rounded-full opacity-10 blur-3xl"
                 style={{ background: '#00D4AA' }} />

            {/* ─── ORB ─────────────────────────────────────────────── */}
            <div className="relative flex items-center justify-center mb-10" style={{ width: 240, height: 240 }}>

              {/* Wave rings */}
              {showWaves && (
                <>
                  <WaveRing delay={0}   color={meta.ringColor} />
                  <WaveRing delay={0.7} color={meta.ringColor} />
                  <WaveRing delay={1.4} color={meta.ringColor} />
                </>
              )}

              {/* Thinking pulse */}
              {orbState === 'thinking' && (
                <motion.span className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid rgba(180,180,255,0.35)' }}
                  animate={{ scale: [1, 1.14, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}

              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 60px 25px rgba(108,99,255,0.35)' }}
              />

              {/* Main clickable orb */}
              <motion.div
                className="relative rounded-full overflow-hidden cursor-pointer select-none"
                style={{ width: 230, height: 230 }}
                /* breathing */
                animate={orbState === 'idle' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={orbState === 'idle'
                  ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }}
                onClick={orbState === 'idle' ? startListening : undefined}
              >
                {/* Layer 1 — rotating conic smudge */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      'conic-gradient(from 0deg at 50% 50%, #0D1B2A 0deg, #6C63FF 100deg, #00D4AA 200deg, #0D1B2A 280deg, #6C63FF 360deg)',
                    filter: 'blur(18px)',
                    transform: 'scale(1.25)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                />

                {/* Layer 2 — slower counter-rotate radial accent */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(ellipse at 70% 30%, rgba(0,212,170,0.55) 0%, transparent 65%), radial-gradient(ellipse at 30% 70%, rgba(108,99,255,0.55) 0%, transparent 65%)',
                    filter: 'blur(14px)',
                    transform: 'scale(1.15)',
                    mixBlendMode: 'screen',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                />

                {/* Layer 3 — deep navy center */}
                <div className="absolute inset-0 rounded-full"
                     style={{ background: 'radial-gradient(circle at 50% 50%, rgba(13,27,42,0.55) 0%, transparent 70%)' }} />

                {/* Specular highlight — stays still */}
                <div className="absolute" style={{
                  top: '14%', left: '16%', width: '34%', height: '26%',
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.42) 0%, transparent 75%)',
                  filter: 'blur(7px)',
                  borderRadius: '50%',
                }} />

                {/* State icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {orbState === 'idle' && (
                    <Mic size={46} className="text-white/85 drop-shadow-2xl" />
                  )}
                  {orbState === 'listening' && (
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.55, repeat: Infinity }}>
                      <Mic size={46} className="text-emerald-300 drop-shadow-2xl" />
                    </motion.div>
                  )}
                  {orbState === 'thinking' && (
                    <motion.div
                      className="w-11 h-11 rounded-full border-4 border-indigo-300/50 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {orbState === 'speaking' && (
                    <motion.div animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 0.45, repeat: Infinity }}>
                      <Volume2 size={46} className="text-teal-200 drop-shadow-2xl" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* ── State label ── */}
            <motion.p
              key={orbState}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/45 text-xs font-bold uppercase tracking-[0.22em] mb-5"
            >
              {meta.label}
            </motion.p>

            {/* ── User transcript ── */}
            {transcript && (
              <p className="text-white/35 text-sm italic text-center max-w-md px-6 mb-2">
                "{transcript}"
              </p>
            )}

            {/* ── AI response ── */}
            <AnimatePresence mode="wait">
              {aiResponse && (
                <motion.p
                  key={aiResponse.slice(0, 30)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-white/88 text-lg font-light text-center max-w-xl px-8 leading-relaxed mb-10"
                >
                  {aiResponse}
                </motion.p>
              )}
            </AnimatePresence>

            {/* ── Inline text input ── */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  className="flex gap-2 mb-6 w-full max-w-md px-5"
                >
                  <input
                    autoFocus
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        sendMessage(inputValue, false);
                        setInputValue(''); setShowText(false);
                      }
                    }}
                    placeholder="Type your question..."
                    className="flex-1 bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/30 rounded-2xl px-5 py-3 text-sm outline-none focus:border-indigo-400/60"
                  />
                  <button
                    onClick={() => { sendMessage(inputValue, false); setInputValue(''); setShowText(false); }}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white p-3 rounded-2xl transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Controls ── */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowText(v => !v)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white/65 text-sm font-medium border border-white/15 transition-colors"
              >
                <Send size={14} /> Type instead
              </motion.button>

              {orbState === 'speaking' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { window.speechSynthesis?.cancel(); setOrbState('idle'); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 text-sm font-medium border border-teal-400/25 transition-colors"
                >
                  <MicOff size={14} /> Stop
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white/65 hover:text-red-300 text-sm font-medium border border-white/15 hover:border-red-400/30 transition-colors"
              >
                <X size={14} /> Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIAssistant;
