'use client';

import React, { useState } from 'react';
import { HeartPulse, ArrowLeft, Send, Calendar, Clock, CheckSquare } from 'lucide-react';
import { ReportRecord } from '@/types/report';

interface HealthFormProps {
  reporterName: string;
  reporterPhone: string;
  reporterLocation: string;
  onBack: () => void;
  onSubmitReport: (record: ReportRecord) => void;
}

export function HealthForm({
  reporterName,
  reporterPhone,
  reporterLocation,
  onBack,
  onSubmitReport,
}: HealthFormProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [location, setLocation] = useState(reporterLocation);
  
  const [healthCategory, setHealthCategory] = useState('Penyakit Berjangkit');
  const [diseaseType, setDiseaseType] = useState('HFMD');
  const [diseaseOther, setDiseaseOther] = useState('');
  const [studentCount, setStudentCount] = useState('1');
  const [studentNamesStr, setStudentNamesStr] = useState('');
  const [quarantinePeriod, setQuarantinePeriod] = useState('7 Hari');
  const [sanitationDone, setSanitationDone] = useState(false);

  const diseaseOptions = [
    'HFMD',
    'Influenza',
    'Dengue',
    'Chickenpox',
    'Demam Selsema',
    'Gastroenteritis (Muntah/Cirit-birit)',
    'LAIN-LAIN',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentNames = studentNamesStr
      ? studentNamesStr.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const newRecord: ReportRecord = {
      id: 'HLT-' + Date.now(),
      type: 'kesihatan',
      date,
      time,
      reporter: reporterName,
      phone: reporterPhone,
      location,
      healthCategory,
      diseaseType,
      diseaseOther: diseaseType === 'LAIN-LAIN' ? diseaseOther : undefined,
      studentCount,
      studentNames,
      quarantinePeriod,
      sanitationDone,
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
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Borang Laporan Kesihatan</h2>
            <p className="text-xs text-slate-500">PASTI Kuala Langat</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nama PASTI / Cawangan *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Kategori Kesihatan / Penyakit *
            </label>
            <select
              value={diseaseType}
              onChange={(e) => setDiseaseType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {diseaseOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {diseaseType === 'LAIN-LAIN' && (
            <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nyatakan Penyakit Lain *
            </label>
            <input
              type="text"
              required
              value={diseaseOther}
              onChange={(e) => setDiseaseOther(e.target.value)}
              placeholder="Cth: Cacar air ringan"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Bilangan Pelajar Terjejas *
              </label>
              <input
                type="number"
                min="1"
                required
                value={studentCount}
                onChange={(e) => setStudentCount(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tempoh Kuarantin
              </label>
              <input
                type="text"
                value={quarantinePeriod}
                onChange={(e) => setQuarantinePeriod(e.target.value)}
                placeholder="Cth: 7 Hari / 10 Hari"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nama Pelajar Terjejas (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={studentNamesStr}
              onChange={(e) => setStudentNamesStr(e.target.value)}
              placeholder="Cth: Ahmad Zikri, Nur Aina"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="sanitation"
              checked={sanitationDone}
              onChange={(e) => setSanitationDone(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="sanitation" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-blue-600" /> Proses sanitasi/nyahcemar premis telah/akan dilakukan segera
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Send className="w-4 h-4" />
            <span>Hantar Laporan Kesihatan</span>
          </button>
        </form>
      </div>
    </div>
  );
}
