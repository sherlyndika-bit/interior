import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';
import { BarChart3, TrendingUp, DollarSign, PieChart, Calendar, Download, ArrowUpRight, ArrowDownRight, PackageCheck } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, products } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'this_month' | 'today'>('all');

  // Filter orders by period
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

  // Calculate Metrics
  const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalHPP = filteredOrders.reduce((acc, o) => acc + o.totalCost, 0);
  const grossProfit = Math.max(0, totalRevenue - totalHPP);
  const totalTax = filteredOrders.reduce((acc, o) => acc + o.taxAmount, 0);
  const netProfit = Math.max(0, grossProfit - totalTax);
  const totalOrdersCount = filteredOrders.length;
  const readyStockCount = filteredOrders.filter(o => o.type === 'Ready Stock').length;
  const customCount = filteredOrders.filter(o => o.type === 'Pre-Order / Custom').length;

  const exportCSV = () => {
    const headers = ['No. Order', 'Tanggal', 'Klien', 'Tipe', 'Item', 'Grand Total', 'HPB', 'Status'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      o.date,
      `"${o.customerName}"`,
      o.type,
      `"${o.items.map(i => i.productName).join(';')}"`,
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
    <div className="space-y-6 pb-12">
      {/* Header & Export controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            Laporan Keuangan & Penjualan Proyek
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analisis Omzet Penjualan Harian/Bulanan, Estimasi Laba Bersih, & Modal Bahan Mentah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['all', 'this_month', 'today'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedPeriod === period
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period === 'all' ? 'Semua Periode' : period === 'this_month' ? 'Bulan Ini' : 'Hari Ini'}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-all border border-slate-700"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Total Omzet Penjualan</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-white">{formatRupiah(totalRevenue)}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Dari {totalOrdersCount} transaksi selesai/DP</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modal Bahan & Produksi (HPP)</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-200">{formatRupiah(totalHPP)}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Multiplek, HPL & Hardware</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Laba Kotor (Gross Profit)</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-emerald-400">{formatRupiah(grossProfit)}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Margin Kotor ~{totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0}%</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Estimasi Laba Bersih (Net Profit)</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-blue-300">{formatRupiah(netProfit)}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Setelah alokasi pajak PPN</span>
          </div>
        </div>
      </div>

      {/* Order Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders List Table */}
        <div className="lg:col-span-8 glass-panel border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            Rincian Transaksi Penjualan Terkini
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">No. Order</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Klien</th>
                  <th className="py-2.5 px-3">Modal HPP</th>
                  <th className="py-2.5 px-3">Omzet Sales</th>
                  <th className="py-2.5 px-3">Laba Proyek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((o) => {
                  const profit = o.grandTotal - o.totalCost;
                  return (
                    <tr key={o.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{o.orderNumber}</td>
                      <td className="py-2.5 px-3 text-slate-400">{formatDate(o.date)}</td>
                      <td className="py-2.5 px-3 text-slate-200 font-medium">{o.customerName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{formatRupiah(o.totalCost)}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{formatRupiah(o.grandTotal)}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">+{formatRupiah(profit)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="lg:col-span-4 glass-panel border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            Distribusi Jenis Pesanan
          </h3>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Pre-Order / Custom Fitout</span>
                <span className="text-amber-400 font-mono font-bold">{customCount} Proyek</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${totalOrdersCount > 0 ? (customCount / totalOrdersCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Ready Stock Furniture</span>
                <span className="text-blue-400 font-mono font-bold">{readyStockCount} Unit</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${totalOrdersCount > 0 ? (readyStockCount / totalOrdersCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
