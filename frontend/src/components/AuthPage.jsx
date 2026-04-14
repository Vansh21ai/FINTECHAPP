import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Relative paths — Vite proxy forwards /auth/* → http://localhost:3000

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let response;
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin
        ? { email, password }
        : { name, email, password };

      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (isLogin) {
        onAuthSuccess('dashboard'); // Skip straight to dashboard
      } else {
        onAuthSuccess('onboarding'); // Show onboarding for new users
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">

        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-panel p-8 shadow-2xl border-white/60 relative overflow-hidden"
        >
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-sm shadow-md">
                E
              </div>
              <span className="text-slate-primary font-bold text-xl tracking-tight">Evlove<span className="text-brand-primary">AI</span></span>
            </div>
            <p className="text-sm text-slate-secondary">Welcome to your financial super app.</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-white/40 p-1 rounded-xl mb-6 shadow-inner border border-white/50">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-slate-secondary hover:text-slate-primary'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-slate-secondary hover:text-slate-primary'
                }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-semibold text-slate-secondary mb-1 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full bg-white/50 border border-white/60 focus:border-brand-primary/50 focus:bg-white/80 rounded-xl px-4 py-3 text-slate-primary text-sm outline-none transition-all placeholder:text-slate-400"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-slate-secondary mb-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/50 border border-white/60 focus:border-brand-primary/50 focus:bg-white/80 rounded-xl px-4 py-3 text-slate-primary text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-secondary mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/50 border border-white/60 focus:border-brand-primary/50 focus:bg-white/80 rounded-xl px-4 py-3 text-slate-primary text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm font-semibold text-center mt-1 bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full bg-brand-primary hover:bg-[#4338CA] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
