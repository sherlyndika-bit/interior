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
    <aside className="w-64 border-r border-stone-900 bg-[#070605] flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
          MODUL MANAJEMEN STUDIO
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all group ${
                isActive
                  ? 'bg-stone-900 text-white font-bold border border-stone-700 shadow-lg'
                  : allowed
                  ? 'text-stone-400 hover:bg-stone-950 hover:text-white'
                  : 'text-stone-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-amber-300 text-stone-950' : 'bg-stone-900 text-stone-400 group-hover:text-amber-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-snug truncate flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold bg-amber-400/10 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-400/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate font-light">{item.desc}</div>
                </div>
              </div>

              {!allowed ? (
                <Lock className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              ) : isActive ? (
                <ChevronRight className="w-4 h-4 text-amber-300 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Role banner at sidebar bottom */}
      <div className="p-4 bg-[#0A0908] border border-stone-900 rounded-2xl space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-400 font-medium">Peran Akses:</span>
          <span className="text-amber-300 font-bold capitalize font-mono text-[11px]">{currentUser ? currentUser.role : 'Guest'}</span>
        </div>
        <p className="text-[10px] text-stone-500 leading-normal font-light">
          {currentUser
            ? `Akses ${currentUser.permissions.includes('all') ? 'penuh seluruh modul' : `${currentUser.permissions.length} modul terstruktur`}.`
            : 'Login untuk membuka portal manajemen.'}
        </p>
      </div>
    </aside>
  );
};
