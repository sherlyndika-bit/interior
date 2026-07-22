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
  ChevronRight,
  Sparkles
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
      desc: 'Cek Katalog dari Rumah (No Price)',
      icon: Store,
      permission: 'catalog',
      badge: 'Publik'
    },
    {
      id: 'inventory',
      label: 'Stok & Bahan',
      desc: 'Varian Barang & Raw Materials',
      icon: Package,
      permission: 'inventory'
    },
    {
      id: 'orders',
      label: 'Kasir & Pre-Order',
      desc: 'POS Ready & Custom Milestone DP',
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
      desc: 'Jadwal Teknisi & Kanban Site',
      icon: Calendar,
      permission: 'schedule'
    },
    {
      id: 'reports',
      label: 'Laporan Penjualan',
      desc: 'Profit, Omzet & Modal Bahan',
      icon: BarChart3,
      permission: 'reports'
    },
    {
      id: 'invoices',
      label: 'Invoice & Penawaran',
      desc: 'Generate PDF Surat Penawaran',
      icon: FileText,
      permission: 'quotations'
    },
    {
      id: 'payroll',
      label: 'Gaji, Pajak & Promo',
      desc: 'Penggajian, PPN 11% & Vouchers',
      icon: DollarSign,
      permission: 'payroll'
    },
    {
      id: 'users',
      label: 'Manajemen Akses User',
      desc: 'Pengaturan Staff & Hak Akses',
      icon: ShieldCheck,
      permission: 'all'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Utama Modul
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
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 font-bold shadow-md shadow-amber-500/5'
                  : allowed
                  ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  : 'text-slate-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800/80 text-slate-400 group-hover:text-amber-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-snug truncate flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                </div>
              </div>

              {!allowed ? (
                <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              ) : isActive ? (
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Role banner at sidebar bottom */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400 font-medium">Status Akses:</span>
          <span className="text-amber-400 font-bold capitalize">{currentUser ? currentUser.role : 'Guest'}</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-normal">
          {currentUser
            ? `Berhak mengakses ${currentUser.permissions.includes('all') ? 'seluruh modul' : `${currentUser.permissions.length} modul terstruktur`}.`
            : 'Melihat Katalog Publik tanpa harga. Login untuk akses sistem.'}
        </p>
      </div>
    </aside>
  );
};
