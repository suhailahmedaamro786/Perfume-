import { STORE_CONFIG } from '../config/storeConfig';
import { CartItem, CheckoutFormData } from '../types/store';
import { calculateDeliveryFee, calculateSubtotal, formatPKR } from './pricing';

export interface ValidationErrors {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
}

/**
 * Validates checkout form inputs before opening WhatsApp
 */
export function validateCheckoutForm(data: CheckoutFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  const trimmedName = data.fullName.trim();
  if (!trimmedName || trimmedName.length < 3) {
    errors.fullName = 'Please enter your full name (at least 3 characters).';
  }

  const cleanedPhone = data.phone.replace(/[\s\-()]/g, '');
  // Accept Pakistani mobile formats: 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX, or international 10-15 digits
  const phoneRegex = /^(\+92|92|0)?3\d{9}$|^\+?\d{10,15}$/;
  if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
    errors.phone = 'Please enter a valid WhatsApp or mobile number (e.g., 0300 1234567).';
  }

  const trimmedCity = data.city.trim();
  if (!trimmedCity || trimmedCity.length < 2) {
    errors.city = 'Please select or enter your delivery city in Pakistan.';
  }

  const trimmedAddress = data.address.trim();
  if (!trimmedAddress || trimmedAddress.length < 10) {
    errors.address = 'Please enter your complete house/flat number, street, and area for courier delivery.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a local reference ID for customer/seller convenience in WhatsApp chat.
 * Note: This is an identification reference only, not a database record.
 */
export function generateOrderReference(): string {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `SK-${datePart}-${randomPart}`;
}

/**
 * Builds the plain-text WhatsApp order message and encoded https://wa.me/923041333131?text=... URL
 */
export function buildWhatsAppOrderPayload(
  items: CartItem[],
  customer: CheckoutFormData,
  orderRef: string
): {
  rawMessage: string;
  whatsappUrl: string;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
} {
  const subtotal = calculateSubtotal(items);
  const deliveryInfo = calculateDeliveryFee(subtotal, customer.city);
  const deliveryFee = deliveryInfo.fee;
  const grandTotal = subtotal + deliveryFee;

  const itemLines = items.map((item, idx) => {
    const lineTotal = item.unitPrice * item.quantity;
    return `${idx + 1}. ${item.name} (${item.size}) — Qty: ${item.quantity} × ${formatPKR(item.unitPrice)} = ${formatPKR(lineTotal)}`;
  });

  const messageParts: string[] = [
    `*${STORE_CONFIG.brandName} — New Order Request*`,
    `Order Reference: ${orderRef} _(For identification only)_`,
    `----------------------------------`,
    `*Selected Fragrances:*`,
    ...itemLines,
    `----------------------------------`,
    `Subtotal: ${formatPKR(subtotal)}`,
    `Delivery Charges (${customer.city.trim()}): ${deliveryFee === 0 ? 'Rs. 0 (Complimentary)' : formatPKR(deliveryFee)}`,
    `*Grand Total: ${formatPKR(grandTotal)}*`,
    `Requested Payment Method: ${customer.paymentPreference} (Subject to seller confirmation)`,
    `----------------------------------`,
    `*Customer & Delivery Details:*`,
    `Name: ${customer.fullName.trim()}`,
    `Contact / WhatsApp: ${customer.phone.trim()}`,
    `City: ${customer.city.trim()}`,
    `Complete Address: ${customer.address.trim()}`,
  ];

  if (customer.notes.trim()) {
    messageParts.push(`Order Notes: ${customer.notes.trim()}`);
  }

  messageParts.push(
    `----------------------------------`,
    `Please review and confirm availability, delivery schedule, and total amount for my order.`
  );

  const rawMessage = messageParts.join('\n');
  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`;

  return {
    rawMessage,
    whatsappUrl,
    subtotal,
    deliveryFee,
    grandTotal,
  };
}

/**
 * Builds a general WhatsApp inquiry link for a single product or customer support
 */
export function buildWhatsAppInquiryUrl(message: string): string {
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
