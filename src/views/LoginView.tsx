import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sparkles, Shield, KeyRound, UserCheck, Store, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  onSuccessLogin: () => void;
  onGoToCatalog: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccessLogin, onGoToCatalog }) => {
  const { login, loginAsRole, users } = useAuth();
  const [username, setUsername] = useState('owner');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username)) {
      setErrorMsg('');
      onSuccessLogin();
    } else {
      setErrorMsg('Username tidak ditemukan. Silakan pilih kartu login cepat di bawah.');
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold shadow-xl shadow-amber-500/20 mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            InteriorCraft <span className="text-amber-400">STUDIO</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
            Sistem Manajemen Integratif Stock, POS Pre-Order, Payroll & Akses Katalog Publik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Form Login */}
          <div className="md:col-span-5 glass-panel bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-slate-100">Portal Masuk Staff</h2>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCustomLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Username / ID Akun
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                onClick={onGoToCatalog}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>Masuk sebagai Tamu (Cek Katalog)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Fast Role Switcher Cards */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Simulasi Akses Peran (Quick Login)
              </span>
              <span className="text-[11px] text-slate-500">Klik kartu untuk tes langsung</span>
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

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-slate-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Sistem Login Siap</strong>: Pembatasan hak akses antar peran (Owner, Kasir, Gudang, Teknisi) akan langsung aktif secara otomatis setelah Anda masuk.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
