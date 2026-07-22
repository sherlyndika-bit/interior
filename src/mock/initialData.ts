import {
  User,
  Product,
  RawMaterial,
  Customer,
  Order,
  InstallationSchedule,
  Employee,
  PayrollRecord,
  TaxSetting,
  PromoVoucher,
  Quotation
} from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-owner',
    name: 'Sherly Dika (Owner)',
    email: 'owner@interiorcraft.id',
    username: 'owner',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    permissions: ['all']
  },
  {
    id: 'usr-kasir',
    name: 'Andi Wijaya (Sales & POS)',
    email: 'sales@interiorcraft.id',
    username: 'kasir',
    role: 'kasir',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    permissions: ['pos', 'preorder', 'customers', 'quotations', 'catalog']
  },
  {
    id: 'usr-gudang',
    name: 'Bambang S. (Manajer Gudang)',
    email: 'gudang@interiorcraft.id',
    username: 'gudang',
    role: 'gudang',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    permissions: ['inventory', 'raw_materials', 'stock_movement']
  },
  {
    id: 'usr-teknisi',
    name: 'Rudi Hartono (Kepala Teknisi)',
    email: 'teknisi@interiorcraft.id',
    username: 'teknisi',
    role: 'teknisi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    permissions: ['schedule', 'installation_status']
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    code: 'KS-NORDIC-01',
    name: 'Kitchen Set Minimalis Scandinavian Wood',
    category: 'Kitchen Set',
    description: 'Kitchen set modular full multiplek 18mm dengan finishing HPL Motif Kayu Oak Warm & Solid White. Dilengkapi island table & engsel soft-close Hafele.',
    baseCost: 14500000,
    basePrice: 24500000,
    stock: 5,
    minStock: 2,
    unit: 'Unit Set',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80'
    ],
    variants: [
      {
        id: 'var-1a',
        name: 'Natural Oak + Quartz White Top',
        additionalCost: 0,
        additionalPrice: 0,
        sku: 'KS-NORDIC-OAK',
        stock: 3
      },
      {
        id: 'var-1b',
        name: 'Dark Walnut + Nero Marble Top',
        additionalCost: 2000000,
        additionalPrice: 3500000,
        sku: 'KS-NORDIC-WALNUT',
        stock: 2
      }
    ],
    isPreOrderAvailable: true,
    leadTimeDays: 14,
    featuredInCatalog: true
  },
  {
    id: 'prod-2',
    code: 'WB-LUXE-02',
    name: 'Wardrobe Walk-in Closet Tempered Glass',
    category: 'Wardrobe',
    description: 'Lemari pakaian custom 4 pintu kaca tempered bronze, frame aluminium matt black, LED sensor bar internal, dan lacian aksesoris perhiasan.',
    baseCost: 18000000,
    basePrice: 31000000,
    stock: 3,
    minStock: 1,
    unit: 'Unit Custom',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&auto=format&fit=crop&q=80'
    ],
    variants: [
      {
        id: 'var-2a',
        name: 'Frame Black Matte + Bronze Glass',
        additionalCost: 0,
        additionalPrice: 0,
        sku: 'WB-LUXE-BLK',
        stock: 2
      },
      {
        id: 'var-2b',
        name: 'Frame Gold Champagne + Clear Glass',
        additionalCost: 1500000,
        additionalPrice: 2800000,
        sku: 'WB-LUXE-GLD',
        stock: 1
      }
    ],
    isPreOrderAvailable: true,
    leadTimeDays: 21,
    featuredInCatalog: true
  },
  {
    id: 'prod-3',
    code: 'WP-FLUTED-03',
    name: 'Wall Panel Fluted Wood & Backdrop TV LED',
    category: 'Wall Panel',
    description: 'Panel dinding WPC fluted motif kayu walnut dipadu konsol TV gantung marbel sintetis & indirect LED light 3000K warm white.',
    baseCost: 6500000,
    basePrice: 11800000,
    stock: 8,
    minStock: 3,
    unit: 'Meter Lari',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=80'
    ],
    variants: [
      {
        id: 'var-3a',
        name: 'Warm Teak Fluted + Warm LED',
        additionalCost: 0,
        additionalPrice: 0,
        sku: 'WP-TEAK-3M',
        stock: 5
      },
      {
        id: 'var-3b',
        name: 'Charcoal Grey + RGB Smart Lighting',
        additionalCost: 800000,
        additionalPrice: 1400000,
        sku: 'WP-CHAR-3M',
        stock: 3
      }
    ],
    isPreOrderAvailable: true,
    leadTimeDays: 7,
    featuredInCatalog: true
  },
  {
    id: 'prod-4',
    code: 'BD-ZEN-04',
    name: 'Bed Frame Floating King Size & Headboard Upholstered',
    category: 'Bedroom',
    description: 'Rangka tempat tidur model melayang dengan headboard dilapisi kain velvet bouclé premium, nightstand terintegrasi wireless charger.',
    baseCost: 7800000,
    basePrice: 13500000,
    stock: 4,
    minStock: 2,
    unit: 'Set Bed',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&auto=format&fit=crop&q=80'
    ],
    variants: [
      {
        id: 'var-4a',
        name: 'King 180x200 - Velvet Cream',
        additionalCost: 0,
        additionalPrice: 0,
        sku: 'BD-ZEN-180',
        stock: 3
      },
      {
        id: 'var-4b',
        name: 'Super King 200x200 - Grey Bouclé',
        additionalCost: 1200000,
        additionalPrice: 2200000,
        sku: 'BD-ZEN-200',
        stock: 1
      }
    ],
    isPreOrderAvailable: true,
    leadTimeDays: 10,
    featuredInCatalog: true
  },
  {
    id: 'prod-5',
    code: 'OF-EXEC-05',
    name: 'Executive Office Desk & Ergonomic Cabinet Set',
    category: 'Office',
    description: 'Meja kerja direksi finishing veneer kayu Jati Jepara grade A, kabel management concealed, dan credenza kabinet berkunci angka.',
    baseCost: 9200000,
    basePrice: 16800000,
    stock: 2,
    minStock: 1,
    unit: 'Set Meja',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&auto=format&fit=crop&q=80'
    ],
    variants: [],
    isPreOrderAvailable: true,
    leadTimeDays: 12,
    featuredInCatalog: true
  }
];

