import React from "react";
import { Sparkles, Loader2, Server } from "lucide-react";

interface ProductLoadingSkeletonProps {
  mode?: "grid" | "table";
  count?: number;
}

export const ProductLoadingSkeleton: React.FC<ProductLoadingSkeletonProps> = ({
  mode = "grid",
  count = 8
}) => {
  return (
    <div className="w-full space-y-6 py-6 animate-in fade-in duration-300">
      {/* Friendly Server Wake-Up / Loading Banner */}
      <div className="w-full bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-amber-500/10 border border-blue-200/80 rounded-2xl p-4 sm:p-6 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-[#2563EB] font-black text-base sm:text-lg">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-[#2563EB]" />
          <span>Connecting to PBL Crackers...</span>
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
        </div>
        <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-md">
          Fetching latest prices and stock from server. If the server is starting up, this will take just a few seconds!
        </p>
        <div className="w-36 h-1 bg-blue-100 rounded-full overflow-hidden mt-1">
          <div className="w-full h-full bg-gradient-to-r from-[#2563EB] to-[#FFD400] animate-pulse" />
        </div>
      </div>

      {/* Grid Mode Placeholder Cards */}
      {mode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-amber-100 bg-white p-3 flex flex-col justify-between space-y-3 animate-pulse shadow-2xs"
            >
              {/* Image Skeleton */}
              <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>

              {/* Text Rows */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-gray-200 rounded-md" />
                  <div className="h-3 w-12 bg-emerald-100 rounded-full" />
                </div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
                <div className="h-3 w-28 bg-amber-100 rounded-md" />
                <div className="flex items-center gap-1">
                  <div className="h-3 w-16 bg-amber-200 rounded-md" />
                  <div className="h-3 w-8 bg-gray-200 rounded-md" />
                </div>
                <div className="h-5 w-20 bg-red-100 rounded-md" />
              </div>

              {/* Button Skeleton */}
              <div className="h-9 w-full bg-red-200/60 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Table Mode Placeholder Rows (For Quick Enquiry) */}
      {mode === "table" && (
        <div className="space-y-3 w-full">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 bg-white border border-amber-100 rounded-xl flex items-center justify-between gap-4 animate-pulse shadow-2xs"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded-md" />
                  <div className="h-3 w-1/4 bg-amber-100 rounded-md" />
                </div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded-md hidden sm:block" />
              <div className="h-5 w-20 bg-red-100 rounded-md" />
              <div className="h-8 w-24 bg-gray-200 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductLoadingSkeleton;
