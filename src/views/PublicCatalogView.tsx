import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductVariant } from '../types';
import { createWhatsAppCatalogLink, formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import {
  MessageSquare,
  Search,
  Clock,
  Calculator,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Sparkles,
  ArrowUpRight
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

  const categories = ['Semua', 'Kitchen Set', 'Wardrobe', 'Bedroom', 'Living Room', 'Wall Panel', 'Office'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Duplicate items for continuous infinite marquee scrolling
  const marqueeRow1 = [...products, ...products];
  const marqueeRow2 = [...products].reverse().concat([...products].reverse());

  const scrollToGallery = () => {
    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
      {/* SOFT ROUNDED MINIMALIST HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 sm:px-12 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20">
              IC
            </div>
            <div>
              <span className="font-extrabold text-white text-xl tracking-tight flex items-center gap-2">
                InteriorCraft <span className="text-amber-400 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-semibold">STUDIO</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Architecture & Fine Interior Fitout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 transition-all shadow-lg"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Simulasi Budget</span>
            </button>

            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20tertarik%20konsultasi%20desain%20interior."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 hover:scale-105"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya WA</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION: SOFT LUXURY ARCHITECTURAL CANVAS */}
      <section className="relative h-[88vh] min-h-[580px] w-full flex items-center justify-center overflow-hidden pt-16">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&auto=format&fit=crop&q=85"
          alt="Architectural Masterpiece Canvas"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7] contrast-[1.05] scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Koleksi Eksklusif Desain Interior & Fitout Custom 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
            Ruang Mewah Impian, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 font-serif italic">
              Pilih Model & Tanya Harga via WA
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
            Setiap karya furniture & fitout interior dirancang secara khusus (<strong>custom-fit</strong>) sesuai ukuran ruangan Anda. Cek portofolio visual lengkap dari rumah, lalu tekan konsultasi WhatsApp untuk penawaran harga presisi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={scrollToGallery}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
            >
              <span>Jelajahi Galeri</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="px-8 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all hover:scale-105"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Simulasi Budget</span>
            </button>
          </div>
        </div>
      </section>

      {/* STUDIO STATEMENT BANNER */}
      <section className="py-16 px-6 sm:px-12 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              PT InteriorCraft Studio Indonesia
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Spesialis custom kitchen set, wardrobe walk-in closet, bed set, & fluted wall panel. Menggunakan kayu multiplek 18mm grade A, engsel soft-close Hafele, & finishing HPL Taco dengan garansi 2 tahun.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20ingin%20konsultasi%20desain%20interior%20bebas%20biaya."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-xl shadow-emerald-600/20 hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Konsultasi Gratis via WA</span>
            </a>
          </div>
        </div>
      </section>

      {/* INFINITE HORIZONTAL MARQUEE SLIDERS WITH SOFT ROUNDED CARDS */}
      <section className="py-12 bg-slate-950 overflow-hidden space-y-4">
        {/* ROW 1 */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee-left gap-4">
            {marqueeRow1.map((product, idx) => (
              <div
                key={`row1-${product.id}-${idx}`}
                onClick={() => handleOpenDetails(product)}
                className="relative w-80 sm:w-96 aspect-[16/10] shrink-0 rounded-3xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-800 shadow-xl"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.9] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-slate-800">
                      {product.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-800">
                      {product.code}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-300 font-light line-clamp-1">{product.description}</p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tanya Harga WA</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee-right gap-4">
            {marqueeRow2.map((product, idx) => (
              <div
                key={`row2-${product.id}-${idx}`}
                onClick={() => handleOpenDetails(product)}
                className="relative w-80 sm:w-96 aspect-[16/10] shrink-0 rounded-3xl overflow-hidden cursor-pointer group bg-slate-900 border border-slate-800 shadow-xl"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.9] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-slate-800">
                      {product.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-800">
                      {product.code}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-300 font-light line-clamp-1">{product.description}</p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tanya Harga WA</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOFT ROUNDED PROJECT GALLERY SECTION */}
      <main id="gallery-section" className="max-w-7xl mx-auto px-6 sm:px-12 py-20 space-y-10">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Galeri Portofolio Proyek Studio
              </h2>
              <p className="text-slate-400 text-xs font-light mt-1">
                Jelajahi karya desain interior & furniture custom kami dari rumah.
              </p>
            </div>

            {/* Soft Pill Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari model fitout, kitchen set..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Soft Pill Category Filters */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ELEGANT SOFT ROUNDED PHOTOGRAPHY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleOpenDetails(product)}
              className="glass-card rounded-3xl border border-slate-800/80 overflow-hidden flex flex-col justify-between glass-card-hover cursor-pointer shadow-2xl group"
            >
              <div>
                {/* Photo Canvas with Soft Rounded Top */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover filter brightness-[0.9] group-hover:scale-108 group-hover:brightness-100 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />

                  {/* Soft Category & Code Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 rounded-full border border-slate-800 shadow-md">
                      {product.category}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 rounded-full border border-slate-800">
                      {product.code}
                    </span>
                  </div>

                  {/* Lead Time Badge */}
                  <div className="absolute bottom-4 left-4 text-[11px] text-slate-200 font-medium bg-slate-950/90 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>~{product.leadTimeDays} Hari Kerja</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 space-y-2">
                  <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => handleOpenDetails(product)}
                  className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Lihat Galeri Foto Full"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <a
                  href={createWhatsAppCatalogLink('6281298765432', product.name, product.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/20 hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tanya Harga via WA</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-10 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-300">
            PT InteriorCraft Studio Indonesia
          </span>
          <span>© 2026 InteriorCraft Studio. All rights reserved.</span>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Galeri Foto: ${selectedProduct.name}`}
          maxWidth="max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-stone-100">
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

              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
                  {selectedProduct.code} • {selectedProduct.category}
                </span>
                <h3 className="text-2xl font-extrabold text-white leading-tight">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                {selectedProduct.variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Pilih Varian Material:
                    </label>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setActiveVariant(variant)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                            activeVariant?.id === variant.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{variant.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">SKU: {variant.sku}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <a
                  href={createWhatsAppCatalogLink(
                    '6281298765432',
                    selectedProduct.name,
                    selectedProduct.code,
                    activeVariant?.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tanya Harga Varian ini via WA</span>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Estimator Modal */}
      {isEstimatorOpen && (
        <Modal
          isOpen={isEstimatorOpen}
          onClose={() => setIsEstimatorOpen(false)}
          title="Simulasi Estimasi Budget Custom Fitout"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-slate-100">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold font-sans">Jenis Proyek</label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
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
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
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
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
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
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

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
                className="px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/6281298765432?text=${encodeURIComponent(`Halo InteriorCraft Studio, saya telah mencoba kalkulator estimasi untuk *${estCategory}* ukuran ${estLength}m x ${estHeight}m dengan finishing ${estFinish}. Mohon konsultasi survei lokasi!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
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
