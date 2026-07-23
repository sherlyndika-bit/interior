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
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
            Manajemen Akses Staff (RBAC)
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Pengaturan kredensial login staff, penugasan peran manajerial, dan hak akses modul internal.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xl"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Staff</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#0A0908] rounded-3xl border border-stone-900 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-stone-300">
          <thead className="bg-[#050505] border-b border-stone-900 text-stone-400 font-mono text-[10px] uppercase tracking-widest">
            <tr>
              <th className="p-4">Akun Staff</th>
              <th className="p-4">Username</th>
              <th className="p-4">Peran Akses</th>
              <th className="p-4">Hak Akses Modul</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-900">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-stone-950/60 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-950 font-bold text-xs flex items-center justify-center">
                    {u.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{u.name}</p>
                    <p className="text-stone-500 text-[11px] font-mono">{u.email}</p>
                  </div>
                </td>
                <td className="p-4 font-mono text-amber-300">{u.username}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-[10px] font-mono uppercase text-amber-300">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-stone-400 text-[11px]">
                  {u.permissions.includes('all') ? 'Seluruh Modul (Super Admin)' : `${u.permissions.length} Modul Terbatas`}
                </td>
                <td className="p-4 text-right">
                  {u.role !== 'owner' && (
                    <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-400">
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
          <form onSubmit={handleSave} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Nama Lengkap Karyawan</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Username Login</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white font-mono" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Peran Akses</label>
              <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white">
                <option value="owner">Owner / Super Admin</option>
                <option value="kasir">Kasir & Sales POS</option>
                <option value="gudang">Manajer Gudang</option>
                <option value="teknisi">Teknisi & Logistik</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Simpan Akun Staff</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