export const initialRawMaterials: RawMaterial[] = [
  {
    id: 'mat-1',
    code: 'RAW-PLY-18',
    name: 'Multiplek Meranti 18mm Grade A (122x244)',
    category: 'Papan Wood',
    unit: 'lembar',
    stock: 145,
    minStock: 30,
    costPerUnit: 245000,
    supplier: 'PT Kayu Nusantara Perkasa',
    lastUpdated: '2026-07-20'
  },
  {
    id: 'mat-2',
    code: 'RAW-HPL-TAC',
    name: 'HPL Taco Warm Oak Gloss TH-802',
    category: 'HPL & Veneer',
    unit: 'lembar',
    stock: 82,
    minStock: 20,
    costPerUnit: 195000,
    supplier: 'CV Taco Laminates Jaya',
    lastUpdated: '2026-07-18'
  },
  {
    id: 'mat-3',
    code: 'RAW-HNG-HAF',
    name: 'Engsel Hafele Soft-close Stainless 304',
    category: 'Hardware & Aksesoris',
    unit: 'pcs',
    stock: 320,
    minStock: 50,
    costPerUnit: 35000,
    supplier: 'PT Hardware Utama',
    lastUpdated: '2026-07-15'
  },
  {
    id: 'mat-4',
    code: 'RAW-GLS-BRZ',
    name: 'Kaca Tempered Bronze 5mm + Bevel',
    category: 'Kaca & Cermin',
    unit: 'meter',
    stock: 25,
    minStock: 10,
    costPerUnit: 420000,
    supplier: 'Kaca Jaya Glassindo',
    lastUpdated: '2026-07-10'
  },
  {
    id: 'mat-5',
    code: 'RAW-LED-SLM',
    name: 'Strip LED COB Warm White 24V High CRI',
    category: 'Hardware & Aksesoris',
    unit: 'meter',
    stock: 150,
    minStock: 30,
    costPerUnit: 48000,
    supplier: 'Lighting Solution ID',
    lastUpdated: '2026-07-12'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    code: 'CUST-001',
    name: 'Dra. Ratna Sarumpaet',
    phone: '081298765432',
    email: 'ratna.design@gmail.com',
    address: 'Jl. Alam Sutera Utama No. 88, Serpong, Tangerang Selatan',
    city: 'Tangerang Selatan',
    totalOrders: 3,
    totalSpent: 67300000,
    notes: 'Klien menyukai gaya Japandi Scandinavian. Pembayaran selalu cepat via Bank BCA.',
    joinedDate: '2025-11-10'
  },
  {
    id: 'cust-2',
    code: 'CUST-002',
    name: 'Ir. Hendra Gunawan',
    phone: '081733445566',
    email: 'hendra.gunawan@techcorp.id',
    address: 'Kawasan Residensial Pakubuwono Signature Apt 12B, Jakarta Selatan',
    city: 'Jakarta Selatan',
    totalOrders: 1,
    totalSpent: 31000000,
    notes: 'Proyek Walk-in Closet Custom. Meminta jaminan garansi engsel 2 tahun.',
    joinedDate: '2026-02-14'
  },
  {
    id: 'cust-3',
    code: 'CUST-003',
    name: 'Clarissa Sutedja',
    phone: '085611223344',
    email: 'clarissa.studio@outlook.com',
    address: 'Jl. Dago Asri No. 15, Bandung',
    city: 'Bandung',
    totalOrders: 2,
    totalSpent: 42800000,
    notes: 'Fitout Cafe & Coffee Shop. Langganan pesanan custom fluted wall panel.',
    joinedDate: '2026-04-05'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-2026-0701',
    date: '2026-07-12',
    type: 'Pre-Order / Custom',
    customerId: 'cust-1',
    customerName: 'Dra. Ratna Sarumpaet',
    customerPhone: '081298765432',
    customerAddress: 'Jl. Alam Sutera Utama No. 88, Serpong',
    items: [
      {
        productId: 'prod-1',
        productName: 'Kitchen Set Minimalis Scandinavian Wood',
        variantId: 'var-1a',
        variantName: 'Natural Oak + Quartz White Top',
        quantity: 1,
        unitPrice: 24500000,
        costPrice: 14500000,
        customSpecs: 'Panjang 3.5 meter, sink undermount Blanco black granite.',
        subtotal: 24500000
      }
    ],
    totalCost: 14500000,
    subtotal: 24500000,
    discountAmount: 1000000,
    promoCode: 'PROMOJULI',
    taxAmount: 2585000,
    grandTotal: 26085000,
    paidAmount: 13042500,
    remainingBalance: 13042500,
    stage: 'In Production',
    milestones: [
      {
        id: 'ms-1',
        name: 'Down Payment (DP 50%)',
        amount: 13042500,
        percentage: 50,
        status: 'Paid',
        dueDate: '2026-07-12',
        paidDate: '2026-07-12',
        paymentMethod: 'Transfer Bank'
      },
      {
        id: 'ms-2',
        name: 'Pelunasan Sebelum Instalasi (50%)',
        amount: 13042500,
        percentage: 50,
        status: 'Pending',
        dueDate: '2026-07-26'
      }
    ],
    targetCompletionDate: '2026-07-28',
    installationAddress: 'Jl. Alam Sutera Utama No. 88, Serpong, Tangerang Selatan',
    notes: 'Sudah diukur ulang oleh tim survei. Bahan multiplek sudah masuk tahap pemotongan CNC.',
    createdByName: 'Andi Wijaya'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-2026-0702',
    date: '2026-07-18',
    type: 'Ready Stock',
    customerId: 'cust-3',
    customerName: 'Clarissa Sutedja',
    customerPhone: '085611223344',
    customerAddress: 'Jl. Dago Asri No. 15, Bandung',
    items: [
      {
        productId: 'prod-3',
        productName: 'Wall Panel Fluted Wood & Backdrop TV LED',
        variantId: 'var-3a',
        variantName: 'Warm Teak Fluted + Warm LED',
        quantity: 2,
        unitPrice: 11800000,
        costPrice: 6500000,
        subtotal: 23600000
      }
    ],
    totalCost: 13000000,
    subtotal: 23600000,
    discountAmount: 0,
    taxAmount: 2596000,
    grandTotal: 26196000,
    paidAmount: 26196000,
    remainingBalance: 0,
    stage: 'Installed',
    milestones: [
      {
        id: 'ms-3',
        name: 'Full Payment 100%',
        amount: 26196000,
        percentage: 100,
        status: 'Paid',
        dueDate: '2026-07-18',
        paidDate: '2026-07-18',
        paymentMethod: 'QRIS'
      }
    ],
    targetCompletionDate: '2026-07-21',
    installationAddress: 'Jl. Dago Asri No. 15, Bandung',
    notes: 'Terpasang sempurna di area lobby cafe. Klien memberi ulasan bintang 5.',
    createdByName: 'Andi Wijaya'
  }
];

