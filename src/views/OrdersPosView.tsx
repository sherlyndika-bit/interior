import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderItem, OrderStage } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { ShoppingCart, Plus, Search, CheckCircle2, Clock, DollarSign, Calendar, User, FileText, ChevronRight, AlertCircle, ArrowRight } from 'lucide-react';

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
    'Draft': 'bg-stone-900 text-stone-300 border-stone-800',
    'DP Paid': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    'In Production': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    'Quality Control': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    'Ready for Delivery': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    'Installed': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    'Completed': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    'Cancelled': 'bg-rose-500/10 text-rose-300 border-rose-500/30'
  };

  return (
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-300" />
            Manajemen Pesanan & Terminal POS
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Pengelolaan kasir barang ready stock & pemantauan alur produksi fitout custom interior.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders_list')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'orders_list'
                ? 'bg-white text-stone-950 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Daftar Pesanan ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeTab === 'pos'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Terminal POS</span>
          </button>

          <button
            onClick={() => setActiveTab('new_custom')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-1.5 ${
              activeTab === 'new_custom'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pre-Order Custom</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS LIST (KANBAN & TABLE LIST) */}
      {activeTab === 'orders_list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor order, klien..."
                className="w-full pl-10 pr-4 py-2 bg-[#0A0908] border border-stone-800 rounded-full text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {['Semua', 'DP Paid', 'In Production', 'Quality Control', 'Installed', 'Completed'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setSelectedStage(stg)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedStage === stg
                      ? 'bg-stone-100 text-stone-950 font-bold'
                      : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 shadow-xl hover:border-stone-700 transition-all cursor-pointer space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-400 font-bold">{order.orderNumber}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${stageBadgeColor[order.stage]}`}>
                    {order.stage}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base line-clamp-1">{order.customerName}</h3>
                  <p className="text-xs text-stone-400 font-light line-clamp-1">
                    {order.items.map(i => i.productName).join(', ')}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#050505] border border-stone-900 text-xs space-y-1.5">
                  <div className="flex justify-between text-stone-400">
                    <span>Total Transaksi:</span>
                    <span className="font-bold text-white">{formatRupiah(order.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Terbayar:</span>
                    <span className="font-bold text-emerald-400">{formatRupiah(order.paidAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>{formatDate(order.date)}</span>
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    Detail <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TERMINAL POS READY */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-amber-300">Pilih Produk Ready Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-4 rounded-3xl bg-[#0A0908] border border-stone-900 space-y-3">
                  <img src={p.images[0]} alt={p.name} className="w-full h-32 object-cover rounded-2xl" />
                  <h3 className="font-bold text-white text-sm line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">{formatRupiah(p.basePrice)}</span>
                    <button
                      onClick={() => addToCart(p.id)}
                      className="px-3 py-1.5 rounded-full bg-white text-stone-950 font-bold text-xs hover:bg-stone-200 transition-colors"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 bg-[#0A0908] p-6 rounded-3xl border border-stone-900 h-fit">
            <h2 className="text-sm font-mono uppercase tracking-widest text-amber-300">Ringkasan Kasir POS</h2>
            {cartItems.length === 0 ? (
              <p className="text-xs text-stone-500 py-8 text-center">Keranjang masih kosong</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-stone-900 pb-2">
                    <div>
                      <p className="font-bold text-white">{item.productName}</p>
                      <p className="text-stone-500">{item.quantity} x {formatRupiah(item.unitPrice)}</p>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-rose-400 hover:text-rose-300 text-xs">Hapus</button>
                  </div>
                ))}
                <div className="pt-2 border-t border-stone-900 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{formatRupiah(posSubtotal)}</span></div>
                  <div className="flex justify-between font-bold text-white text-sm pt-2"><span>Total Akhir:</span><span>{formatRupiah(posGrandTotal)}</span></div>
                </div>
                <button
                  onClick={handleCheckoutPOS}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all"
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
        <form onSubmit={handleSaveCustomOrder} className="max-w-2xl mx-auto bg-[#0A0908] p-8 rounded-3xl border border-stone-900 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight">Formulir Pre-Order Custom Fitout</h2>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">Nama Klien / Pemilik Proyek</label>
              <input
                type="text"
                required
                value={customClientName}
                onChange={e => setCustomClientName(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-stone-500"
                placeholder="Contoh: Bpk. Hendra Kusuma"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Judul Proyek Fitout</label>
              <input
                type="text"
                required
                value={customProjectTitle}
                onChange={e => setCustomProjectTitle(e.target.value)}
                className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-stone-500"
                placeholder="Contoh: Kitchen Set & Backdrop TV Penthouse"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Nilai Kontrak Proyek (Rp)</label>
              <input
                type="number"
                value={customPrice}
                onChange={e => setCustomPrice(Number(e.target.value))}
                className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-stone-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-200 transition-all"
            >
              Simpan & Terbitkan Pre-Order DP
            </button>
          </div>
        </form>
      )}

      {/* DETAIL ORDER MODAL */}
      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Detail Pesanan: ${selectedOrder.orderNumber}`}>
          <div className="space-y-4 text-xs text-stone-300">
            <p><strong className="text-white">Klien:</strong> {selectedOrder.customerName}</p>
            <p><strong className="text-white">Tahap Produksi:</strong> {selectedOrder.stage}</p>
            <p><strong className="text-white">Total Kontrak:</strong> {formatRupiah(selectedOrder.grandTotal)}</p>
            <div className="flex justify-end pt-4">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded-full bg-stone-800 text-white">Tutup</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
