import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { LogOut, Sparkles, Bell, Globe, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const { currentUser, loginAsRole, logout } = useAuth();
  const { products, rawMaterials } = useApp();

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length +
                        rawMaterials.filter(m => m.stock <= m.minStock).length;

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    owner: { title: 'Owner / Super Admin', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    kasir: { title: 'Kasir & Sales POS', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    gudang: { title: 'Manajer Gudang', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    teknisi: { title: 'Teknisi & Logistik', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    guest: { title: 'Tamu / Pelanggan', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-100 tracking-tight text-base flex items-center gap-2">
              InteriorCraft <span className="text-amber-400 font-semibold text-xs px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">ADMIN</span>
            </h1>
            <p className="text-[11px] text-slate-400">Portal Sistem Internal Studio</p>
          </div>
        </div>

        {/* Shortcut to view Public Website */}
        <button
          onClick={() => window.location.hash = ''}
          className="ml-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
          title="Buka Website Katalog Publik Klien"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>Lihat Website Publik</span>
        </button>
      </div>

      {/* Right section: User Badge (Initials Only, No Photo) & Logout */}
      <div className="flex items-center gap-4">
        {lowStockCount > 0 && (
          <button
            onClick={() => onTabChange('inventory')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/20 transition-all"
            title="Ada stok menipis"
          >
            <Bell className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span className="font-semibold">{lowStockCount} Alert Stok</span>
          </button>
        )}

        {/* Quick Role Simulation Selector for Staff */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="px-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Ganti Akun Staff:</span>
          {(['owner', 'kasir', 'gudang', 'teknisi'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => loginAsRole(r)}
              className={`px-2 py-0.5 rounded-md font-medium transition-all text-[11px] ${
                currentUser?.role === r
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Logged in User Initials Badge (No User Photo) */}
        {currentUser && (
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center border border-amber-400/40 shadow-sm">
              {currentUser.initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200">
                {currentUser.name}
              </div>
              <span className={`inline-block px-1.5 py-0.2 text-[10px] font-medium rounded border ${roleLabels[currentUser.role]?.color}`}>
                {roleLabels[currentUser.role]?.title}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                window.location.hash = '';
              }}
              title="Keluar dari Portal Admin"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
