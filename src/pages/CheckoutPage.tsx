import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  ShieldAlert,
} from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { CheckoutFormData, PageRoute } from '../types/store';
import {
  calculateDeliveryFee,
  calculateSubtotal,
  formatPKR,
} from '../utils/pricing';
import {
  ValidationErrors,
  buildWhatsAppOrderPayload,
  generateOrderReference,
  validateCheckoutForm,
} from '../utils/whatsapp';

interface CheckoutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, clearCart, showToast, theme } = useStore();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    city: 'Karachi',
    address: '',
    notes: '',
    paymentPreference: 'Cash on Delivery',
  });

  const [customCity, setCustomCity] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [orderReference] = useState<string>(() => generateOrderReference());
  const [preparedOrder, setPreparedOrder] = useState<{
    rawMessage: string;
    whatsappUrl: string;
    subtotal: number;
    deliveryFee: number;
    grandTotal: number;
  } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const effectiveCity =
    formData.city === 'Other City' ? customCity : formData.city;

  const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);
  const deliveryInfo = useMemo(
    () => calculateDeliveryFee(subtotal, effectiveCity),
    [subtotal, effectiveCity]
  );
  const grandTotal = subtotal + deliveryInfo.fee;

  if (cart.length === 0 && !preparedOrder) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div
          className={`border p-12 ${
            isLight
              ? 'border-[#E5DEC9] bg-white'
              : 'border-[#26231D] bg-[#141414]'
          }`}
        >
          <h1 className="font-serif-display text-3xl font-semibold">
            Your Shopping Bag is Empty
          </h1>
          <p className="mt-2 text-xs text-[#A39E93]">
            Please add at least one fragrance to your bag before proceeding to WhatsApp checkout.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="mt-6 bg-[#D4AF37] px-6 py-3 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleFieldChange = (
    field: keyof CheckoutFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData: CheckoutFormData = {
      ...formData,
      city: effectiveCity,
    };

    const validation = validateCheckoutForm(submissionData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast('Please check the highlighted delivery fields.');
      return;
    }

    setErrors({});
    const payload = buildWhatsAppOrderPayload(
      cart,
      submissionData,
      orderReference
    );
    setPreparedOrder(payload);
  };

  const handleCopyOrderText = async () => {
    if (!preparedOrder) return;
    try {
      await navigator.clipboard.writeText(preparedOrder.rawMessage);
      setCopiedMessage(true);
      showToast('Order message copied to clipboard');
      window.setTimeout(() => setCopiedMessage(false), 3000);
    } catch {
      showToast('Please select and copy the text manually below.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <button
        type="button"
        onClick={() => onNavigate('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D4AF37] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Return to Shopping Bag</span>
      </button>

      <div className="mt-4 border-b border-[#26231D] pb-6">
        <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
          DIRECT WHATSAPP ORDERING · PAKISTAN
        </p>
        <h1 className="mt-1 font-serif-display text-4xl font-semibold">
          Checkout &amp; Delivery Details
        </h1>
      </div>

      {/* Important Honest Notice about WhatsApp Ordering */}
      <div
        className={`mt-6 flex items-start gap-3 border p-4 text-xs leading-relaxed ${
          isLight
            ? 'border-[#D4AF37]/50 bg-[#FAF5E6] text-[#3D3932]'
            : 'border-[#D4AF37]/40 bg-[#171510] text-[#E8E2D5]'
        }`}
      >
        <ShieldAlert
          className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-[#F1D27A]">
            How SK PERFUMES WhatsApp Checkout Works:
          </p>
          <p className="mt-1">
            Orders are submitted by you directly via WhatsApp to{' '}
            <strong className="font-mono-num">{STORE_CONFIG.whatsappDisplay}</strong>. Because this
            storefront does not store your personal data in an external database, your generated
            order reference (<span className="font-mono-num">{orderReference}</span>) is for chat
            identification only. Your order, Cash on Delivery preference, and dispatch schedule are
            confirmed only after you send the WhatsApp message and receive confirmation from our
            seller team.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Customer Form OR Prepared WhatsApp Dispatch Panel */}
        <div className="lg:col-span-7">
          {!preparedOrder ? (
            <form
              onSubmit={handleSubmitOrder}
              noValidate
              className={`border p-6 sm:p-8 space-y-5 ${
                isLight
                  ? 'border-[#E5DEC9] bg-white'
                  : 'border-[#26231D] bg-[#141414]'
              }`}
            >
              <h2 className="font-serif-display text-2xl font-semibold">
                1. Recipient &amp; Delivery Information
              </h2>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-medium text-[#D6D0C4]"
                >
                  Customer Full Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder="e.g., Ahmed Raza Khan"
                  className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                    errors.fullName
                      ? 'border-red-500'
                      : isLight
                        ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                        : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Mobile / WhatsApp Number */}
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-medium text-[#D6D0C4]"
                >
                  WhatsApp or Mobile Number <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="e.g., 0300 1234567 or +92 300 1234567"
                  className={`mt-1.5 w-full border px-3.5 py-2.5 font-mono-num text-xs focus:border-[#D4AF37] focus:outline-none ${
                    errors.phone
                      ? 'border-red-500'
                      : isLight
                        ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                        : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* City Selection */}
              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-xs font-medium text-[#D6D0C4]"
                >
                  City (Pakistan) <span className="text-[#D4AF37]">*</span>
                </label>
                <select
                  id="checkout-city"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                    isLight
                      ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                      : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                  }`}
                >
                  {STORE_CONFIG.popularCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {formData.city === 'Other City' && (
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => {
                      setCustomCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                    }}
                    placeholder="Enter your city or town name in Pakistan"
                    className={`mt-2 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                      errors.city
                        ? 'border-red-500'
                        : isLight
                          ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                          : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                    }`}
                  />
                )}
                {errors.city && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.city}</span>
                  </p>
                )}
                <p className="mt-1 text-[11px] text-[#8C8577]">
                  Major cities ({formatPKR(STORE_CONFIG.delivery.majorCitiesFee)}) · Other cities (
                  {formatPKR(STORE_CONFIG.delivery.otherCitiesFee)}) · Complimentary on orders{' '}
                  {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}+
                </p>
              </div>

              {/* Complete Delivery Address */}
              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-[#D6D0C4]"
                >
                  Complete Delivery Address <span className="text-[#D4AF37]">*</span>
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="House / Flat No., Street, Sector / Block, Area & Nearest Landmark"
                  className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                    errors.address
                      ? 'border-red-500'
                      : isLight
                        ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                        : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* Optional Order Notes */}
              <div>
                <label
                  htmlFor="checkout-notes"
                  className="block text-xs font-medium text-[#D6D0C4]"
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  id="checkout-notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Special delivery timing instructions, gift note request, etc."
                  className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                    isLight
                      ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                      : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                  }`}
                />
              </div>

              {/* Payment Preference */}
              <div className="border-t border-[#26231D] pt-5">
                <h3 className="font-serif-display text-xl font-semibold">
                  2. Requested Payment Preference
                </h3>
                <div className="mt-3 border border-[#D4AF37] bg-[#D4AF37]/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F1D27A]">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-[#D4AF37]">Selected</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#A39E93]">
                    Pay in cash (Pakistani Rupees) upon receiving your parcel. Payment method and
                    delivery dispatch are subject to confirmation by SK PERFUMES on WhatsApp. We
                    never ask for credit card details or bank credentials on this website.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 bg-[#D4AF37] py-4 text-xs font-semibold text-[#0B0B0B] transition-colors hover:bg-[#F1D27A]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Review &amp; Generate WhatsApp Order Message</span>
              </button>
            </form>
          ) : (
            /* Step 2: Validated WhatsApp Order Ready Panel */
            <div
              className={`border p-6 sm:p-8 space-y-6 ${
                isLight
                  ? 'border-[#D4AF37] bg-white'
                  : 'border-[#D4AF37] bg-[#141414]'
              }`}
            >
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#D4AF37]">
                  ORDER MESSAGE READY TO SEND
                </p>
                <h2 className="mt-1 font-serif-display text-2xl font-semibold">
                  Complete Your Order on WhatsApp
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#A39E93]">
                  Your order details have been validated and formatted below. Click the gold button
                  below to open WhatsApp with your pre-filled order message addressed to{' '}
                  <strong className="font-mono-num text-[#F1D27A]">
                    {STORE_CONFIG.whatsappDisplay}
                  </strong>
                  . Please press <strong>Send</strong> inside WhatsApp so our seller team can
                  confirm your order.
                </p>
              </div>

              {/* Primary Direct Anchor Link (Works cleanly in all browsers and iframes) */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={preparedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 bg-[#D4AF37] px-6 py-4 text-xs font-semibold text-[#0B0B0B] transition-colors hover:bg-[#F1D27A]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Open WhatsApp &amp; Send Order</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={() => setPreparedOrder(null)}
                  className="border border-[#2A2721] px-5 py-4 text-xs font-medium text-[#D6D0C4] hover:border-[#D4AF37]"
                >
                  Edit Delivery Details
                </button>
              </div>

              {/* Fallback Instructions if WhatsApp is unavailable on current device */}
              <div className="border border-[#26231D] bg-[#0B0B0B] p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#F1D27A]">
                    Generated Order Message (Fallback Copy)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderText}
                    className="inline-flex items-center gap-1.5 border border-[#D4AF37]/50 px-3 py-1 text-xs text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
                  >
                    {copiedMessage ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap font-mono-num text-[11px] leading-relaxed text-[#D6D0C4]">
                  {preparedOrder.rawMessage}
                </pre>

                <p className="mt-3 text-[11px] text-[#8C8577]">
                  If WhatsApp Web or the WhatsApp app is not installed on this device, copy the
                  message above and send it manually via WhatsApp or SMS to{' '}
                  <strong className="font-mono-num text-[#F1D27A]">
                    {STORE_CONFIG.whatsappDisplay}
                  </strong>
                  .
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#26231D] pt-4 text-xs">
                <span className="text-[#A39E93]">
                  Already sent the message on WhatsApp?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setPreparedOrder(null);
                    onNavigate('home');
                  }}
                  className="text-xs font-semibold text-[#D4AF37] underline underline-offset-4 hover:text-[#F1D27A]"
                >
                  Clear Bag &amp; Return Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Itemized Order Breakdown */}
        <div className="lg:col-span-5">
          <div
            className={`border p-6 ${
              isLight
                ? 'border-[#E5DEC9] bg-white'
                : 'border-[#26231D] bg-[#141414]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#26231D] pb-4">
              <h2 className="font-serif-display text-2xl font-semibold">
                Order Summary
              </h2>
              <span className="font-mono-num text-xs text-[#D4AF37]">
                Ref: {orderReference}
              </span>
            </div>

            <ul className="mt-4 divide-y divide-[#26231D] text-xs">
              {cart.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-[#A39E93]">
                      Size: {item.size} · Qty: {item.quantity} ×{' '}
                      <span className="font-mono-num">{formatPKR(item.unitPrice)}</span>
                    </p>
                  </div>
                  <span className="font-mono-num font-semibold text-[#D4AF37]">
                    {formatPKR(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2.5 border-t border-[#26231D] pt-4 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#A39E93]">Subtotal</dt>
                <dd className="font-mono-num font-medium">{formatPKR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A39E93]">
                  Delivery ({effectiveCity || 'Select City'})
                </dt>
                <dd className="font-mono-num font-medium">
                  {deliveryInfo.isFree
                    ? 'Rs. 0 (Complimentary)'
                    : formatPKR(deliveryInfo.fee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#26231D] pt-3 text-sm font-semibold">
                <dt>Grand Total ({STORE_CONFIG.currencyCode})</dt>
                <dd className="font-mono-num text-base text-[#D4AF37]">
                  {formatPKR(grandTotal)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-[#26231D] pt-4 text-[11px] leading-relaxed text-[#8C8577]">
              <p>
                <strong>Delivery Charge Policy:</strong> Complimentary nationwide delivery on orders
                of {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)} or above. Below{' '}
                {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}, delivery is{' '}
                {formatPKR(STORE_CONFIG.delivery.majorCitiesFee)} for major metro cities and{' '}
                {formatPKR(STORE_CONFIG.delivery.otherCitiesFee)} for all other regions in Pakistan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
