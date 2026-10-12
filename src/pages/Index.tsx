import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, ExternalLink, Sparkles } from "lucide-react";
import UserHeader from "@/components/layout/UserHeader";
import UserFooter from "@/components/layout/UserFooter";
import { useCart } from "@/context/CartContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { getCategories, getProducts, API_BASE_URL } from "@/lib/api";
import { Category, Product } from "@/data/products";
import { cn } from "@/lib/utils";
import companyLogo from "@/assets/logo.png";
import pblMainBanner from "@/assets/pbl-main-banner.jpg";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import dayCrackersImg from "@/assets/daycrackers.png";
import giftBoxCrackersImg from "@/assets/giftboxcrackers.png";
import kidsCrackersImg from "@/assets/kidscrackers.png";
import nightCrackersImg from "@/assets/nightcrackers.png";
import comboPacksImg from "@/assets/combo-packs.png";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Fireworks } from '@fireworks-js/react';

// Fallback Default Categories if none in database
const defaultCategories = [
  { name: "Kids", image: kidsCrackersImg },
  { name: "Day Crackers", image: dayCrackersImg },
  { name: "Night Crackers", image: nightCrackersImg },
  { name: "Gift Box", image: giftBoxCrackersImg },
];

// Cracker Types
const crackerTypes = [
  { name: "Kids", image: kidsCrackersImg, link: "/catalog?category=Kids" },
  { name: "Day Crackers", image: dayCrackersImg, link: "/catalog?category=Day%20Crackers" },
  { name: "Night Crackers", image: nightCrackersImg, link: "/catalog?category=Night%20Crackers" },
  { name: "Gift Box", image: giftBoxCrackersImg, link: "/catalog?category=Gift%20Box" },
];

const getMediaEmbedUrl = (rawUrl: string): { type: 'instagram' | 'youtube' | 'direct'; embedUrl: string; isVertical?: boolean } | null => {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();

  // 1. YouTube Shorts or Video
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (ytShortsMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytShortsMatch[1]}?autoplay=0&rel=0`,
      isVertical: true
    };
  }

  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      isVertical: false
    };
  }

  // 2. Instagram Reel / Post / TV
  const igMatch = url.match(/instagram\.com\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch) {
    const type = igMatch[1].toLowerCase().startsWith('reel') ? 'reel' : igMatch[1].toLowerCase();
    const id = igMatch[2];
    return {
      type: 'instagram',
      embedUrl: `https://www.instagram.com/${type}/${id}/embed/`,
      isVertical: true
    };
  }

  if (url.includes('instagram.com/')) {
    const clean = url.split('?')[0].replace(/\/$/, '');
    return {
      type: 'instagram',
      embedUrl: `${clean}/embed/`,
      isVertical: true
    };
  }

  // 3. Direct video (.mp4, .webm)
  if (url.match(/\.(mp4|webm|ogg)($|\?)/i)) {
    return {
      type: 'direct',
      embedUrl: url,
      isVertical: false
    };
  }

  return {
    type: 'instagram',
    embedUrl: url,
    isVertical: true
  };
};

