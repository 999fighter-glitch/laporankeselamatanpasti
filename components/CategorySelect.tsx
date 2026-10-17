'use client';

import React from 'react';
import { ShieldAlert, HeartPulse, History, LogOut, UserCheck } from 'lucide-react';
import { ReportType } from '@/types/report';

interface CategorySelectProps {
  reporterName: string;
  reporterLocation: string;
  onSelectCategory: (type: ReportType) => void;
  onOpenHistory: () => void;
  onChangeUser: () => void;
}

export function CategorySelect({
  reporterName,
  reporterLocation,
  onSelectCategory,
  onOpenHistory,
  onChangeUser,
}: CategorySelectProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <UserCheck className="w-3.5 h-3.5" /> Pelapor Aktif
            </div>
            <h2 className="text-xl font-bold text-slate-900">{reporterName}</h2>
            <p className="text-xs text-slate-500">{reporterLocation}</p>
          </div>
          <button
            onClick={onChangeUser}
            className="self-start md:self-auto text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Tukar Pelapor
          </button>
        </div>

        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Sila Pilih Jenis Laporan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pilih borang yang ingin dihantar untuk PASTI Kuala Langat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectCategory('keselamatan')}
            className="group relative bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-2xl p-6 text-left transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Laporan Keselamatan</h3>
              <p className="text-xs text-slate-600 mt-1">
                Kerosakan bangunan, isu keselamatan premis, pagar, pendawaian, atau hazard persekitaran.
              </p>
            </div>
            <span className="mt-6 text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Buka Borang Keselamatan &rarr;
            </span>
          </button>

          <button
            onClick={() => onSelectCategory('kesihatan')}
            className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-2xl p-6 text-left transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Laporan Kesihatan</h3>
              <p className="text-xs text-slate-600 mt-1">
                Kes penyakit berjangkit (HFMD, Influenza, Denggi, dll.), jumlah pelajar terjejas, dan sanitasi.
              </p>
            </div>
            <span className="mt-6 text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Buka Borang Kesihatan &rarr;
            </span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <button
            onClick={onOpenHistory}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-5 py-2.5 rounded-xl transition-colors"
          >
            <History className="w-4 h-4" /> Lihat Sejarah Laporan Dihantar
          </button>
        </div>
      </div>
    </div>
  );
}
