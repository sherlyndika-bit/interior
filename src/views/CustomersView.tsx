import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Users, Plus, Search, Phone, Mail, MapPin, History, Edit, Trash2 } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedHistoryCustomer, setSelectedHistoryCustomer] = useState<Customer | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        name,
        phone,
        email,
        address,
        city,
        notes
      });
    } else {
      addCustomer({
        id: `cust-${Date.now()}`,
        code: code || `CUST-${Date.now().toString().slice(-4)}`,
        name,
        phone,
        email,
        address,
        city: city || 'Jabodetabek',
        totalOrders: 0,
        totalSpent: 0,
        notes,
        joinedDate: new Date().toISOString().split('T')[0]
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setCode('');
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCity('');
    setNotes('');
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  return (
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-300" />
            Database Klien & CRM Proyek
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Pengelolaan direktori klien, riwayat proyek fitout, dan kontak langsung via WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Klien Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama klien, telepon, kota..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0A0908] border border-stone-800 rounded-full text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
        />
      </div>

      {/* Customer Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((c) => {
          const custOrders = getCustomerOrders(c.id);
          const totalSpent = custOrders.reduce((sum, o) => sum + o.grandTotal, 0);

          return (
            <div key={c.id} className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">{c.code}</span>
                  <span className="text-[10px] font-mono text-stone-500">{c.city}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-white text-lg">{c.name}</h3>
                  <p className="text-xs text-stone-400 font-light flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{c.phone}</span>
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#050505] border border-stone-900 text-xs space-y-1">
                  <div className="flex justify-between text-stone-400">
                    <span>Total Proyek Fitout:</span>
                    <span className="font-bold text-white">{custOrders.length} Proyek</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Akumulasi Nilai:</span>
                    <span className="font-bold text-emerald-400">{formatRupiah(totalSpent)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-900">
                <button
                  onClick={() => setSelectedHistoryCustomer(c)}
                  className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5 text-amber-300" />
                  <span>Riwayat</span>
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteCustomer(c.id)} className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL HISTORY */}
      {selectedHistoryCustomer && (
        <Modal isOpen={!!selectedHistoryCustomer} onClose={() => setSelectedHistoryCustomer(null)} title={`Riwayat Proyek: ${selectedHistoryCustomer.name}`}>
          <div className="space-y-4 text-xs text-stone-300">
            {getCustomerOrders(selectedHistoryCustomer.id).length === 0 ? (
              <p className="text-stone-500">Belum ada riwayat pesanan</p>
            ) : (
              getCustomerOrders(selectedHistoryCustomer.id).map(o => (
                <div key={o.id} className="p-4 rounded-2xl bg-[#050505] border border-stone-900 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{o.orderNumber}</p>
                    <p className="text-stone-400 font-light">{formatDate(o.date)} — {o.stage}</p>
                  </div>
                  <span className="font-bold text-emerald-400">{formatRupiah(o.grandTotal)}</span>
                </div>
              ))
            )}
            <div className="flex justify-end pt-4">
              <button onClick={() => setSelectedHistoryCustomer(null)} className="px-5 py-2.5 rounded-full bg-stone-800 text-white">Tutup</button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL ADD CLIENT */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Klien Baru">
          <form onSubmit={handleSave} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Nama Lengkap Klien</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Nomor WhatsApp / HP</label>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Simpan Klien</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
