import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, RawMaterial, ProductVariant } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Package, Layers, Plus, Search, AlertTriangle, Edit, Trash2, Tag, ArrowUpRight, ArrowDownRight, Warehouse, DollarSign } from 'lucide-react';

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
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80');

  // Product Variants state
  const [variantsList, setVariantsList] = useState<{ name: string; sku: string; cost: number; price: number; stock: number }[]>([]);
  const [varName, setVarName] = useState('');
  const [varSku, setVarSku] = useState('');
  const [varPrice, setVarPrice] = useState<number>(0);

  // New Raw Material Form State
  const [matCode, setMatCode] = useState('');
  const [matName, setMatName] = useState('');
  const [matCategory, setMatCategory] = useState<RawMaterial['category']>('Papan Wood');
  const [matUnit, setMatUnit] = useState('lembar');
  const [matStock, setMatStock] = useState<number>(50);
  const [matMinStock, setMatMinStock] = useState<number>(15);
  const [matCost, setMatCost] = useState<number>(200000);
  const [matSupplier, setMatSupplier] = useState('');

  const handleAddVariant = () => {
    if (!varName) return;
    setVariantsList(prev => [
      ...prev,
      {
        name: varName,
        sku: varSku || `VAR-${Date.now()}`,
        cost: 0,
        price: varPrice,
        stock: 5
      }
    ]);
    setVarName('');
    setVarSku('');
    setVarPrice(0);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodCode) return;

    const formattedVariants: ProductVariant[] = variantsList.map((v, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      name: v.name,
      sku: v.sku,
      additionalCost: v.cost,
      additionalPrice: v.price,
      stock: v.stock
    }));

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
        images: [prodImage],
        variants: formattedVariants
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
        unit: 'Unit',
        images: [prodImage],
        variants: formattedVariants,
        isPreOrderAvailable: true,
        leadTimeDays: 14,
        featuredInCatalog: true
      });
    }

    setIsProductModalOpen(false);
    resetProductForm();
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdCode('');
    setProdName('');
    setProdDesc('');
    setProdCost(10000000);
    setProdPrice(18000000);
    setProdStock(5);
    setProdMinStock(2);
    setVariantsList([]);
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
        supplier: matSupplier || 'CV Supplier Utama',
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }

    setIsMaterialModalOpen(false);
    resetMaterialForm();
  };

  const resetMaterialForm = () => {
    setEditingMaterial(null);
    setMatCode('');
    setMatName('');
    setMatUnit('lembar');
    setMatStock(50);
    setMatMinStock(15);
    setMatCost(200000);
    setMatSupplier('');
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
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            Manajemen Inventaris & Bahan Mentah
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola stok barang jadi, varian finishing kayu, serta pasokan multiplek & hardware.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetProductForm();
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Barang & Varian</span>
          </button>

          <button
            onClick={() => {
              resetMaterialForm();
              setIsMaterialModalOpen(true);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Tambah Bahan Mentah</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Barang Jadi & Varian ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Stok Bahan Mentah ({rawMaterials.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode/nama/kategori..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Finished Goods & Variants Table */}
      {activeTab === 'products' && (
        <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Produk / Gambar</th>
                  <th className="px-4 py-3">Kategori & Kode</th>
                  <th className="px-4 py-3">Stok Unit</th>
                  <th className="px-4 py-3">Modal HPB</th>
                  <th className="px-4 py-3">Harga Jual Standard</th>
                  <th className="px-4 py-3">Varian Tersedia</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                          />
                          <div>
                            <div className="font-bold text-slate-100">{p.name}</div>
                            <div className="text-[10px] text-slate-500">{p.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-semibold border border-slate-700 block w-max">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">{p.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-sm ${isLowStock ? 'text-rose-400' : 'text-slate-100'}`}>
                            {p.stock}
                          </span>
                          {isLowStock && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" /> LOW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">{formatRupiah(p.baseCost)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400">{formatRupiah(p.basePrice)}</td>
                      <td className="px-4 py-3">
                        {p.variants.length > 0 ? (
                          <div className="space-y-1">
                            {p.variants.map((v) => (
                              <div key={v.id} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300 flex items-center justify-between gap-2">
                                <span>{v.name}</span>
                                {v.additionalPrice > 0 && (
                                  <span className="text-amber-400 font-mono">+{formatRupiah(v.additionalPrice)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Tanpa varian</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProdCode(p.code);
                              setProdName(p.name);
                              setProdCategory(p.category);
                              setProdDesc(p.description);
                              setProdCost(p.baseCost);
                              setProdPrice(p.basePrice);
                              setProdStock(p.stock);
                              setProdMinStock(p.minStock);
                              setVariantsList(p.variants.map(v => ({ name: v.name, sku: v.sku, cost: v.additionalCost, price: v.additionalPrice, stock: v.stock })));
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw Materials Table */}
      {activeTab === 'materials' && (
        <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Nama Bahan</th>
                  <th className="px-4 py-3">Kode & Kategori</th>
                  <th className="px-4 py-3">Stok Gudang</th>
                  <th className="px-4 py-3">Harga Beli / Unit</th>
                  <th className="px-4 py-3">Pemasok / Supplier</th>
                  <th className="px-4 py-3">Terakhir Update</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMaterials.map((m) => {
                  const isLowStock = m.stock <= m.minStock;
                  return (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-100">{m.name}</div>
                        <div className="text-[10px] text-slate-500">Satuan: {m.unit}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 block w-max">
                          {m.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">{m.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-sm ${isLowStock ? 'text-rose-400' : 'text-slate-100'}`}>
                            {m.stock} {m.unit}
                          </span>
                          {isLowStock && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" /> REORDER NOW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-amber-400">{formatRupiah(m.costPerUnit)}</td>
                      <td className="px-4 py-3 text-slate-300">{m.supplier}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(m.lastUpdated)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingMaterial(m);
                              setMatCode(m.code);
                              setMatName(m.name);
                              setMatCategory(m.category);
                              setMatUnit(m.unit);
                              setMatStock(m.stock);
                              setMatMinStock(m.minStock);
                              setMatCost(m.costPerUnit);
                              setMatSupplier(m.supplier);
                              setIsMaterialModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRawMaterial(m.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isProductModalOpen && (
        <Modal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          title={editingProduct ? 'Edit Barang & Varian' : 'Tambah Barang Jadi Baru'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kode Barang (SKU Master)</label>
                <input
                  type="text"
                  required
                  value={prodCode}
                  onChange={(e) => setProdCode(e.target.value)}
                  placeholder="e.g. KS-MODULAR-01"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kategori</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Kitchen Set">Kitchen Set</option>
                  <option value="Wardrobe">Wardrobe</option>
                  <option value="Wall Panel">Wall Panel</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Office">Office</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Nama Produk Furniture</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Kitchen Set Minimalis Japandi Warm Teak"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Modal Pokok (HPP Base)</label>
                <input
                  type="number"
                  required
                  value={prodCost}
                  onChange={(e) => setProdCost(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Harga Jual Acuan (IDR)</label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Stok Siap Kirim</label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Batas Minimum Stok Alert</label>
                <input
                  type="number"
                  required
                  value={prodMinStock}
                  onChange={(e) => setProdMinStock(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Varian Creator Section */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 block">Tambah Varian Finishing / Kayu:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nama Varian (e.g. Walnut Finish)"
                  value={varName}
                  onChange={(e) => setVarName(e.target.value)}
                  className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Tambahan Harga"
                  value={varPrice || ''}
                  onChange={(e) => setVarPrice(Number(e.target.value))}
                  className="w-32 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  + Tambah Varian
                </button>
              </div>

              {variantsList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {variantsList.map((v, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-200 flex items-center gap-2">
                      <span>{v.name} (+{formatRupiah(v.price)})</span>
                      <button
                        type="button"
                        onClick={() => setVariantsList(prev => prev.filter((_, i) => i !== idx))}
                        className="text-rose-400 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add/Edit Raw Material Modal */}
      {isMaterialModalOpen && (
        <Modal
          isOpen={isMaterialModalOpen}
          onClose={() => setIsMaterialModalOpen(false)}
          title={editingMaterial ? 'Edit Stok Bahan Mentah' : 'Tambah Bahan Mentah Baru'}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveMaterial} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kode Bahan</label>
                <input
                  type="text"
                  required
                  value={matCode}
                  onChange={(e) => setMatCode(e.target.value)}
                  placeholder="RAW-PLY-18"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kategori Bahan</label>
                <select
                  value={matCategory}
                  onChange={(e) => setMatCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Papan Wood">Papan Wood (Multiplek / MDF)</option>
                  <option value="HPL & Veneer">HPL & Veneer</option>
                  <option value="Hardware & Aksesoris">Hardware & Aksesoris</option>
                  <option value="Kaca & Cermin">Kaca & Cermin</option>
                  <option value="Busa & Kain">Busa & Upholstery Kain</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Nama Bahan</label>
                <input
                  type="text"
                  required
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  placeholder="Multiplek Meranti 18mm Grade A"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Satuan Unit</label>
                <input
                  type="text"
                  required
                  value={matUnit}
                  onChange={(e) => setMatUnit(e.target.value)}
                  placeholder="lembar / meter / pcs"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Harga Beli Beli Per Unit (IDR)</label>
                <input
                  type="number"
                  required
                  value={matCost}
                  onChange={(e) => setMatCost(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Stok Tersedia Saat Ini</label>
                <input
                  type="number"
                  required
                  value={matStock}
                  onChange={(e) => setMatStock(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Batas Stok Minimal Alert</label>
                <input
                  type="number"
                  required
                  value={matMinStock}
                  onChange={(e) => setMatMinStock(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Nama Pemasok / Supplier</label>
                <input
                  type="text"
                  value={matSupplier}
                  onChange={(e) => setMatSupplier(e.target.value)}
                  placeholder="PT Kayu Nusantara Utama"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Simpan Stok Bahan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
