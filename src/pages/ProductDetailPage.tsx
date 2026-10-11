import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { LuxuryImage } from '../components/LuxuryImage';
import { ProductCard } from '../components/ProductCard';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { PageRoute, Product } from '../types/store';
import { formatPKR, getEffectiveVariantPrice } from '../utils/pricing';
import { buildWhatsAppInquiryUrl } from '../utils/whatsapp';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (slug: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onSelectProduct,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, theme } = useStore();
  const isLight = theme === 'light';

  const defaultVariant =
    product.variants.find((v) => v.size === '50ml') || product.variants[0];

  const [selectedSize, setSelectedSize] = useState<'30ml' | '50ml' | '100ml'>(
    defaultVariant.size
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Reset state when switching products
  useEffect(() => {
    const initialVar =
      product.variants.find((v) => v.size === '50ml') || product.variants[0];
    setSelectedSize(initialVar.size);
    setQuantity(1);
    setActiveImageIndex(0);
  }, [product]);

  const activeVariant =
    product.variants.find((v) => v.size === selectedSize) || defaultVariant;
  const effectivePrice = getEffectiveVariantPrice(activeVariant);
  const hasDiscount =
    typeof activeVariant.salePrice === 'number' &&
    activeVariant.salePrice < activeVariant.price;
  const saved = isInWishlist(product.id);

  const relatedProducts = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.category === product.category ||
        p.fragranceFamily === product.fragranceFamily)
  ).slice(0, 3);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleBuyNowToCheckout = () => {
    addToCart(product, selectedSize, quantity);
    onNavigate('checkout');
  };

  const whatsappProductQuestionUrl = buildWhatsAppInquiryUrl(
    `Assalam-o-Alaikum ${STORE_CONFIG.brandName}, I have a question regarding ${product.name} (${selectedSize}, ${formatPKR(effectivePrice)}).`
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
      {/* Breadcrumb & Back Navigation */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#A39E93]">
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-1.5 font-medium text-[#D4AF37] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Fragrance Collection</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#D4AF37]"
          >
            Home
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() =>
              onNavigate(
                product.category === "Men's"
                  ? 'men'
                  : product.category === "Women's"
                    ? 'women'
                    : 'unisex'
              )
            }
            className="hover:text-[#D4AF37]"
          >
            {product.category}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#F1D27A]">{product.name}</span>
        </div>
      </div>

      {/* Main Contiguous Purchase Split */}
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        {/* Left: Sticky Gallery */}
        <div className="lg:sticky lg:top-28 lg:col-span-6">
          <div className="border border-[#26231D] bg-[#141414]">
            <LuxuryImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={`${product.name} (${selectedSize}) — ${product.concentration}`}
              aspectClassName="aspect-[4/3]"
              priority={true}
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {product.images.map((imgSrc, idx) => (
                <button
                  key={`${product.id}-img-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View angle ${idx + 1} of ${product.name}`}
                  className={`overflow-hidden border transition-colors ${
                    activeImageIndex === idx
                      ? 'border-[#D4AF37]'
                      : 'border-[#26231D] opacity-70 hover:opacity-100'
                  }`}
                >
                  <LuxuryImage
                    src={imgSrc}
                    alt={`${product.name} view ${idx + 1}`}
                    aspectClassName="aspect-[4/3]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6">
          <div
            className={`border p-6 sm:p-8 ${
              isLight
                ? 'border-[#E5DEC9] bg-white'
                : 'border-[#26231D] bg-[#141414]'
            }`}
          >
            {/* Quiet Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A39E93]">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.concentration}</span>
              <span aria-hidden="true">·</span>
              <span>{product.fragranceFamily}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#D4AF37]">
                {activeVariant.inStock ? 'In Stock in Pakistan' : 'Out of Stock'}
              </span>
            </div>

            <h1 className="mt-2 font-serif-display text-3xl font-semibold sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-[#F1D27A]">{product.subtitle}</p>

            {/* Price Display */}
            <div className="mt-6 flex items-baseline gap-3 border-y border-[#26231D] py-4 font-mono-num">
              <span className="text-2xl font-semibold text-[#D4AF37]">
                {formatPKR(effectivePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-[#736E64] line-through">
                    {formatPKR(activeVariant.price)}
                  </span>
                  <span className="text-xs text-[#F1D27A]">
                    Save {formatPKR(activeVariant.price - effectivePrice)}
                  </span>
                </>
              )}
              <span className="ml-auto text-xs font-sans text-[#A39E93]">
                Size: {selectedSize}
              </span>
            </div>

            <p
              className={`mt-5 text-sm leading-relaxed ${
                isLight ? 'text-[#4A453C]' : 'text-[#D6D0C4]'
              }`}
            >
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#A39E93]">
                  Select Flacon Size
                </span>
                <span className="text-[#A39E93]">
                  All prices in {STORE_CONFIG.currencyCode}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-3">
                {product.variants.map((variant) => {
                  const isSelected = variant.size === selectedSize;
                  const varPrice = getEffectiveVariantPrice(variant);
                  return (
                    <button
                      key={variant.size}
                      type="button"
                      onClick={() => setSelectedSize(variant.size)}
                      className={`flex flex-col items-start border p-3 text-left transition-colors ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15'
                          : isLight
                            ? 'border-[#DCD3BE] hover:border-[#D4AF37]'
                            : 'border-[#2A2721] hover:border-[#D4AF37]/60'
                      }`}
                    >
                      <span className="text-xs font-semibold">{variant.size}</span>
                      <span className="mt-1 font-mono-num text-xs text-[#D4AF37]">
                        {formatPKR(varPrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selection & Primary Actions */}
            <div className="mt-6">
              <label
                htmlFor="quantity-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#A39E93]"
              >
                Quantity
              </label>

              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                {/* Quantity Stepper */}
                <div className="inline-flex items-center border border-[#2A2721]">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-11 items-center justify-center text-[#A39E93] hover:text-[#D4AF37] disabled:opacity-40"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min={1}
                    max={20}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!Number.isNaN(val)) {
                        setQuantity(Math.max(1, Math.min(20, val)));
                      }
                    }}
                    className="h-11 w-14 border-x border-[#2A2721] bg-transparent text-center font-mono-num text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 20}
                    aria-label="Increase quantity"
                    className="flex h-11 w-11 items-center justify-center text-[#A39E93] hover:text-[#D4AF37] disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={() => addToCart(product, selectedSize, quantity)}
                  disabled={!activeVariant.inStock}
                  className="flex h-11 flex-1 items-center justify-center gap-2 bg-[#D4AF37] px-6 text-xs font-semibold text-[#0B0B0B] whitespace-nowrap shrink-0 transition-colors hover:bg-[#F1D27A] disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono-num">
                    Add to Bag · {formatPKR(effectivePrice * quantity)}
                  </span>
                </button>

                {/* Save to Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-11 w-11 items-center justify-center border border-[#2A2721] hover:border-[#D4AF37]"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      saved ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Express Order / WhatsApp Checkout CTA */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleBuyNowToCheckout}
                  className="w-full border border-[#D4AF37] py-3 text-xs font-semibold text-[#F1D27A] transition-colors hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
                >
                  Proceed to WhatsApp Checkout
                </button>

                <a
                  href={whatsappProductQuestionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 border border-[#2A2721] py-3 text-xs font-medium text-[#D6D0C4] transition-colors hover:border-[#D4AF37] hover:text-[#F1D27A]"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Olfactory Pyramid (Verified Fragrance Notes) */}
            <div className="mt-8 border-t border-[#26231D] pt-6">
              <h2 className="font-serif-display text-xl font-semibold">
                Olfactory Architecture &amp; Notes
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="border border-[#26231D] p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                    Top Notes
                  </p>
                  <p className="mt-1.5 text-xs text-[#D6D0C4]">
                    {product.notes.top.join(' · ')}
                  </p>
                </div>
                <div className="border border-[#26231D] p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                    Heart Notes
                  </p>
                  <p className="mt-1.5 text-xs text-[#D6D0C4]">
                    {product.notes.heart.join(' · ')}
                  </p>
                </div>
                <div className="border border-[#26231D] p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                    Base Notes
                  </p>
                  <p className="mt-1.5 text-xs text-[#D6D0C4]">
                    {product.notes.base.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#A39E93]">
                <span>
                  <strong className="text-[#F1D27A]">Longevity:</strong> {product.longevity}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-[#F1D27A]">Sillage:</strong> {product.sillage}
                </span>
              </div>
            </div>

            {/* Editorial Story & Delivery Notice */}
            <div className="mt-6 border-t border-[#26231D] pt-6 space-y-4 text-xs leading-relaxed text-[#A39E93]">
              <p>{product.story}</p>
              <div className="flex items-start gap-2.5 border border-[#26231D] p-3.5">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <p>
                  Complimentary delivery across Pakistan on orders of{' '}
                  <strong className="font-mono-num text-[#F1D27A]">
                    {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}
                  </strong>{' '}
                  or above. Standard courier charges ({formatPKR(STORE_CONFIG.delivery.majorCitiesFee)}–
                  {formatPKR(STORE_CONFIG.delivery.otherCitiesFee)}) apply to smaller orders. Cash
                  on Delivery available subject to seller confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Fragrances Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-[#26231D] pt-14">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-[#D4AF37]">
                COMPLEMENTARY COMPOSITIONS
              </p>
              <h2 className="mt-1 font-serif-display text-3xl font-semibold">
                You May Also Appreciate
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="text-xs font-semibold text-[#D4AF37] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelectProduct={onSelectProduct}
                theme={theme}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
