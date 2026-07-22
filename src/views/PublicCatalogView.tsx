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
  Maximize2,
  SlidersHorizontal,
  ArrowRight,
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 selection:text-stone-900">
      {/* Editorial Luxury Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-amber-200 font-bold text-sm shadow-md">
              IC
            </div>
            <div>
              <span className="font-serif font-bold text-stone-900 text-xl tracking-tight flex items-center gap-2">
                INTERIORCRAFT <span className="font-sans text-[10px] font-semibold tracking-widest text-amber-700 uppercase px-2 py-0.5 rounded bg-stone-100 border border-stone-200">STUDIO</span>
              </span>
              <p className="text-[10px] text-stone-500 tracking-wider uppercase font-medium">Architecture & Fine Furniture Gallery</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-xs font-medium text-stone-800 transition-all shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Simulasi Budget</span>
            </button>

            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20tertarik%20untuk%20konsultasi%20desain%20interior."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-100 font-semibold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya Harga via WA</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Editorial Architecture Gallery Showcase */}
      <section className="relative overflow-hidden py-16 px-6 border-b border-stone-200/60 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Koleksi Eksklusif Fitout Interior & Furniture 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-normal text-stone-950 tracking-tight leading-[1.15]">
              Ruang Elegan & Custom, <br />
              <span className="italic font-serif text-amber-800">
                Konsultasikan Harga via WA
              </span>
            </h1>

            <p className="text-stone-600 text-base leading-relaxed max-w-2xl font-light">
              Setiap karya furniture & fitout interior dirancang secara khusus (<strong>custom-fit</strong>) sesuai ukuran ruangan Anda. Pilih galeri inspirasi dari rumah, lalu tekan tombol konsultasi WhatsApp untuk penawaran harga presisi.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center lg:justify-start">
              <button
                onClick={() => setIsEstimatorOpen(true)}
                className="px-7 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md hover:scale-[1.02]"
              >
                <Calculator className="w-4 h-4 text-amber-300" />
                <span>Simulasi Estimasi Budget Custom</span>
              </button>

              <a
                href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20ingin%20konsultasi%20desain%20interior%20bebas%20biaya."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Konsultasi Gratis via WA</span>
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garansi Engsel & Kayu 2 Tahun</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-stone-700" />
                <span>Bahan Multiplek 18mm & HPL Taco Grade A</span>
              </div>
            </div>
          </div>

          {/* Hero Editorial Showcase Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-white group">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80"
                alt="Luxury Gallery Showcase"
                className="w-full h-80 sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-200">
                  Scandinavian Minimalist Fitout
                </span>
                <h3 className="font-serif text-lg font-bold">Proyek Residensial Alam Sutera</h3>
                <p className="text-xs text-stone-300 font-light">Custom fluted wall panel, warm LED light & quartz top.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Collection */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Visual Category Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-stone-900 tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              Galeri Kategori Ruangan
            </h2>
            <span className="text-xs text-stone-500">Pilih kategori untuk memfilter</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`relative rounded-xl overflow-hidden h-24 text-left p-3 flex flex-col justify-end transition-all border ${
                  selectedCategory === cat.name
                    ? 'border-amber-700 ring-2 ring-amber-700/20 scale-[1.02] shadow-md'
                    : 'border-stone-200 hover:border-stone-300 opacity-90 hover:opacity-100'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-75 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
                <span className="relative z-10 text-xs font-semibold text-white">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200">
          <div className="text-xs text-stone-500">
            Menampilkan <strong className="text-stone-900 font-semibold">{filteredProducts.length}</strong> karya portofolio furniture
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari model furniture / kode..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-full text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Editorial Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                {/* Product Showcase Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-pointer" onClick={() => handleOpenDetails(product)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.01]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-60" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold text-stone-900 rounded-full border border-stone-200 shadow-sm">
                      {product.category}
                    </span>
                    <span className="px-2.5 py-1 bg-stone-900/80 backdrop-blur-md text-[10px] font-mono text-amber-200 rounded-full">
                      {product.code}
                    </span>
                  </div>

                  {/* Lead Time */}
                  <div className="absolute bottom-3 left-3 text-[11px] text-white font-medium bg-stone-950/80 px-2.5 py-1 rounded-full border border-stone-700 backdrop-blur-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>Lead Time ~{product.leadTimeDays} Hari</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-2">
                  <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-amber-800 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>

                  {/* Variants */}
                  {product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {product.variants.map(v => (
                        <span key={v.id} className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {v.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleOpenDetails(product)}
                  className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Lihat Galeri Details"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <a
                  href={createWhatsAppCatalogLink('6281298765432', product.name, product.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
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
      <footer className="border-t border-stone-200 mt-20 py-10 bg-white text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900">PT InteriorCraft Studio Indonesia</span>
            <span>• Kawasan Industri Kreatif, BSD City</span>
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
          title={`Galeri & Spesifikasi: ${selectedProduct.name}`}
          maxWidth="max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-stone-900">
            {/* Left: Images */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 group">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {selectedProduct.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedProduct.images.length - 1))}
                      className="p-2 rounded-full bg-white/90 text-stone-900 border border-stone-200 hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev < selectedProduct.images.length - 1 ? prev + 1 : 0))}
                      className="p-2 rounded-full bg-white/90 text-stone-900 border border-stone-200 hover:bg-white"
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
                        activeImageIndex === idx ? 'border-amber-700 scale-105' : 'border-stone-200 opacity-60'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block">Kategori</span>
                  <span className="font-bold text-stone-900">{selectedProduct.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block">Lead Time Produksi</span>
                  <span className="font-bold text-stone-900">{selectedProduct.leadTimeDays} Hari Kerja</span>
                </div>
              </div>
            </div>

            {/* Right: Technical Specs */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-amber-800 px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 inline-block">
                  {selectedProduct.code}
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-950 leading-tight">{selectedProduct.name}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                {/* Variant selection */}
                {selectedProduct.variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-semibold text-stone-700 block">
                      Pilih Varian Finishing / Material:
                    </label>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setActiveVariant(variant)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                            activeVariant?.id === variant.id
                              ? 'bg-amber-50 border-amber-700 text-amber-900 font-bold'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
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

              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
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
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 shadow-md transition-all"
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
          title="Simulasi Estimasi Budget Custom Fitout Interior"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-stone-900">
            <p className="text-xs text-stone-600">
              Hitung gambaran kasar anggaran biaya custom furniture berdasarkan ukuran ruangan Anda:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Jenis Proyek</label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-700"
                >
                  <option value="Kitchen Set">Kitchen Set</option>
                  <option value="Wardrobe">Wardrobe Walk-in Closet</option>
                  <option value="Wall Panel">Wall Panel & Backdrop TV</option>
                  <option value="Bedroom">Bed Frame & Nightstand</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Finishing Material</label>
                <select
                  value={estFinish}
                  onChange={(e) => setEstFinish(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-700"
                >
                  <option value="HPL Taco Wood Grain">HPL Taco Standard</option>
                  <option value="Duco Matte Paint">Cat Duco Premium</option>
                  <option value="Veneer Jati Natural">Veneer Kayu Jati Genuine</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Panjang Ruangan (Meter)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={estLength}
                  onChange={(e) => setEstLength(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Tinggi Kabinet (Meter)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={estHeight}
                  onChange={(e) => setEstHeight(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>

            {/* Calculated Result Box */}
            {(() => {
              const { minEst, maxEst } = calculateEstimatedPriceRange();
              return (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1 shadow-sm">
                  <span className="text-xs text-amber-900 font-semibold block">Estimasi Biaya Indikatif:</span>
                  <div className="text-2xl font-serif font-bold text-stone-950">
                    {formatRupiah(minEst)} - {formatRupiah(maxEst)}
                  </div>
                  <p className="text-[10px] text-stone-500">
                    *Termasuk multiplek 18mm, engsel soft-close, delivery & instalasi lokasi.
                  </p>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEstimatorOpen(false)}
                className="px-4 py-2 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/6281298765432?text=${encodeURIComponent(`Halo InteriorCraft Studio, saya telah mencoba kalkulator estimasi untuk *${estCategory}* ukuran ${estLength}m x ${estHeight}m dengan finishing ${estFinish}. Mohon konsultasi survei lokasi!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
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
