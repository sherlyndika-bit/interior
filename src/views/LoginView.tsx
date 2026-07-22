import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sparkles, Shield, ArrowRight, UserCheck, Lock, KeyRound } from 'lucide-react';

interface LoginViewProps {
  onSuccessLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccessLogin }) => {
  const { login, loginAsRole } = useAuth();
  const [username, setUsername] = useState('owner');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username)) {
      setErrorMsg('');
      onSuccessLogin();
    } else {
      setErrorMsg('Username tidak ditemukan. Silakan gunakan kredensial valid atau tombol login cepat.');
    }
  };

  const handleQuickRole = (role: UserRole) => {
    loginAsRole(role);
    onSuccessLogin();
  };

  const roleCardData: { role: UserRole; label: string; desc: string; color: string; badge: string }[] = [
    {
      role: 'owner',
      label: 'Owner / Super Admin',
      desc: 'Akses penuh ke seluruh modul sistem, laporan keuangan profit & payroll.',
      color: 'border-amber-500/50 hover:bg-amber-500/10 text-amber-300',
      badge: 'Full Privilege'
    },
    {
      role: 'kasir',
      label: 'Kasir & Sales Consult',
      desc: 'Kelola POS, transaksi Pre-Order DP, CRM pelanggan, & Surat Penawaran.',
      color: 'border-blue-500/50 hover:bg-blue-500/10 text-blue-300',
      badge: 'Sales & POS'
    },
    {
      role: 'gudang',
      label: 'Manajer Gudang',
      desc: 'Kelola stok barang jadi, varian kayu, & stok bahan mentah (HPL, Multiplek).',
      color: 'border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-300',
      badge: 'Inventory'
    },
    {
      role: 'teknisi',
      label: 'Teknisi & Logistik',
      desc: 'Pantau jadwal pengiriman & instalasi site, upload bukti penyelesaian.',
      color: 'border-purple-500/50 hover:bg-purple-500/10 text-purple-300',
      badge: 'Field Operations'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold shadow-xl shadow-amber-500/20 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Portal Otentikasi Admin <span className="text-amber-400">STUDIO</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            Akses Terbatas — Masukkan Kredensial Staff / Manajerial Studio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Form Login */}
          <div className="md:col-span-5 glass-panel bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-slate-100">Login Karyawan / Admin</h2>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCustomLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Username Akun
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
                    placeholder="e.g. owner / kasir / gudang"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <span>Verifikasi & Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500">
                🔒 Sesi login terenkripsi lokal dan terproteksi sesuai Role RBAC.
              </span>
            </div>
          </div>

          {/* Right Column: Quick Role Switcher */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Simulasi Otentikasi Cepat (Quick Access)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleCardData.map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleQuickRole(item.role)}
                  className={`text-left p-4 rounded-xl border bg-slate-900/60 backdrop-blur-md transition-all group hover:scale-[1.02] shadow-lg ${item.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {item.badge}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
