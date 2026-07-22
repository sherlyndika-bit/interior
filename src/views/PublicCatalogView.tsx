import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductVariant } from '../types';
import { createWhatsAppCatalogLink, formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import {
  MessageSquare,
  Search,
  Clock,
  ShieldCheck,
  Calculator,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  SlidersHorizontal
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
    { name: 'Semua', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80' },
    { name: 'Kitchen Set', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80' },
    { name: 'Wardrobe', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80' },
    { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80' },
    { name: 'Living Room', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80' },
    { name: 'Wall Panel', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80' },
    { name: 'Office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80' }
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
    <div className="min-h-screen bg-[#0F0E0D] text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Overlay Minimalist Top Header (Clean Layout) */}
      <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent backdrop-blur-md px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 font-bold text-sm shadow-xl">
              IC
            </div>
            <div>
              <span className="font-serif font-bold text-white text-xl tracking-tight flex items-center gap-2">
                INTERIORCRAFT <span className="font-sans text-[10px] font-semibold tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded bg-white/10 border border-white/20">GALLERY</span>
              </span>
              <p className="text-[10px] text-stone-300 tracking-wider uppercase font-medium">Architecture & Custom Fitout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-xs font-medium text-white transition-all shadow-lg"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Simulasi Budget</span>
            </button>

            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20tertarik%20untuk%20konsultasi%20desain%20interior."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-xl hover:scale-105"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya Harga via WA</span>
            </a>
          </div>
        </div>
      </header>

      {/* FULL-BLEED FULL SCREEN PHOTOGRAPHY HERO WITH OVERLAID TYPOGRAPHY */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Full-bleed background photography */}
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&auto=format&fit=crop&q=85"
          alt="Full Bleed Architecture Photography"
          className="absolute inset-0 w-full h-full object-cover filter contrast-[1.05] brightness-90 scale-105"
        />

        {/* Dark Vignette Overlay for Crisp Typography Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0D] via-[#0F0E0D]/40 to-[#0F0E0D]/60" />
        <div className="absolute inset-0 bg-stone-950/30 backdrop-brightness-95" />

        {/* OVERLAID CONTENT ON TOP OF IMAGE (Clean spacing without overlapping pill badge) */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-24">
          <h1 className="text-4xl sm:text-7xl font-serif font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            Ruang Elegan & Custom, <br />
            <span className="italic font-serif text-amber-300 font-normal">
              Konsultasikan Harga via WA
            </span>
          </h1>

          <p className="text-stone-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light drop-shadow-md">
            Jelajahi karya desain interior & furniture custom kami dari rumah. Klik foto favorit Anda dan tekan tombol WhatsApp untuk diskusi penawaran harga presisi!
          </p>

          {/* Search bar directly inside hero overlay */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kitchen set, wardrobe, bed set, wall panel..."
                className="w-full pl-12 pr-6 py-3.5 bg-stone-950/80 backdrop-blur-xl border border-white/20 rounded-full text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-300 shadow-2xl transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="px-8 py-3.5 rounded-full bg-white/90 hover:bg-white text-stone-950 font-bold text-xs flex items-center gap-2 shadow-2xl transition-all hover:scale-105"
            >
              <Calculator className="w-4 h-4 text-amber-700" />
              <span>Simulasi Budget Custom</span>
            </button>

            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20tertarik%20konsultasi%20desain%20interior."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-2xl transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tanya Harga via WA</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Visual Gallery Showcase Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Category Pills Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-white tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-300" />
              Galeri Berdasarkan Kategori
            </h2>
            <span className="text-xs text-stone-400 font-light">Pilih kategori untuk memfilter</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`relative rounded-2xl overflow-hidden h-28 text-left p-3 flex flex-col justify-end transition-all border group ${
                  selectedCategory === cat.name
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-[1.03] shadow-2xl'
                    : 'border-stone-800 opacity-70 hover:opacity-100 hover:border-stone-700'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                <span className="relative z-10 text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Result Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 text-xs text-stone-400">
          <span>Menampilkan <strong className="text-white font-bold">{filteredProducts.length}</strong> karya portofolio foto</span>
          <span>Kategori: <strong className="text-amber-300 font-bold">{selectedCategory}</strong></span>
        </div>

        {/* FULL IMAGE PHOTOGRAPHY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-stone-900/80 rounded-3xl border border-stone-800 overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-all duration-500 group shadow-2xl"
            >
              <div>
                {/* Full Visual Photo Card Canvas */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-950 cursor-pointer" onClick={() => handleOpenDetails(product)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter contrast-[1.03]"
                  />
                  {/* Photo Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-90" />

                  {/* Category & Code Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-stone-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 rounded-full border border-stone-800 shadow-md">
                      {product.category}
                    </span>
                    <span className="px-2.5 py-1 bg-stone-950/80 backdrop-blur-md text-[10px] font-mono text-stone-300 rounded-full border border-stone-800">
                      {product.code}
                    </span>
                  </div>

                  {/* Lead Time Tag */}
                  <div className="absolute bottom-4 left-4 text-[11px] text-stone-200 font-medium bg-stone-950/90 px-3 py-1 rounded-full border border-stone-800 backdrop-blur-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Lead Time ~{product.leadTimeDays} Hari</span>
                  </div>
                </div>

                {/* Card Title & Specs Description */}
                <div className="p-6 space-y-3">
                  <h3 className="font-serif font-extrabold text-white text-lg group-hover:text-amber-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>

                  {/* Variant Tags */}
                  {product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.variants.map(v => (
                        <span key={v.id} className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-950 text-stone-300 border border-slate-800">
                          {v.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => handleOpenDetails(product)}
                  className="p-3 rounded-full bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors"
                  title="Lihat Galeri Foto Full"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <a
                  href={createWhatsAppCatalogLink('6281298765432', product.name, product.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02]"
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
      <footer className="border-t border-stone-800 mt-20 py-10 bg-stone-950 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-200">PT InteriorCraft Studio Indonesia</span>
            <span>• Kawasan Industri Kreatif, BSD City</span>
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
          title={`Galeri Foto: ${selectedProduct.name}`}
          maxWidth="max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-stone-100">
            {/* Left: Images Carousel */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 group">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {selectedProduct.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedProduct.images.length - 1))}
                      className="p-2 rounded-full bg-stone-950/80 backdrop-blur-md text-white border border-stone-700 hover:bg-stone-900"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev < selectedProduct.images.length - 1 ? prev + 1 : 0))}
                      className="p-2 rounded-full bg-stone-950/80 backdrop-blur-md text-white border border-stone-700 hover:bg-stone-900"
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
                        activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-stone-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-stone-500 block">Kategori</span>
                  <span className="font-bold text-amber-300">{selectedProduct.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-slate-500 block">Lead Time Produksi</span>
                  <span className="font-bold text-slate-200">{selectedProduct.leadTimeDays} Hari Kerja</span>
                </div>
              </div>
            </div>

            {/* Right: Technical Specs & WA Action */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-amber-300 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 inline-block">
                  {selectedProduct.code}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white leading-tight">{selectedProduct.name}</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                {/* Variant selection */}
                {selectedProduct.variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-semibold text-stone-300 block">
                      Pilih Varian Finishing / Material:
                    </label>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setActiveVariant(variant)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                            activeVariant?.id === variant.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <span>{variant.name}</span>
                          <span className="text-[10px] font-mono text-stone-500">SKU: {variant.sku}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-800 space-y-3">
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
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full flex items-center justify-center gap-2 shadow-xl transition-all"
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
          <div className="space-y-4 text-stone-100">
            <p className="text-xs text-stone-300">
              Hitung gambaran kasar anggaran biaya custom furniture berdasarkan ukuran ruangan Anda:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Jenis Proyek</label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Kitchen Set">Kitchen Set</option>
                  <option value="Wardrobe">Wardrobe Walk-in Closet</option>
                  <option value="Wall Panel">Wall Panel & Backdrop TV</option>
                  <option value="Bedroom">Bed Frame & Nightstand</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Finishing Material</label>
                <select
                  value={estFinish}
                  onChange={(e) => setEstFinish(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="HPL Taco Wood Grain">HPL Taco Standard</option>
                  <option value="Duco Matte Paint">Cat Duco Premium</option>
                  <option value="Veneer Jati Natural">Veneer Kayu Jati Genuine</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Panjang Ruangan (Meter)</label>
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

            {/* Calculated Result Box */}
            {(() => {
              const { minEst, maxEst } = calculateEstimatedPriceRange();
              return (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1 shadow-xl">
                  <span className="text-xs text-amber-300 font-semibold block">Estimasi Biaya Indikatif:</span>
                  <div className="text-2xl font-serif font-bold text-white">
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
