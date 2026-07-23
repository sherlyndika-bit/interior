import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { BarChart3, Download } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'this_month' | 'today'>('all');

  const filteredOrders = orders.filter(o => {
    if (selectedPeriod === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      return o.date === todayStr;
    }
    if (selectedPeriod === 'this_month') {
      const currentMonthStr = new Date().toISOString().slice(0, 7);
      return o.date.startsWith(currentMonthStr);
    }
    return true;
  });

  const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalHPP = filteredOrders.reduce((acc, o) => acc + o.totalCost, 0);
  const grossProfit = Math.max(0, totalRevenue - totalHPP);
  const totalTax = filteredOrders.reduce((acc, o) => acc + o.taxAmount, 0);
  const netProfit = Math.max(0, grossProfit - totalTax);

  const exportCSV = () => {
    const headers = ['No. Order', 'Tanggal', 'Klien', 'Tipe', 'Grand Total', 'HPP', 'Status'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      o.date,
      `"${o.customerName}"`,
      o.type,
      o.grandTotal,
      o.totalCost,
      o.stage
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Penjualan_InteriorCraft_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Laporan Keuangan & Penjualan
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Analisis omzet penjualan, estimasi laba kotor, HPP material, dan ekspor laporan resmi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 text-xs shadow-sm">
            {(['all', 'this_month', 'today'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider transition-all ${
                  selectedPeriod === p
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {p === 'all' ? 'Semua' : p === 'this_month' ? 'Bulan Ini' : 'Hari Ini'}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2.5 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Total Omzet (Gross Revenue):</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-white">{formatRupiah(totalRevenue)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Estimasi HPP Material:</span>
          <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{formatRupiah(totalHPP)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Laba Kotor (Gross Profit):</span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-white">{formatRupiah(grossProfit)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Estimasi Laba Bersih:</span>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatRupiah(netProfit)}</div>
        </div>
      </div>

      {/* Orders Table Breakdown */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium uppercase text-[10px]">
            <tr>
              <th className="p-4">No. Order</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Nama Klien</th>
              <th className="p-4">Tipe Proyek</th>
              <th className="p-4">Total Omzet</th>
              <th className="p-4">HPP Material</th>
              <th className="p-4 text-right">Tahap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/60 transition-colors">
                <td className="p-4 font-mono font-bold text-zinc-900 dark:text-white">{o.orderNumber}</td>
                <td className="p-4 font-mono text-zinc-500 dark:text-zinc-400">{o.date}</td>
                <td className="p-4 font-bold text-zinc-900 dark:text-white">{o.customerName}</td>
                <td className="p-4">{o.type}</td>
                <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(o.grandTotal)}</td>
                <td className="p-4 font-mono text-zinc-500 dark:text-zinc-400">{formatRupiah(o.totalCost)}</td>
                <td className="p-4 text-right font-mono uppercase text-[10px]">{o.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
