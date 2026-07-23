import React, { useState, useEffect } from 'react';
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
import { Lock } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [routeHash, setRouteHash] = useState<string>(() => window.location.hash || '#/');
  const [currentTab, setCurrentTab] = useState<string>('orders');
  const { hasPermission, currentUser } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setRouteHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isDemoRoute = routeHash.includes('demo');
  const isAdminRoute = routeHash.includes('admin') || isDemoRoute;

  // 1. PUBLIC STOREFRONT MODE (Default Route `/` or `/#/`):
  if (!isAdminRoute) {
    return (
      <>
        <PublicCatalogView />
        <Toast />
      </>
    );
  }

  // 2. DEMO PORTAL ROUTE (`/#/demo`):
  if (isDemoRoute && !currentUser) {
    return (
      <>
        <LoginView
          isDemoMode={true}
          onSuccessLogin={() => setCurrentTab('orders')}
        />
        <Toast />
      </>
    );
  }

  // 3. STRICT REAL ADMIN ROUTE (`/#/admin`):
  if (isAdminRoute && !currentUser) {
    return (
      <>
        <LoginView
          isDemoMode={false}
          onSuccessLogin={() => setCurrentTab('orders')}
        />
        <Toast />
      </>
    );
  }

  // 4. AUTHENTICATED ADMIN DASHBOARD: Render layout with Header & Sidebar
  const renderAdminContent = () => {
    const permissionMap: Record<string, string> = {
      inventory: 'inventory',
      orders: 'pos',
      customers: 'customers',
      schedule: 'schedule',
      reports: 'reports',
      invoices: 'quotations',
      payroll: 'payroll',
      users: 'all'
    };

    const requiredPerm = permissionMap[currentTab] || 'all';
    const allowed = hasPermission(requiredPerm);

    if (!allowed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-[#0A0908] border border-stone-900 rounded-3xl my-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Akses Modul Dibatasi</h2>
          <p className="text-xs text-stone-400 max-w-md leading-relaxed font-light">
            Peran Anda saat ini (<strong>{currentUser?.role || 'Guest'}</strong>) tidak memiliki izin untuk membuka modul ini.
          </p>
          <button
            onClick={() => setCurrentTab('orders')}
            className="px-6 py-2.5 bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-all"
          >
            Kembali ke Modul Utama
          </button>
        </div>
      );
    }

    switch (currentTab) {
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
        return <OrdersPosView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-100 flex flex-col font-sans">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-[1800px] mx-auto w-full">
          {renderAdminContent()}
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
