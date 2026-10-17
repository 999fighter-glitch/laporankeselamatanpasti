'use client';

import React, { useState } from 'react';
import { ShieldCheck, KeyRound, ArrowRight, Lock } from 'lucide-react';

interface CodeAuthProps {
  onSuccess: () => void;
  onGoAdmin: () => void;
}

export function CodeAuth({ onSuccess, onGoAdmin }: CodeAuthProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === '1010') {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 shadow-emerald-600/30">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          LAPORAN KESELAMATAN & KESIHATAN
        </h1>
        <p className="text-sm font-medium text-emerald-700 mt-1">
          PASTI KAWASAN KUALA LANGAT
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Kod Akses Sistem / Unit
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Masukkan Kod (cth: 1010)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-lg tracking-widest"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Kod akses tidak sah. Sila cuba lagi (Kod: 1010).
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Masuk Sistem</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Pentadbir Kawasan?</span>
          <button
            type="button"
            onClick={onGoAdmin}
            className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
          >
            Papan Kawalan Admin
          </button>
        </div>
      </div>
    </div>
  );
}
