import { ShoppingCart, X, Plus, Minus, Heart, PackageCheck, Sparkles } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useSiteSettings, getDiscountPrice } from "@/context/SiteSettingsContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import companyLogo from "@/assets/logo.png";
import ComboProductsModal from "@/components/ComboProductsModal";

const ProductCard = ({ product, categoryName, onCardClick, className, showDetailOnly, onDetailClose, compact }: { product: Product; categoryName?: string; onCardClick?: () => void; className?: string; showDetailOnly?: boolean; onDetailClose?: () => void; compact?: boolean }) => {
  const [showDetails, setShowDetails] = useState(!!showDetailOnly);
  const [showComboModal, setShowComboModal] = useState(false);

  useEffect(() => {
    if (showDetailOnly !== undefined) {
      setShowDetails(!!showDetailOnly);
    }
  }, [showDetailOnly]);

  const handleCloseDetails = () => {
    setShowDetails(false);
    if (onDetailClose) onDetailClose();
  };
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const { settings } = useSiteSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = String(product._id || product.id || '');
  const cartItem = useMemo(() => items.find(i => i && i.product && String(i.product._id || i.product.id || '') === productId), [items, productId]);
  const quantity = cartItem?.quantity || 0;
  const isWishlisted = isInWishlist(productId);

  const discountPrice = getDiscountPrice(product.price, product.hasDiscount, settings.discountPercent, product.netRate, product.displayNetRate);
  const isNetRate = !!product.netRate && product.netRate > 0 && !!product.displayNetRate;
  const discount = (product.hasDiscount && !isNetRate) ? settings.discountPercent : 0;

  const stockVal = product.storeStockPieces !== undefined ? Number(product.storeStockPieces) : (product.stock !== undefined ? Number(product.stock) : 999);
  const isOutOfStock = stockVal <= 0;

  const selectedAmount = quantity * discountPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    if (quantity >= stockVal) {
      toast.error("Not enough stock available");
      return;
    }
    if (quantity === 0) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } else {
      updateQuantity(productId, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    } else if (quantity === 1) {
      removeFromCart(productId);
    }
  };

  const QuantitySelector = ({ className }: { className?: string }) => (
    <div className={cn("flex items-center justify-between gap-1.5 w-full", className)} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 0}
        className={cn(
          "flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-[#2563EB] transition-colors font-bold disabled:opacity-40 cursor-pointer",
          compact ? "h-7 w-7 text-xs" : "h-8 w-8 sm:h-9 sm:w-9"
        )}
      >
        <Minus className={cn("stroke-[2.5]", compact ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4")} />
      </button>
      <span className={cn(
        "flex-1 py-1 text-center font-black text-white bg-[#2563EB] rounded-xl shadow-xs",
        compact ? "text-xs py-0.5" : "text-xs sm:text-sm"
      )}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        className={cn(
          "flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-[#2563EB] transition-colors font-bold disabled:opacity-40 cursor-pointer",
          compact ? "h-7 w-7 text-xs" : "h-8 w-8 sm:h-9 sm:w-9"
        )}
        disabled={isOutOfStock || quantity >= stockVal}
      >
        <Plus className={cn("stroke-[2.5]", compact ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4")} />
      </button>
    </div>
  );

  return (
    <>
      {!showDetailOnly && (
        <div className="group h-full">
          <div
            className={cn("rounded-2xl overflow-hidden bg-white border border-amber-200/80 hover:border-amber-400 transition-all duration-300 hover:shadow-lg flex flex-col h-full relative cursor-pointer text-left items-start", className)}
            onClick={() => onCardClick ? onCardClick() : setShowDetails(true)}
          >
            {/* Image Area */}
            <div className={cn("relative w-full overflow-hidden bg-[#FDFBF7] border-b border-amber-100/70", compact ? "h-24 p-1" : "aspect-square p-1.5 sm:p-3")}>
              <img
                src={isOutOfStock ? companyLogo : (product.image || companyLogo)}
                alt={product.name}
                className={cn(
                  "w-full h-full object-contain p-1 transition-transform duration-500 ease-out mix-blend-multiply",
                  !isOutOfStock && "group-hover:scale-105"
                )}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = companyLogo;
                }}
              />

              {/* If Out of Stock: prominent Sold Out badge over the PBL logo */}
              {isOutOfStock ? (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 p-2">
                  <span className="bg-red-600 text-white font-extrabold text-[11px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md uppercase tracking-wider">
                    Sold Out
                  </span>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 uppercase tracking-widest">
                      Quick View
                    </span>
                  </div>

                  {/* Sleek Modern Discount Badge (Replaces old yellow tag) */}
                  {discount > 0 && !isNetRate && (
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span className="bg-red-600 text-white font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
                        {discount}% OFF
                      </span>
                    </div>
                  )}

                  {isNetRate && (
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm z-10 tracking-wide uppercase">
                      NET RATE
                    </span>
                  )}

                  {stockVal < 20 && (
                    <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-amber-400 text-amber-950 text-xs sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                      Only {stockVal} left
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Left Aligned Content Details Section */}
            <div className={cn("flex-1 flex flex-col justify-between w-full text-left items-start", compact ? "p-2" : "p-2 sm:p-3.5")}>
              <div className="w-full text-left">
                {/* Title (Brand row removed as requested) */}
                <h3 className={cn("product-title-font font-black text-gray-900 leading-snug line-clamp-2 text-left mb-0.5", compact ? "text-xs" : "text-xs sm:text-base")}>
                  {product.name}
                  {product.quantity && (
                    <span className="ml-1 text-[10px] font-bold text-gray-500 font-sans">
                      ({product.quantity})
                    </span>
                  )}
                </h3>

                {/* Price Display */}
                <div className={cn("flex items-baseline text-left gap-1 flex-wrap", compact ? "mt-0.5 mb-0" : "mt-0.5 mb-0.5 gap-1.5")}>
                  <span className={cn("font-display font-black text-[#2563EB] leading-none", compact ? "text-base" : "text-lg sm:text-2xl")}>₹{discountPrice}</span>
                  {product.hasDiscount && !isNetRate && (
                    <span className={cn("text-gray-400 line-through font-semibold", compact ? "text-[10px]" : "text-[10px] sm:text-sm")}>₹{product.price}</span>
                  )}
                  {isNetRate && (
                    <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-tighter">Fixed Price</span>
                  )}
                </div>

                {/* Discount Badge Pill — hidden in compact/wishlist */}
                {discount > 0 && !isNetRate && !compact && (
                  <div className="my-1 text-left">
                    <span className={cn("bg-[#E6F4EA] text-[#137333] font-black rounded-md inline-block", compact ? "text-[10px] px-1.5 py-0.5" : "text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1")}>
                      {discount}% OFF
                    </span>
                  </div>
                )}

                {/* Combo Products Included Button on Card */}
                {product.comboProducts && product.comboProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComboModal(true);
                    }}
                    className={cn(
                      "w-full my-1 py-1 px-2 bg-gradient-to-r from-blue-50 to-amber-50 hover:from-blue-100 hover:to-amber-100 text-[#1D4ED8] border border-blue-200 rounded-xl font-black flex items-center justify-center gap-1.5 shadow-2xs transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
                      compact ? "text-[9px] py-0.5" : "text-[10px] sm:text-xs py-1"
                    )}
                  >
                    <PackageCheck className={cn("text-[#2563EB] shrink-0", compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
                    <span className="truncate">View {product.comboProducts.length} Items List</span>
                  </button>
                )}
              </div>

              {/* Add to Cart Button Row (Normal flat style, no 3D thick border) */}
              <div className="w-full pt-1 sm:pt-2 mt-auto" onClick={e => e.stopPropagation()}>
                {quantity > 0 ? (
                  <QuantitySelector />
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={cn(
                      "w-full rounded-xl sm:rounded-2xl flex items-center justify-center font-bold uppercase tracking-wider transition-all select-none shadow-sm",
                      compact ? "h-8 text-[11px] gap-1.5" : "h-8 sm:h-10 text-[11px] sm:text-xs gap-1.5 sm:gap-2",
                      isOutOfStock
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1e40af] text-white hover:shadow-md cursor-pointer"
                    )}
                  >
                    <ShoppingCart className={cn("text-white", compact ? "w-3.5 h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4")} />
                    <span>{isOutOfStock ? "Sold Out" : "ADD TO CART"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View / Detail Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md overflow-y-auto p-4 flex items-center justify-center animate-in fade-in duration-300"
          onClick={handleCloseDetails}
        >
          <div
            className="relative bg-[#FDFBF7] max-w-lg md:max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-500 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseDetails}
              className="absolute top-4 right-4 z-10 bg-white/40 backdrop-blur-md border border-white/40 rounded-full p-2 hover:bg-white transition-colors shadow-lg"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-[#FDFBF7] p-4 md:p-8 flex items-center justify-center relative">
              <img
                src={isOutOfStock ? '/logo.png' : (product.image || '/logo.png')}
                alt={product.name}
                className="w-full h-full object-contain max-h-[350px] md:max-h-[400px] mix-blend-multiply"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center text-left">
              {(categoryName || product.category) && (
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                    {categoryName || (typeof product.category === 'object' && product.category !== null ? (product.category as any).name : product.category)}
                  </span>
                </div>
              )}

              <h2 className="product-title-font text-2xl md:text-3xl font-black text-[#1F2937] mb-1 leading-tight">{product.name}</h2>
              {product.quantity && (
                <div className="mb-3">
                  <span className="inline-block bg-blue-50 text-[#2563EB] border border-blue-200/80 text-xs font-black px-2.5 py-0.5 rounded-md shadow-2xs">
                    {product.quantity}
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="text-2xl md:text-4xl font-black text-[#2563EB]">₹{discountPrice}</span>
                {product.hasDiscount && !isNetRate && (
                  <span className="text-base md:text-xl text-gray-300 line-through font-medium">₹{product.price}</span>
                )}
                {isNetRate && (
                  <span className="text-xs md:text-sm text-indigo-500 font-black uppercase tracking-widest px-2.5 py-0.5 bg-indigo-50 rounded-lg border border-indigo-100">Net Rate Only</span>
                )}
              </div>

              {/* View Included Combo Products Button in Quick View Modal */}
              {((product.comboProducts && product.comboProducts.length > 0) || product.name.toLowerCase().includes('combo') || product.name.toLowerCase().includes('pack')) && (
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComboModal(true);
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-amber-400/30"
                  >
                    <PackageCheck className="w-4 h-4 text-amber-100 shrink-0" />
                    <span>🎁 View Included Combo Products {product.comboProducts?.length ? `(${product.comboProducts.length} Items)` : ''}</span>
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {quantity > 0 ? (
                    <div className="flex items-center gap-4 flex-1">
                      <QuantitySelector className="p-1 gap-4" />
                      <span className="text-sm font-bold text-[#2563EB] whitespace-nowrap">Added to Cart</span>
                    </div>
                  ) : (
                    <Button
                      className={cn(
                        "w-full h-11 md:h-14 rounded-2xl text-base md:text-lg font-bold uppercase tracking-wider transition-all select-none",
                        isOutOfStock
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                          : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md cursor-pointer"
                      )}
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? (
                        <span className="flex items-center gap-1.5"><X className="h-5 w-5" /> Out of Stock</span>
                      ) : (
                        <span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 drop-shadow-xs" /> Add to Cart</span>
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-[10px] md:text-xs text-gray-400 text-center font-medium italic">
                  Fast delivery within 2-3 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Combo Products Included Modal */}
      <ComboProductsModal
        product={product}
        isOpen={showComboModal}
        onClose={() => setShowComboModal(false)}
      />
    </>
  );
};

export default ProductCard;
