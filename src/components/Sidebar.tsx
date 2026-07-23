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
  Lock
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { hasPermission, currentUser } = useAuth();

  const sections = [
    {
      title: 'OPERASIONAL & SALES',
      items: [
        {
          id: 'orders',
          label: 'Kasir & Pre-Order',
          desc: 'POS Fitout & Milestone DP',
          icon: ShoppingCart,
          permission: 'pos'
        },
        {
          id: 'inventory',
          label: 'Stok & Bahan',
          desc: 'Katalog Produk & Material',
          icon: Package,
          permission: 'inventory'
        },
        {
          id: 'customers',
          label: 'Database Klien',
          desc: 'CRM & Riwayat Proyek',
          icon: Users,
          permission: 'customers'
        },
        {
          id: 'schedule',
          label: 'Jadwal Pemasangan',
          desc: 'Instalasi & Delivery Site',
          icon: Calendar,
          permission: 'schedule'
        }
      ]
    },
    {
      title: 'KEUANGAN & DOKUMEN',
      items: [
        {
          id: 'invoices',
          label: 'Surat Penawaran & Invoice',
          desc: 'SPH Proposal & Faktur Tagihan',
          icon: FileText,
          permission: 'quotations'
        },
        {
          id: 'payroll',
          label: 'Gaji, Pajak & Promo',
          desc: 'Payroll Staff & Kupon',
          icon: DollarSign,
          permission: 'payroll'
        },
        {
          id: 'reports',
          label: 'Laporan Penjualan',
          desc: 'Profit, Omzet & Analitik',
          icon: BarChart3,
          permission: 'reports'
        }
      ]
    },
    {
      title: 'PENGATURAN',
      items: [
        {
          id: 'users',
          label: 'Manajemen Akses User',
          desc: 'Pengaturan Peran Staff (RBAC)',
          icon: ShieldCheck,
          permission: 'all'
        },
        {
          id: 'catalog',
          label: 'Buka Katalog Publik',
          desc: 'Lihat Storefront Klien',
          icon: Store,
          permission: 'catalog',
          badge: 'Publik'
        }
      ]
    }
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 self-start shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 transition-colors select-none">
      <div className="space-y-4 overflow-y-auto flex-1 pr-1">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const allowed = hasPermission(item.permission);
              const isActive = currentTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => allowed && onTabChange(item.id)}
                  disabled={!allowed}
                  className={`w-full flex items-center justify-between px-3.5 h-11 rounded-xl text-left transition-all group active:scale-[0.98] ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs'
                      : allowed
                      ? 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white'
                      : 'text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold leading-tight truncate flex items-center gap-1.5">
                        {item.label}
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            isActive
                              ? 'bg-white/20 text-white dark:bg-zinc-900 dark:text-white border-transparent'
                              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] truncate font-normal ${
                        isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
                      }`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {!allowed && (
                    <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role banner at sidebar bottom - Always fixed at bottom */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0 mt-2">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Hak Akses:</span>
            <span className="text-zinc-900 dark:text-white font-bold capitalize text-[11px]">{currentUser ? currentUser.role : 'Guest'}</span>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal font-normal">
            {currentUser
              ? `Diberikan hak ${currentUser.permissions.includes('all') ? 'akses penuh modul' : `${currentUser.permissions.length} modul terstruktur`}.`
              : 'Login untuk membuka portal.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
