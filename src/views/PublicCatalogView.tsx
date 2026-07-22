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
  Maximize2
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
    <div className="min-h-screen bg-[#050505] text-stone-100 font-sans selection:bg-stone-100 selection:text-stone-950">
      {/* ALIEN DC STYLE MINIMALIST MONOCHROMATIC HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-stone-900 px-6 sm:px-12 py-5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-serif font-extrabold text-white text-2xl tracking-widest uppercase">
              INTERIORCRAFT <span className="font-sans font-light text-stone-400 text-xs tracking-normal">STUDIO</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-stone-300 uppercase">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">HOME</button>
            <button onClick={scrollToGallery} className="hover:text-white transition-colors">PROJECT GALLERY</button>
            <button onClick={() => setIsEstimatorOpen(true)} className="hover:text-white transition-colors">SIMULASI BUDGET</button>
            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20tertarik%20konsultasi%20desain%20interior."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>TANYA WA</span>
            </a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION: ARCHITECTURAL MONUMENTAL CANVAS */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden pt-16">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&auto=format&fit=crop&q=85"
          alt="Architectural Masterpiece Canvas"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.05] scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-[#050505]/60" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 w-full text-left space-y-6">
          <h1 className="text-4xl sm:text-7xl font-sans font-bold text-white tracking-tight leading-[1.08] max-w-3xl">
            We Design Your <br />
            <span className="font-serif italic font-normal text-stone-200">Bespoke Spaces</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-xl font-light leading-relaxed">
            Koleksi lengkap portofolio desain interior, kitchen set modular, wardrobe custom, & wall panel. Konsultasikan harga presisi langsung via WhatsApp.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={scrollToGallery}
              className="px-8 py-3.5 border border-white text-white font-semibold text-xs uppercase tracking-widest hover:bg-white hover:text-stone-950 transition-all"
            >
              Explore Gallery
            </button>
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="px-8 py-3.5 border border-stone-700 text-stone-300 font-semibold text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all"
            >
              Simulasi Budget
            </button>
          </div>
        </div>
      </section>

      {/* STUDIO MANIFESTO / ABOUT STATEMENT SECTION */}
      <section className="py-20 px-6 sm:px-12 bg-[#0A0908] border-y border-stone-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex items-center justify-center">
            <span className="font-serif text-9xl font-bold text-stone-800 tracking-tighter select-none">
              IC
            </span>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight leading-snug">
              InteriorCraft Studio is a collective of Craftsmen, Architects, and Interior Designers Committed to Transforming Vision Into Precise Spaces.
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed font-light">
              Berpengalaman mengerjakan fitout residensial, apartemen mewah, & perkantoran. Kami menggunakan kayu multiplek 18mm grade A, engsel soft-close Hafele, dan finishing HPL Taco / Cat Duco berkualitas tinggi dengan garansi resmi 2 tahun.
            </p>
          </div>
        </div>
      </section>

      {/* INFINITE HORIZONTAL AUTOMATIC MARQUEE SLIDERS (PURE PHOTOGRAPHY ROWS, NO TEXT HEADERS) */}
      <section className="py-8 bg-[#050505] overflow-hidden space-y-4">
        {/* MARQUEE ROW 1: AUTOMATICALLY SCROLLING RIGHT TO LEFT */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee-left gap-2">
            {marqueeRow1.map((product, idx) => (
              <div
                key={`row1-${product.id}-${idx}`}
                onClick={() => handleOpenDetails(product)}
                className="relative w-80 sm:w-96 aspect-[16/10] shrink-0 overflow-hidden cursor-pointer group bg-stone-950 border border-stone-900"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <span className="text-[10px] font-mono text-amber-300 tracking-widest uppercase">
                    {product.category} • {product.code}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-white line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-stone-300 font-light line-clamp-1">{product.description}</p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tanya Harga WA</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MARQUEE ROW 2: AUTOMATICALLY SCROLLING LEFT TO RIGHT */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee-right gap-2">
            {marqueeRow2.map((product, idx) => (
              <div
                key={`row2-${product.id}-${idx}`}
                onClick={() => handleOpenDetails(product)}
                className="relative w-80 sm:w-96 aspect-[16/10] shrink-0 overflow-hidden cursor-pointer group bg-stone-950 border border-stone-900"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <span className="text-[10px] font-mono text-amber-300 tracking-widest uppercase">
                    {product.category} • {product.code}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-white line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-stone-300 font-light line-clamp-1">{product.description}</p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
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

      {/* PROJECT GALLERY FEED SECTION */}
      <main id="gallery-section" className="max-w-7xl mx-auto px-6 sm:px-12 py-20 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-stone-900 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              Project Gallery
            </h2>
            <p className="text-stone-400 text-xs font-light max-w-md">
              Kumpulan kurasi proyek interior dan custom furniture berdasarkan kategori ruang.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wider transition-all shrink-0 uppercase border ${
                    selectedCategory === cat
                      ? 'border-white bg-white text-stone-950 font-bold'
                      : 'border-stone-800 text-stone-400 hover:text-white hover:border-stone-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword or SKU code..."
            className="w-full pl-11 pr-4 py-3 bg-[#0A0908] border border-stone-800 rounded-none text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-500 transition-colors"
          />
        </div>

        {/* PHOTOGRAPHY GALLERY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleOpenDetails(product)}
              className="group cursor-pointer space-y-4"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-950 border border-stone-900">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[10px] font-mono text-stone-300">
                  {product.code}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200 block">
                  {product.category}
                </span>
                <h3 className="font-serif font-bold text-white text-lg group-hover:text-stone-300 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-stone-400 text-xs font-light line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500">
                    Lead time ~{product.leadTimeDays} days
                  </span>
                  <a
                    href={createWhatsAppCatalogLink('6281298765432', product.name, product.code)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire WA</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-900 py-12 bg-[#050505] text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif font-bold text-stone-300 tracking-wider">
            INTERIORCRAFT STUDIO INDONESIA
          </span>
          <span>© 2026 InteriorCraft Studio. All rights reserved.</span>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Project Showcase: ${selectedProduct.name}`}
          maxWidth="max-w-4xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-stone-100">
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[4/3] rounded-none overflow-hidden border border-stone-800 bg-stone-950 group">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {selectedProduct.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedProduct.images.length - 1))}
                      className="p-2 bg-stone-950/80 text-white border border-stone-700 hover:bg-stone-900"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev < selectedProduct.images.length - 1 ? prev + 1 : 0))}
                      className="p-2 bg-stone-950/80 text-white border border-stone-700 hover:bg-stone-900"
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
                      className={`w-20 h-16 border transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-white scale-105' : 'border-stone-800 opacity-60'
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
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
                  {selectedProduct.code} • {selectedProduct.category}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white leading-tight">{selectedProduct.name}</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                {selectedProduct.variants.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-semibold text-stone-300 block">
                      Select Material Variant:
                    </label>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setActiveVariant(variant)}
                          className={`w-full text-left p-3 text-xs font-medium border flex items-center justify-between transition-all ${
                            activeVariant?.id === variant.id
                              ? 'bg-stone-800 border-white text-white font-bold'
                              : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
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
                <a
                  href={createWhatsAppCatalogLink(
                    '6281298765432',
                    selectedProduct.name,
                    selectedProduct.code,
                    activeVariant?.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquire Price & Specs via WA</span>
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
          title="Custom Fitout Budget Estimator"
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-stone-100">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Project Type</label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-white"
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
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-white"
                >
                  <option value="HPL Taco Wood Grain">HPL Taco Standard</option>
                  <option value="Duco Matte Paint">Cat Duco Premium</option>
                  <option value="Veneer Jati Natural">Veneer Kayu Jati Genuine</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Room Length (Meters)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={estLength}
                  onChange={(e) => setEstLength(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-semibold">Cabinet Height (Meters)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={estHeight}
                  onChange={(e) => setEstHeight(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {(() => {
              const { minEst, maxEst } = calculateEstimatedPriceRange();
              return (
                <div className="p-5 bg-stone-950 border border-stone-800 text-center space-y-1">
                  <span className="text-xs text-stone-400 font-semibold block">Indicative Budget Estimate:</span>
                  <div className="text-2xl font-serif font-bold text-white">
                    {formatRupiah(minEst)} - {formatRupiah(maxEst)}
                  </div>
                  <p className="text-[10px] text-stone-500">
                    *Includes 18mm plywood, soft-close hardware, delivery & site installation.
                  </p>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEstimatorOpen(false)}
                className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
              >
                Close
              </button>
              <a
                href={`https://wa.me/6281298765432?text=${encodeURIComponent(`Halo InteriorCraft Studio, saya telah mencoba kalkulator estimasi untuk *${estCategory}* ukuran ${estLength}m x ${estHeight}m dengan finishing ${estFinish}. Mohon konsultasi survei lokasi!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire Result via WA</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
