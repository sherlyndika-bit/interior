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
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Sync state with HTML element
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app-theme', 'light');
    }
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length +
                        rawMaterials.filter(m => m.stock <= m.minStock).length;

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    owner: { title: 'Owner / Super Admin', color: 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700' },
    kasir: { title: 'Kasir & Sales POS', color: 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700' },
    gudang: { title: 'Manajer Gudang', color: 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700' },
    teknisi: { title: 'Teknisi & Logistik', color: 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700' },
    guest: { title: 'Tamu / Pelanggan', color: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700' }
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between transition-colors">
      {/* Left branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = ''}>
          <span className="font-bold text-zinc-900 dark:text-white text-base tracking-tight">
            INTERIORCRAFT <span className="font-normal text-zinc-500 dark:text-zinc-400 text-xs">STUDIO</span>
          </span>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Shortcut to view Public Website */}
        <button
          onClick={() => window.location.hash = ''}
          className="ml-4 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-all border border-zinc-200 dark:border-zinc-700"
          title="Buka Website Katalog Publik Klien"
        >
          <Globe className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
          <span>Website Publik</span>
        </button>
      </div>

      {/* Right section: Theme Toggle, Low Stock & User Badge */}
      <div className="flex items-center gap-3">
        {/* Dark / Light System Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-zinc-700" />
              <span className="hidden sm:inline text-xs">Dark Mode</span>
            </>
          )}
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
        <div className="hidden lg:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          <span className="px-2 text-[10px] text-zinc-500 font-medium uppercase">Simulasi Peran:</span>
          {(['owner', 'kasir', 'gudang', 'teknisi'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => loginAsRole(r)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all text-[11px] ${
                currentUser?.role === r
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Logged in User Initials Badge */}
        {currentUser && (
          <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs flex items-center justify-center shadow-sm">
              {currentUser.initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
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
              className="p-2 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-xs font-medium"
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
