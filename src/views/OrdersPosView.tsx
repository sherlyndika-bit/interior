import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderItem, MilestonePayment, OrderType, OrderStage } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { ShoppingCart, Plus, Search, Filter, CheckCircle2, Clock, DollarSign, Calendar, User, FileText, ChevronRight, AlertCircle, ArrowRight } from 'lucide-react';

export const OrdersPosView: React.FC = () => {
  const {
    products,
    customers,
    orders,
    addOrder,
    updateOrderStatus,
    addPaymentMilestone,
    promos,
    taxSetting,
    addCustomer
  } = useApp();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders_list' | 'pos' | 'new_custom'>('orders_list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('Semua');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // POS Cart State
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [posNotes, setPosNotes] = useState<string>('');

  // New Custom Pre-Order Form State
  const [customClientName, setCustomClientName] = useState('');
  const [customClientPhone, setCustomClientPhone] = useState('');
  const [customClientAddress, setCustomClientAddress] = useState('');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [customSpecs, setCustomSpecs] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(25000000);
  const [customCost, setCustomCost] = useState<number>(14000000);
  const [customDpPercent, setCustomDpPercent] = useState<number>(50);
  const [customTargetDate, setCustomTargetDate] = useState<string>('2026-08-15');

  // Milestone Payment Record Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'Transfer Bank' | 'Tunai' | 'QRIS' | 'Kartu Kredit'>('Transfer Bank');

  // POS Add Item to Cart
  const addToCart = (productId: string, variantId?: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const variant = prod.variants.find(v => v.id === variantId);
    const unitPrice = prod.basePrice + (variant?.additionalPrice || 0);
    const costPrice = prod.baseCost + (variant?.additionalCost || 0);

    const existingIndex = cartItems.findIndex(i => i.productId === productId && i.variantId === variantId);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal = updated[existingIndex].quantity * unitPrice;
      setCartItems(updated);
    } else {
      setCartItems(prev => [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          variantId: variant?.id,
          variantName: variant?.name,
          quantity: 1,
          unitPrice,
          costPrice,
          subtotal: unitPrice
        }
      ]);
    }
  };

  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate POS Totals
  const posSubtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const matchedPromo = promos.find(p => p.code.toUpperCase() === appliedPromoCode.trim().toUpperCase() && p.isActive);
  let posDiscount = 0;
  if (matchedPromo) {
    if (matchedPromo.type === 'fixed') posDiscount = matchedPromo.value;
    if (matchedPromo.type === 'percentage') posDiscount = (posSubtotal * matchedPromo.value) / 100;
  }
  const posTaxable = Math.max(0, posSubtotal - posDiscount);
  const posTax = taxSetting.enablePPN ? (posTaxable * taxSetting.ppnRate) / 100 : 0;
  const posGrandTotal = posTaxable + posTax;

  // Checkout POS Order
  const handleCheckoutPOS = () => {
    if (cartItems.length === 0) return;
    const cust = customers.find(c => c.id === selectedCustomerId) || customers[0];

    const newOrd: Order = {
      id: `ord-pos-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Ready Stock',
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerAddress: cust.address,
      items: cartItems,
      totalCost: cartItems.reduce((acc, i) => acc + (i.costPrice * i.quantity), 0),
      subtotal: posSubtotal,
      discountAmount: posDiscount,
      promoCode: matchedPromo?.code,
      taxAmount: posTax,
      grandTotal: posGrandTotal,
      paidAmount: posGrandTotal,
      remainingBalance: 0,
      stage: 'Completed',
      milestones: [
        {
          id: `ms-full-${Date.now()}`,
          name: 'Pelunasan 100% (Kasir POS)',
          amount: posGrandTotal,
          percentage: 100,
          status: 'Paid',
          dueDate: new Date().toISOString().split('T')[0],
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'QRIS'
        }
      ],
      notes: posNotes,
      createdByName: currentUser?.name || 'Kasir'
    };

    addOrder(newOrd);
    setCartItems([]);
    setAppliedPromoCode('');
    setPosNotes('');
    setActiveTab('orders_list');
  };

  // Submit New Custom Pre-Order
  const handleSaveCustomOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClientName || !customProjectTitle) return;

    // Check or create customer
    let cust = customers.find(c => c.phone === customClientPhone || c.name.toLowerCase() === customClientName.toLowerCase());
    if (!cust) {
      cust = {
        id: `cust-${Date.now()}`,
        code: `CUST-${Date.now().toString().slice(-4)}`,
        name: customClientName,
        phone: customClientPhone || '08123456789',
        email: '',
        address: customClientAddress || 'Alamat Site Proyek',
        city: 'Jabodetabek',
        totalOrders: 0,
        totalSpent: 0,
        notes: 'Dibuat otomatis dari Pre-Order Custom',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      addCustomer(cust);
    }

    const dpAmount = (customPrice * customDpPercent) / 100;
    const remaining = customPrice - dpAmount;

    const newOrder: Order = {
      id: `ord-custom-${Date.now()}`,
      orderNumber: `ORD-CUSTOM-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Pre-Order / Custom',
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerAddress: cust.address,
      items: [
        {
          productId: 'prod-custom',
          productName: customProjectTitle,
          quantity: 1,
          unitPrice: customPrice,
          costPrice: customCost,
          customSpecs: customSpecs,
          subtotal: customPrice
        }
      ],
      totalCost: customCost,
      subtotal: customPrice,
      discountAmount: 0,
      taxAmount: taxSetting.enablePPN ? (customPrice * taxSetting.ppnRate) / 100 : 0,
      grandTotal: customPrice + (taxSetting.enablePPN ? (customPrice * taxSetting.ppnRate) / 100 : 0),
      paidAmount: dpAmount,
      remainingBalance: remaining + (taxSetting.enablePPN ? (customPrice * taxSetting.ppnRate) / 100 : 0),
      stage: 'DP Paid',
      milestones: [
        {
          id: `ms-dp-${Date.now()}`,
          name: `Down Payment (DP ${customDpPercent}%)`,
          amount: dpAmount,
          percentage: customDpPercent,
          status: 'Paid',
          dueDate: new Date().toISOString().split('T')[0],
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Transfer Bank'
        },
        {
          id: `ms-pelunasan-${Date.now()}`,
          name: `Pelunasan Sebelum Instalasi (${100 - customDpPercent}%)`,
          amount: remaining,
          percentage: 100 - customDpPercent,
          status: 'Pending',
          dueDate: customTargetDate
        }
      ],
      targetCompletionDate: customTargetDate,
      installationAddress: customClientAddress || cust.address,
      notes: `Proyek Custom Interior: ${customSpecs}`,
      createdByName: currentUser?.name || 'Sales Staff'
    };

    addOrder(newOrder);
    resetCustomForm();
    setActiveTab('orders_list');
  };

  const resetCustomForm = () => {
    setCustomClientName('');
    setCustomClientPhone('');
    setCustomClientAddress('');
    setCustomProjectTitle('');
    setCustomSpecs('');
    setCustomPrice(25000000);
    setCustomCost(14000000);
    setCustomDpPercent(50);
  };

  // Filter Orders List
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = selectedStage === 'Semua' || o.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const stageBadgeColor: Record<OrderStage, string> = {
    'Draft': 'bg-slate-800 text-slate-300 border-slate-700',
    'DP Paid': 'bg-blue-950 text-blue-300 border-blue-500/40',
    'In Production': 'bg-amber-950 text-amber-300 border-amber-500/40',
    'Quality Control': 'bg-purple-950 text-purple-300 border-purple-500/40',
    'Ready for Delivery': 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
    'Installed': 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
    'Completed': 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
    'Cancelled': 'bg-rose-950 text-rose-300 border-rose-500/40'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-400" />
            Manajemen Pesanan, POS & Pre-Order Custom
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kasir barang ready stock & pemantauan tahap produksi proyek custom interior dengan DP bertahap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders_list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders_list'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Daftar Pesanan ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pos'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Terminal POS Ready</span>
          </button>

          <button
            onClick={() => setActiveTab('new_custom')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'new_custom'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Pre-Order Custom</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Orders List Table */}
      {activeTab === 'orders_list' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {['Semua', 'DP Paid', 'In Production', 'Quality Control', 'Installed', 'Completed'].map(stage => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedStage === stage
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari no. order / nama klien..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">No. Order & Tanggal</th>
                    <th className="px-4 py-3">Pelanggan & Kontak</th>
                    <th className="px-4 py-3">Tipe & Proyek Item</th>
                    <th className="px-4 py-3">Tahap Produksi</th>
                    <th className="px-4 py-3">Grand Total</th>
                    <th className="px-4 py-3">Status DP / Pembayaran</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-amber-400 font-mono">{ord.orderNumber}</div>
                        <div className="text-[10px] text-slate-500">{formatDate(ord.date)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-100">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-400">{ord.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border block w-max mb-1 ${
                          ord.type === 'Pre-Order / Custom'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        }`}>
                          {ord.type}
                        </span>
                        <div className="text-slate-300 truncate max-w-xs font-medium">
                          {ord.items.map(i => i.productName).join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={ord.stage}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border focus:outline-none cursor-pointer ${stageBadgeColor[ord.stage]}`}
                        >
                          <option value="Draft">Draft</option>
                          <option value="DP Paid">DP Paid</option>
                          <option value="In Production">In Production</option>
                          <option value="Quality Control">Quality Control</option>
                          <option value="Ready for Delivery">Ready for Delivery</option>
                          <option value="Installed">Installed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-100">
                        {formatRupiah(ord.grandTotal)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-bold">Terbayar: {formatRupiah(ord.paidAmount)}</span>
                          </div>
                          {ord.remainingBalance > 0 ? (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 block w-max">
                              Sisa: {formatRupiah(ord.remainingBalance)}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 block w-max">
                              LUNAS 100%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                        >
                          Rincian & DP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Terminal POS Ready Stock */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Product Selector */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Pilih Produk Ready Stock:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded-lg border border-slate-800" />
                    <div>
                      <span className="text-[10px] font-mono text-amber-400">{p.code}</span>
                      <h3 className="font-bold text-xs text-white line-clamp-1">{p.name}</h3>
                      <div className="text-xs font-bold text-emerald-400 mt-1">{formatRupiah(p.basePrice)}</div>
                      <div className="text-[10px] text-slate-400">Stok: {p.stock} {p.unit}</div>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => addToCart(p.id)}
                      disabled={p.stock <= 0}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg transition-all"
                    >
                      + Tambah ke Keranjang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Checkout Cart Panel */}
          <div className="lg:col-span-5 glass-panel bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  Keranjang Kasir POS
                </h3>
                <span className="text-xs text-slate-400">{cartItems.length} Item</span>
              </div>

              {/* Customer Selector */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Pilih Pelanggan:</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              {/* Cart Items List */}
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-white">{item.productName}</div>
                      <div className="text-[10px] text-slate-400">{formatRupiah(item.unitPrice)} x {item.quantity}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-400">{formatRupiah(item.subtotal)}</span>
                      <button onClick={() => removeFromCart(idx)} className="text-rose-400 font-bold hover:bg-slate-800 p-1 rounded">×</button>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500 italic">
                    Keranjang masih kosong. Klik "+ Tambah ke Keranjang".
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Kode Promo (e.g. PROMOJULI)"
                  value={appliedPromoCode}
                  onChange={(e) => setAppliedPromoCode(e.target.value)}
                  className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatRupiah(posSubtotal)}</span>
              </div>
              {posDiscount > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Diskon Promo ({matchedPromo?.code})</span>
                  <span>-{formatRupiah(posDiscount)}</span>
                </div>
              )}
              {taxSetting.enablePPN && (
                <div className="flex justify-between text-slate-400">
                  <span>PPN {taxSetting.ppnRate}%</span>
                  <span>+{formatRupiah(posTax)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-amber-400">{formatRupiah(posGrandTotal)}</span>
              </div>

              <button
                onClick={handleCheckoutPOS}
                disabled={cartItems.length === 0}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all mt-3"
              >
                Proses Pembayaran & Cetak Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: New Custom Pre-Order Form */}
      {activeTab === 'new_custom' && (
        <div className="max-w-3xl mx-auto glass-panel bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            Formulir Pesanan Pre-Order / Custom Fitout Baru
          </h2>

          <form onSubmit={handleSaveCustomOrder} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nama Klien / Pelanggan *</label>
                <input
                  type="text"
                  required
                  value={customClientName}
                  onChange={(e) => setCustomClientName(e.target.value)}
                  placeholder="e.g. Bpk. Irwan Syahputra"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">No. WhatsApp Klien *</label>
                <input
                  type="text"
                  required
                  value={customClientPhone}
                  onChange={(e) => setCustomClientPhone(e.target.value)}
                  placeholder="0812xxxxxxx"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Alamat Site / Lokasi Instalasi</label>
                <input
                  type="text"
                  value={customClientAddress}
                  onChange={(e) => setCustomClientAddress(e.target.value)}
                  placeholder="Cluster Residensial BSD Blok C12, Tangerang"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Judul Proyek Furniture *</label>
                <input
                  type="text"
                  required
                  value={customProjectTitle}
                  onChange={(e) => setCustomProjectTitle(e.target.value)}
                  placeholder="Kitchen Set L-Shape & Island Bar Custom 4M"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Spesifikasi Teknik & Material</label>
                <textarea
                  rows={3}
                  value={customSpecs}
                  onChange={(e) => setCustomSpecs(e.target.value)}
                  placeholder="Multiplek 18mm, HPL Taco Grey Matt, top marble quartz white, engsel Hafele soft-close."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nilai Kesepakatan Proyek (IDR) *</label>
                <input
                  type="number"
                  required
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Estimasi Modal Pokok Bahan (HPP)</label>
                <input
                  type="number"
                  required
                  value={customCost}
                  onChange={(e) => setCustomCost(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Down Payment (DP %)</label>
                <select
                  value={customDpPercent}
                  onChange={(e) => setCustomDpPercent(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={30}>DP 30%</option>
                  <option value={50}>DP 50% (Standard)</option>
                  <option value={70}>DP 70%</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Tanggal Selesai Instalasi</label>
                <input
                  type="date"
                  value={customTargetDate}
                  onChange={(e) => setCustomTargetDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">DP Awal Yang Diterima ({customDpPercent}%):</span>
                <div className="text-base font-extrabold text-white">{formatRupiah((customPrice * customDpPercent) / 100)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sisa Pelunasan Site:</span>
                <div className="text-base font-extrabold text-amber-400">{formatRupiah(customPrice - (customPrice * customDpPercent) / 100)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('orders_list')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20"
              >
                Simpan Pre-Order & Catat DP
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Order Details & Payment Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Rincian Order: ${selectedOrder.orderNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-500 block">Klien:</span>
                <span className="font-bold text-white">{selectedOrder.customerName} ({selectedOrder.customerPhone})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tahap Produksi:</span>
                <span className="font-bold text-amber-400">{selectedOrder.stage}</span>
              </div>
            </div>

            {/* Milestones Payment Breakdown */}
            <div>
              <h4 className="font-bold text-slate-300 mb-2">Riwayat Tahap Pembayaran (DP Milestones):</h4>
              <div className="space-y-2">
                {selectedOrder.milestones.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400">Jatuh Tempo: {formatDate(m.dueDate)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400">{formatRupiah(m.amount)}</div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        m.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {m.status === 'Paid' ? `LUNAS (${m.paymentMethod || 'Bank'})` : 'BELUM DIBAYAR'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catat Pelunasan Button */}
            {selectedOrder.remainingBalance > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    addPaymentMilestone(selectedOrder.id, 'Transfer Bank', selectedOrder.remainingBalance);
                    setSelectedOrder(null);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Catat Pelunasan Sisa ({formatRupiah(selectedOrder.remainingBalance)})
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
