'use client';

import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft, Send, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { ReportRecord } from '@/types/report';

interface SafetyFormProps {
  reporterName: string;
  reporterPhone: string;
  reporterLocation: string;
  onBack: () => void;
  onSubmitReport: (record: ReportRecord) => void;
}

export function SafetyForm({
  reporterName,
  reporterPhone,
  reporterLocation,
  onBack,
  onSubmitReport,
}: SafetyFormProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [problem, setProblem] = useState('');
  const [severity, setSeverity] = useState<'rendah' | 'sederhana' | 'kritikal'>('sederhana');
  const [location, setLocation] = useState(reporterLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) {
      alert('Sila nyatakan masalah keselamatan.');
      return;
    }

    const newRecord: ReportRecord = {
      id: 'SEC-' + Date.now(),
      type: 'keselamatan',
      date,
      time,
      reporter: reporterName,
      phone: reporterPhone,
      location,
      problem: problem.trim(),
      severity,
      status: 'pending',
    };

    onSubmitReport(newRecord);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-xs font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
        </button>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Borang Laporan Keselamatan</h2>
            <p className="text-xs text-slate-500">PASTI Kuala Langat</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tarikh *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Masa *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </span>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nama PASTI / Lokasi Kejadian *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tahap Keterukan / Urgency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'rendah', label: 'Rendah', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
                { id: 'sederhana', label: 'Sederhana', color: 'border-amber-200 bg-amber-50 text-amber-800' },
                { id: 'kritikal', label: 'Kritikal / Segera', color: 'border-rose-200 bg-rose-50 text-rose-800' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSeverity(s.id as any)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    severity === s.id
                      ? `${s.color} ring-2 ring-offset-1 ring-slate-900 shadow-sm`
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Butiran Masalah / Kerosakan Keselamatan *
            </label>
            <textarea
              required
              rows={4}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Cth: Pagar belakang sekolah tercabut, bumbung bocor di bilik darjah 3, suis elektrik terbakar..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Laporan ini akan disimpan ke pangkalan data tempatan dan anda juga boleh kongsikan ringkasan melalui WhatsApp kepada Penyelaras PASTI.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Hantar Laporan Keselamatan</span>
          </button>
        </form>
      </div>
    </div>
  );
}
