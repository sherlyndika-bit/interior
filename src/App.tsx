import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';

import { LoginView } from './views/LoginView';
import { PublicCatalogView } from './views/PublicCatalogView';
import { InventoryView } from './views/InventoryView';
import { OrdersPosView } from './views/OrdersPosView';
import { CustomersView } from './views/CustomersView';
import { ReportsView } from './views/ReportsView';
import { ScheduleView } from './views/ScheduleView';
import { PayrollTaxView } from './views/PayrollTaxView';
import { InvoiceQuotationView } from './views/InvoiceQuotationView';
import { UserManagementView } from './views/UserManagementView';
import { Lock, ShieldAlert } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const { hasPermission, currentUser } = useAuth();

  if (currentTab === 'login') {
    return (
      <LoginView
        onSuccessLogin={() => setCurrentTab('orders')}
        onGoToCatalog={() => setCurrentTab('catalog')}
      />
    );
  }

  const renderContent = () => {
    // Map permissions
    const permissionMap: Record<string, string> = {
      catalog: 'catalog',
      inventory: 'inventory',
      orders: 'pos',
      customers: 'customers',
      schedule: 'schedule',
      reports: 'reports',
      invoices: 'quotations',
      payroll: 'payroll',
      users: 'all'
    };

    const requiredPerm = permissionMap[currentTab] || 'catalog';
    const allowed = hasPermission(requiredPerm);

    if (!allowed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 glass-panel border border-slate-800 rounded-3xl my-8">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Akses Modul Dibatasi</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Peran Anda saat ini (<strong>{currentUser?.role || 'Guest'}</strong>) tidak memiliki izin untuk membuka modul ini. Silakan hubungi Owner / Super Admin atau switch akun di bar atas.
          </p>
          <button
            onClick={() => setCurrentTab('catalog')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            Kembali ke Katalog Publik
          </button>
        </div>
      );
    }

    switch (currentTab) {
      case 'catalog':
        return <PublicCatalogView />;
      case 'inventory':
        return <InventoryView />;
      case 'orders':
        return <OrdersPosView />;
      case 'customers':
        return <CustomersView />;
      case 'schedule':
        return <ScheduleView />;
      case 'reports':
        return <ReportsView />;
      case 'invoices':
        return <InvoiceQuotationView />;
      case 'payroll':
        return <PayrollTaxView />;
      case 'users':
        return <UserManagementView />;
      default:
        return <PublicCatalogView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
