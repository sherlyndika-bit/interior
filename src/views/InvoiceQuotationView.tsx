import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Quotation, QuotationItem, Order } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { FileText, Printer, Plus, CheckCircle2, Trash2, Receipt, Building2, CreditCard } from 'lucide-react';

interface InvoiceQuotationViewProps {
  initialTab?: 'quotations' | 'invoices';
}

export const InvoiceQuotationView: React.FC<InvoiceQuotationViewProps> = ({ initialTab = 'quotations' }) => {
  const { quotations, addQuotation, convertQuotationToOrder, orders, taxSetting, addPaymentMilestone } = useApp();
  const [activeTab, setActiveTab] = useState<'quotations' | 'invoices'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Quotation State
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(quotations[0] || null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Invoice State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(orders[0] || null);
  const [invoiceType, setInvoiceType] = useState<'DP 50%' | 'Progress 30%' | 'Pelunasan 50%' | 'Full 100%'>('DP 50%');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // New Quotation Form State
  const [quoNo, setQuoNo] = useState(`QUO-2026-${Date.now().toString().slice(-4)}`);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [projectName, setProjectName] = useState('');

  // Scope Items for Quotation
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
  const [itemPrice, setItemPrice] = useState<number>(5000000);

  const handleAddItem = () => {
    if (!itemTitle || !itemPrice) return;
    setItems(prev => [
      ...prev,
      {
        id: `qi-${Date.now()}`,
        title: itemTitle,
        specification: itemSpec || 'Spesifikasi standar studio',
        dimensions: itemDim || 'Custom Fitout',
        unit: 'Set',
        quantity: 1,
        unitPrice: itemPrice,
        totalPrice: itemPrice
      }
    ]);
    setItemTitle('');
    setItemSpec('');
    setItemDim('');
    setItemPrice(5000000);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleOpenNewQuotationModal = () => {
    setQuoNo(`QUO-2026-${Date.now().toString().slice(-4)}`);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setProjectName('');
    setItems([
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
    setIsQuotationModalOpen(true);
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
      customerPhone: custPhone || '08123456789',
      customerAddress: custAddress || 'Lokasi Site Proyek Klien',
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

  const getInvoiceAmount = (order: Order, type: string) => {
    if (type === 'DP 50%') return order.grandTotal * 0.5;
    if (type === 'Progress 30%') return order.grandTotal * 0.3;
    if (type === 'Pelunasan 50%') return order.grandTotal * 0.5;
    return order.grandTotal;
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header & Prominent Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            {activeTab === 'quotations' ? (
              <>
                <FileText className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                Surat Penawaran Harga (SPH Proposal)
              </>
            ) : (
              <>
                <Receipt className="w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                Faktur Tagihan Resmi (Invoice DP & Pelunasan)
              </>
            )}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
            {activeTab === 'quotations'
              ? 'Generator proposal penawaran harga resmi sebelum penandatanganan kontrak proyek fitout.'
              : 'Generator faktur tagihan resmi (DP/Pelunasan) lengkap dengan NPWP Perusahaan & Rekening Bank.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Main Tab Switcher with whitespace-nowrap and shrink-0 to prevent text wrapping */}
          <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 shadow-xs shrink-0">
            <button
              onClick={() => setActiveTab('quotations')}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'quotations'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Surat Penawaran ({quotations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('invoices')}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'invoices'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 shrink-0" />
              <span>Invoice Tagihan ({orders.length})</span>
            </button>
          </div>

          {activeTab === 'quotations' ? (
            <button
              onClick={handleOpenNewQuotationModal}
              className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Buat SPH Baru</span>
            </button>
          ) : (
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Terbitkan Invoice Tagihan</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SURAT PENAWARAN HARGA (QUOTATIONS) */}
      {activeTab === 'quotations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quotations List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              Daftar Proposal Penawaran (SPH)
            </h2>
            <div className="space-y-3">
              {quotations.map(q => (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuotation(q)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
                    selectedQuotation?.id === q.id
                      ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">{q.quotationNumber}</span>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                      {q.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{q.projectName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{q.customerName}</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-2">{formatRupiah(q.grandTotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Printable Quotation Document View */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs">
            {selectedQuotation ? (
              <div className="space-y-6 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-6">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">PROPOSAL ESTIMASI PROYEK</span>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-wider uppercase mt-0.5">SURAT PENAWARAN HARGA (SPH)</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-normal">PT InteriorCraft Studio Indonesia</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-zinc-900 dark:text-white text-sm">{selectedQuotation.quotationNumber}</span>
                    <p className="text-zinc-400 text-[11px] font-mono">Berlaku s/d: {formatDate(selectedQuotation.validUntil)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-mono">Ditujukan Kepada Klien:</span>
                    <p className="font-bold text-zinc-900 dark:text-white">{selectedQuotation.customerName}</p>
                    <p className="text-zinc-500 dark:text-zinc-400 font-normal">{selectedQuotation.customerPhone}</p>
                    <p className="text-zinc-400 font-normal">{selectedQuotation.customerAddress}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-mono">Judul Proyek Fitout:</span>
                    <p className="font-bold text-zinc-900 dark:text-white">{selectedQuotation.projectName}</p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium text-[10px] uppercase">
                    <tr>
                      <th className="py-2">Rincian Scope Pekerjaan</th>
                      <th className="py-2">Dimensi</th>
                      <th className="py-2 text-right">Harga (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedQuotation.items.map(item => (
                      <tr key={item.id}>
                        <td className="py-3">
                          <p className="font-bold text-zinc-900 dark:text-white">{item.title}</p>
                          <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-normal">{item.specification}</p>
                        </td>
                        <td className="py-3 font-mono text-zinc-500 dark:text-zinc-400">{item.dimensions}</td>
                        <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Terms and Conditions */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 space-y-1 text-[11px]">
                  <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Syarat & Ketentuan Ketentuan SPH:</h4>
                  {selectedQuotation.termsAndConditions.map((tc, idx) => (
                    <p key={idx} className="text-zinc-500 dark:text-zinc-400">• {tc}</p>
                  ))}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between items-center text-sm font-bold text-zinc-900 dark:text-white">
                  <span>Total Nilai Penawaran:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base">{formatRupiah(selectedQuotation.grandTotal)}</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => window.print()}
                    className="h-9 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4 shrink-0" /> Cetak SPH PDF
                  </button>
                  {selectedQuotation.status !== 'Approved' && selectedQuotation.status !== 'Converted to Order' && (
                    <button
                      onClick={() => convertQuotationToOrder(selectedQuotation.id)}
                      className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Setujui SPH & Ubah Jadi Order
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-zinc-400 text-center py-12">Pilih surat penawaran untuk melihat preview</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FAKTUR INVOICE TAGIHAN RESMI */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Orders List for Invoicing */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              Daftar Faktur Tagihan (Invoice)
            </h2>
            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderForInvoice(order)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
                    selectedOrderForInvoice?.id === order.id
                      ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">INV/2026/07/{order.orderNumber.replace('ORD-', '')}</span>
                    <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded ${
                      order.remainingBalance === 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300'
                    }`}>
                      {order.remainingBalance === 0 ? 'LUNAS' : 'TERTAGIH'}
                    </span>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{order.customerName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{order.items.map(i => i.productName).join(', ')}</p>
                  <div className="flex justify-between items-center pt-2 text-xs">
                    <span className="text-zinc-400 font-mono">{formatDate(order.date)}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(order.grandTotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Official Invoice Printable Document View */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs">
            {selectedOrderForInvoice ? (
              <div className="space-y-6 text-xs text-zinc-700 dark:text-zinc-300">
                {/* Official Invoice Header */}
                <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white mb-1">
                      <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      PT INTERIORCRAFT STUDIO INDONESIA
                    </div>
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-wider uppercase">FAKTUR TAGIHAN RESMI (INVOICE)</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">NPWP: 01.234.567.8-012.000</p>
                    <p className="text-zinc-400 text-[11px]">Jl. Interior Craftsman No. 88, Jakarta Selatan</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono font-bold text-zinc-900 dark:text-white text-sm">
                      INV/2026/07/{selectedOrderForInvoice.orderNumber.replace('ORD-', '')}
                    </span>
                    <p className="text-zinc-400 text-[11px] font-mono">Tgl Terbit: {formatDate(selectedOrderForInvoice.date)}</p>
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${
                      selectedOrderForInvoice.remainingBalance === 0
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                    }`}>
                      {selectedOrderForInvoice.remainingBalance === 0 ? 'LUNAS (PAID)' : 'MENUNGGU PELUNASAN'}
                    </span>
                  </div>
                </div>

                {/* Billed To Client Card */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-mono">Ditagihkan Kepada (Billed To):</span>
                    <p className="font-bold text-zinc-900 dark:text-white">{selectedOrderForInvoice.customerName}</p>
                    <p className="text-zinc-500 dark:text-zinc-400 font-normal">{selectedOrderForInvoice.customerPhone}</p>
                    <p className="text-zinc-400 font-normal">{selectedOrderForInvoice.customerAddress}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-mono">Tipe Tagihan:</span>
                    <p className="font-bold text-zinc-900 dark:text-white">{invoiceType} Tagihan Proyek Fitout</p>
                    <span className="text-zinc-400 text-[11px] block mt-1">Ref Order: {selectedOrderForInvoice.orderNumber}</span>
                  </div>
                </div>

                {/* Invoice Items Table */}
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium text-[10px] uppercase">
                    <tr>
                      <th className="py-2">Item Tagihan / Komponen Pekerjaan</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Harga Satuan (Rp)</th>
                      <th className="py-2 text-right">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedOrderForInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3">
                          <p className="font-bold text-zinc-900 dark:text-white">{item.productName}</p>
                          {item.customSpecs && <p className="text-zinc-400 text-[11px]">{item.customSpecs}</p>}
                        </td>
                        <td className="py-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-3 text-right font-mono">{formatRupiah(item.unitPrice)}</td>
                        <td className="py-3 text-right font-bold text-zinc-900 dark:text-white">{formatRupiah(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Calculation breakdown */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal Pekerjaan:</span>
                    <span>{formatRupiah(selectedOrderForInvoice.subtotal)}</span>
                  </div>
                  {taxSetting.enablePPN && (
                    <div className="flex justify-between text-zinc-500">
                      <span>PPN ({taxSetting.ppnRate}%):</span>
                      <span>{formatRupiah(selectedOrderForInvoice.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-zinc-900 dark:text-white text-sm pt-2">
                    <span>Total Nilai Kontrak:</span>
                    <span>{formatRupiah(selectedOrderForInvoice.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Telah Dibayar (DP / Progress):</span>
                    <span>{formatRupiah(selectedOrderForInvoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-extrabold text-sm pt-1">
                    <span>Tagihan Bersih Invoice ({invoiceType}):</span>
                    <span>{formatRupiah(getInvoiceAmount(selectedOrderForInvoice, invoiceType))}</span>
                  </div>
                </div>

                {/* Official Bank Account Information */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-xs flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Instruksi Pembayaran Transfer Bank Resmi:
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-[11px] text-zinc-600 dark:text-zinc-300">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Bank BCA</p>
                      <p className="font-mono text-zinc-900 dark:text-white font-bold">8830-1928-33</p>
                      <p className="text-zinc-400">a.n. PT InteriorCraft Studio</p>
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">Bank Mandiri</p>
                      <p className="font-mono text-zinc-900 dark:text-white font-bold">127-00-99228-11</p>
                      <p className="text-zinc-400">a.n. PT InteriorCraft Studio</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => window.print()}
                    className="h-9 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4 shrink-0" /> Cetak Invoice PDF
                  </button>
                  {selectedOrderForInvoice.remainingBalance > 0 && (
                    <button
                      onClick={() => addPaymentMilestone(selectedOrderForInvoice.id, 'Transfer Bank', selectedOrderForInvoice.remainingBalance)}
                      className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Catat Invoice Lunas
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-zinc-400 text-center py-12">Pilih pesanan untuk melihat pratinjau invoice tagihan</p>
            )}
          </div>
        </div>
      )}

      {/* NEW QUOTATION MODAL */}
      {isQuotationModalOpen && (
        <Modal isOpen={isQuotationModalOpen} onClose={() => setIsQuotationModalOpen(false)} title="Buat Surat Penawaran Baru">
          <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nomor Surat Penawaran</label>
                <input type="text" readOnly value={quoNo} className="w-full p-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 font-mono" />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nama Proyek Fitout</label>
                <input type="text" required value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Kitchen Set & Backdrop TV" className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nama Klien</label>
                <input type="text" required value={custName} onChange={e => setCustName(e.target.value)} placeholder="Bpk. Hendra Kusuma" className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Telepon / WhatsApp</label>
                <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="081234567890" className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Alamat Lokasi Proyek</label>
              <input type="text" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Jl. Senopati No. 45, Jakarta" className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>

            {/* Scope Items Builder */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
              <h4 className="font-bold text-zinc-900 dark:text-white text-xs">Tambah Item Pekerjaan</h4>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Judul Pekerjaan (ex: Cabinet)" value={itemTitle} onChange={e => setItemTitle(e.target.value)} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white" />
                <input type="text" placeholder="Spesifikasi Material" value={itemSpec} onChange={e => setItemSpec(e.target.value)} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="Dimensi (ex: P 300 x L 60)" value={itemDim} onChange={e => setItemDim(e.target.value)} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white" />
                <input type="number" placeholder="Harga (Rp)" value={itemPrice} onChange={e => setItemPrice(Number(e.target.value))} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white" />
                <button type="button" onClick={handleAddItem} className="py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-lg text-xs">+ Tambah Item</button>
              </div>

              {/* Added Items List */}
              <div className="space-y-2 pt-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px]">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{item.title}</p>
                      <p className="text-zinc-400">{item.dimensions} — {formatRupiah(item.totalPrice)}</p>
                    </div>
                    {items.length > 1 && (
                      <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-rose-600 p-1"><Trash2 className="w-3.5 h-3.5 shrink-0" /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Terbitkan Penawaran</button>
          </form>
        </Modal>
      )}

      {/* NEW INVOICE SELECTION MODAL */}
      {isInvoiceModalOpen && (
        <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} title="Terbitkan Faktur Invoice Tagihan Baru">
          <div className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Pilih Pesanan Klien</label>
              <select
                value={selectedOrderForInvoice?.id || ''}
                onChange={e => {
                  const ord = orders.find(o => o.id === e.target.value);
                  if (ord) setSelectedOrderForInvoice(ord);
                }}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white"
              >
                {orders.map(o => (
                  <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName} ({formatRupiah(o.grandTotal)})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Tipe Tagihan Invoice</label>
              <select
                value={invoiceType}
                onChange={e => setInvoiceType(e.target.value as any)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-semibold"
              >
                <option value="DP 50%">Down Payment (DP 50%)</option>
                <option value="Progress 30%">Progress Milestone (30%)</option>
                <option value="Pelunasan 50%">Pelunasan Akhir (50%)</option>
                <option value="Full 100%">Pembayaran Penuh (100%)</option>
              </select>
            </div>

            {selectedOrderForInvoice && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <div className="flex justify-between"><span>Nominal Ditagihkan:</span><span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(getInvoiceAmount(selectedOrderForInvoice, invoiceType))}</span></div>
                <div className="flex justify-between text-zinc-400"><span>Klien:</span><span>{selectedOrderForInvoice.customerName} ({selectedOrderForInvoice.customerPhone})</span></div>
              </div>
            )}

            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl"
            >
              Tampilkan Pratinjau Invoice
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
