import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductVariant } from '../types';
import { createWhatsAppCatalogLink, formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import {
  Search,
  Clock,
  Calculator,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';

// Genuine WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.22-1.107zm10.741-6.732c-.301-.15-1.784-.881-2.06-.982-.275-.1-.476-.15-.676.15-.2.3-.776.982-.951 1.182-.175.2-.351.225-.652.075-1.921-.963-3.183-1.722-4.444-3.882-.334-.572.334-.53.956-1.772.1-.2.05-.375-.025-.525-.075-.15-.676-1.627-.926-2.226-.243-.583-.49-.504-.676-.513-.175-.008-.376-.008-.576-.008-.2 0-.526.075-.802.375-.275.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.907 1.227 3.107.15.2 2.119 3.236 5.134 4.54.718.311 1.278.498 1.714.636.721.23 1.378.197 1.898.12.578-.087 1.784-.729 2.034-1.431.25-.702.25-1.303.175-1.43-.075-.128-.275-.228-.576-.378z"/>
  </svg>
);

export const PublicCatalogView: React.FC = () => {
  const { products } = useApp();
  const [lang, setLang] = useState<'id' | 'en'>('id');
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

  const categories = lang === 'id'
    ? ['Semua', 'Kitchen Set', 'Wardrobe', 'Bedroom', 'Living Room', 'Wall Panel', 'Office']
    : ['All', 'Kitchen Set', 'Wardrobe', 'Bedroom', 'Living Room', 'Wall Panel', 'Office'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Semua' || selectedCategory === 'All' || p.category === selectedCategory;
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

  const scrollToAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setActiveVariant(product.variants.length > 0 ? product.variants[0] : null);
  };

  // Synchronized Selection Handlers (Variant <-> Image 2-Way Sync)
  const handleSelectVariant = (variant: ProductVariant, index: number) => {
    setActiveVariant(variant);
    if (selectedProduct && selectedProduct.images[index]) {
      setActiveImageIndex(index);
    }
  };

  const handleSelectImage = (index: number) => {
    setActiveImageIndex(index);
    if (selectedProduct && selectedProduct.variants[index]) {
      setActiveVariant(selectedProduct.variants[index]);
    }
  };

  const calculateEstimatedPriceRange = () => {
    let ratePerMeter = 2800000;
    if (estCategory === 'Wardrobe') ratePerMeter = 3200000;
    if (estCategory === 'Wall Panel') ratePerMeter = 1800000;
    if (estCategory === 'Bedroom') ratePerMeter = 2500000;
    if (estFinish.includes('Veneer Jati')) ratePerMeter += 800000;
    if (estFinish.includes('Duco')) ratePerMeter += 500000;

    const baseEst = estLength * ratePerMeter;
    const minEst = Math.round(baseEst * 0.9);
    const maxEst = Math.round(baseEst * 1.15);
    return { minEst, maxEst, ratePerMeter };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-100 font-sans selection:bg-stone-100 selection:text-stone-950">
      {/* HEADER WITH LANGUAGE SWITCHER (ID 🇮🇩 / EN 🇬🇧) */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-stone-900 px-6 sm:px-12 lg:px-16 py-5 transition-all">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-bold text-white text-xl sm:text-2xl lg:text-3xl tracking-widest uppercase">
              INTERIORCRAFT <span className="font-light text-stone-400 text-xs lg:text-sm tracking-normal">STUDIO</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-xs lg:text-sm font-semibold tracking-wider text-stone-300 uppercase">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
              {lang === 'id' ? 'BERANDA' : 'HOME'}
            </button>
            <button onClick={scrollToAbout} className="hover:text-white transition-colors">
              {lang === 'id' ? 'TENTANG KAMI' : 'ABOUT US'}
            </button>
            <button onClick={scrollToGallery} className="hover:text-white transition-colors">
              {lang === 'id' ? 'GALERI PROYEK' : 'PROJECT GALLERY'}
            </button>
            <button onClick={() => setIsEstimatorOpen(true)} className="hover:text-white transition-colors">
              {lang === 'id' ? 'SIMULASI BUDGET' : 'BUDGET ESTIMATOR'}
            </button>

            {/* BILINGUAL LANGUAGE SWITCHER */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-[11px] font-mono">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              <button
                onClick={() => setLang('id')}
                className={`transition-colors ${lang === 'id' ? 'text-amber-300 font-bold' : 'text-stone-500 hover:text-stone-300'}`}
              >
                ID
              </button>
              <span className="text-stone-700">|</span>
              <button
                onClick={() => setLang('en')}
                className={`transition-colors ${lang === 'en' ? 'text-amber-300 font-bold' : 'text-stone-500 hover:text-stone-300'}`}
              >
                EN
              </button>
            </div>

            <a
              href="https://wa.me/6281298765432?text=Halo%20InteriorCraft%20Studio%2C%20saya%20tertarik%20konsultasi%20desain%20interior."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-bold"
            >
              <WhatsAppIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{lang === 'id' ? 'TANYA WA' : 'INQUIRE WA'}</span>
            </a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION: FLUID AUTO-SCALING MONUMENTAL CANVAS */}
      <section className="relative h-screen min-h-[650px] w-full flex items-center justify-center overflow-hidden pt-16">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2400&auto=format&fit=crop&q=90"
          alt="Architectural Masterpiece Canvas"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.05] scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-[#050505]/60" />

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 w-full text-left space-y-6 lg:space-y-8">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl 2xl:text-9xl font-sans font-extrabold text-white tracking-tight leading-[1.05] max-w-6xl">
            {lang === 'id' ? (
              <>Desain Interior & <br /><span className="text-amber-200">Fitout Custom Mewah</span></>
            ) : (
              <>Bespoke Interior & <br /><span className="text-amber-200">Architectural Fitouts</span></>
            )}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base lg:text-xl max-w-2xl font-light leading-relaxed">
            {lang === 'id'
              ? 'Koleksi portofolio eksklusif kitchen set modular, custom wardrobe, & backdrop wall panel. Konsultasikan konsep & penawaran harga presisi langsung via WhatsApp.'
              : 'Curated portfolio of modular kitchen sets, custom walk-in closets, & wall backdrops. Consult your vision & get precise estimates via WhatsApp.'
            }
          </p>

          <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-4">
            <button
              onClick={scrollToGallery}
              className="px-8 lg:px-10 py-3.5 lg:py-4 border border-white text-white font-semibold text-xs lg:text-sm uppercase tracking-widest hover:bg-white hover:text-stone-950 transition-all rounded-full"
            >
              {lang === 'id' ? 'Jelajahi Galeri' : 'Explore Gallery'}
            </button>
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="px-8 lg:px-10 py-3.5 lg:py-4 border border-stone-700 text-stone-300 font-semibold text-xs lg:text-sm uppercase tracking-widest hover:border-white hover:text-white transition-all rounded-full"
            >
              {lang === 'id' ? 'Simulasi Budget' : 'Budget Estimator'}
            </button>
          </div>
        </div>
      </section>

      {/* STUDIO MANIFESTO SECTION */}
      <section className="py-20 lg:py-28 px-6 sm:px-12 lg:px-16 bg-[#0A0908] border-y border-stone-900">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-4 flex items-center justify-center lg:justify-start">
            <span className="text-9xl lg:text-[14rem] font-extrabold text-stone-800 tracking-tighter select-none leading-none">
              IC
            </span>
          </div>

          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight leading-snug">
              {lang === 'id'
                ? 'InteriorCraft Studio Adalah Kolektif Pengrajin, Arsitek, & Desainer Interior yang Berkomitmen Mewujudkan Ruangan Presisi Tanpa Kompromi.'
                : 'InteriorCraft Studio is a Collective of Craftsmen, Architects, and Interior Designers Committed to Transforming Vision Into Precise Spaces.'
              }
            </h2>
            <p className="text-stone-400 text-sm lg:text-lg leading-relaxed font-light max-w-4xl">
              {lang === 'id'
                ? 'Berpengalaman mengerjakan fitout residensial, apartemen mewah, & perkantoran. Kami menggunakan kayu multiplek 18mm grade A, engsel soft-close Hafele, dan finishing HPL Taco / Cat Duco berkualitas tinggi dengan garansi resmi 2 tahun.'
                : 'Over 12 years of experience crafting luxury residential, apartment, and corporate office fitouts. We utilize 18mm grade-A plywood, Hafele soft-close hardware, and premium Taco HPL / Duco finishes with an official 2-year warranty.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* CLEAN ARCHITECTURAL STUDIO EDITORIAL ABOUT US SECTION (ZERO CHEESY ICON BOXES) */}
      <section id="about-section" className="py-24 lg:py-32 px-6 sm:px-12 lg:px-16 bg-[#050505] border-b border-stone-900">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Title & Heritage */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs lg:text-sm font-mono uppercase tracking-widest text-amber-300 block">
              {lang === 'id' ? 'TENTANG KAMI & METODOLOGI STUDI' : 'ABOUT US & STUDIO METHODOLOGY'}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              {lang === 'id' ? 'Seni Presisi & Pengolahan Material Berkelanjutan' : 'The Art of Precision & Sustainable Crafts'}
            </h2>
            <p className="text-stone-400 text-sm lg:text-base font-light leading-relaxed">
              {lang === 'id'
                ? 'Didirikan di Jakarta Selatan, InteriorCraft Studio menggabungkan keahlian pertukangan kayu tradisional dengan teknologi manufaktur presisi modern untuk melahirkan karya interior yang abadi.'
                : 'Founded in South Jakarta, InteriorCraft Studio fuses traditional woodworking heritage with modern engineering to craft timeless interior masterpieces.'
              }
            </p>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-8 text-stone-300 text-sm lg:text-lg font-light leading-relaxed">
            <p>
              {lang === 'id'
                ? 'Setiap proyek yang kami kerjakan didasari oleh pemahaman mendalam atas proporsi ruangan, pencahayaan alami, dan fungsi ergonomis. Kami tidak sekadar memproduksi lemari atau kabinet, melainkan membentuk pengalaman hidup di dalam ruangan.'
                : 'Every project we undertake is grounded in a deep understanding of room proportions, natural illumination, and ergonomic utility. We build living experiences.'
              }
            </p>

            <div className="border-l-2 border-amber-300/80 pl-6 py-2 space-y-2 text-stone-200 italic font-serif">
              <p>
                {lang === 'id'
                  ? '"Konstruksi kokoh dengan multiplek 18mm grade A, mekanisme engsel Hafele soft-close, dan finishing Taco HPL dengan jaminan garansi resmi 2 tahun."'
                  : '"Robust construction with 18mm grade-A plywood, Hafele soft-close hardware, and Taco HPL finishes backed by an official 2-year warranty."'
                }
              </p>
            </div>

            <p>
              {lang === 'id'
                ? 'Seluruh proses manufaktur dilakukan secara independen di workshop pribadi kami untuk menjamin kendali mutu penuh mulai dari pemotongan presisi milimeter hingga pemasangan langsung di lokasi proyek.'
                : 'All manufacturing is conducted in-house at our private workshop to guarantee complete quality control from millimeter-accurate cutting to final site installation.'
              }
            </p>

            {/* Studio Statistical Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-stone-900 pt-8 text-left">
              <div className="space-y-1">
                <span className="text-3xl lg:text-5xl font-extrabold text-white">12+</span>
                <p className="text-[11px] text-stone-400 font-mono uppercase tracking-wider">
                  {lang === 'id' ? 'Tahun Berdiri' : 'Years Established'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl lg:text-5xl font-extrabold text-amber-300">450+</span>
                <p className="text-[11px] text-stone-400 font-mono uppercase tracking-wider">
                  {lang === 'id' ? 'Proyek Selesai' : 'Fitouts Completed'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl lg:text-5xl font-extrabold text-emerald-400">18mm</span>
                <p className="text-[11px] text-stone-400 font-mono uppercase tracking-wider">
                  {lang === 'id' ? 'Multiplek Grade A' : 'Plywood Grade A'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-3xl lg:text-5xl font-extrabold text-white">24m</span>
                <p className="text-[11px] text-stone-400 font-mono uppercase tracking-wider">
                  {lang === 'id' ? 'Garansi Servis' : 'Full Warranty'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE MARQUEE SLIDERS */}
      <section className="py-8 bg-[#050505] overflow-hidden space-y-6">
        {/* ROW 1 */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee-left gap-4 lg:gap-6">
            {marqueeRow1.map((product, idx) => (
              <div
                key={`row1-${product.id}-${idx}`}
                onClick={() => handleOpenDetails(product)}
                className="relative w-80 sm:w-96 lg:w-[28rem] aspect-[16/10] shrink-0 rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer group bg-stone-950 border border-stone-900 shadow-xl"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 lg:p-8">
                  <span className="text-[10px] lg:text-xs font-mono text-amber-300 tracking-widest uppercase">
                    {product.category}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg lg:text-xl font-bold text-white line-clamp-1">{product.name}</h3>
                    <p className="text-xs lg:text-sm text-stone-300 font-light line-clamp-1">{product.description}</p>
                    <div className="pt-2 flex items-center gap-2 text-xs lg:text-sm font-bold text-emerald-400">
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>{lang === 'id' ? 'Tanya Harga WA' : 'Inquire Price WA'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee-right gap-4 lg:gap-6">
            {marqueeRow2.map((product, idx) => (
              <div
                key={`row2-${product.id}-${idx}`}
                onClick={() => handleOpenDetails(product)}
                className="relative w-80 sm:w-96 lg:w-[28rem] aspect-[16/10] shrink-0 rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer group bg-stone-950 border border-stone-900 shadow-xl"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 lg:p-8">
                  <span className="text-[10px] lg:text-xs font-mono text-amber-300 tracking-widest uppercase">
                    {product.category}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg lg:text-xl font-bold text-white line-clamp-1">{product.name}</h3>
                    <p className="text-xs lg:text-sm text-stone-300 font-light line-clamp-1">{product.description}</p>
                    <div className="pt-2 flex items-center gap-2 text-xs lg:text-sm font-bold text-emerald-400">
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>{lang === 'id' ? 'Tanya Harga WA' : 'Inquire Price WA'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT GALLERY SECTION */}
      <main id="gallery-section" className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 py-24 lg:py-32 space-y-12 lg:space-y-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-stone-900 pb-8">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight">
              {lang === 'id' ? 'Galeri Portofolio Proyek' : 'Project Portfolio Gallery'}
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
              {lang === 'id'
                ? 'Kumpulan kurasi proyek arsitektur & fitout desain interior studio kami.'
                : 'A curated selection of architectural fitouts and bespoke interior design projects.'
              }
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-mono uppercase tracking-widest transition-all rounded-full ${
                    selectedCategory === cat
                      ? 'bg-white text-stone-950 font-bold shadow-md'
                      : 'text-stone-400 hover:text-white bg-stone-950 border border-stone-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative max-w-md lg:max-w-lg">
          <Search className="w-4 h-4 lg:w-5 lg:h-5 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'id' ? "Cari nama proyek interior..." : "Search project by name..."}
            className="w-full pl-11 lg:pl-12 pr-4 py-2.5 lg:py-3 bg-[#0A0908] border border-stone-800 rounded-full text-xs lg:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-500 transition-colors"
          />
        </div>

        {/* FLUID GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleOpenDetails(product)}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer group bg-stone-950 border border-stone-900/80 shadow-2xl transition-all duration-500"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover filter brightness-[0.9] group-hover:scale-108 group-hover:brightness-100 transition-all duration-700"
              />

              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 bg-stone-950/80 backdrop-blur-md border border-stone-800/80 text-[10px] lg:text-xs font-mono uppercase tracking-widest text-amber-300 rounded-full shadow-lg">
                  {product.category}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 lg:p-8 flex flex-col justify-end">
                <h3 className="font-extrabold text-white text-lg lg:text-2xl leading-snug line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-stone-300 text-xs lg:text-sm font-light line-clamp-2 mt-1 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[11px] lg:text-xs font-mono text-stone-400">
                    Lead time ~{product.leadTimeDays} {lang === 'id' ? 'hari' : 'days'}
                  </span>
                  <div className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs lg:text-sm flex items-center gap-1.5 transition-all shadow-xl">
                    <WhatsAppIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span>{lang === 'id' ? 'Tanya Harga WA' : 'Inquire WA'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RICH ARCHITECTURAL STUDIO FOOTER */}
      <footer className="border-t border-stone-900 bg-[#070605] pt-20 pb-12 text-stone-400 text-xs lg:text-sm">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Col 1: Studio Info */}
            <div className="lg:col-span-2 space-y-6">
              <span className="font-bold text-white text-2xl tracking-widest uppercase block">
                INTERIORCRAFT <span className="font-light text-stone-400 text-sm tracking-normal">STUDIO</span>
              </span>
              <p className="text-stone-400 text-xs lg:text-sm leading-relaxed font-light max-w-md">
                {lang === 'id'
                  ? 'Studio konsultan arsitektur & manufaktur furniture custom terpercaya di Indonesia. Menghadirkan karya interior berkualitas tinggi dengan ketelitian presisi milimeter.'
                  : 'Indonesia’s leading architectural interior consultant & custom furniture manufacturer. Delivering high-caliber interior masterpieces engineered with millimeter precision.'
                }
              </p>
              <div className="flex items-center gap-4 text-stone-300">
                <a href="#" className="p-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="p-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                {lang === 'id' ? 'NAVIGASI STUDIO' : 'STUDIO NAVIGATION'}
              </h4>
              <ul className="space-y-2.5 font-light">
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
                    {lang === 'id' ? 'Beranda Utama' : 'Main Home'}
                  </button>
                </li>
                <li>
                  <button onClick={scrollToAbout} className="hover:text-white transition-colors">
                    {lang === 'id' ? 'Tentang Kami & Metodologi' : 'About Us & Methodology'}
                  </button>
                </li>
                <li>
                  <button onClick={scrollToGallery} className="hover:text-white transition-colors">
                    {lang === 'id' ? 'Galeri Portofolio Proyek' : 'Project Portfolio'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsEstimatorOpen(true)} className="hover:text-white transition-colors">
                    {lang === 'id' ? 'Kalkulator Simulasi Budget' : 'Budget Estimator Calculator'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Specialized Services */}
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                {lang === 'id' ? 'SPESIALISASI LAYANAN' : 'SPECIALIZED SERVICES'}
              </h4>
              <ul className="space-y-2.5 font-light">
                <li className="hover:text-white transition-colors">Kitchen Set Modular & Island Table</li>
                <li className="hover:text-white transition-colors">Wardrobe Walk-in Closet Glass</li>
                <li className="hover:text-white transition-colors">Wall Panel WPC & TV Backdrop</li>
                <li className="hover:text-white transition-colors">Bed Frame Floating & Headboard</li>
                <li className="hover:text-white transition-colors">Fitout Komersial & Kantor Direksi</li>
              </ul>
            </div>

            {/* Col 4: Studio Contact & Location */}
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                {lang === 'id' ? 'KANTOR & WORKSHOP' : 'STUDIO & WORKSHOP'}
              </h4>
              <div className="space-y-3 font-light leading-relaxed">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>Jl. Interior Craftsman No. 88, Cilandak, Jakarta Selatan 12430</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+62 812-9876-5432 (WhatsApp)</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>info@interiorcraft.co.id</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
            <span>© 2026 PT InteriorCraft Studio Indonesia. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-stone-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          hideHeader={true}
          maxWidth="max-w-5xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-stone-100 pt-2">
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
                      onClick={() => handleSelectImage(activeImageIndex > 0 ? activeImageIndex - 1 : selectedProduct.images.length - 1)}
                      className="p-2 rounded-full bg-stone-950/80 text-white border border-stone-700 hover:bg-stone-900"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleSelectImage(activeImageIndex < selectedProduct.images.length - 1 ? activeImageIndex + 1 : 0)}
                      className="p-2 rounded-full bg-stone-950/80 text-white border border-stone-700 hover:bg-stone-900"
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
                      onClick={() => handleSelectImage(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-amber-400 scale-105 shadow-lg' : 'border-stone-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 block mb-1">
                    {lang === 'id' ? 'Koleksi' : 'Collection'} {selectedProduct.category}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                    {selectedProduct.name}
                  </h3>
                </div>

                <p className="text-xs lg:text-sm text-stone-300 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>

                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs lg:text-sm space-y-1">
                  <span className="text-stone-400 block">
                    {lang === 'id' ? 'Estimasi Waktu Pengerjaan (Lead Time):' : 'Estimated Lead Time:'}
                  </span>
                  <span className="font-bold text-amber-300">~{selectedProduct.leadTimeDays} {lang === 'id' ? 'Hari Kerja (Custom Fitout)' : 'Working Days (Bespoke)'}</span>
                </div>

                {selectedProduct.variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs lg:text-sm font-semibold text-stone-300 block">
                      {lang === 'id' ? 'Pilih Varian Finishing / Material:' : 'Select Finishing Variant:'}
                    </label>
                    <div className="space-y-2">
                      {selectedProduct.variants.map((variant, idx) => (
                        <button
                          key={variant.id}
                          onClick={() => handleSelectVariant(variant, idx)}
                          className={`w-full text-left p-3.5 rounded-xl text-xs lg:text-sm font-semibold border flex items-center justify-between transition-all ${
                            activeVariant?.id === variant.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <span>{variant.name}</span>
                          {activeVariant?.id === variant.id && (
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                              {lang === 'id' ? 'TERPILIH' : 'SELECTED'}
                            </span>
                          )}
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
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs lg:text-sm rounded-full flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>{lang === 'id' ? 'Konsultasi Harga & Spesifikasi via WA' : 'Inquire Price & Specs via WA'}</span>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ESTIMATOR MODAL */}
      {isEstimatorOpen && (
        <Modal
          isOpen={isEstimatorOpen}
          onClose={() => setIsEstimatorOpen(false)}
          title={lang === 'id' ? "Simulasi Estimasi Budget Custom Fitout" : "Custom Fitout Budget Estimator"}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-stone-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs lg:text-sm">
              <div className="space-y-1">
                <label className="block text-stone-400 font-semibold">
                  {lang === 'id' ? 'Jenis Proyek' : 'Project Type'}
                </label>
                <select
                  value={estCategory}
                  onChange={(e) => setEstCategory(e.target.value)}
                  className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white font-medium focus:outline-none focus:border-stone-500 transition-colors"
                >
                  <option value="Kitchen Set">Kitchen Set Modular</option>
                  <option value="Wardrobe">Wardrobe Walk-in Closet</option>
                  <option value="Wall Panel">Wall Panel & Backdrop TV</option>
                  <option value="Bedroom">Bed Frame & Nightstand</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-stone-400 font-semibold">
                  {lang === 'id' ? 'Finishing Material' : 'Finishing Material'}
                </label>
                <select
                  value={estFinish}
                  onChange={(e) => setEstFinish(e.target.value)}
                  className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white font-medium focus:outline-none focus:border-stone-500 transition-colors"
                >
                  <option value="HPL Taco Wood Grain">HPL Taco Standard</option>
                  <option value="Duco Matte Paint">Cat Duco Matte Premium</option>
                  <option value="Veneer Jati Natural">Veneer Kayu Jati Genuine</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-stone-400 font-semibold">
                  {lang === 'id' ? 'Panjang Ruangan (Meter)' : 'Room Length (Meters)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="20"
                  value={estLength}
                  onChange={(e) => setEstLength(Number(e.target.value))}
                  className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white font-medium focus:outline-none focus:border-stone-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-stone-400 font-semibold">
                  {lang === 'id' ? 'Tinggi Kabinet (Meter)' : 'Cabinet Height (Meters)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={estHeight}
                  onChange={(e) => setEstHeight(Number(e.target.value))}
                  className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white font-medium focus:outline-none focus:border-stone-500 transition-colors"
                />
              </div>
            </div>

            {(() => {
              const { minEst, maxEst } = calculateEstimatedPriceRange();
              return (
                <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block">
                    {lang === 'id' ? 'Perkiraan Anggaran Biaya Indikatif:' : 'Indicative Budget Estimate:'}
                  </span>

                  <div className="text-xl sm:text-3xl font-bold text-white tracking-wide">
                    {formatRupiah(minEst)} &nbsp;—&nbsp; {formatRupiah(maxEst)}
                  </div>

                  <p className="text-[11px] lg:text-xs text-stone-500 font-light">
                    {lang === 'id'
                      ? '*Termasuk kayu multiplek 18mm grade A, engsel soft-close Hafele, pengiriman & instalasi lokasi.'
                      : '*Includes 18mm grade-A plywood, Hafele soft-close hardware, delivery & site installation.'
                    }
                  </p>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEstimatorOpen(false)}
                className="px-5 py-2.5 rounded-full bg-stone-800 text-stone-300 text-xs lg:text-sm font-semibold hover:bg-stone-700 transition-colors"
              >
                {lang === 'id' ? 'Tutup' : 'Close'}
              </button>
              <a
                href={`https://wa.me/6281298765432?text=${encodeURIComponent(`Halo InteriorCraft Studio, saya telah mencoba kalkulator estimasi untuk *${estCategory}* ukuran ${estLength}m x ${estHeight}m dengan finishing ${estFinish}. Mohon konsultasi survei lokasi!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs lg:text-sm font-extrabold flex items-center gap-2 shadow-xl hover:scale-105"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>{lang === 'id' ? 'Konsultasi Hasil Estimasi via WA' : 'Inquire Estimate Result via WA'}</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
