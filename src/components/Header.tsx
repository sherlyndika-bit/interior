import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sun, Moon, LogOut, Store } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  const { currentUser, loginAsRole, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app-theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app-theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between sticky top-0 z-40 transition-colors select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold flex items-center justify-center text-sm shadow-xs">
            IC
          </div>
          <div>
            <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-base">INTERIORCRAFT</span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider ml-1.5 uppercase font-medium">STUDIO ADMIN</span>
          </div>
        </div>
      </div>

      {/* Action Controls & User Switcher */}
      <div className="flex items-center gap-3">
        {/* Open Public Storefront Button */}
        <button
          onClick={() => onTabChange('catalog')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white active:scale-[0.98]"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Katalog Publik</span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white active:scale-[0.98]"
          title="Toggle Light / Dark Mode"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-zinc-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Role Simulator Switcher */}
        <div className="hidden md:flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase px-2">PERAN:</span>
          {(['owner', 'kasir', 'gudang', 'teknisi'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => loginAsRole(r)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                currentUser?.role === r
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Current User Profile & Logout */}
        {currentUser && (
          <div className="flex items-center gap-3 pl-3 border-l border-zinc-200 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser.initials}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono capitalize leading-tight">{currentUser.role}</p>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
