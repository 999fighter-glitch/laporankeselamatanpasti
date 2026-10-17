'use client';

import React, { useState } from 'react';
import {
  History,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  User,
  Check,
} from 'lucide-react';
import { ReportRecord, ReportStatus } from '@/types/report';

interface HistoryViewProps {
  records: ReportRecord[];
  onBack: () => void;
  currentReporterName?: string;
  onUpdateStatus?: (id: string, status: ReportStatus) => void;
}

export function HistoryView({
  records,
  onBack,
  currentReporterName = '',
  onUpdateStatus,
}: HistoryViewProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const normalizedCurrentReporter = currentReporterName.trim().toLowerCase();

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      !search ||
      (r.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.reporter || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || r.type === typeFilter;
    const itemStatus: ReportStatus = r.status || 'pending';
    const matchesStatus = !statusFilter || itemStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPending = records.filter((r) => (r.status || 'pending') === 'pending').length;
  const totalResolved = records.filter((r) => r.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 mb-6 gap-4">
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-xs font-semibold transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
          </button>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sejarah Laporan Dihantar</h2>
              {currentReporterName && (
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3 text-emerald-600" /> Log masuk sebagai:{' '}
                  <span className="font-semibold text-slate-700">{currentReporterName}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats summary banner */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Jumlah Rekod
            </span>
            <span className="text-xl font-bold text-slate-900">{records.length}</span>
          </div>
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              Menunggu Tindakan
            </span>
            <span className="text-xl font-bold text-amber-700">{totalPending}</span>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Telah Selesai
            </span>
            <span className="text-xl font-bold text-emerald-700">{totalResolved}</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
          <div className="sm:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari mengikut lokasi atau pelapor..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Semua Jenis</option>
              <option value="keselamatan">Keselamatan</option>
              <option value="kesihatan">Kesihatan</option>
            </select>
          </div>

          <div className="sm:col-span-3 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Clock className="w-4 h-4" />
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">🟡 Menunggu Tindakan</option>
              <option value="resolved">🟢 Selesai (Resolved)</option>
            </select>
          </div>
        </div>

        {/* Informative helper note */}
        <div className="mb-4 text-xs text-slate-500 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <span>
            💡 <strong>Petunjuk:</strong> Pelapor boleh mengemas kini status laporan milik sendiri
            kepada <strong className="text-emerald-700">Selesai (Resolved)</strong> setelah tindakan
            pembaikan atau pemulihan diambil.
          </span>
        </div>

        {/* Content Table / Empty State */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm font-medium">Tiada laporan dijumpai dalam rekod.</p>
            <p className="text-slate-400 text-xs mt-1">Cuba tukar kata carian atau tetapan penapis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3.5 whitespace-nowrap">Tarikh / Masa</th>
                  <th className="p-3.5 whitespace-nowrap">Jenis</th>
                  <th className="p-3.5 whitespace-nowrap">Status</th>
                  <th className="p-3.5">Nama PASTI / Lokasi</th>
                  <th className="p-3.5">Pelapor</th>
                  <th className="p-3.5">Butiran</th>
                  <th className="p-3.5 text-center whitespace-nowrap">Tindakan Pelapor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => {
                  const isResolved = r.status === 'resolved';
                  const isOwnReport = Boolean(
                    normalizedCurrentReporter &&
                      r.reporter &&
                      r.reporter.trim().toLowerCase() === normalizedCurrentReporter
                  );

                  let details = '';
                  if (r.type === 'keselamatan') {
                    details = r.problem || '';
                  } else {
                    details = `${r.healthCategory || 'Kesihatan'} — ${
                      r.diseaseType === 'LAIN-LAIN' ? r.diseaseOther : r.diseaseType
                    }`;
                    if (r.studentCount) details += ` (${r.studentCount} pelajar)`;
                    if (r.sanitationDone) details += ' | ✅ Sanitasi';
                  }

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${
                        isResolved ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Date & Time */}
                      <td className="p-3.5 whitespace-nowrap text-slate-600">
                        <span className="font-medium text-slate-800">{r.date}</span>
                        <br />
                        <span className="text-[11px] text-slate-400 font-mono">{r.time}</span>
                      </td>

                      {/* Type */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                            r.type === 'keselamatan'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {r.type}
                        </span>
                      </td>

                      {/* Status Indicator */}
                      <td className="p-3.5 whitespace-nowrap">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Selesai</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Menunggu</span>
                          </span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="p-3.5 font-semibold text-slate-900">{r.location || '-'}</td>

                      {/* Reporter */}
                      <td className="p-3.5 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{r.reporter || '-'}</span>
                          {isOwnReport && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Anda
                            </span>
                          )}
                        </div>
                        {r.phone && <div className="text-[11px] text-slate-400">{r.phone}</div>}
                      </td>

                      {/* Details */}
                      <td className="p-3.5 text-slate-600 max-w-xs truncate" title={details}>
                        {details}
                      </td>

                      {/* Action Button for Reporter */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {isOwnReport ? (
                          !isResolved ? (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus?.(r.id, 'resolved')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                              title="Tandakan laporan ini sebagai selesai"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Tanda Selesai</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Selesai
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateStatus?.(r.id, 'pending')}
                                className="text-[11px] text-slate-400 hover:text-amber-700 underline transition-colors flex items-center gap-0.5"
                                title="Buka semula laporan jika memerlukan tindakan lanjut"
                              >
                                <RotateCcw className="w-3 h-3" /> Buka
                              </button>
                            </div>
                          )
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Hanya pelapor
                          </span>
                        )}
                      </td>
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
