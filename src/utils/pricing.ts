import { STORE_CONFIG } from '../config/storeConfig';
import { CartItem, Product, ProductSizeVariant } from '../types/store';

/**
 * Formats an integer PKR amount as "Rs. 5,200"
 */
export function formatPKR(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  return `${STORE_CONFIG.currencySymbol} ${safeAmount.toLocaleString('en-PK')}`;
}

/**
 * Returns the effective selling price for a size variant (salePrice if present and lower, otherwise price)
 */
export function getEffectiveVariantPrice(variant: ProductSizeVariant): number {
  if (typeof variant.salePrice === 'number' && variant.salePrice > 0 && variant.salePrice < variant.price) {
    return variant.salePrice;
  }
  return variant.price;
}

/**
 * Checks if any size variant of a product is currently on sale
 */
export function isProductOnSale(product: Product): boolean {
  return product.variants.some(
    (v) => typeof v.salePrice === 'number' && v.salePrice > 0 && v.salePrice < v.price
  );
}

/**
 * Calculates cart subtotal from actual cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

/**
 * Calculates regular subtotal (before sale discounts) to show customer savings if applicable
 */
export function calculateRegularSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.regularPrice * item.quantity, 0);
}

/**
 * Calculates delivery fee based on STORE_CONFIG rules:
 * - If cart is empty, 0
 * - If subtotal >= freeDeliveryThreshold (Rs. 10,000), 0
 * - If city is in majorCities list, Rs. 250
 * - Otherwise, Rs. 350
 */
export function calculateDeliveryFee(subtotal: number, city?: string): {
  fee: number;
  isFree: boolean;
  tierLabel: string;
  amountRemainingForFree: number;
} {
  if (subtotal <= 0) {
    return {
      fee: 0,
      isFree: false,
      tierLabel: 'Calculated at checkout',
      amountRemainingForFree: STORE_CONFIG.delivery.freeDeliveryThreshold,
    };
  }

  const threshold = STORE_CONFIG.delivery.freeDeliveryThreshold;
  if (subtotal >= threshold) {
    return {
      fee: 0,
      isFree: true,
      tierLabel: `Complimentary Delivery (Orders ${formatPKR(threshold)}+)`,
      amountRemainingForFree: 0,
    };
  }

  const normalizedCity = (city || '').trim().toLowerCase();
  const isMajorCity = STORE_CONFIG.delivery.majorCities.some(
    (c) => c.toLowerCase() === normalizedCity
  );

  const fee = normalizedCity
    ? isMajorCity
      ? STORE_CONFIG.delivery.majorCitiesFee
      : STORE_CONFIG.delivery.otherCitiesFee
    : STORE_CONFIG.delivery.majorCitiesFee;

  const tierLabel = !normalizedCity
    ? `Standard Delivery (${formatPKR(STORE_CONFIG.delivery.majorCitiesFee)} – ${formatPKR(STORE_CONFIG.delivery.otherCitiesFee)})`
    : isMajorCity
      ? `Major City Courier (${city})`
      : `Nationwide Courier (${city})`;

  return {
    fee,
    isFree: false,
    tierLabel,
    amountRemainingForFree: Math.max(0, threshold - subtotal),
  };
}
