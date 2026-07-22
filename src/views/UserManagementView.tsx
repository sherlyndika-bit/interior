import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';
import { Modal } from '../components/Modal';
import { ShieldCheck, UserPlus, Shield, Edit, Trash2, Key, CheckCircle2, Lock } from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('kasir');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['pos', 'customers', 'quotations']);

  const allModules = [
    { id: 'pos', label: 'Kasir & Pre-Order POS' },
    { id: 'inventory', label: 'Stok Barang Jadi & Bahan Mentah' },
    { id: 'customers', label: 'Database Pelanggan CRM' },
    { id: 'schedule', label: 'Jadwal Pengiriman & Fitting Teknisi' },
    { id: 'reports', label: 'Laporan Penjualan & Laba Bersih' },
    { id: 'quotations', label: 'Invoice & Surat Penawaran' },
    { id: 'payroll', label: 'Penggajian Karyawan & Tax Setup' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) return;

    if (editingUser) {
      updateUser({
        ...editingUser,
        name,
        email,
        username,
        role,
        permissions: role === 'owner' ? ['all'] : selectedPermissions
      });
    } else {
      addUser({
        id: `usr-${Date.now()}`,
        name,
        email,
        username,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        permissions: role === 'owner' ? ['all'] : selectedPermissions
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setUsername('');
    setRole('kasir');
    setSelectedPermissions(['pos', 'customers', 'quotations']);
  };

  const togglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(prev => prev.filter(p => p !== permId));
    } else {
      setSelectedPermissions(prev => [...prev, permId]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            Manajemen Akses User & Role (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengaturan akun staff kasir, gudang, teknisi & hak akses per modul sistem.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Staff Baru</span>
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((usr) => (
          <div key={usr.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <img src={usr.avatar} alt={usr.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40" />
                <div>
                  <h3 className="font-bold text-white text-sm">{usr.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">@{usr.username}</span>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Role: {usr.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Hak Akses Modul:</span>
                <div className="flex flex-wrap gap-1">
                  {usr.permissions.includes('all') ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/40">
                      ALL PRIVILEGES (FULL ACCESS)
                    </span>
                  ) : (
                    usr.permissions.map(p => (
                      <span key={p} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditingUser(usr);
                  setName(usr.name);
                  setEmail(usr.email);
                  setUsername(usr.username);
                  setRole(usr.role);
                  setSelectedPermissions(usr.permissions);
                  setIsModalOpen(true);
                }}
                className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </button>
              {usr.id !== currentUser?.id && (
                <button
                  onClick={() => deleteUser(usr.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? 'Edit Hak Akses Staff' : 'Tambah Akun Staff Baru'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Andi Wijaya"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Username Login</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kasir1"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Peran Utama (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="kasir">Kasir & Sales POS</option>
                <option value="gudang">Manajer Gudang</option>
                <option value="teknisi">Teknisi & Logistik</option>
                <option value="owner">Owner / Super Admin</option>
              </select>
            </div>

            {role !== 'owner' && (
              <div className="space-y-2 pt-2">
                <label className="block text-slate-400 font-semibold">Pilih Modul Yang Boleh Diakses:</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {allModules.map((m) => {
                    const isChecked = selectedPermissions.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => togglePermission(m.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{m.label}</span>
                        <input type="checkbox" checked={isChecked} onChange={() => {}} className="accent-amber-500" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                Simpan Akun
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
