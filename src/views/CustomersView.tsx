import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Users, Plus, Search, Phone, Mail, MapPin, History, Edit, Trash2, Award } from 'lucide-react';

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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            Database Pelanggan & CRM Proyek
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Riwayat belanja, catatan preferensi gaya interior, dan kontak klien.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama / no. telp / kota..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => {
          const custOrders = getCustomerOrders(cust.id);
          return (
            <div key={cust.id} className="glass-card rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {cust.code}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1">{cust.name}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 block">Total Belanja</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-sm">{formatRupiah(cust.totalSpent)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{cust.phone}</span>
                  </div>
                  {cust.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cust.email}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{cust.address}</span>
                  </div>
                </div>

                {cust.notes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 italic">
                    "{cust.notes}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedHistoryCustomer(cust)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Riwayat Transaksi ({custOrders.length})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCustomer(cust);
                      setCode(cust.code);
                      setName(cust.name);
                      setPhone(cust.phone);
                      setEmail(cust.email);
                      setAddress(cust.address);
                      setCity(cust.city);
                      setNotes(cust.notes);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(cust.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Form Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kode Klien</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="CUST-001"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kota Asal</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jakarta / Tangerang / Bandung"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Nama Lengkap Klien *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dra. Ratna Sarumpaet"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">No. Telepon / WA *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081298765432"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ratna@gmail.com"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Alam Sutera Utama No. 88, Serpong"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Catatan Preferensi / Khusus</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Suka gaya Scandinavian, garansi engsel 2 tahun."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Simpan Data Klien
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Customer Transaction History Modal */}
      {selectedHistoryCustomer && (
        <Modal
          isOpen={!!selectedHistoryCustomer}
          onClose={() => setSelectedHistoryCustomer(null)}
          title={`Riwayat Transaksi: ${selectedHistoryCustomer.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-3 text-xs">
            {getCustomerOrders(selectedHistoryCustomer.id).map((ord) => (
              <div key={ord.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-amber-400">{ord.orderNumber}</div>
                  <div className="text-slate-300 font-medium">{ord.items.map(i => i.productName).join(', ')}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{formatDate(ord.date)} • Stage: {ord.stage}</div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-emerald-400 text-sm">{formatRupiah(ord.grandTotal)}</div>
                  <span className="text-[10px] text-slate-400">Terbayar: {formatRupiah(ord.paidAmount)}</span>
                </div>
              </div>
            ))}

            {getCustomerOrders(selectedHistoryCustomer.id).length === 0 && (
              <div className="text-center py-6 text-slate-500 italic">
                Belum ada transaksi tercatat untuk pelanggan ini.
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
