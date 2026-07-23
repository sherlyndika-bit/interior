import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, RawMaterial } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    products,
    rawMaterials,
    addProduct,
    updateProduct,
    deleteProduct,
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'materials'>('products');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);

  // New Product Form State
  const [prodCode, setProdCode] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Product['category']>('Kitchen Set');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCost, setProdCost] = useState<number>(10000000);
  const [prodPrice, setProdPrice] = useState<number>(18000000);
  const [prodStock, setProdStock] = useState<number>(5);
  const [prodMinStock, setProdMinStock] = useState<number>(2);
  const [prodUnit, setProdUnit] = useState<string>('Unit');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80');

  // New Raw Material Form State
  const [matCode, setMatCode] = useState('');
  const [matName, setMatName] = useState('');
  const [matCategory, setMatCategory] = useState<RawMaterial['category']>('Papan Wood');
  const [matUnit, setMatUnit] = useState('lembar');
  const [matStock, setMatStock] = useState<number>(50);
  const [matMinStock, setMatMinStock] = useState<number>(15);
  const [matCost, setMatCost] = useState<number>(200000);
  const [matSupplier, setMatSupplier] = useState('');

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdCode(`PRD-${Date.now().toString().slice(-4)}`);
    setProdName('');
    setProdCategory('Kitchen Set');
    setProdDesc('');
    setProdCost(10000000);
    setProdPrice(18000000);
    setProdStock(5);
    setProdMinStock(2);
    setProdUnit('Unit');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdCode(p.code);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdDesc(p.description);
    setProdCost(p.baseCost);
    setProdPrice(p.basePrice);
    setProdStock(p.stock);
    setProdMinStock(p.minStock);
    setProdUnit(p.unit || 'Unit');
    setProdImage(p.images[0] || '');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodCode) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        code: prodCode,
        name: prodName,
        category: prodCategory,
        description: prodDesc,
        baseCost: prodCost,
        basePrice: prodPrice,
        stock: prodStock,
        minStock: prodMinStock,
        unit: prodUnit,
        images: [prodImage]
      });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        code: prodCode,
        name: prodName,
        category: prodCategory,
        description: prodDesc,
        baseCost: prodCost,
        basePrice: prodPrice,
        stock: prodStock,
        minStock: prodMinStock,
        unit: prodUnit,
        images: [prodImage],
        variants: [],
        isPreOrderAvailable: true,
        leadTimeDays: 14,
        featuredInCatalog: true
      });
    }
    setIsProductModalOpen(false);
  };

  const handleOpenNewMaterial = () => {
    setEditingMaterial(null);
    setMatCode(`MAT-${Date.now().toString().slice(-4)}`);
    setMatName('');
    setMatCategory('Papan Wood');
    setMatUnit('lembar');
    setMatStock(50);
    setMatMinStock(15);
    setMatCost(200000);
    setMatSupplier('PT Timber Jaya');
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName || !matCode) return;

    if (editingMaterial) {
      updateRawMaterial({
        ...editingMaterial,
        code: matCode,
        name: matName,
        category: matCategory,
        unit: matUnit,
        stock: matStock,
        minStock: matMinStock,
        costPerUnit: matCost,
        supplier: matSupplier,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } else {
      addRawMaterial({
        id: `mat-${Date.now()}`,
        code: matCode,
        name: matName,
        category: matCategory,
        unit: matUnit,
        stock: matStock,
        minStock: matMinStock,
        costPerUnit: matCost,
        supplier: matSupplier,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
    setIsMaterialModalOpen(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = rawMaterials.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-300" />
            Stok Produk & Material Bahan
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Pengendalian inventaris produk ready stock & bahan baku kayu multiplek, Hafele, HPL Taco.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'products'
                ? 'bg-white text-stone-950 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Katalog Produk ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'materials'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Bahan Mentah ({rawMaterials.length})
          </button>

          <button
            onClick={activeTab === 'products' ? handleOpenNewProduct : handleOpenNewMaterial}
            className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah {activeTab === 'products' ? 'Produk' : 'Bahan'}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Cari nama ${activeTab === 'products' ? 'produk' : 'bahan mentah'}...`}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0A0908] border border-stone-800 rounded-full text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
        />
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 shadow-xl space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-950">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-[10px] font-mono text-amber-300 uppercase tracking-widest border border-stone-800">
                  {p.category}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-stone-500">{p.code}</span>
                <h3 className="font-bold text-white text-base line-clamp-1">{p.name}</h3>
                <p className="text-xs text-stone-400 font-light line-clamp-2">{p.description}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#050505] border border-stone-900 text-xs flex justify-between items-center">
                <div>
                  <span className="text-stone-500 block text-[10px]">Harga Jual:</span>
                  <span className="font-bold text-amber-300">{formatRupiah(p.basePrice)}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[10px]">Stok Tersedia:</span>
                  <span className={`font-bold ${p.stock <= p.minStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {p.stock} {p.unit || 'Unit'} {p.stock <= p.minStock && '(Menipis)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-900">
                <button
                  onClick={() => handleOpenEditProduct(p)}
                  className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: RAW MATERIALS TABLE */}
      {activeTab === 'materials' && (
        <div className="bg-[#0A0908] rounded-3xl border border-stone-900 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#050505] border-b border-stone-900 text-stone-400 font-mono uppercase tracking-widest text-[10px]">
              <tr>
                <th className="p-4">Kode</th>
                <th className="p-4">Nama Material</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Harga Modal / Unit</th>
                <th className="p-4">Supplier</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-900">
              {filteredMaterials.map((m) => (
                <tr key={m.id} className="hover:bg-stone-950/60 transition-colors">
                  <td className="p-4 font-mono text-amber-300">{m.code}</td>
                  <td className="p-4 font-bold text-white">{m.name}</td>
                  <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-[10px] uppercase font-mono">{m.category}</span></td>
                  <td className="p-4 font-bold">
                    <span className={m.stock <= m.minStock ? 'text-rose-400' : 'text-emerald-400'}>
                      {m.stock} {m.unit}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{formatRupiah(m.costPerUnit)}</td>
                  <td className="p-4 text-stone-400">{m.supplier}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => deleteRawMaterial(m.id)} className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}>
          <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Nama Produk</label>
              <input type="text" required value={prodName} onChange={e => setProdName(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">Harga Jual (Rp)</label>
                <input type="number" required value={prodPrice} onChange={e => setProdPrice(Number(e.target.value))} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Stok Unit</label>
                <input type="number" required value={prodStock} onChange={e => setProdStock(Number(e.target.value))} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Simpan Produk</button>
          </form>
        </Modal>
      )}

      {/* MATERIAL MODAL */}
      {isMaterialModalOpen && (
        <Modal isOpen={isMaterialModalOpen} onClose={() => setIsMaterialModalOpen(false)} title="Tambah Material Bahan Mentah">
          <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Nama Material Bahan</label>
              <input type="text" required value={matName} onChange={e => setMatName(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Simpan Material</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
