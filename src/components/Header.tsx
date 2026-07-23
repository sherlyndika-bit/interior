import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { LogOut, Bell, Globe } from 'lucide-react';
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
    owner: { title: 'Owner / Super Admin', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    kasir: { title: 'Kasir & Sales POS', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    gudang: { title: 'Manajer Gudang', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    teknisi: { title: 'Teknisi & Logistik', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
    guest: { title: 'Tamu / Pelanggan', color: 'bg-stone-500/10 text-stone-300 border-stone-500/30' }
  };

  return (
    <header className="h-16 border-b border-stone-900 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Left branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = ''}>
          <span className="font-bold text-white text-lg tracking-widest uppercase">
            INTERIORCRAFT <span className="font-light text-stone-400 text-xs tracking-normal">STUDIO</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 uppercase tracking-widest">
            ADMIN
          </span>
        </div>

        {/* Shortcut to view Public Website */}
        <button
          onClick={() => window.location.hash = ''}
          className="ml-4 px-3.5 py-1.5 rounded-full bg-stone-950 hover:bg-stone-900 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-stone-800"
          title="Buka Website Katalog Publik Klien"
        >
          <Globe className="w-3.5 h-3.5 text-amber-300" />
          <span>Lihat Website Publik</span>
        </button>
      </div>

      {/* Right section: User Badge & Logout */}
      <div className="flex items-center gap-4">
        {lowStockCount > 0 && (
          <button
            onClick={() => onTabChange('inventory')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/20 transition-all"
            title="Ada stok menipis"
          >
            <Bell className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span className="font-semibold">{lowStockCount} Alert Stok</span>
          </button>
        )}

        {/* Quick Role Simulation Selector */}
        <div className="hidden lg:flex items-center gap-1 bg-[#0A0908] p-1 rounded-full border border-stone-800 text-xs">
          <span className="px-2 text-[10px] text-stone-500 uppercase font-mono font-semibold">Simulasi Peran:</span>
          {(['owner', 'kasir', 'gudang', 'teknisi'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => loginAsRole(r)}
              className={`px-3 py-1 rounded-full font-medium transition-all text-[11px] ${
                currentUser?.role === r
                  ? 'bg-white text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Logged in User Initials Badge */}
        {currentUser && (
          <div className="flex items-center gap-3 border-l border-stone-800 pl-4">
            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-950 font-extrabold text-xs flex items-center justify-center border border-white shadow-sm">
              {currentUser.initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser.name}
              </div>
              <span className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full border ${roleLabels[currentUser.role]?.color}`}>
                {roleLabels[currentUser.role]?.title}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                window.location.hash = '';
              }}
              title="Keluar dari Portal Admin"
              className="p-2 rounded-full text-stone-400 hover:text-rose-400 hover:bg-stone-900 transition-colors flex items-center gap-1 text-xs font-semibold"
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
