import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quotation, QuotationItem } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { FileText, Printer, Plus, CheckCircle2 } from 'lucide-react';

export const InvoiceQuotationView: React.FC = () => {
  const { quotations, addQuotation, convertQuotationToOrder, taxSetting } = useApp();
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(quotations[0] || null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // New Quotation Form State
  const [quoNo] = useState(`QUO-2026-${Date.now().toString().slice(-4)}`);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [projectName, setProjectName] = useState('');

  // Scope Items
  const [items] = useState<QuotationItem[]>([
    {
      id: 'qi-1',
      title: 'Kitchen Set Minimalis Main Cabinet',
      specification: 'Multiplek 18mm, HPL Taco Wood Grain, engsel soft-close Hafele',
      dimensions: 'P 350 x L 60 x T 280 cm',
      unit: 'Set',
      quantity: 1,
      unitPrice: 18500000,
      totalPrice: 18500000
    }
  ]);

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || items.length === 0) return;

    const sub = items.reduce((acc, i) => acc + i.totalPrice, 0);
    const tax = taxSetting.enablePPN ? (sub * taxSetting.ppnRate) / 100 : 0;
    const grand = sub + tax;

    const newQuo: Quotation = {
      id: `qte-${Date.now()}`,
      quotationNumber: quoNo,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: custName,
      customerPhone: custPhone,
      customerAddress: custAddress,
      projectName: projectName || 'Proyek Custom Fitout Interior',
      items,
      subtotal: sub,
      discount: 0,
      tax,
      grandTotal: grand,
      termsAndConditions: [
        'Harga sudah termasuk biaya pengiriman & instalasi Jabodetabek.',
        'Down Payment (DP) 50% saat penandatanganan kesepakatan.',
        'Pelunasan 50% dilakukan sebelum barang dikirim ke lokasi.',
        'Lead time pengerjaan workshop: 14-21 hari kerja.'
      ],
      status: 'Sent'
    };

    addQuotation(newQuo);
    setSelectedQuotation(newQuo);
    setIsQuotationModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Surat Penawaran & Invoice Resmi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generator dokumen penawaran harga resmi (Quotation) & faktur tagihan fitout custom.
          </p>
        </div>

        <button
          onClick={() => setIsQuotationModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Penawaran Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quotations List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Daftar Surat Penawaran</h2>
          <div className="space-y-3">
            {quotations.map(q => (
              <div
                key={q.id}
                onClick={() => setSelectedQuotation(q)}
                className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
                  selectedQuotation?.id === q.id
                    ? 'bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">{q.quotationNumber}</span>
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {q.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{q.projectName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{q.customerName}</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-2">{formatRupiah(q.grandTotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Printable Document View */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          {selectedQuotation ? (
            <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wider uppercase">INTERIORCRAFT STUDIO</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Jl. Interior Craftsman No. 88, Jakarta Selatan</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-sm">{selectedQuotation.quotationNumber}</span>
                  <p className="text-slate-400 text-[11px] font-mono">{formatDate(selectedQuotation.date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Kepada Klien:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedQuotation.customerName}</p>
                  <p className="text-slate-500 dark:text-slate-400 font-normal">{selectedQuotation.customerPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Nama Proyek:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedQuotation.projectName}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium text-[10px] uppercase">
                  <tr>
                    <th className="py-2">Rincian Pekerjaan</th>
                    <th className="py-2">Dimensi</th>
                    <th className="py-2 text-right">Harga (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedQuotation.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-3">
                        <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] font-normal">{item.specification}</p>
                      </td>
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400">{item.dimensions}</td>
                      <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                <span>Total Penawaran:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-base">{formatRupiah(selectedQuotation.grandTotal)}</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak PDF
                </button>
                {selectedQuotation.status !== 'Approved' && (
                  <button
                    onClick={() => convertQuotationToOrder(selectedQuotation.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Setujui & Ubah Jadi Order
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-12">Pilih penawaran untuk melihat preview</p>
          )}
        </div>
      </div>

      {/* NEW QUOTATION MODAL */}
      {isQuotationModalOpen && (
        <Modal isOpen={isQuotationModalOpen} onClose={() => setIsQuotationModalOpen(false)} title="Buat Surat Penawaran Baru">
          <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs text-slate-900 dark:text-slate-100">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Nama Klien</label>
              <input type="text" required value={custName} onChange={e => setCustName(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Judul Proyek</label>
              <input type="text" required value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl">Terbitkan Penawaran</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
