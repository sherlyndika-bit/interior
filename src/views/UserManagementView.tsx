import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';
import { Modal } from '../components/Modal';
import { ShieldCheck, UserPlus, Trash2 } from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('kasir');

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
        initials
      });
    } else {
      addUser({
        id: `usr-${Date.now()}`,
        name,
        email,
        username,
        role,
        initials,
        permissions: role === 'owner' ? ['all'] : ['pos', 'customers']
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Manajemen Akses Staff (RBAC)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengaturan kredensial login staff, penugasan peran manajerial, dan hak akses modul internal.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Staff</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase text-[10px]">
            <tr>
              <th className="p-4">Akun Staff</th>
              <th className="p-4">Username</th>
              <th className="p-4">Peran Akses</th>
              <th className="p-4">Hak Akses Modul</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-extrabold text-xs flex items-center justify-center shadow-sm">
                    {u.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{u.email}</p>
                  </div>
                </td>
                <td className="p-4 font-mono text-slate-900 dark:text-amber-300 font-bold">{u.username}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono uppercase text-amber-700 dark:text-amber-300">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                  {u.permissions.includes('all') ? 'Seluruh Modul (Super Admin)' : `${u.permissions.length} Modul Terbatas`}
                </td>
                <td className="p-4 text-right">
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Akun Staff Baru">
          <form onSubmit={handleSave} className="space-y-4 text-xs text-slate-900 dark:text-slate-100">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Nama Lengkap Karyawan</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Username Login</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono" />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Peran Akses</label>
              <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white">
                <option value="owner">Owner / Super Admin</option>
                <option value="kasir">Kasir & Sales POS</option>
                <option value="gudang">Manajer Gudang</option>
                <option value="teknisi">Teknisi & Logistik</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl">Simpan Akun Staff</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
