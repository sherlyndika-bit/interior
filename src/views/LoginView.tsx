import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sparkles, Shield, ArrowRight, UserCheck, Lock, KeyRound, Sparkle } from 'lucide-react';

interface LoginViewProps {
  onSuccessLogin: () => void;
  isDemoMode?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccessLogin, isDemoMode = false }) => {
  const { login, loginAsRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Harap isi username dan kata sandi.');
      return;
    }

    if (password === 'password123' && login(username)) {
      setErrorMsg('');
      onSuccessLogin();
    } else {
      setErrorMsg('Username atau kata sandi tidak valid. Silakan periksa kredensial Anda.');
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
      {/* Background Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className={`w-full ${isDemoMode ? 'max-w-4xl' : 'max-w-md'} relative z-10 transition-all duration-300`}>
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold shadow-xl shadow-amber-500/20 mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isDemoMode ? 'Portal Simulasi Demo Studio' : 'Portal Otentikasi Admin Studio'}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isDemoMode
              ? 'Mode Pengujian Demo — Pilih Kartu Peran atau Gunakan Login Kredensial'
              : 'Akses Terbatas — Masukkan Kredensial Resmi Staff / Manajerial'}
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isDemoMode ? 'md:grid-cols-12' : ''} gap-6 items-stretch`}>
          {/* Form Login Box */}
          <div className={`${isDemoMode ? 'md:col-span-5' : ''} glass-panel bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Lock className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-slate-100">Login Karyawan / Admin</h2>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Username Akun
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono placeholder:text-slate-600"
                    placeholder="Masukkan username"
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
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-600"
                    placeholder="Masukkan kata sandi"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
                >
                  <span>Verifikasi & Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Sesi terenkripsi & terproteksi sesuai Role RBAC.
              </span>
            </div>
          </div>

          {/* Quick Access Demo Cards (RENDERED ONLY IN DEMO MODE `/#/demo`) */}
          {isDemoMode && (
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Kartu Pengujian Demo Cepat (Quick Access Demo)
                </span>
                <span className="text-[10px] text-slate-500">Khusus Mode Demo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleCardData.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleQuickRole(item.role)}
                    className={`text-left p-4 rounded-2xl border bg-slate-900/60 backdrop-blur-md transition-all group hover:scale-[1.02] shadow-lg ${item.color}`}
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
          )}
        </div>
      </div>
    </div>
  );
};
