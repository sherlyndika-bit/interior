import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { LogOut, Bell, Globe, Sun, Moon } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const { currentUser, loginAsRole, logout } = useAuth();
  const { products, rawMaterials } = useApp();
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length +
                        rawMaterials.filter(m => m.stock <= m.minStock).length;

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    owner: { title: 'Owner / Super Admin', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30' },
    kasir: { title: 'Kasir & Sales POS', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30' },
    gudang: { title: 'Manajer Gudang', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30' },
    teknisi: { title: 'Teknisi & Logistik', color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30' },
    guest: { title: 'Tamu / Pelanggan', color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between transition-colors">
      {/* Left branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = ''}>
          <span className="font-bold text-slate-900 dark:text-white text-lg tracking-wider uppercase">
            INTERIORCRAFT <span className="font-light text-slate-500 dark:text-slate-400 text-xs tracking-normal">STUDIO</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-400/10 dark:border-amber-400/30 dark:text-amber-300 uppercase tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Shortcut to view Public Website */}
        <button
          onClick={() => window.location.hash = ''}
          className="ml-4 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
          title="Buka Website Katalog Publik Klien"
        >
          <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Website Publik</span>
        </button>
      </div>

      {/* Right section: Theme Toggle, Low Stock & User Badge */}
      <div className="flex items-center gap-3">
        {/* Dark / Light System Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {lowStockCount > 0 && (
          <button
            onClick={() => onTabChange('inventory')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs hover:bg-rose-100 transition-all"
            title="Ada stok menipis"
          >
            <Bell className="w-3.5 h-3.5 animate-pulse text-rose-600 dark:text-rose-400" />
            <span className="font-semibold">{lowStockCount} Alert Stok</span>
          </button>
        )}

        {/* Quick Role Simulation Selector */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <span className="px-2 text-[10px] text-slate-500 font-semibold uppercase">Simulasi Peran:</span>
          {(['owner', 'kasir', 'gudang', 'teknisi'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => loginAsRole(r)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all text-[11px] ${
                currentUser?.role === r
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Logged in User Initials Badge */}
        {currentUser && (
          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-extrabold text-xs flex items-center justify-center shadow-sm">
              {currentUser.initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </div>
              <span className={`inline-block px-1.5 py-0.2 text-[9px] font-medium rounded border ${roleLabels[currentUser.role]?.color}`}>
                {roleLabels[currentUser.role]?.title}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                window.location.hash = '';
              }}
              title="Keluar dari Portal Admin"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
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
