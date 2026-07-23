import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Users, Plus, Search, Phone, History, Trash2 } from 'lucide-react';

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
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Database Klien & CRM Proyek
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pengelolaan direktori klien, riwayat proyek fitout, dan kontak langsung WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Klien Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama klien, telepon, kota..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
        />
      </div>

      {/* Customer Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((c) => {
          const custOrders = getCustomerOrders(c.id);
          const totalSpent = custOrders.reduce((sum, o) => sum + o.grandTotal, 0);

          return (
            <div key={c.id} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold">{c.code}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{c.city}</span>
                </div>

                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base">{c.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5 font-normal">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{c.phone}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1">
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>Total Proyek Fitout:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{custOrders.length} Proyek</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                    <span>Akumulasi Nilai:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(totalSpent)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setSelectedHistoryCustomer(c)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                  <span>Riwayat</span>
                </button>
                <button onClick={() => deleteCustomer(c.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-500/10 dark:text-rose-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL HISTORY */}
      {selectedHistoryCustomer && (
        <Modal isOpen={!!selectedHistoryCustomer} onClose={() => setSelectedHistoryCustomer(null)} title={`Riwayat Proyek: ${selectedHistoryCustomer.name}`}>
          <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
            {getCustomerOrders(selectedHistoryCustomer.id).length === 0 ? (
              <p className="text-zinc-400">Belum ada riwayat pesanan</p>
            ) : (
              getCustomerOrders(selectedHistoryCustomer.id).map(o => (
                <div key={o.id} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{o.orderNumber}</p>
                    <p className="text-zinc-400">{formatDate(o.date)} — {o.stage}</p>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(o.grandTotal)}</span>
                </div>
              ))
            )}
            <div className="flex justify-end pt-3">
              <button onClick={() => setSelectedHistoryCustomer(null)} className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium">Tutup</button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL ADD CLIENT */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Klien Baru">
          <form onSubmit={handleSave} className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nama Lengkap Klien</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nomor WhatsApp / HP</label>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Simpan Klien</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