export const initialSchedules: InstallationSchedule[] = [
  {
    id: 'sch-1',
    orderId: 'ord-101',
    orderNumber: 'ORD-2026-0701',
    customerName: 'Dra. Ratna Sarumpaet',
    phone: '081298765432',
    address: 'Jl. Alam Sutera Utama No. 88, Serpong',
    scheduledDate: '2026-07-26',
    timeSlot: '09:00 - 15:00 WIB',
    assignedTeam: ['Rudi Hartono (Lead)', 'Sujatno (Tukang)', 'Randi (Driver Delivery)'],
    status: 'Scheduled',
    notes: 'Bawa bor beton 12mm & silicone sealant transparan.'
  },
  {
    id: 'sch-2',
    orderId: 'ord-102',
    orderNumber: 'ORD-2026-0702',
    customerName: 'Clarissa Sutedja',
    phone: '085611223344',
    address: 'Jl. Dago Asri No. 15, Bandung',
    scheduledDate: '2026-07-21',
    timeSlot: '10:00 - 16:00 WIB',
    assignedTeam: ['Rudi Hartono (Lead)', 'Agus (Tukang Listrik LED)'],
    status: 'Installed',
    notes: 'Selesai tanpa kendala. BAST telah ditandatangani klien.',
    completionPhoto: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeCode: 'EMP-01',
    name: 'Rudi Hartono',
    role: 'Kepala Teknisi & Fitting',
    baseSalary: 5500000,
    allowance: 1200000,
    commissionRate: 2.5,
    phone: '081234567890',
    status: 'Active'
  },
  {
    id: 'emp-2',
    employeeCode: 'EMP-02',
    name: 'Ahmad Fauzi',
    role: 'Senior Interior 3D Draftsman',
    baseSalary: 6000000,
    allowance: 1000000,
    commissionRate: 1.5,
    phone: '081399887766',
    status: 'Active'
  },
  {
    id: 'emp-3',
    employeeCode: 'EMP-03',
    name: 'Sujatno',
    role: 'Tukang Kayu & Assembly',
    baseSalary: 4800000,
    allowance: 800000,
    commissionRate: 1.0,
    phone: '085712344321',
    status: 'Active'
  }
];

