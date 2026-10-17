'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AdminLogin({ onBack, onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'admin100') {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-xs font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 text-center">Papan Kawalan Admin</h2>
        <p className="text-xs text-slate-500 text-center mt-1 mb-6">
          Log masuk untuk melihat semua rekod, statistik, dan eksport data.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Kata Laluan Admin
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Masukkan kata laluan (admin100)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Kata laluan salah. Sila cuba lagi (Kata laluan: admin100).
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Log Masuk Admin</span>
          </button>
        </form>
      </div>
    </div>
  );
}
