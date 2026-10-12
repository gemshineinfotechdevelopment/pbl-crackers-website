import companyLogo from "@/assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, Heart, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface CatalogFilters {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  uniqueCategoryNames: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface UserHeaderProps {
  isHidden?: boolean;
  catalogFilters?: CatalogFilters;
}

const UserHeader: React.FC<UserHeaderProps> = ({ isHidden = false, catalogFilters }) => {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { settings } = useSiteSettings();
  const { isUserLoggedIn, userPhone, userName, openLoginModal, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    if (path === '/') {
      return currentPath === '/';
    }
    if (path === '/about-us') {
      return currentPath === '/about-us' || currentPath === '/about';
    }
    if (path === '/catalog') {
      return currentPath === '/catalog' || currentPath.startsWith('/product/');
    }
    if (path === '/chit-scheme') {
      return currentPath === '/chit-scheme';
    }
    return currentPath === path;
  };

  const getLinkClass = (path: string) => {
    const active = isActive(path);
    return active
      ? "text-[#2563EB] border-b-2 border-[#2563EB] pb-1 transition-colors font-extrabold"
      : "text-[#1F2937] hover:text-[#2563EB] pb-1 transition-colors font-bold";
  };

  const getMobileLinkClass = (path: string) => {
    const active = isActive(path);
    return active
      ? "text-[#2563EB] font-extrabold border-l-4 border-[#2563EB] pl-2"
      : "text-[#1F2937] hover:text-[#2563EB] font-bold";
  };

  const isHomePage = location.pathname === "/";
  const isCatalogPage = location.pathname === "/catalog";

  const handleUserClick = () => {
    if (isUserLoggedIn) {
      openLoginModal();
    } else {
      if (totalItems > 0) {
        navigate("/cart");
      } else {
        openLoginModal();
      }
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-[#FFFDF2] shadow-md border-b border-amber-200/60 transition-transform duration-300 w-full ${isHidden ? "-translate-y-full" : "translate-y-0"}`}>
        {/* Top Announcement Bar */}
        <div className="bg-[#2563EB] text-[#FFD400] text-xs py-1.5 overflow-hidden relative z-50">
          <div className="flex items-center justify-between container mx-auto px-4">
            <div className="w-full overflow-hidden">
              <div className="animate-top-announcement w-max whitespace-nowrap flex items-center gap-4 text-[11px] sm:text-xs font-black tracking-wider text-[#FFD400]">
                <span>DIWALI 2026 BOOKING OPENS! | In compliance with the 2018 Supreme Court order, online sale of firecrackers is strictly prohibited. This site only provides price estimates for reference. </span>
                <span className="text-white">✦</span>
                <span>DIWALI 2026 BOOKING OPENS! | In compliance with the 2018 Supreme Court order, online sale of firecrackers is strictly prohibited. This site only provides price estimates for reference. </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header & Navbar Row */}
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={companyLogo} alt="PBL Crackers" className="h-14 md:h-16 scale-110 md:scale-125 origin-left object-contain transition-all duration-200" />
          </Link>

          {/* Navigation Bar (Desktop) */}
          <nav className="hidden md:flex items-center gap-3.5 xl:gap-5 text-sm xl:text-[15px] font-medium tracking-wide">
            <Link to="/" className={getLinkClass('/')}>
              Home
            </Link>
            <Link to="/catalog" className={getLinkClass('/catalog')}>
              All Products
            </Link>
            <Link to="/price-list" className={getLinkClass('/price-list')}>
              Price List
            </Link>
            <Link to="/about-us" className={getLinkClass('/about-us')}>
              About Us
            </Link>
            <Link to="/safety-tips" className={getLinkClass('/safety-tips')}>
              Safety Tips
            </Link>
            <Link to="/contact" className={getLinkClass('/contact')}>
              Contact Us
            </Link>
          </nav>

          {/* Desktop Filter Controls (Only on All Products page) */}
          {isCatalogPage && catalogFilters && (
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={catalogFilters.selectedCategory}
                  onChange={(e) => catalogFilters.setSelectedCategory(e.target.value)}
                  className="w-36 xl:w-44 py-1.5 px-2.5 pr-7 rounded-xl border border-amber-200/90 text-xs font-bold text-[#1F2937] bg-white shadow-xs outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] cursor-pointer appearance-none truncate transition-all"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%232563EB\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '0.75rem'
                  }}
                >
                  {catalogFilters.uniqueCategoryNames.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Products Input */}
              <div className="relative w-40 xl:w-52">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={catalogFilters.searchQuery}
                  onChange={(e) => catalogFilters.setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-amber-200/90 text-xs font-medium text-[#1F2937] bg-white shadow-xs outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] placeholder:text-gray-400 transition-all font-sans"
                />
                {catalogFilters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => catalogFilters.setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Corner Buttons: Cart Widget (Icon + Badge + Total Amount on all pages) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div
              onClick={() => setIsCartOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-2 sm:gap-2.5 shadow-md border border-[#1D4ED8] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shrink-0"
              title="Click to view Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FFD400] text-[#1F2937] text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-black shadow-sm border border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left justify-center leading-none">
                <span className="text-[7px] sm:text-[9px] font-extrabold text-white/90 uppercase tracking-wider">Cart Total</span>
                <span className="text-xs sm:text-sm font-black leading-tight text-white mt-0.5">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Filter Sub-Row (Only on All Products page) */}
        {isCatalogPage && catalogFilters && (
          <div className="lg:hidden border-t border-amber-200/60 bg-[#FFFDF2] px-3 py-2 shadow-xs">
            <div className="container mx-auto flex items-center gap-2">
              {/* Category Dropdown */}
              <div className="relative w-1/2">
                <select
                  value={catalogFilters.selectedCategory}
                  onChange={(e) => catalogFilters.setSelectedCategory(e.target.value)}
                  className="w-full py-1.5 pl-2.5 pr-6 rounded-lg border border-amber-200 text-xs font-bold text-[#1F2937] bg-white shadow-xs outline-none focus:border-[#2563EB] appearance-none truncate"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%232563EB\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.4rem center',
                    backgroundSize: '0.75rem'
                  }}
                >
                  {catalogFilters.uniqueCategoryNames.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Products Input */}
              <div className="relative w-1/2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={catalogFilters.searchQuery}
                  onChange={(e) => catalogFilters.setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-6 py-1.5 rounded-lg border border-amber-200 text-xs font-medium text-[#1F2937] bg-white shadow-xs outline-none focus:border-[#2563EB] placeholder:text-gray-400 font-sans"
                />
                {catalogFilters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => catalogFilters.setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Marquee Banner between Header and Content (Home Page Only) - Blue BG, White Text */}
        {isHomePage && (() => {
          const rawNews = settings?.news || "✨ Welcome to PBL Crackers - Sivakasi's Premium Fireworks at Wholesale Price! ✨ 💥 Special Diwali Offer: Up to 50% discount on all Family Packs! 💥 🚚 Direct delivery from Sivakasi to your doorstep! 🚚 📞 WhatsApp us now to place your inquiry and custom orders! 📞";
          const displayNews = rawNews.replace(/sai\s*yogi/gi, "PBL");
          return (
            <div className="relative overflow-hidden bg-[#2563EB] text-white py-2 border-y border-[#1D4ED8] select-none z-[110] shadow-sm">
              <div className="animate-top-marquee font-bold text-[10px] md:text-xs uppercase tracking-widest py-1 text-white">
                <div className="flex gap-16 whitespace-nowrap text-white">
                  <span className="text-white">{displayNews}</span>
                </div>
                <div className="flex gap-16 whitespace-nowrap text-white">
                  <span className="text-white">{displayNews}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </header>

      {/* Mobile Menu Drawer (Placed outside header so it doesn't get affected by header scroll-hide translate-y) */}
      <div className={`md:hidden fixed inset-0 z-[100] ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer content */}
        <div
          className={`absolute top-0 left-0 h-full w-[85vw] max-w-[320px] bg-[#FFFDF2] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="p-4 border-b border-amber-200/50 flex justify-between items-center bg-[#FFFDF2]">
            <img src={companyLogo} alt="PBL Crackers" className="h-14 object-contain" />
            <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 p-6 text-sm uppercase font-bold overflow-y-auto">
            <Link to="/" onClick={() => setMenuOpen(false)} className={getMobileLinkClass('/')}>HOME</Link>
            <Link to="/catalog" onClick={() => setMenuOpen(false)} className={getMobileLinkClass('/catalog')}>ALL PRODUCTS</Link>
            <Link to="/price-list" onClick={() => setMenuOpen(false)} className={getMobileLinkClass('/price-list')}>Price List</Link>
            <Link to="/about-us" onClick={() => setMenuOpen(false)} className={getMobileLinkClass('/about-us')}>ABOUT US</Link>
            <Link to="/safety-tips" onClick={() => setMenuOpen(false)} className={getMobileLinkClass('/safety-tips')}>SAFETY TIPS</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className={getMobileLinkClass('/contact')}>CONTACT US</Link>
          </nav>
        </div>
      </div>

      {/* Responsive layout spacer so fixed header doesn't cover top of page content */}
      <div className={isHomePage ? "w-full shrink-0 h-[112px] md:h-[142px]" : "w-full shrink-0 h-[60px] md:h-[108px]"} />
    </>
  );
};

export default UserHeader;
