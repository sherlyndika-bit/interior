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
      color: 'border-amber-200 dark:border-amber-500/30 bg-white dark:bg-slate-900 hover:border-amber-500 text-amber-900 dark:text-amber-300',
      badge: 'Full Access'
    },
    {
      role: 'kasir',
      label: 'Kasir & Sales Consult',
      desc: 'Kelola POS fitout, transaksi Pre-Order DP, & CRM pelanggan.',
      color: 'border-blue-200 dark:border-blue-500/30 bg-white dark:bg-slate-900 hover:border-blue-500 text-blue-900 dark:text-blue-300',
      badge: 'Sales & POS'
    },
    {
      role: 'gudang',
      label: 'Manajer Gudang',
      desc: 'Kelola stok barang jadi & stok bahan mentah (HPL, Multiplek).',
      color: 'border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-slate-900 hover:border-emerald-500 text-emerald-900 dark:text-emerald-300',
      badge: 'Inventory'
    },
    {
      role: 'teknisi',
      label: 'Teknisi & Logistik',
      desc: 'Pantau jadwal pengiriman & instalasi site, upload bukti foto.',
      color: 'border-purple-200 dark:border-purple-500/30 bg-white dark:bg-slate-900 hover:border-purple-500 text-purple-900 dark:text-purple-300',
      badge: 'Operations'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <div className={`w-full ${isDemoMode ? 'max-w-4xl' : 'max-w-md'} relative z-10 transition-all duration-300`}>
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 mb-2 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-wider uppercase">
            INTERIORCRAFT <span className="font-light text-slate-500 dark:text-slate-400 text-xs tracking-normal">STUDIO</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-mono tracking-wider uppercase">
            {isDemoMode
              ? 'PORTAL SIMULASI DEMO STAFF'
              : 'PORTAL OTENTIKASI KEAMANAN ADMIN'}
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isDemoMode ? 'md:grid-cols-12' : ''} gap-6 items-stretch`}>
          {/* Form Login Box */}
          <div className={`${isDemoMode ? 'md:col-span-5' : ''} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Login Staff</h2>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Username Akun
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors font-mono placeholder:text-slate-400"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors placeholder:text-slate-400"
                    placeholder="Masukkan kata sandi"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
                >
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-mono">
                <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Sesi Terenkripsi Kriptografi RBAC.
              </span>
            </div>
          </div>

          {/* Quick Access Demo Cards */}
          {isDemoMode && (
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Simulasi Akun Pengujian Cepat
                </span>
                <span className="text-[10px] text-slate-500 font-mono">MODE DEMO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleCardData.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleQuickRole(item.role)}
                    className={`text-left p-4 rounded-xl border transition-all group hover:scale-[1.01] shadow-sm ${item.color}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {item.badge}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug font-normal">
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
