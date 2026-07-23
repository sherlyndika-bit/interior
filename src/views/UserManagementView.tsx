import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';
import { Modal } from '../components/Modal';
import { ShieldCheck, UserPlus, Edit, Trash2 } from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('kasir');

  const handleOpenNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setUsername(u.username);
    setRole(u.role);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) return;

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    if (editingUser) {
      updateUser({
        ...editingUser,
        name,
        email,
        username,
        role,
        initials,
        permissions: role === 'owner' ? ['all'] : role === 'kasir' ? ['pos', 'customers'] : role === 'gudang' ? ['inventory'] : ['schedule']
      });
    } else {
      addUser({
        id: `usr-${Date.now()}`,
        name,
        email,
        username,
        role,
        initials,
        permissions: role === 'owner' ? ['all'] : role === 'kasir' ? ['pos', 'customers'] : role === 'gudang' ? ['inventory'] : ['schedule']
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
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Manajemen Akses Staff (RBAC)
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pengaturan kredensial login staff, penugasan peran manajerial, dan hak akses modul internal.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Staff</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium uppercase text-[10px]">
            <tr>
              <th className="p-4">Akun Staff</th>
              <th className="p-4">Username</th>
              <th className="p-4">Peran Akses</th>
              <th className="p-4">Hak Akses Modul</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/60 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs flex items-center justify-center shadow-sm">
                    {u.initials}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{u.name}</p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-mono">{u.email}</p>
                  </div>
                </td>
                <td className="p-4 font-mono text-zinc-900 dark:text-white font-bold">{u.username}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono uppercase text-zinc-700 dark:text-zinc-300">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-zinc-500 dark:text-zinc-400 text-[11px]">
                  {u.permissions.includes('all') ? 'Seluruh Modul (Super Admin)' : `${u.permissions.length} Modul Terbatas`}
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => handleOpenEdit(u)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-300"><Edit className="w-4 h-4" /></button>
                  {u.role !== 'owner' && (
                    <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-500/10 dark:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USER MODAL */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit Akun Staff' : 'Tambah Akun Staff Baru'}>
          <form onSubmit={handleSave} className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nama Lengkap Karyawan</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Username Login</label>
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" placeholder="email@interiorcraft.com" />
              </div>
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Peran Akses Sistem</label>
              <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white">
                <option value="owner">Owner / Super Admin (Akses Penuh)</option>
                <option value="kasir">Kasir & Sales POS (Modul Kasir + CRM)</option>
                <option value="gudang">Manajer Gudang (Modul Stok & Bahan)</option>
                <option value="teknisi">Teknisi & Logistik (Modul Pemasangan Site)</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Simpan Akun Staff</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
