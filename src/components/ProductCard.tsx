import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { formatPKR, getEffectiveVariantPrice } from '../utils/pricing';
import { LuxuryImage } from './LuxuryImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (slug: string) => void;
  theme?: 'dark' | 'light';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  theme = 'dark',
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  // Default to 50ml as signature presentation size, or first variant
  const defaultVariant =
    product.variants.find((v) => v.size === '50ml') || product.variants[0];
  const [selectedSize, setSelectedSize] = useState<'30ml' | '50ml' | '100ml'>(
    defaultVariant.size
  );

  const activeVariant =
    product.variants.find((v) => v.size === selectedSize) || defaultVariant;
  const effectivePrice = getEffectiveVariantPrice(activeVariant);
  const hasDiscount =
    typeof activeVariant.salePrice === 'number' &&
    activeVariant.salePrice < activeVariant.price;
  const saved = isInWishlist(product.id);

  // Single quiet text status label (zero pill clutter)
  const statusKicker = hasDiscount
    ? 'Special Offer'
    : product.bestSeller
      ? 'Best Seller'
      : product.newArrival
        ? 'New Arrival'
        : null;

  const isLight = theme === 'light';

  return (
    <article
      className={`group flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 ${
        isLight
          ? 'border border-[#E5DEC9] bg-white text-[#141413]'
          : 'border border-[#26231D] bg-[#141414] text-[#F9F6F0]'
      }`}
    >
      <div>
        {/* Product Image Container (65-75% visual weight) */}
        <div className="relative overflow-hidden">
          <button
            type="button"
            onClick={() => onSelectProduct(product.slug)}
            className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            aria-label={`View details for ${product.name}`}
          >
            <LuxuryImage
              src={product.images[0]}
              alt={`${product.name} — ${product.concentration} by SK PERFUMES`}
              label={product.name}
              aspectClassName="aspect-[4/3]"
              className="transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>

          {/* Wishlist Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={
              saved
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
            }
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center bg-[#0B0B0B]/75 text-[#F9F6F0] backdrop-blur-sm transition-colors duration-150 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <Heart
              className={`h-4 w-4 ${
                saved ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-current'
              }`}
            />
          </button>
        </div>

        {/* Clean Metadata & Title */}
        <div className="p-5 pb-4">
          <div
            className={`flex items-center gap-1.5 text-xs ${
              isLight ? 'text-[#6E675B]' : 'text-[#A39E93]'
            }`}
          >
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.fragranceFamily}</span>
            {statusKicker && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#D4AF37]">{statusKicker}</span>
              </>
            )}
          </div>

          <h3 className="mt-1.5 font-serif-display text-xl font-semibold tracking-wide">
            <button
              type="button"
              onClick={() => onSelectProduct(product.slug)}
              className="text-left transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              {product.name}
            </button>
          </h3>

          <p
            className={`mt-1 line-clamp-1 text-xs ${
              isLight ? 'text-[#5C564B]' : 'text-[#A39E93]'
            }`}
          >
            {product.subtitle}
          </p>
        </div>
      </div>

      {/* Size Selector, Price & Add to Bag */}
      <div
        className={`border-t px-5 pt-3.5 pb-5 ${
          isLight ? 'border-[#EFE9D8]' : 'border-[#221F1A]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Interactive Size Selector Buttons */}
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label={`Select bottle size for ${product.name}`}
          >
            {product.variants.map((v) => {
              const isSelected = v.size === selectedSize;
              return (
                <button
                  key={v.size}
                  type="button"
                  onClick={() => setSelectedSize(v.size)}
                  className={`px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                    isSelected
                      ? 'border border-[#D4AF37] bg-[#D4AF37]/15 text-[#F1D27A]'
                      : isLight
                        ? 'border border-[#E5DEC9] text-[#5C564B] hover:border-[#D4AF37]'
                        : 'border border-[#2A2721] text-[#A39E93] hover:border-[#D4AF37]/50 hover:text-[#F9F6F0]'
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>

          {/* Tabular Price */}
          <div className="text-right font-mono-num">
            {hasDiscount && (
              <span
                className={`mr-1.5 text-xs line-through ${
                  isLight ? 'text-[#8C8577]' : 'text-[#736E64]'
                }`}
              >
                {formatPKR(activeVariant.price)}
              </span>
            )}
            <span className="text-[15px] font-semibold text-[#D4AF37]">
              {formatPKR(effectivePrice)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => addToCart(product, selectedSize, 1)}
            disabled={!activeVariant.inStock}
            className="flex flex-1 items-center justify-center gap-2 bg-[#D4AF37] px-4 py-2.5 text-xs font-semibold text-[#0B0B0B] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#F1D27A] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {activeVariant.inStock ? `Add to Bag · ${selectedSize}` : 'Out of Stock'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