export const initialPayrolls: PayrollRecord[] = [
  {
    id: 'pay-2026-06-1',
    employeeId: 'emp-1',
    employeeName: 'Rudi Hartono',
    employeeRole: 'Kepala Teknisi & Fitting',
    period: '2026-06',
    baseSalary: 5500000,
    allowance: 1200000,
    commissionAmount: 1450000,
    bonus: 500000,
    deductions: 150000,
    taxAmount: 210000,
    netSalary: 8290000,
    status: 'Paid',
    paymentDate: '2026-06-28'
  }
];

export const initialTaxSetting: TaxSetting = {
  enablePPN: true,
  ppnRate: 11,
  enablePPh21: true,
  companyNPWP: '88.342.109.4-412.000',
  companyName: 'PT InteriorCraft Studio Indonesia',
  companyAddress: 'Kawasan Industri Kreatif No. 12, BSD City, Tangerang',
  companyPhone: '+62 21 5566-7788',
  companyEmail: 'info@interiorcraft.id'
};

export const initialPromos: PromoVoucher[] = [
  {
    id: 'prm-1',
    code: 'PROMOJULI',
    description: 'Diskon Spesial Rp 1.000.000 untuk Pemesanan Kitchen Set',
    type: 'fixed',
    value: 1000000,
    minSpend: 20000000,
    validUntil: '2026-08-31',
    isActive: true
  },
  {
    id: 'prm-2',
    code: 'NEWSTUDIO5',
    description: 'Potongan 5% Seluruh Produk Custom Interior',
    type: 'percentage',
    value: 5,
    minSpend: 10000000,
    validUntil: '2026-12-31',
    isActive: true
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: 'qte-501',
    quotationNumber: 'QUO-2026-0701',
    date: '2026-07-20',
    validUntil: '2026-08-04',
    customerName: 'Bpk. Dr. Adrian Setiadi',
    customerPhone: '081199881122',
    customerAddress: 'Cluster Emerald Residence No. 7, Bintaro Jaya',
    projectName: 'Pengadaan & Fitting Fitout Apt 3 Bedroom',
    items: [
      {
        id: 'qi-1',
        title: 'Master Bedroom Backdrop & Floating Bed',
        specification: 'Multiplex 18mm, HPL Taco Wood Grain, Padded Headboard Velvet, Indirect Strip LED 24V.',
        dimensions: 'P 300 x L 220 x T 260 cm',
        unit: 'Set',
        quantity: 1,
        unitPrice: 18500000,
        totalPrice: 18500000
      },
      {
        id: 'qi-2',
        title: 'Living Room TV Cabinet & Fluted Slats',
        specification: 'Backdrop multiplek 18mm, WPC fluted panel teak, konsol laci soft-close Hafele, top marbel sintetis.',
        dimensions: 'P 280 x L 45 x T 240 cm',
        unit: 'Set',
        quantity: 1,
        unitPrice: 14200000,
        totalPrice: 14200000
      }
    ],
    subtotal: 32700000,
    discount: 1000000,
    tax: 3487000,
    grandTotal: 35187000,
    termsAndConditions: [
      'Harga sudah termasuk biaya pengiriman & jasa instalasi area Jabodetabek.',
      'Sistem Pembayaran: Down Payment (DP) 50% saat penandatanganan SPK.',
      'Pelunasan 50% dilakukan H-1 sebelum pengiriman ke lokasi site.',
      'Waktu pengerjaan (Lead Time): 21 hari kerja sejak DP diterima.'
    ],
    status: 'Sent'
  }
];
