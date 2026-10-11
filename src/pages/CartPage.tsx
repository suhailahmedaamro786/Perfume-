import React, { useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { LuxuryImage } from '../components/LuxuryImage';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/store';
import {
  calculateDeliveryFee,
  calculateRegularSubtotal,
  calculateSubtotal,
  formatPKR,
} from '../utils/pricing';

interface CartPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (slug: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, theme } = useStore();
  const isLight = theme === 'light';
  const [previewCity, setPreviewCity] = useState<string>('Karachi');

  const subtotal = calculateSubtotal(cart);
  const regularSubtotal = calculateRegularSubtotal(cart);
  const totalSavings = Math.max(0, regularSubtotal - subtotal);
  const deliveryInfo = calculateDeliveryFee(subtotal, previewCity);
  const grandTotal = subtotal + deliveryInfo.fee;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div
          className={`border p-12 ${
            isLight
              ? 'border-[#E5DEC9] bg-white'
              : 'border-[#26231D] bg-[#141414]'
          }`}
        >
          <ShoppingBag
            className="mx-auto h-10 w-10 text-[#D4AF37]"
            aria-hidden="true"
          />
          <h1 className="mt-4 font-serif-display text-3xl font-semibold">
            Your Shopping Bag is Empty
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#A39E93]">
            Explore our collection of original Extraits and Eaux de Parfum to add your signature
            scent. Your bag automatically saves across page refreshes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
            >
              Explore All Fragrances
            </button>
            <button
              type="button"
              onClick={() => onNavigate('best-sellers')}
              className="border border-[#D4AF37]/60 px-6 py-3 text-xs font-semibold text-[#F1D27A] hover:bg-[#D4AF37]/10"
            >
              View Best Sellers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#26231D] pb-6">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
            YOUR SELECTION
          </p>
          <h1 className="mt-1 font-serif-display text-4xl font-semibold">
            Shopping Bag
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-[#A39E93] underline underline-offset-4 hover:text-[#D4AF37]"
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Complimentary Delivery Progress Notice */}
      <div
        className={`mt-6 border p-4 text-xs ${
          isLight
            ? 'border-[#E5DEC9] bg-white text-[#3D3932]'
            : 'border-[#26231D] bg-[#141414] text-[#D6D0C4]'
        }`}
      >
        {deliveryInfo.isFree ? (
          <p>
            Your order qualifies for{' '}
            <strong className="text-[#D4AF37]">Complimentary Nationwide Delivery</strong> across
            Pakistan.
          </p>
        ) : (
          <p>
            Add{' '}
            <strong className="font-mono-num text-[#D4AF37]">
              {formatPKR(deliveryInfo.amountRemainingForFree)}
            </strong>{' '}
            more to unlock{' '}
            <strong className="text-[#F1D27A]">Complimentary Nationwide Delivery</strong> (on
            orders of {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}+).
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Itemized Cart List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const lineSubtotal = item.unitPrice * item.quantity;
            const hasSale = item.unitPrice < item.regularPrice;

            return (
              <div
                key={`${item.productId}-${item.size}`}
                className={`flex flex-col gap-4 border p-4 sm:flex-row sm:items-center sm:justify-between ${
                  isLight
                    ? 'border-[#E5DEC9] bg-white'
                    : 'border-[#26231D] bg-[#141414]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(item.slug)}
                    className="w-24 shrink-0 overflow-hidden border border-[#26231D]"
                  >
                    <LuxuryImage
                      src={item.image}
                      alt={`${item.name} (${item.size})`}
                      aspectClassName="aspect-[4/3]"
                    />
                  </button>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#A39E93]">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.concentration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#D4AF37]">
                        Size: {item.size}
                      </span>
                    </div>

                    <h2 className="mt-1 font-serif-display text-xl font-semibold">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(item.slug)}
                        className="hover:text-[#D4AF37]"
                      >
                        {item.name}
                      </button>
                    </h2>

                    <div className="mt-1 font-mono-num text-xs">
                      <span className="text-[#D4AF37]">
                        {formatPKR(item.unitPrice)} each
                      </span>
                      {hasSale && (
                        <span className="ml-2 text-[#736E64] line-through">
                          {formatPKR(item.regularPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Stepper + Line Price + Remove */}
                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <div className="inline-flex items-center border border-[#2A2721]">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.productId,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      aria-label={`Decrease quantity of ${item.name} (${item.size})`}
                      className="flex h-9 w-9 items-center justify-center text-[#A39E93] hover:text-[#D4AF37]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-10 text-center font-mono-num text-xs font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.productId,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      disabled={item.quantity >= 20}
                      aria-label={`Increase quantity of ${item.name} (${item.size})`}
                      className="flex h-9 w-9 items-center justify-center text-[#A39E93] hover:text-[#D4AF37] disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="min-w-[95px] text-right font-mono-num text-sm font-semibold text-[#D4AF37]">
                    {formatPKR(lineSubtotal)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.size)}
                    aria-label={`Remove ${item.name} (${item.size}) from bag`}
                    className="p-2 text-[#A39E93] transition-colors hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div
            className={`border p-6 ${
              isLight
                ? 'border-[#E5DEC9] bg-white'
                : 'border-[#26231D] bg-[#141414]'
            }`}
          >
            <h2 className="font-serif-display text-2xl font-semibold">
              Order Summary
            </h2>

            {/* City Estimator */}
            <div className="mt-4">
              <label
                htmlFor="city-estimator"
                className="block text-xs text-[#A39E93]"
              >
                Estimate Delivery by City:
              </label>
              <select
                id="city-estimator"
                value={previewCity}
                onChange={(e) => setPreviewCity(e.target.value)}
                className={`mt-1.5 w-full border px-3 py-2 text-xs focus:border-[#D4AF37] focus:outline-none ${
                  isLight
                    ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                    : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                }`}
              >
                {STORE_CONFIG.popularCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <dl className="mt-6 space-y-3 border-t border-[#26231D] pt-4 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#A39E93]">Subtotal</dt>
                <dd className="font-mono-num font-medium">{formatPKR(subtotal)}</dd>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-[#D4AF37]">
                  <dt>Special Offer Savings</dt>
                  <dd className="font-mono-num">-{formatPKR(totalSavings)}</dd>
                </div>
              )}

              <div className="flex justify-between">
                <dt className="text-[#A39E93]">{deliveryInfo.tierLabel}</dt>
                <dd className="font-mono-num font-medium">
                  {deliveryInfo.isFree ? 'Rs. 0 (Free)' : formatPKR(deliveryInfo.fee)}
                </dd>
              </div>

              <div className="flex justify-between border-t border-[#26231D] pt-3 text-sm font-semibold">
                <dt>Estimated Grand Total</dt>
                <dd className="font-mono-num text-[#D4AF37]">
                  {formatPKR(grandTotal)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => onNavigate('checkout')}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-[#D4AF37] py-3.5 text-xs font-semibold text-[#0B0B0B] transition-colors hover:bg-[#F1D27A]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="mt-3 w-full border border-[#2A2721] py-2.5 text-xs text-[#A39E93] hover:border-[#D4AF37] hover:text-[#F1D27A]"
            >
              Continue Shopping
            </button>

            <p className="mt-4 text-[11px] leading-relaxed text-[#8C8577]">
              Payment preference (Cash on Delivery) and final delivery schedule are confirmed
              directly with SK PERFUMES on WhatsApp at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
