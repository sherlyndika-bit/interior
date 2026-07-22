import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quotation, QuotationItem } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { FileText, Printer, Plus, ArrowRight, CheckCircle2, Sparkles, Send, Building } from 'lucide-react';

export const InvoiceQuotationView: React.FC = () => {
  const { quotations, addQuotation, convertQuotationToOrder, orders, taxSetting } = useApp();
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(quotations[0] || null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // New Quotation Form State
  const [quoNo, setQuoNo] = useState(`QUO-2026-${Date.now().toString().slice(-4)}`);
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            Generate Invoice & Surat Penawaran (Quotation)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cetak faktur resmi & surat penawaran proyek dengan kop studio resmi & rincian spesifikasi teknis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQuotationModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Penawaran Baru</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Quotation Selector & Document View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Selector */}
        <div className="lg:col-span-4 space-y-3 no-print">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Surat Penawaran:</h2>
          {quotations.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelectedQuotation(q)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedQuotation?.id === q.id
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs">{q.quotationNumber}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                  {q.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-xs mt-1">{q.customerName}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{q.projectName}</p>
              <div className="text-xs font-mono font-bold text-emerald-400 mt-2">{formatRupiah(q.grandTotal)}</div>
            </button>
          ))}
        </div>

        {/* Right Document Printable Paper Sheet */}
        <div className="lg:col-span-8">
          {selectedQuotation ? (
            <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl space-y-6 border border-slate-300 text-xs font-sans print:shadow-none print:p-0 print:border-none">
              {/* Kop Surat Header */}
              <div className="flex items-center justify-between border-b-2 border-amber-600 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-extrabold text-base">
                      IC
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      PT INTERIORCRAFT STUDIO INDONESIA
                    </h1>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {taxSetting.companyAddress} | Telp: {taxSetting.companyPhone}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">
                    NPWP: {taxSetting.companyNPWP}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-amber-600 block uppercase tracking-wider">
                    SURAT PENAWARAN
                  </span>
                  <span className="font-mono font-bold text-slate-700 text-xs block">
                    No: {selectedQuotation.quotationNumber}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Tanggal: {formatDate(selectedQuotation.date)}
                  </span>
                </div>
              </div>

              {/* Client Info Block */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase">Penawar Kepada:</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedQuotation.customerName}</div>
                  <div className="text-slate-700">{selectedQuotation.customerPhone}</div>
                  <div className="text-slate-600 text-[11px]">{selectedQuotation.customerAddress}</div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase">Nama Proyek Fitout:</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedQuotation.projectName}</div>
                  <div className="text-slate-600 text-[11px]">Berlaku s/d: {formatDate(selectedQuotation.validUntil)}</div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-left border-collapse border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border border-slate-300">No</th>
                      <th className="p-2 border border-slate-300">Lingkup Pekerjaan & Spesifikasi Material</th>
                      <th className="p-2 border border-slate-300">Dimensi</th>
                      <th className="p-2 border border-slate-300 text-center">Qty</th>
                      <th className="p-2 border border-slate-300 text-right">Harga Satuan</th>
                      <th className="p-2 border border-slate-300 text-right">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuotation.items.map((item, idx) => (
                      <tr key={item.id} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-300 text-center font-bold">{idx + 1}</td>
                        <td className="p-2 border border-slate-300">
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <div className="text-[11px] text-slate-600">{item.specification}</div>
                        </td>
                        <td className="p-2 border border-slate-300 font-mono text-[11px]">{item.dimensions || '-'}</td>
                        <td className="p-2 border border-slate-300 text-center">{item.quantity} {item.unit}</td>
                        <td className="p-2 border border-slate-300 text-right font-mono">{formatRupiah(item.unitPrice)}</td>
                        <td className="p-2 border border-slate-300 text-right font-mono font-bold">{formatRupiah(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatRupiah(selectedQuotation.subtotal)}</span>
                  </div>
                  {taxSetting.enablePPN && (
                    <div className="flex justify-between text-slate-600">
                      <span>PPN {taxSetting.ppnRate}%:</span>
                      <span className="font-mono">+{formatRupiah(selectedQuotation.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-300">
                    <span>Grand Total:</span>
                    <span className="font-mono text-amber-700">{formatRupiah(selectedQuotation.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                <strong className="text-slate-900 block">Syarat & Ketentuan Pembayaran:</strong>
                <ol className="list-decimal list-inside text-slate-700 space-y-0.5">
                  {selectedQuotation.termsAndConditions.map((tc, idx) => (
                    <li key={idx}>{tc}</li>
                  ))}
                </ol>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-center">
                <div>
                  <span className="text-slate-600 font-semibold block">Hormat Kami,</span>
                  <span className="text-[10px] text-slate-400">PT InteriorCraft Studio Indonesia</span>
                  <div className="h-16 flex items-center justify-center text-slate-300 italic text-xs">
                    ( Tanda Tangan & Stempel )
                  </div>
                  <span className="font-bold text-slate-900 block underline">Sherly Dika</span>
                  <span className="text-[10px] text-slate-500">Managing Director</span>
                </div>

                <div>
                  <span className="text-slate-600 font-semibold block">Menyetujui Klien,</span>
                  <span className="text-[10px] text-slate-400">Konfirmasi SPK Proyek</span>
                  <div className="h-16 flex items-center justify-center text-slate-300 italic text-xs">
                    ( Tanda Tangan Klien )
                  </div>
                  <span className="font-bold text-slate-900 block underline">{selectedQuotation.customerName}</span>
                  <span className="text-[10px] text-slate-500">Pelanggan</span>
                </div>
              </div>

              {/* Convert Button for Admin UI */}
              <div className="pt-4 no-print flex justify-end">
                {selectedQuotation.status !== 'Converted to Order' ? (
                  <button
                    onClick={() => convertQuotationToOrder(selectedQuotation.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Konversi Penawaran ini Ke Pesanan Pre-Order Active</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Dikonversi ke Orders Active
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500 italic">
              Pilih surat penawaran di sebelah kiri untuk menampilkan preview printable document.
            </div>
          )}
        </div>
      </div>

      {/* New Quotation Modal */}
      {isQuotationModalOpen && (
        <Modal
          isOpen={isQuotationModalOpen}
          onClose={() => setIsQuotationModalOpen(false)}
          title="Buat Surat Penawaran (Quotation) Baru"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">No. Surat Penawaran</label>
                <input
                  type="text"
                  required
                  value={quoNo}
                  onChange={(e) => setQuoNo(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nama Proyek</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Fitting Fitout Apartemen 3BR"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nama Klien</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Bpk. Dr. Adrian"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">No. WhatsApp Klien</label>
                <input
                  type="text"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="0811xxxxxx"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Alamat Klien</label>
                <input
                  type="text"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  placeholder="Cluster Bintaro Jaya No. 7"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Item add scope */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 block">Tambah Rincian Scope Pekerjaan:</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Judul Pekerjaan (e.g. Bed Backdrop)"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Dimensi (e.g. 240 x 280 cm)"
                  value={itemDim}
                  onChange={(e) => setItemDim(e.target.value)}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Spesifikasi Material (e.g. HPL Taco + Strip LED)"
                  value={itemSpec}
                  onChange={(e) => setItemSpec(e.target.value)}
                  className="col-span-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
                <input
                  type="number"
                  placeholder="Harga Total Pekerjaan (IDR)"
                  value={itemPrice || ''}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                  className="col-span-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg mt-2"
              >
                + Tambah Ke Daftar Item
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsQuotationModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Simpan Surat Penawaran
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
