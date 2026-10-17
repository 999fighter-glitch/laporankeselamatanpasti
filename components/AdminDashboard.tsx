'use client';

import React, { useState } from 'react';
import { ShieldCheck, LogOut, Download, Trash2, Search, Filter, ArrowUpDown } from 'lucide-react';
import { ReportRecord } from '@/types/report';

interface AdminDashboardProps {
  records: ReportRecord[];
  onLogout: () => void;
  onExportCSV: () => void;
  onClearData: () => void;
}

export function AdminDashboard({
  records,
  onLogout,
  onExportCSV,
  onClearData,
}: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredRecords = records
    .filter((r) => {
      const matchesSearch =
        !search ||
        (r.reporter || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.location || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.phone || '').includes(search);
      const matchesCat = !catFilter || r.type === catFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return (a.location || '').localeCompare(b.location || '');
      if (sortBy === 'name-desc') return (b.location || '').localeCompare(a.location || '');
      if (sortBy === 'reporter-asc') return (a.reporter || '').localeCompare(b.reporter || '');
      if (sortBy === 'reporter-desc') return (b.reporter || '').localeCompare(a.reporter || '');
      // default date-desc
      return new Date(b.date + ' ' + (b.time || '00:00')).getTime() - new Date(a.date + ' ' + (a.time || '00:00')).getTime();
    });

  const totalSafety = records.filter((r) => r.type === 'keselamatan').length;
  const totalHealth = records.filter((r) => r.type === 'kesihatan').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex justify-center">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Papan Kawalan Admin</h1>
              <p className="text-xs text-slate-500">PASTI Kawasan Kuala Langat</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Eksport CSV
            </button>
            <button
              onClick={onClearData}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Padam Semua
            </button>
            <button
              onClick={onLogout}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Keseluruhan</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{records.length}</p>
          </div>
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Laporan Keselamatan</p>
            <p className="text-3xl font-extrabold text-amber-900 mt-1">{totalSafety}</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Laporan Kesihatan</p>
            <p className="text-3xl font-extrabold text-blue-900 mt-1">{totalHealth}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pelapor / lokasi / telefon..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Semua Kategori</option>
              <option value="keselamatan">Keselamatan Sahaja</option>
              <option value="kesihatan">Kesihatan Sahaja</option>
            </select>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-4 h-4" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date-desc">Susun: Terkini Dulu</option>
              <option value="name-asc">Nama Lokasi (A-Z)</option>
              <option value="name-desc">Nama Lokasi (Z-A)</option>
              <option value="reporter-asc">Pelapor (A-Z)</option>
            </select>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Tiada rekod dijumpai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Tarikh / Masa</th>
                  <th className="p-3">Jenis</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Nama PASTI / Lokasi</th>
                  <th className="p-3">Pelapor</th>
                  <th className="p-3">Butiran</th>
                  <th className="p-3">Telefon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => {
                  let details = '';
                  if (r.type === 'keselamatan') {
                    details = r.problem || '';
                  } else {
                    details = `${r.healthCategory || 'Kesihatan'} — ${r.diseaseType === 'LAIN-LAIN' ? r.diseaseOther : r.diseaseType}`;
                    if (r.studentCount) details += ` | Pelajar: ${r.studentCount}`;
                    if (r.studentNames?.length) details += ` (${r.studentNames.join(', ')})`;
                    if (r.quarantinePeriod) details += ` | Kuarantin: ${r.quarantinePeriod}`;
                    if (r.sanitationDone) details += ' | ✅ Sanitasi';
                  }

                  const isResolved = r.status === 'resolved';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="p-3 whitespace-nowrap text-slate-600">
                        {r.date}
                        <br />
                        <span className="text-xs text-slate-400">{r.time}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            r.type === 'keselamatan'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {r.type}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">{r.location || '-'}</td>
                      <td className="p-3 text-slate-700">{r.reporter || '-'}</td>
                      <td className="p-3 text-slate-600 max-w-sm" title={details}>
                        {details}
                      </td>
                      <td className="p-3 whitespace-nowrap text-slate-600">{r.phone || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
