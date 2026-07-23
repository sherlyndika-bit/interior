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
  const [items, setItems] = useState<QuotationItem[]>([
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

  const [itemTitle, setItemTitle] = useState('');
  const [itemSpec, setItemSpec] = useState('');
  const [itemDim, setItemDim] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(0);

  const handleAddItem = () => {
    if (!itemTitle || !itemPrice) return;
    setItems(prev => [
      ...prev,
      {
        id: `qi-${Date.now()}`,
        title: itemTitle,
        specification: itemSpec,
        dimensions: itemDim,
        unit: 'Set',
        quantity: 1,
        unitPrice: itemPrice,
        totalPrice: itemPrice
      }
    ]);
    setItemTitle('');
    setItemSpec('');
    setItemDim('');
    setItemPrice(0);
  };

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
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-300" />
            Surat Penawaran & Invoice Resmi
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Generator dokumen penawaran harga resmi (Quotation) & faktur tagihan fitout custom.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuotationModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Penawaran Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quotations List */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-300">Daftar Surat Penawaran</h2>
          <div className="space-y-3">
            {quotations.map(q => (
              <div
                key={q.id}
                onClick={() => setSelectedQuotation(q)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                  selectedQuotation?.id === q.id
                    ? 'bg-stone-900 border-stone-700 text-white shadow-xl'
                    : 'bg-[#0A0908] border-stone-900 text-stone-400 hover:border-stone-800'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-amber-300">{q.quotationNumber}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-stone-950 border border-stone-800 text-stone-300">
                    {q.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm line-clamp-1">{q.projectName}</h3>
                <p className="text-xs text-stone-400 font-light">{q.customerName}</p>
                <p className="text-xs font-bold text-emerald-400 pt-2">{formatRupiah(q.grandTotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Printable Document View */}
        <div className="lg:col-span-8 bg-[#0A0908] p-8 rounded-3xl border border-stone-900 space-y-6">
          {selectedQuotation ? (
            <div className="space-y-6 text-xs text-stone-300">
              <div className="flex justify-between items-start border-b border-stone-900 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-widest uppercase">INTERIORCRAFT STUDIO</h2>
                  <p className="text-stone-400 text-xs font-light">Jl. Interior Craftsman No. 88, Jakarta Selatan</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-300 text-sm">{selectedQuotation.quotationNumber}</span>
                  <p className="text-stone-400 text-[11px] font-mono">{formatDate(selectedQuotation.date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#050505] border border-stone-900">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Kepada Klien:</span>
                  <p className="font-bold text-white">{selectedQuotation.customerName}</p>
                  <p className="text-stone-400 font-light">{selectedQuotation.customerPhone}</p>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-mono">Nama Proyek:</span>
                  <p className="font-bold text-white">{selectedQuotation.projectName}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead className="border-b border-stone-900 text-stone-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-2">Rincian Pekerjaan</th>
                    <th className="py-2">Dimensi</th>
                    <th className="py-2 text-right">Harga (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-900">
                  {selectedQuotation.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-3">
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-stone-400 text-[11px] font-light">{item.specification}</p>
                      </td>
                      <td className="py-3 font-mono text-stone-400">{item.dimensions}</td>
                      <td className="py-3 text-right font-bold text-emerald-400">{formatRupiah(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-stone-900 pt-4 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Penawaran:</span>
                <span className="text-emerald-400 text-base">{formatRupiah(selectedQuotation.grandTotal)}</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-900">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak PDF
                </button>
                {selectedQuotation.status !== 'Approved' && (
                  <button
                    onClick={() => convertQuotationToOrder(selectedQuotation.id)}
                    className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Setujui & Ubah Jadi Order
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-stone-500 text-center py-12">Pilih penawaran untuk melihat preview</p>
          )}
        </div>
      </div>

      {/* NEW QUOTATION MODAL */}
      {isQuotationModalOpen && (
        <Modal isOpen={isQuotationModalOpen} onClose={() => setIsQuotationModalOpen(false)} title="Buat Surat Penawaran Baru">
          <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Nama Klien</label>
              <input type="text" required value={custName} onChange={e => setCustName(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Judul Proyek</label>
              <input type="text" required value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Terbitkan Penawaran</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
