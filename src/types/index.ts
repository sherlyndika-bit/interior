export type UserRole = 'owner' | 'kasir' | 'gudang' | 'teknisi' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  initials: string; // e.g. "SD", "AW", "BS", "RH"
  permissions: string[]; // e.g. ['pos', 'inventory', 'reports', 'payroll', 'schedule', 'users']
}

export interface ProductVariant {
  id: string;
  name: string;
  colorHex?: string;
  dimensions?: string;
  additionalCost: number;
  additionalPrice: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: 'Kitchen Set' | 'Bedroom' | 'Living Room' | 'Office' | 'Wardrobe' | 'Wall Panel' | 'Custom Fitout';
  description: string;
  baseCost: number;
  basePrice: number;
  stock: number;
  minStock: number;
  unit: string;
  images: string[];
  variants: ProductVariant[];
  materialsRequired?: { materialId: string; quantity: number }[];
  isPreOrderAvailable: boolean;
  leadTimeDays: number;
  featuredInCatalog: boolean;
}

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  category: 'Papan Wood' | 'HPL & Veneer' | 'Hardware & Aksesoris' | 'Cat & Finishing' | 'Kaca & Cermin' | 'Busa & Kain';
  unit: string;
  stock: number;
  minStock: number;
  costPerUnit: number;
  supplier: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  date: string;
  itemType: 'product' | 'material';
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  notes: string;
  operator: string;
}

export type OrderType = 'Ready Stock' | 'Pre-Order / Custom';
export type OrderStage = 'Draft' | 'DP Paid' | 'In Production' | 'Quality Control' | 'Ready for Delivery' | 'Installed' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  customSpecs?: string;
  subtotal: number;
}

export interface MilestonePayment {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  status: 'Pending' | 'Paid';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'Transfer Bank' | 'Tunai' | 'QRIS' | 'Kartu Kredit';
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  type: OrderType;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalCost: number;
  subtotal: number;
  discountAmount: number;
  promoCode?: string;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  remainingBalance: number;
  stage: OrderStage;
  milestones: MilestonePayment[];
  targetCompletionDate?: string;
  installationAddress?: string;
  notes?: string;
  createdByName: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  notes: string;
  joinedDate: string;
}

export interface InstallationSchedule {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  scheduledDate: string;
  timeSlot: string;
  assignedTeam: string[];
  status: 'Scheduled' | 'In Transit' | 'In Progress' | 'Installed' | 'Rescheduled';
  notes: string;
  completionPhoto?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  role: string;
  baseSalary: number;
  allowance: number;
  commissionRate: number;
  phone: string;
  status: 'Active' | 'Inactive';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  period: string;
  baseSalary: number;
  allowance: number;
  commissionAmount: number;
  bonus: number;
  deductions: number;
  taxAmount: number;
  netSalary: number;
  status: 'Draft' | 'Approved' | 'Paid';
  paymentDate?: string;
}

export interface TaxSetting {
  enablePPN: boolean;
  ppnRate: number;
  enablePPh21: boolean;
  companyNPWP: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
}

export interface PromoVoucher {
  id: string;
  code: string;
  description: string;
  type: 'fixed' | 'percentage';
  value: number;
  minSpend: number;
  validUntil: string;
  isActive: boolean;
}

export interface QuotationItem {
  id: string;
  title: string;
  specification: string;
  dimensions: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  projectName: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  termsAndConditions: string[];
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Converted to Order';
}
