import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  BarChart3,
  FileText,
  DollarSign,
  ShieldCheck,
  Lock,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { hasPermission, currentUser } = useAuth();

  const navItems = [
    {
      id: 'catalog',
      label: 'Katalog Publik',
      desc: 'Portofolio Publik Studio',
      icon: Store,
      permission: 'catalog',
      badge: 'Publik'
    },
    {
      id: 'inventory',
      label: 'Stok & Bahan',
      desc: 'Katalog Produk & Material',
      icon: Package,
      permission: 'inventory'
    },
    {
      id: 'orders',
      label: 'Kasir & Pre-Order',
      desc: 'POS Fitout & Milestone DP',
      icon: ShoppingCart,
      permission: 'pos'
    },
    {
      id: 'customers',
      label: 'Database Pelanggan',
      desc: 'CRM & Riwayat Transaksi',
      icon: Users,
      permission: 'customers'
    },
    {
      id: 'schedule',
      label: 'Pengiriman & Instalasi',
      desc: 'Jadwal Pemasangan Lapangan',
      icon: Calendar,
      permission: 'schedule'
    },
    {
      id: 'reports',
      label: 'Laporan Penjualan',
      desc: 'Profit, Omzet & Analitik',
      icon: BarChart3,
      permission: 'reports'
    },
    {
      id: 'invoices',
      label: 'Invoice & Penawaran',
      desc: 'Surat Penawaran & Faktur',
      icon: FileText,
      permission: 'quotations'
    },
    {
      id: 'payroll',
      label: 'Gaji, Pajak & Promo',
      desc: 'Penggajian, PPN & Voucher',
      icon: DollarSign,
      permission: 'payroll'
    },
    {
      id: 'users',
      label: 'Manajemen Akses User',
      desc: 'Pengaturan Peran Staff',
      icon: ShieldCheck,
      permission: 'all'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] transition-colors">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Modul Utama Studio
        </div>

        {navItems.map((item) => {
          const allowed = hasPermission(item.permission);
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => allowed && onTabChange(item.id)}
              disabled={!allowed}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/20 dark:border-amber-500/30'
                  : allowed
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  : 'text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-snug truncate flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-400/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-normal">{item.desc}</div>
                </div>
              </div>

              {!allowed ? (
                <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              ) : isActive ? (
                <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Role banner at sidebar bottom */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Hak Akses:</span>
          <span className="text-amber-700 dark:text-amber-300 font-bold capitalize text-[11px]">{currentUser ? currentUser.role : 'Guest'}</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal font-normal">
          {currentUser
            ? `Diberikan hak ${currentUser.permissions.includes('all') ? 'akses penuh modul' : `${currentUser.permissions.length} modul terstruktur`}.`
            : 'Login untuk membuka portal manajemen.'}
        </p>
      </div>
    </aside>
  );
};
