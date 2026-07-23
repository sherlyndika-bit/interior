import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderItem, OrderStage } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { ShoppingCart, Plus, Search, ChevronRight, CheckCircle2, DollarSign, PackageCheck } from 'lucide-react';

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
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Transfer Bank' | 'Tunai' | 'QRIS' | 'Kartu Kredit'>('Transfer Bank');

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

  const handleRecordPayment = (orderId: string) => {
    if (paymentAmount <= 0) return;
    addPaymentMilestone(orderId, paymentMethod, paymentAmount);
    setPaymentAmount(0);
    setSelectedOrder(null);
  };

  // Filter Orders List
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = selectedStage === 'Semua' || o.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const allStages: OrderStage[] = [
    'Draft',
    'DP Paid',
    'In Production',
    'Quality Control',
    'Ready for Delivery',
    'Installed',
    'Completed',
    'Cancelled'
  ];

  const stageBadgeColor: Record<OrderStage, string> = {
    'Draft': 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    'DP Paid': 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
    'In Production': 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
    'Quality Control': 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
    'Ready for Delivery': 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
    'Installed': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
    'Cancelled': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30'
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Manajemen Pesanan & Terminal POS
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pengelolaan kasir barang ready stock & pemantauan alur produksi fitout custom.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders_list')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'orders_list'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Daftar Pesanan ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'pos'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Terminal POS</span>
          </button>

          <button
            onClick={() => setActiveTab('new_custom')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'new_custom'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pre-Order Custom</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS LIST */}
      {activeTab === 'orders_list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor order, klien..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {['Semua', 'DP Paid', 'In Production', 'Quality Control', 'Installed', 'Completed'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setSelectedStage(stg)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                    selectedStage === stg
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setPaymentAmount(order.remainingBalance);
                }}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold">{order.orderNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-medium border ${stageBadgeColor[order.stage]}`}>
                    {order.stage}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base line-clamp-1">{order.customerName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal line-clamp-1">
                    {order.items.map(i => i.productName).join(', ')}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1">
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>Total Kontrak:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{formatRupiah(order.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>Terbayar:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(order.paidAmount)}</span>
                  </div>
                  {order.remainingBalance > 0 && (
                    <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                      <span>Sisa Pelunasan:</span>
                      <span>{formatRupiah(order.remainingBalance)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
                  <span>{formatDate(order.date)}</span>
                  <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-semibold">
                    Detail & Kelola <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TERMINAL POS READY */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Pilih Produk Ready Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                  <img src={p.images[0]} alt={p.name} className="w-full h-32 object-cover rounded-xl" />
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{formatRupiah(p.basePrice)}</span>
                    <button
                      onClick={() => addToCart(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-fit shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Ringkasan Kasir POS</h2>

            {/* Customer Selector */}
            <div>
              <label className="block text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-1">Pilih Klien / Pembeli</label>
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center">Keranjang masih kosong</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{item.productName}</p>
                      <p className="text-zinc-400">{item.quantity} x {formatRupiah(item.unitPrice)}</p>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-rose-600 hover:text-rose-700 text-xs font-medium">Hapus</button>
                  </div>
                ))}

                {/* Promo Code Input */}
                <div>
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-1">Kode Voucher Promo</label>
                  <input
                    type="text"
                    value={appliedPromoCode}
                    onChange={e => setAppliedPromoCode(e.target.value)}
                    placeholder="Contoh: FITOUT500"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white uppercase font-mono"
                  />
                  {matchedPromo && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                      Voucher Valid: Potongan {matchedPromo.type === 'fixed' ? formatRupiah(matchedPromo.value) : `${matchedPromo.value}%`}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500"><span>Subtotal:</span><span>{formatRupiah(posSubtotal)}</span></div>
                  {posDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium"><span>Diskon Promo:</span><span>-{formatRupiah(posDiscount)}</span></div>
                  )}
                  {taxSetting.enablePPN && (
                    <div className="flex justify-between text-zinc-500"><span>PPN ({taxSetting.ppnRate}%):</span><span>{formatRupiah(posTax)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-zinc-900 dark:text-white text-sm pt-2"><span>Total Akhir:</span><span>{formatRupiah(posGrandTotal)}</span></div>
                </div>

                <button
                  onClick={handleCheckoutPOS}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  Proses Transaksi POS
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NEW CUSTOM PRE-ORDER */}
      {activeTab === 'new_custom' && (
        <form onSubmit={handleSaveCustomOrder} className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">Formulir Pre-Order Custom Fitout</h2>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nama Klien / Pemilik Proyek</label>
                <input
                  type="text"
                  required
                  value={customClientName}
                  onChange={e => setCustomClientName(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                  placeholder="Contoh: Bpk. Hendra Kusuma"
                />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nomor Telepon / WA</label>
                <input
                  type="text"
                  required
                  value={customClientPhone}
                  onChange={e => setCustomClientPhone(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Alamat Site Pemasangan</label>
              <input
                type="text"
                required
                value={customClientAddress}
                onChange={e => setCustomClientAddress(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                placeholder="Jl. Senopati No. 45, Jakarta Selatan"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Judul Proyek Fitout</label>
              <input
                type="text"
                required
                value={customProjectTitle}
                onChange={e => setCustomProjectTitle(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                placeholder="Contoh: Kitchen Set & Backdrop TV Penthouse"
              />
            </div>

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Spesifikasi Material & Fitting</label>
              <textarea
                rows={3}
                value={customSpecs}
                onChange={e => setCustomSpecs(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                placeholder="Multiplek 18mm, HPL Taco Wood Grain, engsel soft-close Hafele"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nilai Kontrak (Rp)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={e => setCustomPrice(Number(e.target.value))}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Persentase DP (%)</label>
                <input
                  type="number"
                  value={customDpPercent}
                  onChange={e => setCustomDpPercent(Number(e.target.value))}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Simpan & Terbitkan Pre-Order DP
            </button>
          </div>
        </form>
      )}

      {/* DETAIL ORDER & MANAGEMENT MODAL */}
      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Kelola Pesanan: ${selectedOrder.orderNumber}`}>
          <div className="space-y-5 text-xs text-zinc-700 dark:text-zinc-300">
            {/* Info Summary */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-zinc-900 dark:text-white text-sm">{selectedOrder.customerName}</span>
                <span className="font-mono text-zinc-500">{selectedOrder.customerPhone}</span>
              </div>
              <p className="text-zinc-500 font-normal">{selectedOrder.customerAddress}</p>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-bold mb-1">Ubah Tahap Produksi / Proyek</label>
              <select
                value={selectedOrder.stage}
                onChange={(e) => {
                  const nextStage = e.target.value as OrderStage;
                  updateOrderStatus(selectedOrder.id, nextStage);
                  setSelectedOrder({ ...selectedOrder, stage: nextStage });
                }}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-semibold"
              >
                {allStages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Payment Summary & Record Milestone */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Status Pembayaran Milestone
              </h4>
              <div className="flex justify-between text-xs">
                <span>Total Kontrak:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{formatRupiah(selectedOrder.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                <span>Sudah Dibayar:</span>
                <span>{formatRupiah(selectedOrder.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-rose-600 font-bold">
                <span>Sisa Tagihan:</span>
                <span>{formatRupiah(selectedOrder.remainingBalance)}</span>
              </div>

              {selectedOrder.remainingBalance > 0 && (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div>
                    <label className="block text-zinc-500 mb-1">Metode Pembayaran</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value as any)}
                      className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                    >
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="Tunai">Tunai</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Kartu Kredit">Kartu Kredit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1">Jumlah Catat Pelunasan (Rp)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(Number(e.target.value))}
                      className="w-full p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleRecordPayment(selectedOrder.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                  >
                    Catat Pembayaran Masuk
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium">Tutup</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