const Index = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [isMobileView, setIsMobileView] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productChunkIndex, setProductChunkIndex] = useState(0);
  const [isChunkFading, setIsChunkFading] = useState(false);

  // Fetch all products for the 4-in-a-line flash showcase
  useEffect(() => {
    getProducts()
      .then((prods) => {
        if (Array.isArray(prods) && prods.length > 0) {
          const withImages = prods.filter(p => p.image && !p.image.includes('placeholder'));
          setProducts(withImages.length > 0 ? withImages : prods);
        }
      })
      .catch((err) => {
        console.error("Failed to load products for showcase in Index:", err);
      });
  }, []);

  // Split products into groups of 4 for the 1-second auto-transition row
  const productChunks = useMemo(() => {
    if (!products || products.length === 0) return [];
    const chunkSize = 4;
    const chunks: Product[][] = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      chunks.push(products.slice(i, i + chunkSize));
    }
    return chunks;
  }, [products]);

  const currentProductChunk = productChunks[productChunkIndex] || [];

  // Auto transition every 3 seconds (3s display with smooth fade transition to next 4)
  useEffect(() => {
    if (productChunks.length <= 1) return;
    const timer = setInterval(() => {
      setIsChunkFading(true);
      setTimeout(() => {
        setProductChunkIndex((prev) => (prev + 1) % productChunks.length);
        setIsChunkFading(false);
      }, 350);
    }, 3000);

    return () => clearInterval(timer);
  }, [productChunks.length]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch admin-created categories from backend (with auto-refresh on window focus)
  const fetchActiveCategories = useCallback(() => {
    getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((c: any) => c.isActive !== false);
          active.sort((a: any, b: any) => {
            const codeA = parseInt(a.categoryCode || '', 10);
            const codeB = parseInt(b.categoryCode || '', 10);
            if (!isNaN(codeA) && !isNaN(codeB)) return codeA - codeB;
            return String(a.categoryCode || '').localeCompare(String(b.categoryCode || ''), undefined, { numeric: true });
          });
          setCategories(active);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories in Index:", err);
      })
      .finally(() => {
        setLoadingCats(false);
      });
  }, []);

  useEffect(() => {
    fetchActiveCategories();
    window.addEventListener('focus', fetchActiveCategories);
    return () => window.removeEventListener('focus', fetchActiveCategories);
  }, [fetchActiveCategories]);

  // Helper to resolve category image with fallbacks
  const getCategoryImage = (cat: Category | { name: string; image?: string }) => {
    if (cat.image && typeof cat.image === 'string' && cat.image.trim().length > 0 && !cat.image.includes('placeholder')) {
      const trimmed = cat.image.trim();
      if (trimmed.startsWith('/uploads')) {
        return `${API_BASE_URL}${trimmed}`;
      }
      return trimmed;
    }
    const n = (cat.name || '').toLowerCase();
    if (n.includes('kid') || n.includes('child')) return kidsCrackersImg;
    if (n.includes('sparkler')) return kidsCrackersImg;
    if (n.includes('pot') || n.includes('flower') || n.includes('day')) return dayCrackersImg;
    if (n.includes('chakkar') || n.includes('ground') || n.includes('night')) return nightCrackersImg;
    if (n.includes('gift') || n.includes('box')) return giftBoxCrackersImg;
    if (n.includes('sky') || n.includes('shot') || n.includes('rocket')) return giftBoxCrackersImg;
    if (n.includes('combo') || n.includes('pack')) return comboPacksImg;
    return dayCrackersImg;
  };

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // Running categories carousel (duplicated for continuous seamless left-to-right slow motion)
  const runnerCategories = useMemo(() => {
    const base = displayCategories.length > 0 ? displayCategories : defaultCategories;
    let list = [...base];
    while (list.length < 12) {
      list = [...list, ...base];
    }
    return [...list, ...list];
  }, [displayCategories]);

  // Hero image slideshow (starts with custom PBL banner on website open, auto slides every 3 seconds)
  const heroImages = useMemo(() => {
    if (settings?.heroBanners && settings.heroBanners.length > 0) {
      return settings.heroBanners.includes(pblMainBanner)
        ? settings.heroBanners
        : [pblMainBanner, ...settings.heroBanners];
    }
    return [pblMainBanner, banner1, banner2];
  }, [settings?.heroBanners]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Auto-advance hero slides every 3 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      setSlideKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next slide
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        setSlideKey((k) => k + 1);
      } else {
        // Swiped right -> prev slide
        setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
        setSlideKey((k) => k + 1);
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF2] relative font-sans text-[#1F2937]">
      <UserHeader />

      {/* Hero Section - Responsive Aspect Ratio (1024/408) for pixel-perfect mobile and desktop fit */}
      <section className="bg-[#FFFDF2] pt-2 sm:pt-4 md:pt-5 pb-2 sm:pb-3 md:pb-[20px] select-none overflow-hidden">
        <div className="container mx-auto px-2 sm:px-3 lg:px-4 max-w-[1600px]">
          {/* Main Carousel (Maintains exact 1024/408 banner ratio, 0% crop on mobile & desktop) */}
          <div 
            className="relative w-full aspect-[1024/408] overflow-hidden bg-black group rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Full Width & Height Banner Image */}
            <div key={slideKey} className="absolute inset-0 w-full h-full animate-slide-left">
              <img
                src={
                  heroImages[currentSlide]?.startsWith('/uploads')
                    ? `${API_BASE_URL}${heroImages[currentSlide]}`
                    : heroImages[currentSlide]
                }
                alt={`PBL Crackers Banner ${currentSlide + 1}`}
                className="w-full h-full object-cover filter brightness-105 transition-all duration-500"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none z-10" />

            {/* Left Arrow Navigation */}
            <button
              onClick={() => {
                setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
                setSlideKey((k) => k + 1);
              }}
              className="absolute left-1.5 sm:left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-[#2563EB] text-white backdrop-blur-md border border-white/20 transition-all shadow-md hover:scale-110 opacity-70 group-hover:opacity-100 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            {/* Right Arrow Navigation */}
            <button
              onClick={() => {
                setCurrentSlide((prev) => (prev + 1) % heroImages.length);
                setSlideKey((k) => k + 1);
              }}
              className="absolute right-1.5 sm:right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-[#2563EB] text-white backdrop-blur-md border border-white/20 transition-all shadow-md hover:scale-110 opacity-70 group-hover:opacity-100 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-0 right-0 z-30 flex justify-center items-center gap-1.5 sm:gap-2.5">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setSlideKey((k) => k + 1);
                  }}
                  className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx 
                      ? "bg-[#FFD400] w-5 sm:w-8 shadow-md shadow-yellow-500/50" 
                      : "bg-white/60 w-1.5 sm:w-2.5 hover:bg-white"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supreme Court Order Disclaimer Marquee
      <div className="bg-red-600 text-white py-2 overflow-hidden flex items-center relative z-20">
        <div className="animate-marquee whitespace-nowrap text-sm md:text-base font-semibold tracking-wide flex items-center gap-4">
          <span>⚠️ As per the 2018 Supreme Court order, online sale of firecrackers is strictly prohibited. This website is intended for inquiry and catalog browsing purposes only. We process orders through official offline channels only. ⚠️</span>
          <span>⚠️ As per the 2018 Supreme Court order, online sale of firecrackers is strictly prohibited. This website is intended for inquiry and catalog browsing purposes only. We process orders through official offline channels only. ⚠️</span>
          <span>⚠️ As per the 2018 Supreme Court order, online sale of firecrackers is strictly prohibited. This website is intended for inquiry and catalog browsing purposes only. We process orders through official offline channels only. ⚠️</span>
        </div>
      </div> */}



      {/* Background Fireworks Canvas */}
      <Fireworks
        options={{
          rocketsPoint: { min: 0, max: 100 },
          hue: { min: 0, max: 360 },
          // Increased sky shots frequency and intensity for double sky cracker effect
          delay: isMobileView ? { min: 60, max: 90 } : { min: 50, max: 100 },

          acceleration: 1.05,
          friction: 0.97,
          gravity: 1.5,
          particles: isMobileView ? 25 : 45,
          traceLength: 3,
          traceSpeed: isMobileView ? 4 : 8,
          explosion: isMobileView ? 3 : 5,
          intensity: isMobileView ? 12 : 20, // Adjusted intensity for double cracker effect without being too crowded
          flickering: 50,
          lineStyle: 'round',
          lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
          brightness: { min: 50, max: 80 },
          decay: { min: 0.015, max: 0.03 },
          mouse: { click: false, move: false, max: 1 }
        }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
          background: 'transparent',
          zIndex: 40,
          pointerEvents: 'none',
          opacity: 0.5
        }}
      />

      {/* Shop by Category Section - Running Left to Right Continuous Carousel */}
      <section className="py-8 sm:py-16 bg-[#FFFDF2] border-b border-amber-200/40 select-none overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-extrabold text-[#1F2937] text-2xl sm:text-4xl md:text-5xl tracking-tight font-display">
              Shop by Category
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-[#2563EB] mx-auto mt-2.5 sm:mt-3.5 rounded-full" />
          </div>
        </div>

        {/* Continuous Running Marquee (Slow Motion, Right to Left) */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Subtle edge gradient overlays for smooth fade effect */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-[#FFFDF2] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-[#FFFDF2] to-transparent z-10" />

          <div className="animate-category-running-rtl flex gap-4 sm:gap-6 items-center">
            {runnerCategories.map((cat, idx) => {
              const catImg = getCategoryImage(cat);
              const catName = cat.name;
              const isDefaultShopNowAsset =
                catImg === kidsCrackersImg ||
                catImg === dayCrackersImg ||
                catImg === nightCrackersImg ||
                catImg === giftBoxCrackersImg;

              return (
                <div
                  key={`cat-run-${idx}`}
                  onClick={() => navigate(`/catalog?category=${encodeURIComponent(catName)}`)}
                  className="group cursor-pointer flex flex-col items-center shrink-0 w-36 sm:w-48 md:w-56"
                  title={`View ${catName}`}
                >
                  <div className="relative w-full aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-amber-200/70 bg-amber-50/40 transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#2563EB] group-hover:-translate-y-1.5">
                    <img
                      src={catImg}
                      alt={catName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = dayCrackersImg;
                      }}
                    />

                    {/* Show SHOP NOW badge for custom category images */}
                    {!isDefaultShopNowAsset && (
                      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 z-10 pointer-events-none">
                        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-[9px] sm:text-xs uppercase px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-lg border border-yellow-400/50 flex items-center gap-1">
                          <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300" />
                          <span>SHOP NOW</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-[#1F2937] text-center mt-2.5 sm:mt-3.5 tracking-tight transition-colors duration-200 group-hover:text-[#2563EB] truncate max-w-full px-1">
                    {catName}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Types Section */}
      <section className="py-8 sm:py-16 bg-[#FFFDF2] border-b border-amber-200/40 select-none">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="font-extrabold text-[#1F2937] text-2xl sm:text-4xl md:text-5xl tracking-tight font-display">
              Types
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-[#2563EB] mx-auto mt-2.5 sm:mt-3.5 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8 justify-center">
            {crackerTypes.map((item, idx) => {
              const isDefaultSquareAsset = item.image === kidsCrackersImg || item.image === dayCrackersImg || item.image === nightCrackersImg || item.image === giftBoxCrackersImg;

              return (
                <div
                  key={`type-${idx}`}
                  onClick={() => navigate(item.link)}
                  className="group cursor-pointer flex flex-col items-center"
                  title={`View ${item.name}`}
                >
                  <div className="relative w-full aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-amber-200/70 bg-amber-50/40 transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#2563EB] group-hover:-translate-y-1.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Show SHOP NOW badge for items like Combo Packs */}
                    {!isDefaultSquareAsset && (
                      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 z-10 pointer-events-none">
                        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-[9px] sm:text-xs uppercase px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-lg border border-yellow-400/50 flex items-center gap-1">
                          <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300" />
                          <span>SHOP NOW</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-lg md:text-xl text-[#1F2937] text-center mt-2.5 sm:mt-4 tracking-tight transition-colors duration-200 group-hover:text-[#2563EB]">
                    {item.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Offer Banner below Types Section */}
      <section className="py-6 sm:py-10 bg-[#FFFDF2]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-amber-200/60 hover:shadow-xl transition-shadow duration-300">
            <img src={banner2} alt="PBL Crackers Special Offer" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Featured Products Flash Showcase (Auto-cycles 4 products in one line every 1 second) */}
      {currentProductChunk.length > 0 && (
        <section className="py-8 sm:py-12 bg-[#FFFDF2] border-t border-amber-200/40 select-none">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-left">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-[11px] font-black uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Featured Collection</span>
                </div>
                <h2 className="font-extrabold text-[#1F2937] text-2xl sm:text-3xl md:text-4xl tracking-tight font-display">
                  Explore Our Products
                </h2>
              </div>
              <button
                onClick={() => navigate('/catalog')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 px-4 py-2 rounded-full transition-all cursor-pointer"
              >
                <span>View All Products</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 4 products in 1 line with smooth 1-second auto cycle transition */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 transition-all duration-300 ease-in-out ${isChunkFading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
              {currentProductChunk.map((prod, idx) => {
                const prodImg = prod.image && typeof prod.image === 'string' && prod.image.trim().length > 0
                  ? (prod.image.startsWith('/uploads') ? `${API_BASE_URL}${prod.image}` : prod.image)
                  : companyLogo;

                return (
                  <div
                    key={`flash-prod-${prod._id || prod.id || idx}-${productChunkIndex}`}
                    onClick={() => navigate('/catalog')}
                    className="group cursor-pointer bg-white rounded-2xl p-3 border border-amber-200/70 shadow-xs hover:shadow-xl hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
                    title={`View ${prod.name}`}
                  >
                    <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#FDFBF7] border border-amber-100/60 p-2 flex items-center justify-center mb-2.5">
                      <img
                        src={prodImg}
                        alt={prod.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = companyLogo;
                        }}
                      />
                      {prod.hasDiscount && (
                        <div className="absolute top-1.5 left-1.5 pointer-events-none">
                          <span className="bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs uppercase">
                            Offer
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-extrabold text-xs sm:text-sm md:text-base text-gray-900 line-clamp-1 group-hover:text-[#2563EB] transition-colors w-full px-1">
                      {prod.name}
                    </h3>
                    {prod.price && (
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="font-display font-black text-xs sm:text-sm text-[#2563EB]">
                          ₹{prod.price}
                        </span>
                        {prod.quantity && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            ({prod.quantity})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Promotional Videos Section (Instagram / YouTube) */}
      {(() => {
        const rawVideos = (settings?.instagramVideos && settings.instagramVideos.length > 0)
          ? settings.instagramVideos
          : (settings?.youtubeVideos && settings.youtubeVideos.length > 0 ? settings.youtubeVideos : []);
        const validVideos = rawVideos.filter(v => v && v.url && v.url.trim().length > 0);
        if (validVideos.length === 0) return null;

        return (
          <section className="py-8 sm:py-12 bg-[#FFFDF2] border-t border-amber-200/40">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-5 sm:mb-8">
                <h2 className="font-extrabold text-[#1F2937] text-xl sm:text-3xl md:text-4xl tracking-tight font-display">
                  Watch Our Highlights
                </h2>
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#2563EB] via-[#dc2743] to-[#FFD400] mx-auto mt-2 rounded-full" />
                <p className="text-gray-600 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
                  Watch our latest firework demonstrations, celebration reels, and festive moments from PBL Crackers!
                </p>
              </div>

              {(() => {
                // Video card renderer
                const renderCard = (video: any, cardKey: string | number, isTwoCol: boolean = false) => {
                  const media = getMediaEmbedUrl(video.url);
                  if (!media) return null;
                  const isVertical = media.isVertical ?? true;

                  return (
                    <div
                      key={cardKey}
                      className={`bg-white rounded-2xl ${isTwoCol ? 'p-2 sm:p-3' : 'p-2.5 sm:p-3'} shadow-md hover:shadow-xl border border-pink-100 flex flex-col transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full ${isTwoCol ? 'max-w-full' : 'max-w-[280px] sm:max-w-[290px]'} mx-auto`}
                    >
                      {video.title && (
                        <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2 px-0.5 sm:px-1">
                          <h4 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-sm line-clamp-1 flex items-center gap-1 sm:gap-1.5">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 inline-block shrink-0"></span>
                            {video.title}
                          </h4>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] sm:text-[10px] font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-0.5 shrink-0"
                            title="Watch Video"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}

                      <div className={`relative w-full ${isVertical ? (isTwoCol ? 'aspect-[9/16] h-[250px] xs:h-[300px] sm:h-[380px] max-h-[410px]' : 'aspect-[9/16] h-[340px] sm:h-[390px] max-h-[410px]') : (isTwoCol ? 'aspect-video min-h-[120px] sm:min-h-[180px]' : 'aspect-video min-h-[150px] sm:min-h-[190px]')} bg-neutral-100 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center`}>
                        {media.type === 'direct' ? (
                          <video
                            src={media.embedUrl}
                            controls
                            playsInline
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <iframe
                            src={media.embedUrl}
                            className="absolute top-0 left-0 w-[154%] h-[154%] scale-[0.65] origin-top-left sm:w-full sm:h-full sm:scale-100 rounded-xl border-0 overflow-hidden"
                            frameBorder="0"
                            scrolling="no"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            title={video.title || "Promotional Video"}
                          />
                        )}
                      </div>
                    </div>
                  );
                };

                // Case 1: Exactly 1 video -> Single centered static card
                if (validVideos.length === 1) {
                  return (
                    <div className="grid grid-cols-1 max-w-[280px] sm:max-w-[290px] mx-auto justify-center">
                      {renderCard(validVideos[0], 'promo-single-0', false)}
                    </div>
                  );
                }

                // Case 2: Exactly 2 videos -> Static side-by-side in ONE LINE (never stacked vertically on mobile or desktop)
                if (validVideos.length === 2) {
                  return (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-6 max-w-[620px] mx-auto w-full px-1 sm:px-0 justify-center">
                      {validVideos.map((video, idx) => renderCard(video, `promo-two-${idx}`, true))}
                    </div>
                  );
                }

                // Case 3: More than 2 videos -> Continuous Right-to-Left Running Marquee (on both desktop and mobile view)
                const runnerVideos = (() => {
                  let list = [...validVideos];
                  while (list.length < 6) {
                    list = [...list, ...validVideos];
                  }
                  return [...list, ...list];
                })();

                return (
                  <div className="relative w-full overflow-hidden py-2 sm:py-3 select-none">
                    {/* Subtle edge gradient overlays */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-20 bg-gradient-to-r from-[#FFFDF2] to-transparent z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-20 bg-gradient-to-l from-[#FFFDF2] to-transparent z-10" />

                    <div className="animate-video-running-rtl flex gap-3.5 sm:gap-6 items-center">
                      {runnerVideos.map((video, idx) => (
                        <div key={`promo-runner-${idx}`} className="shrink-0 w-[220px] sm:w-[280px]">
                          {renderCard(video, `promo-runner-item-${idx}`, false)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        );
      })()}

      {/* Premium Quality Cards Section */}
      <section className="py-20 bg-[#FFFDF2]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Banner Card 1 */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E40AF] to-[#1D4ED8] p-8 text-white shadow-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-between min-h-[180px]">
              <div className="max-w-[60%] flex flex-col items-start gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#FFD400] bg-white/15 px-2.5 py-1 rounded">
                  Premium Quality
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide leading-tight">
                  Best Quality from Verified Manufacturers
                </h3>
              </div>
              <div className="relative border-4 border-[#FFD400] rounded-full bg-white flex flex-col items-center justify-center text-center w-24 h-24 shadow-[0_0_20px_rgba(255,212,0,0.3)] shrink-0 select-none overflow-hidden p-2">
                <img src={settings?.logo || companyLogo} alt="PBL Crackers" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Banner Card 2 */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1F2937] via-[#111827] to-[#0F172A] p-8 text-white shadow-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-between min-h-[180px]">
              <div className="max-w-[60%] flex flex-col items-start gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#FFD400] bg-white/10 px-2.5 py-1 rounded">
                  Trusted Partners
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide leading-tight">
                  We collab with Top Partners from Sivakasi
                </h3>
              </div>
              <div className="relative border-4 border-[#FFD400] rounded-full bg-white flex flex-col items-center justify-center text-center w-24 h-24 shadow-[0_0_20px_rgba(255,212,0,0.3)] shrink-0 select-none overflow-hidden p-2">
                <img src={settings?.logo || companyLogo} alt="PBL Crackers" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Banner Card 3 */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFD400] to-[#E6BE00] p-8 text-[#1F2937] shadow-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-between min-h-[180px]">
              <div className="max-w-[60%] flex flex-col items-start gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-[#1F2937] bg-black/10 px-2.5 py-1 rounded font-bold">
                  Authentic Brands
                </span>
                <h3 className="text-lg font-black uppercase tracking-wide leading-tight text-[#1F2937]">
                  We are Selling Crackers from Authentic Brands
                </h3>
              </div>
              <div className="relative border-4 border-white rounded-full bg-white flex flex-col items-center justify-center text-center w-24 h-24 shadow-lg shrink-0 select-none overflow-hidden p-2">
                <img src={settings?.logo || companyLogo} alt="PBL Crackers" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <UserFooter />
    </div>
  );
};

export default Index;
