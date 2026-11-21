import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginWithDemo('Ramesh Patel', 'farmer@krishipulse.org');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-crimson-laser selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-crimson-laser to-rose-700 shadow-laser-md">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tight text-chrome-metallic">
            KRISHI<span className="text-laser-crimson">PULSE</span>
          </span>
        </Link>
        <h2 className="text-xl font-black uppercase tracking-wider text-white font-mono">
          AUTHENTICATE CONSOLE
        </h2>
        <p className="mt-2 text-xs text-chrome-500 font-mono">
          Enter cryptographic credentials or launch demo matrix
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-chrome-800 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-crimson-950/40 border border-crimson-laser/40 p-3 text-xs text-crimson-400 font-mono">
              <AlertCircle className="h-4 w-4 shrink-0 text-crimson-laser" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                Email Address
              </label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-chrome-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@krishipulse.org"
                  className="w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-chrome-600 focus:border-crimson-laser focus:outline-none focus:ring-1 focus:ring-crimson-laser"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-chrome-400">
                Passphrase
              </label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-chrome-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-chrome-800 bg-obsidian-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-chrome-600 focus:border-crimson-laser focus:outline-none focus:ring-1 focus:ring-crimson-laser"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson-laser to-rose-700 py-3 text-xs font-black uppercase tracking-wider text-white shadow-laser-md hover:scale-105 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'ACCESS CONSOLE'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Access Button in Obsidian Chrome */}
          <div className="mt-6 pt-6 border-t border-obsidian-800">
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-chrome-700 bg-obsidian-950 py-2.5 text-xs font-bold uppercase tracking-wider text-chrome-200 hover:border-crimson-laser hover:text-white transition font-mono shadow-sm"
            >
              <ShieldCheck className="h-4 w-4 text-crimson-laser" />
              <span>1-CLICK DEMO MATRIX LOGIN</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-chrome-500 font-mono">
            New node operator?{' '}
            <Link to="/register" className="font-bold text-crimson-laser hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
