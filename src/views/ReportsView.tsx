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
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-300" />
            Laporan Keuangan & Penjualan
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Analisis omzet penjualan, estimasi laba kotor, HPP material, dan ekspor laporan resmi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#0A0908] border border-stone-800 rounded-full p-1 text-xs">
            {(['all', 'this_month', 'today'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all ${
                  selectedPeriod === p
                    ? 'bg-white text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {p === 'all' ? 'Semua' : p === 'this_month' ? 'Bulan Ini' : 'Hari Ini'}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-stone-800"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">Total Omzet (Gross Revenue):</span>
          <div className="text-2xl font-extrabold text-white">{formatRupiah(totalRevenue)}</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">Estimasi HPP Material:</span>
          <div className="text-2xl font-extrabold text-rose-400">{formatRupiah(totalHPP)}</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">Laba Kotor (Gross Profit):</span>
          <div className="text-2xl font-extrabold text-amber-300">{formatRupiah(grossProfit)}</div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">Estimasi Laba Bersih:</span>
          <div className="text-2xl font-extrabold text-emerald-400">{formatRupiah(netProfit)}</div>
        </div>
      </div>

      {/* Orders Table Breakdown */}
      <div className="bg-[#0A0908] rounded-3xl border border-stone-900 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-stone-300">
          <thead className="bg-[#050505] border-b border-stone-900 text-stone-400 font-mono text-[10px] uppercase tracking-widest">
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
          <tbody className="divide-y divide-stone-900">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-stone-950/60 transition-colors">
                <td className="p-4 font-mono font-bold text-amber-300">{o.orderNumber}</td>
                <td className="p-4 font-mono text-stone-400">{o.date}</td>
                <td className="p-4 font-bold text-white">{o.customerName}</td>
                <td className="p-4">{o.type}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">{formatRupiah(o.grandTotal)}</td>
                <td className="p-4 font-mono text-stone-400">{formatRupiah(o.totalCost)}</td>
                <td className="p-4 text-right font-mono uppercase text-[10px]">{o.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
