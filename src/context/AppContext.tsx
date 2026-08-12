import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  RawMaterial,
  Customer,
  Order,
  InstallationSchedule,
  Employee,
  PayrollRecord,
  TaxSetting,
  PromoVoucher,
  Quotation,
  EmployeeAttendance,
  WorkSchedule
} from '../types';
import {
  initialProducts,
  initialRawMaterials,
  initialCustomers,
  initialOrders,
  initialSchedules,
  initialEmployees,
  initialPayrolls,
  initialTaxSetting,
  initialPromos,
  initialQuotations,
  initialAttendances,
  initialWorkSchedules
} from '../mock/initialData';

interface AppContextType {
  products: Product[];
  rawMaterials: RawMaterial[];
  customers: Customer[];
  orders: Order[];
  schedules: InstallationSchedule[];
  employees: Employee[];
  payrolls: PayrollRecord[];
  taxSetting: TaxSetting;
  promos: PromoVoucher[];
  quotations: Quotation[];
  attendances: EmployeeAttendance[];
  workSchedules: WorkSchedule[];

  // CRUD actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  addRawMaterial: (material: RawMaterial) => void;
  updateRawMaterial: (material: RawMaterial) => void;
  deleteRawMaterial: (id: string) => void;

  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;

  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, stage: Order['stage']) => void;
  addPaymentMilestone: (orderId: string, paymentMethod: string, amount: number) => void;
  deleteOrder: (id: string) => void;

  addSchedule: (schedule: InstallationSchedule) => void;
  updateScheduleStatus: (id: string, status: InstallationSchedule['status'], notes?: string, photo?: string) => void;

  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  generatePayroll: (employeeId: string, period: string, bonus: number, manualDeductions: number) => void;
  markPayrollPaid: (payrollId: string) => void;

  addAttendance: (attendance: EmployeeAttendance) => void;
  updateAttendance: (attendance: EmployeeAttendance) => void;
  addWorkSchedule: (schedule: WorkSchedule) => void;
  updateWorkSchedule: (schedule: WorkSchedule) => void;

  updateTaxSetting: (setting: TaxSetting) => void;

  addPromo: (promo: PromoVoucher) => void;
  togglePromo: (id: string) => void;
  deletePromo: (id: string) => void;

  addQuotation: (quotation: Quotation) => void;
  convertQuotationToOrder: (quotationId: string) => void;
  deleteQuotation: (id: string) => void;

  // Global Toast state
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('interior_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    const saved = localStorage.getItem('interior_materials');
    return saved ? JSON.parse(saved) : initialRawMaterials;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('interior_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('interior_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [schedules, setSchedules] = useState<InstallationSchedule[]>(() => {
    const saved = localStorage.getItem('interior_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('interior_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('interior_payrolls');
    return saved ? JSON.parse(saved) : initialPayrolls;
  });

  const [taxSetting, setTaxSetting] = useState<TaxSetting>(() => {
    const saved = localStorage.getItem('interior_tax');
    return saved ? JSON.parse(saved) : initialTaxSetting;
  });

  const [promos, setPromos] = useState<PromoVoucher[]>(() => {
    const saved = localStorage.getItem('interior_promos');
    return saved ? JSON.parse(saved) : initialPromos;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('interior_quotations');
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const [attendances, setAttendances] = useState<EmployeeAttendance[]>(() => {
    const saved = localStorage.getItem('interior_attendances');
    return saved ? JSON.parse(saved) : initialAttendances;
  });

  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>(() => {
    const saved = localStorage.getItem('interior_work_schedules');
    return saved ? JSON.parse(saved) : initialWorkSchedules;
  });

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('interior_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('interior_materials', JSON.stringify(rawMaterials)); }, [rawMaterials]);
  useEffect(() => { localStorage.setItem('interior_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('interior_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('interior_schedules', JSON.stringify(schedules)); }, [schedules]);
  useEffect(() => { localStorage.setItem('interior_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('interior_payrolls', JSON.stringify(payrolls)); }, [payrolls]);
  useEffect(() => { localStorage.setItem('interior_tax', JSON.stringify(taxSetting)); }, [taxSetting]);
  useEffect(() => { localStorage.setItem('interior_promos', JSON.stringify(promos)); }, [promos]);
  useEffect(() => { localStorage.setItem('interior_quotations', JSON.stringify(quotations)); }, [quotations]);
  useEffect(() => { localStorage.setItem('interior_attendances', JSON.stringify(attendances)); }, [attendances]);
  useEffect(() => { localStorage.setItem('interior_work_schedules', JSON.stringify(workSchedules)); }, [workSchedules]);

  // Product Actions
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    showToast(`Produk ${product.name} berhasil ditambahkan!`);
  };
  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    showToast(`Produk ${product.name} diperbarui.`);
  };
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Produk berhasil dihapus.', 'info');
  };

  // Material Actions
  const addRawMaterial = (material: RawMaterial) => {
    setRawMaterials(prev => [material, ...prev]);
    showToast(`Bahan ${material.name} ditambahkan.`);
  };
  const updateRawMaterial = (material: RawMaterial) => {
    setRawMaterials(prev => prev.map(m => m.id === material.id ? material : m));
    showToast(`Bahan ${material.name} diperbarui.`);
  };
  const deleteRawMaterial = (id: string) => {
    setRawMaterials(prev => prev.filter(m => m.id !== id));
    showToast('Bahan berhasil dihapus.', 'info');
  };

  // Customer Actions
  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [customer, ...prev]);
    showToast(`Pelanggan ${customer.name} berhasil ditambahkan!`);
  };
  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    showToast(`Data pelanggan ${customer.name} diperbarui.`);
  };
  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    showToast('Data pelanggan dihapus.', 'info');
  };

  // Order Actions
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Deduct ready stock if applicable
    order.items.forEach(item => {
      setProducts(prevProds => prevProds.map(p => {
        if (p.id === item.productId) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      }));
    });

    // Auto add to schedule if target completion date exists
    if (order.targetCompletionDate) {
      const newSch: InstallationSchedule = {
        id: `sch-${Date.now()}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        phone: order.customerPhone,
        address: order.installationAddress || order.customerAddress,
        scheduledDate: order.targetCompletionDate,
        timeSlot: '09:00 - 15:00 WIB',
        assignedTeam: ['Tim Instalatir Utama'],
        status: 'Scheduled',
        notes: `Instalasi Pesanan ${order.orderNumber}`
      };
      setSchedules(prev => [newSch, ...prev]);
    }

    // Auto create or update Customer in database
    setCustomers(prev => {
      const found = prev.find(c => c.id === order.customerId || c.phone === order.customerPhone || c.name.toLowerCase() === order.customerName.toLowerCase());
      if (found) {
        return prev.map(c => c.id === found.id ? {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + order.grandTotal
        } : c);
      } else {
        const newCust: Customer = {
          id: order.customerId || `cust-${Date.now()}`,
          code: `KLIEN-2026-${Date.now().toString().slice(-4)}`,
          name: order.customerName,
          phone: order.customerPhone || '08123456789',
          email: `${order.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          address: order.customerAddress || 'Alamat Klien',
          city: 'Jakarta',
          totalOrders: 1,
          totalSpent: order.grandTotal,
          notes: 'Dibuat otomatis dari Pesanan Baru POS',
          joinedDate: new Date().toISOString().split('T')[0]
        };
        return [newCust, ...prev];
      }
    });

    showToast(`Pesanan ${order.orderNumber} berhasil dibuat!`);
  };

  const updateOrderStatus = (orderId: string, stage: Order['stage']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage } : o));
    showToast(`Status pesanan diperbarui ke ${stage}.`);
  };

  const addPaymentMilestone = (orderId: string, paymentMethod: string, amount: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newPaid = o.paidAmount + amount;
        const newRemaining = Math.max(0, o.grandTotal - newPaid);
        const updatedMilestones = o.milestones.map(m => {
          if (m.status === 'Pending') {
            return {
              ...m,
              status: 'Paid' as const,
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod: paymentMethod as any
            };
          }
          return m;
        });
        return {
          ...o,
          paidAmount: newPaid,
          remainingBalance: newRemaining,
          milestones: updatedMilestones,
          stage: newRemaining === 0 ? 'Completed' : o.stage
        };
      }
      return o;
    }));
    showToast(`Pembayaran Rp ${amount.toLocaleString('id-ID')} berhasil dicatat!`);
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast('Pesanan berhasil dibatalkan/dihapus.', 'info');
  };

  // Schedule Actions
  const addSchedule = (schedule: InstallationSchedule) => {
    setSchedules(prev => [schedule, ...prev]);
    showToast('Jadwal instalasi berhasil dibuat.');
  };

  const updateScheduleStatus = (id: string, status: InstallationSchedule['status'], notes?: string, photo?: string) => {
    setSchedules(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status,
          notes: notes !== undefined ? notes : s.notes,
          completionPhoto: photo || s.completionPhoto
        };
      }
      return s;
    }));
    showToast(`Status jadwal diperbarui ke "${status}".`);
  };

  // Employee & Payroll
  const addEmployee = (employee: Employee) => {
    setEmployees(prev => [employee, ...prev]);
    showToast(`Karyawan ${employee.name} ditambahkan.`);
  };

  const updateEmployee = (employee: Employee) => {
    setEmployees(prev => prev.map(e => e.id === employee.id ? employee : e));
    showToast(`Data ${employee.name} diperbarui.`);
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast('Data karyawan dihapus.', 'info');
  };

  const generatePayroll = (employeeId: string, period: string, bonus: number, manualDeductions: number) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    // Calculate commission based on installed projects in period
    const installedProjectsCount = orders.filter(o => o.stage === 'Installed' || o.stage === 'Completed').length;
    const commission = (emp.commissionRate / 100) * 15000000 * installedProjectsCount; // approx estimate per project

    // Calculate auto deductions based on HR Attendance policy
    // Filter attendances for this period
    const empAttendances = attendances.filter(a => a.employeeId === employeeId && a.date.startsWith(period));
    const lateDaysCount = empAttendances.filter(a => a.isLate).length;
    const absentDaysCount = empAttendances.filter(a => a.status === 'Alpa').length;

    const autoLatePenalty = lateDaysCount * taxSetting.latePenaltyFee;
    const autoAbsencePenalty = absentDaysCount * taxSetting.absencePenaltyFee;
    const totalDeductions = manualDeductions + autoLatePenalty + autoAbsencePenalty;

    const gross = emp.baseSalary + emp.allowance + commission + bonus;
    const pph21 = taxSetting.enablePPh21 ? gross * 0.05 : 0;
    const net = gross - totalDeductions - pph21;

    const newRecord: PayrollRecord = {
      id: `pay-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeRole: emp.role,
      period,
      baseSalary: emp.baseSalary,
      allowance: emp.allowance,
      commissionAmount: commission,
      bonus,
      deductions: totalDeductions,
      taxAmount: pph21,
      netSalary: Math.max(0, net),
      status: 'Draft'
    };

    setPayrolls(prev => [newRecord, ...prev]);
    showToast(`Slip gaji ${emp.name} periode ${period} berhasil dibuat! (Potongan absen/telat otomatis dihitung)`);
  };

  const markPayrollPaid = (payrollId: string) => {
    setPayrolls(prev => prev.map(p => p.id === payrollId ? {
      ...p,
      status: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0]
    } : p));
    showToast('Status penggajian diubah ke LUNAS.');
  };

  // HR Actions
  const addAttendance = (attendance: EmployeeAttendance) => {
    setAttendances(prev => [attendance, ...prev]);
    showToast('Data absensi dicatat.');
  };
  
  const updateAttendance = (attendance: EmployeeAttendance) => {
    setAttendances(prev => prev.map(a => a.id === attendance.id ? attendance : a));
    showToast('Data absensi diperbarui.');
  };

  const addWorkSchedule = (schedule: WorkSchedule) => {
    setWorkSchedules(prev => [schedule, ...prev]);
    showToast('Jadwal kerja berhasil dibuat.');
  };

  const updateWorkSchedule = (schedule: WorkSchedule) => {
    setWorkSchedules(prev => prev.map(s => s.id === schedule.id ? schedule : s));
    showToast('Jadwal kerja diperbarui.');
  };

  // Tax Setting
  const updateTaxSetting = (setting: TaxSetting) => {
    setTaxSetting(setting);
    showToast('Pengaturan pajak & profil perusahaan berhasil disimpan.');
  };

  // Promo Vouchers
  const addPromo = (promo: PromoVoucher) => {
    setPromos(prev => [promo, ...prev]);
    showToast(`Voucher ${promo.code} berhasil ditambahkan!`);
  };

  const togglePromo = (id: string) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    showToast('Status voucher diperbarui.');
  };

  const deletePromo = (id: string) => {
    setPromos(prev => prev.filter(p => p.id !== id));
    showToast('Voucher diskon dihapus.', 'info');
  };

  // Quotation
  const addQuotation = (quotation: Quotation) => {
    setQuotations(prev => [quotation, ...prev]);
    showToast(`Surat Penawaran ${quotation.quotationNumber} berhasil dibuat!`);
  };

  const convertQuotationToOrder = (quotationId: string) => {
    const q = quotations.find(item => item.id === quotationId);
    if (!q) return;

    // Check if customer already exists or create new customer
    const existingCust = customers.find(c => c.phone === q.customerPhone || c.name.toLowerCase() === q.customerName.toLowerCase());
    const custId = existingCust ? existingCust.id : `cust-${Date.now()}`;

    if (!existingCust) {
      const newCust: Customer = {
        id: custId,
        code: `KLIEN-2026-${Date.now().toString().slice(-4)}`,
        name: q.customerName,
        phone: q.customerPhone || '08123456789',
        email: `${q.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address: q.customerAddress || 'Lokasi Site Proyek',
        city: 'Jakarta',
        totalOrders: 1,
        totalSpent: q.grandTotal,
        notes: `Klien dari konversi SPH ${q.quotationNumber}`,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setCustomers(prev => [newCust, ...prev]);
    } else {
      setCustomers(prev => prev.map(c => c.id === existingCust.id ? {
        ...c,
        totalOrders: c.totalOrders + 1,
        totalSpent: c.totalSpent + q.grandTotal
      } : c));
    }

    // Create new order from quotation
    const newOrder: Order = {
      id: `ord-q-${Date.now()}`,
      orderNumber: `ORD-${q.quotationNumber.replace('QUO-', '')}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Pre-Order / Custom',
      customerId: custId,
      customerName: q.customerName,
      customerPhone: q.customerPhone,
      customerAddress: q.customerAddress,
      items: q.items.map(i => ({
        productId: 'prod-custom',
        productName: i.title,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        costPrice: i.unitPrice * 0.6,
        customSpecs: i.specification,
        subtotal: i.totalPrice
      })),
      totalCost: q.subtotal * 0.6,
      subtotal: q.subtotal,
      discountAmount: q.discount,
      taxAmount: q.tax,
      grandTotal: q.grandTotal,
      paidAmount: q.grandTotal * 0.5, // 50% DP
      remainingBalance: q.grandTotal * 0.5,
      stage: 'DP Paid',
      milestones: [
        {
          id: `ms-q1`,
          name: 'Down Payment 50%',
          amount: q.grandTotal * 0.5,
          percentage: 50,
          status: 'Paid',
          dueDate: new Date().toISOString().split('T')[0],
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Transfer Bank'
        },
        {
          id: `ms-q2`,
          name: 'Pelunasan Sebelum Kirim (50%)',
          amount: q.grandTotal * 0.5,
          percentage: 50,
          status: 'Pending',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ],
      targetCompletionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Dikonversi dari Penawaran ${q.quotationNumber}`,
      createdByName: 'Sistem Konversi'
    };

    // Auto create schedule for converted order
    const newSch: InstallationSchedule = {
      id: `sch-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      phone: newOrder.customerPhone,
      address: newOrder.customerAddress,
      scheduledDate: newOrder.targetCompletionDate!,
      timeSlot: '09:00 - 15:00 WIB',
      assignedTeam: ['Tim Instalatir Utama'],
      status: 'Scheduled',
      notes: `Instalasi Proyek Konversi ${q.quotationNumber}`
    };

    setOrders(prev => [newOrder, ...prev]);
    setSchedules(prev => [newSch, ...prev]);
    setQuotations(prev => prev.map(item => item.id === quotationId ? { ...item, status: 'Converted to Order' } : item));
    showToast(`Penawaran ${q.quotationNumber} berhasil dikonversi ke Pesanan & Jadwal Instalasi Baru!`);
  };

  const deleteQuotation = (id: string) => {
    setQuotations(prev => prev.filter(q => q.id !== id));
    showToast('Surat Penawaran dihapus.', 'info');
  };

  return (
    <AppContext.Provider value={{
      products,
      rawMaterials,
      customers,
      orders,
      schedules,
      employees,
      payrolls,
      taxSetting,
      promos,
      quotations,
      attendances,
      workSchedules,
      addProduct,
      updateProduct,
      deleteProduct,
      addRawMaterial,
      updateRawMaterial,
      deleteRawMaterial,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addOrder,
      updateOrderStatus,
      addPaymentMilestone,
      deleteOrder,
      addSchedule,
      updateScheduleStatus,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      generatePayroll,
      markPayrollPaid,
      updateTaxSetting,
      addPromo,
      togglePromo,
      deletePromo,
      addQuotation,
      convertQuotationToOrder,
      deleteQuotation,
      addAttendance,
      updateAttendance,
      addWorkSchedule,
      updateWorkSchedule,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
