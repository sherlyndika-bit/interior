import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductVariant } from '../types';
import { createWhatsAppCatalogLink, formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import {
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  Ruler,
  Clock,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Eye,
  LogIn,
  PhoneCall,
  LayoutDashboard,
  CheckCircle2,
  Award,
  ChevronRight
} from 'lucide-react';

interface PublicCatalogViewProps {
  onLoginClick?: () => void;
  onGoToAdmin?: () => void;
}

export const PublicCatalogView: React.FC<PublicCatalogViewProps> = ({ onLoginClick, onGoToAdmin }) => {
  const { products } = useApp();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  // Custom Fitout Estimator Modal State
  const [isEstimatorOpen, setIsEstimatorOpen] = useState<boolean>(false);
  const [estCategory, setEstCategory] = useState<string>('Kitchen Set');
  const [estLength, setEstLength] = useState<number>(3);
  const [estHeight, setEstHeight] = useState<number>(2.4);
  const [estFinish, setEstFinish] = useState<string>('HPL Taco Wood Grain');

  const categories = ['Semua', 'Kitchen Set', 'Bedroom', 'Living Room', 'Office', 'Wardrobe', 'Wall Panel'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveVariant(product.variants.length > 0 ? product.variants[0] : null);
  };

  const calculateEstimatedPriceRange = () => {
    let ratePerMeter = 2800000;
    if (estCategory === 'Wardrobe') ratePerMeter = 3200000;
    if (estCategory === 'Wall Panel') ratePerMeter = 1800000;
    if (estCategory === 'Bedroom') ratePerMeter = 2500000;
    if (estFinish.includes('Veneer Jati')) ratePerMeter += 800000;

    const baseEst = estLength * ratePerMeter;
    const minEst = Math.round(baseEst * 0.9);
    const maxEst = Math.round(baseEst * 1.15);
    return { minEst, maxEst };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Public Storefront Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight flex items-center gap-2">
                InteriorCraft <span className="text-amber-400 font-semibold text-xs px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">STUDIO</span>
              </span>
              <p className="text-[10px] text-slate-400">Custom Fitout & Fine Furniture</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-amber-300 transition-all"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Simulasi Budget</span>
            </button>

            {currentUser ? (
              <button
                onClick={onGoToAdmin}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Masuk Portal Staff / Admin</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Login Staff / Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Full-width Hero Landing Banner */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 sm:p-14 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 shadow-2xl">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Katalog Portofolio Interior & Custom Furniture 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Wujudkan Interior Impian, <br />
              <span className="text-amber-400">Konsultasikan Harga Langsung via WA</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Setiap karya furniture & fitout ruang dibuat secara <strong>custom-fit</strong> menyesuaikan luas ruangan & selera material Anda. Pilih model impian dari rumah, lalu tekan tombol WhatsApp untuk diskusi penawaran harga presisi!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center sm:justify-start">
              <button
                onClick={() => setIsEstimatorOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-xl shadow-amber-500/20 hover:scale-105"
              >
                <Calculator className="w-4 h-4" />
                <span>Hitung Simulasi Budget Custom</span>
              </button>

              <a
                href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20ingin%20konsultasi%20desain%20interior%20bebas%20biaya."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-xl shadow-emerald-600/20 hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Konsultasi Gratis via WA</span>
              </a>
            </div>
          </div>

          <div className="w-full sm:w-80 shrink-0 relative">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80"
              alt="Interior Studio Portfolio Showcase"
              className="w-full h-64 object-cover rounded-2xl border-2 border-amber-500/30 shadow-2xl rotate-1 group-hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute -bottom-4 -left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Garansi Resmi 2 Tahun</span>
                <span className="text-[10px] text-slate-400">Engsel Hafele & Kayu Multiplek</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari model furniture, kitchen set, wardrobe..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between glass-card-hover group shadow-xl"
            >
              <div>
                {/* Product Image Showcase */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Category & Code badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-amber-400 rounded-lg">
                      {product.category}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 rounded-lg">
                      {product.code}
                    </span>
                  </div>

                  {/* Lead time badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-slate-300 font-medium bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-800 backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Lead Time ~{product.leadTimeDays} Hari</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-slate-100 text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Available Variants Tag */}
                  {product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.variants.map(v => (
                        <span key={v.id} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {v.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleOpenDetails(product)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Lihat Rincian Specs"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Primary "Harga by WA" Button */}
                <a
                  href={createWhatsAppCatalogLink('6281298765432', product.name, product.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tanya Harga via WA</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-16 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">PT InteriorCraft Studio Indonesia</span>
            <span>• BSD City, Tangerang</span>
          </div>
          <div>
            © 2026 InteriorCraft Studio. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Detail Produk: ${selectedProduct.name}`}
          maxWidth="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-60 object-cover rounded-xl border border-slate-800"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Kategori</span>
                  <span className="font-bold text-amber-400">{selectedProduct.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Lead Time Produksi</span>
                  <span className="font-bold text-slate-200">{selectedProduct.leadTimeDays} Hari Kerja</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {selectedProduct.code}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Variant selection */}
                {selectedProduct.variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-semibold text-slate-400 block">
                      Pilih Varian Finishing / Material:
                    </label>
                    <div className="space-y-1.5">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setActiveVariant(variant)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                            activeVariant?.id === variant.id
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{variant.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">SKU: {variant.sku}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Pesan & penyesuaian ukuran dilakukan secara konsultatif via WhatsApp.</span>
                </div>

                <a
                  href={createWhatsAppCatalogLink(
                    '6281298765432',
                    selectedProduct.name,
                    selectedProduct.code,
                    activeVariant?.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tanya Harga Varian ini via WA</span>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Fitout Budget Estimator Modal */}
      {isEstimatorOpen && (
        <Modal
          isOpen={isEstimatorOpen}
          onClose={() => setIsEstimatorOpen(false)}
          title="Simulasi Estimasi Budget Custom Fitout Interior"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Hitung gambaran kasar anggaran biaya custom furniture berdasarkan ukuran ruangan Anda:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jenis Proyek</label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Kitchen Set">Kitchen Set</option>
                  <option value="Wardrobe">Wardrobe Walk-in Closet</option>
                  <option value="Wall Panel">Wall Panel & Backdrop TV</option>
                  <option value="Bedroom">Bed Frame & Nightstand</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Finishing Material</label>
                <select
                  value={estFinish}
                  onChange={(e) => setEstFinish(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="HPL Taco Wood Grain">HPL Taco Standard</option>
                  <option value="Duco Matte Paint">Cat Duco Premium</option>
                  <option value="Veneer Jati Natural">Veneer Kayu Jati Genuine</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Panjang Ruangan (Meter)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={estLength}
                  onChange={(e) => setEstLength(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tinggi Kabinet (Meter)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={estHeight}
                  onChange={(e) => setEstHeight(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Calculated Result Box */}
            {(() => {
              const { minEst, maxEst } = calculateEstimatedPriceRange();
              return (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                  <span className="text-xs text-amber-300 font-semibold block">Estimasi Biaya Indikatif:</span>
                  <div className="text-xl font-extrabold text-white">
                    {formatRupiah(minEst)} - {formatRupiah(maxEst)}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    *Termasuk multiplek 18mm, engsel soft-close, delivery & instalasi lokasi.
                  </p>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEstimatorOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/6281298765432?text=${encodeURIComponent(`Halo InteriorCraft Studio, saya telah mencoba kalkulator estimasi untuk *${estCategory}* ukuran ${estLength}m x ${estHeight}m dengan finishing ${estFinish}. Mohon konsultasi survei lokasi!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Konsultasi Hasil Estimasi via WA</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
