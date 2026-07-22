import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductVariant } from '../types';
import { createWhatsAppCatalogLink, formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import {
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  Clock,
  ShieldCheck,
  Calculator,
  Eye,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Award,
  ArrowUpRight,
  Maximize2,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

export const PublicCatalogView: React.FC = () => {
  const { products } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Custom Fitout Estimator Modal State
  const [isEstimatorOpen, setIsEstimatorOpen] = useState<boolean>(false);
  const [estCategory, setEstCategory] = useState<string>('Kitchen Set');
  const [estLength, setEstLength] = useState<number>(3.5);
  const [estHeight, setEstHeight] = useState<number>(2.8);
  const [estFinish, setEstFinish] = useState<string>('HPL Taco Wood Grain');

  const categories = [
    { name: 'Semua', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
    { name: 'Kitchen Set', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80' },
    { name: 'Wardrobe', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80' },
    { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80' },
    { name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80' },
    { name: 'Wall Panel', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
    { name: 'Office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80' }
  ];

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
    setActiveImageIndex(0);
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
      {/* Luxury Full-Bleed Storefront Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-white text-xl tracking-tight flex items-center gap-2">
                InteriorCraft <span className="text-amber-400 font-semibold text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">STUDIO</span>
              </span>
              <p className="text-[11px] text-slate-400">Architecture, Custom Furniture & Fine Interior</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 transition-all shadow-lg shadow-amber-500/5"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Simulasi Budget Fitout</span>
            </button>

            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20tertarik%20untuk%20konsultasi%20desain%20interior."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Hubungi WA Studio</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section: Full-Bleed Visual Showcase Banner */}
      <section className="relative overflow-hidden min-h-[580px] flex items-center justify-center py-16 px-6">
        {/* Full-bleed background gallery slider simulation */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop&q=80"
            alt="Luxury Interior Architecture Banner"
            className="w-full h-full object-cover opacity-30 filter brightness-90 scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Katalog Eksklusif Desain Interior & Fitout Custom 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Ruang Mewah Impian, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
                Pilih Model & Tanya Harga via WA
              </span>
            </h1>

            <p className="text-slate-300 text-base leading-relaxed max-w-2xl font-light">
              Setiap karya furniture, kitchen set, & walk-in closet dibuat secara khusus (<strong>custom-fit</strong>) sesuai ukuran ruangan Anda. Cek portofolio visual lengkap dari rumah, lalu tekan konsultasi WhatsApp untuk penawaran harga presisi!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center lg:justify-start">
              <button
                onClick={() => setIsEstimatorOpen(true)}
                className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center gap-2.5 transition-all shadow-xl shadow-amber-500/25 hover:scale-105"
              >
                <Calculator className="w-4 h-4" />
                <span>Simulasi Estimasi Budget Custom</span>
              </button>

              <a
                href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20ingin%20konsultasi%20desain%20interior%20bebas%20biaya."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2.5 transition-all shadow-xl shadow-emerald-600/25 hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Konsultasi Gratis via WhatsApp</span>
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Garansi Kayu Multiplek & Engsel 2 Thn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Bahan Grade A Multiplek 18mm & HPL Taco</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&auto=format&fit=crop&q=80"
                alt="Kitchen Set Luxury Custom Showcase"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 inline-block">
                  Kitchen Set Scandinavian Oak
                </span>
                <h3 className="font-extrabold text-white text-lg">Proyek Cluster BSD Signature</h3>
                <p className="text-xs text-slate-300">Custom multiplek 18mm, quartz white top, indirect strip LED.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Visual Category Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-400" />
              Jelajahi Berdasarkan Kategori Ruang
            </h2>
            <span className="text-xs text-slate-400">Pilih kategori untuk memfilter</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`relative rounded-2xl overflow-hidden border h-24 text-left p-3 flex flex-col justify-end transition-all group ${
                  selectedCategory === cat.name
                    ? 'border-amber-500 ring-2 ring-amber-500/30 scale-[1.02] shadow-xl shadow-amber-500/10'
                    : 'border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <span className="relative z-10 text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Menampilkan <strong className="text-amber-400">{filteredProducts.length}</strong> model furniture custom
          </div>

          <div className="relative w-full sm:w-80">
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

        {/* Full-Bleed Product Cards Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-3xl border border-slate-800/80 overflow-hidden flex flex-col justify-between glass-card-hover group shadow-2xl"
            >
              <div>
                {/* Product Image Showcase */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => handleOpenDetails(product)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />

                  {/* Category & Code badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-amber-400 rounded-xl">
                      {product.category}
                    </span>
                    <span className="px-3 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 rounded-xl">
                      {product.code}
                    </span>
                  </div>

                  {/* Lead time badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] text-slate-200 font-semibold bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lead Time ~{product.leadTimeDays} Hari</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-3">
                  <h3 className="font-extrabold text-slate-100 text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Available Variants Tag */}
                  {product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.variants.map(v => (
                        <span key={v.id} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                          {v.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => handleOpenDetails(product)}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Lihat Galeri & Detail Specs"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Primary "Harga by WA" Button */}
                <a
                  href={createWhatsAppCatalogLink('6281298765432', product.name, product.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20 hover:scale-[1.02]"
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
      <footer className="border-t border-slate-800 mt-20 py-10 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">PT InteriorCraft Studio Indonesia</span>
            <span>• Kawasan Industri Kreatif, BSD City, Tangerang</span>
          </div>
          <div>
            © 2026 InteriorCraft Studio. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Full Visual Gallery & Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Galeri & Spesifikasi: ${selectedProduct.name}`}
          maxWidth="max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive Image Carousel */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {selectedProduct.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedProduct.images.length - 1))}
                      className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-slate-700 hover:bg-slate-900"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev < selectedProduct.images.length - 1 ? prev + 1 : 0))}
                      className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-slate-700 hover:bg-slate-900"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
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

            {/* Right: Technical Specs & WA Order Action */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 inline-block">
                  {selectedProduct.code}
                </span>
                <h3 className="text-2xl font-extrabold text-white leading-tight">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Variant selection */}
                {selectedProduct.variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-semibold text-slate-400 block">
                      Pilih Varian Finishing / Material:
                    </label>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setActiveVariant(variant)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                            activeVariant?.id === variant.id
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
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
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Pemesanan & penyesuaian ukuran dilakukan langsung via WhatsApp.</span>
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
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all"
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
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1 shadow-xl">
                  <span className="text-xs text-amber-300 font-semibold block">Estimasi Biaya Indikatif:</span>
                  <div className="text-2xl font-extrabold text-white">
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
