import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Shield, ArrowRight, UserCheck, Lock, KeyRound } from 'lucide-react';

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
      desc: 'Akses penuh seluruh modul sistem, laporan profit, & payroll.',
      color: 'border-amber-500/40 bg-stone-950 hover:border-amber-400 text-amber-300',
      badge: 'Full Access'
    },
    {
      role: 'kasir',
      label: 'Kasir & Sales Consult',
      desc: 'Kelola POS fitout, transaksi Pre-Order DP, & CRM pelanggan.',
      color: 'border-blue-500/40 bg-stone-950 hover:border-blue-400 text-blue-300',
      badge: 'Sales & POS'
    },
    {
      role: 'gudang',
      label: 'Manajer Gudang',
      desc: 'Kelola stok barang jadi & stok bahan mentah (HPL, Multiplek).',
      color: 'border-emerald-500/40 bg-stone-950 hover:border-emerald-400 text-emerald-300',
      badge: 'Inventory'
    },
    {
      role: 'teknisi',
      label: 'Teknisi & Logistik',
      desc: 'Pantau jadwal pengiriman & instalasi site, upload bukti foto.',
      color: 'border-purple-500/40 bg-stone-950 hover:border-purple-400 text-purple-300',
      badge: 'Operations'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans text-stone-100">
      {/* Ambient Architectural Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className={`w-full ${isDemoMode ? 'max-w-4xl' : 'max-w-md'} relative z-10 transition-all duration-300`}>
        {/* Studio Logo Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-900 border border-stone-800 text-white mb-2 shadow-xl">
            <Shield className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-widest uppercase">
            INTERIORCRAFT <span className="font-light text-stone-400 text-sm tracking-normal">STUDIO</span>
          </h1>
          <p className="text-stone-400 text-xs font-mono tracking-wider uppercase">
            {isDemoMode
              ? 'PORTAL SIMULASI DEMO — PILIH KARTU AKSELERASI ATAU LOGIN'
              : 'PORTAL OTENTIKASI KEAMANAN STAFF & MANAJEMEN'}
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isDemoMode ? 'md:grid-cols-12' : ''} gap-6 items-stretch`}>
          {/* Form Login Box */}
          <div className={`${isDemoMode ? 'md:col-span-5' : ''} bg-[#0A0908] border border-stone-900 p-8 rounded-3xl shadow-2xl space-y-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-stone-900">
                <Lock className="w-4 h-4 text-amber-300" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Login Kredensial</h2>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs mt-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    Username Staff
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#050505] border border-stone-800 text-white text-sm focus:outline-none focus:border-stone-500 transition-colors font-mono placeholder:text-stone-600"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#050505] border border-stone-800 text-white text-sm focus:outline-none focus:border-stone-500 transition-colors placeholder:text-stone-600"
                    placeholder="Masukkan kata sandi"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-white hover:bg-stone-200 text-stone-950 font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl flex items-center justify-center gap-2 mt-2"
                >
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-stone-900 text-center">
              <span className="text-[11px] text-stone-500 flex items-center justify-center gap-1 font-mono">
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                Sesi Terenkripsi Kriptografi RBAC.
              </span>
            </div>
          </div>

          {/* Quick Access Demo Cards */}
          {isDemoMode && (
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Simulasi Akun Pengujian Cepat
                </span>
                <span className="text-[10px] text-stone-500 font-mono">MODE DEMO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleCardData.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleQuickRole(item.role)}
                    className={`text-left p-5 rounded-3xl border transition-all group hover:scale-[1.02] shadow-xl ${item.color}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 uppercase tracking-wider">
                        {item.badge}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-300">
                      {item.label}
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-1 leading-snug font-light">
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
