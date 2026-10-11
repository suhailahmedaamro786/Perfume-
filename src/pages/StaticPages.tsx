import React, { useState } from 'react';
import { ExternalLink, MessageCircle, Truck, ShieldCheck } from 'lucide-react';
import { LuxuryImage } from '../components/LuxuryImage';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { HERO_IMAGE } from '../data/products';
import { PageRoute } from '../types/store';
import { formatPKR } from '../utils/pricing';
import { buildWhatsAppInquiryUrl } from '../utils/whatsapp';

interface StaticPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:py-20">
      <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
        THE HOUSE OF SK PERFUMES
      </p>
      <h1 className="mt-2 font-serif-display text-4xl font-semibold sm:text-5xl">
        Luxury Fragrances. Timeless Elegance.
      </h1>

      <div className="mt-8 overflow-hidden border border-[#26231D]">
        <LuxuryImage
          src={HERO_IMAGE}
          alt="SK PERFUMES signature crystal and gold bottle"
          aspectClassName="aspect-[16/9]"
        />
      </div>

      <div
        className={`mt-10 grid grid-cols-1 gap-8 text-sm leading-relaxed md:grid-cols-2 ${
          isLight ? 'text-[#3D3932]' : 'text-[#D6D0C4]'
        }`}
      >
        <div className="space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold text-[#D4AF37]">
            Our Olfactory Philosophy
          </h2>
          <p>
            SK PERFUMES was founded with a singular ambition: to offer discerning individuals in
            Pakistan access to richly concentrated, original fragrances presented with timeless
            sophistication.
          </p>
          <p>
            Every fragrance in our collection is conceived as an original house composition—never an
            imitation or misrepresentation of third-party designer labels. We celebrate noble raw
            materials including aged agarwood (oud), Kashmiri saffron, Damascus rose, Java vetiver,
            and Calabrian bergamot.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold text-[#D4AF37]">
            Crafted for Pakistan&apos;s Climate &amp; Occasions
          </h2>
          <p>
            From warm coastal afternoons in Karachi to crisp winter evenings and festive gatherings
            in Lahore and Islamabad, climate plays a decisive role in how a perfume unfolds on skin.
          </p>
          <p>
            Our Extraits de Parfum and Eaux de Parfum are formulated for balanced projection and
            enduring base notes, available in versatile 30ml, 50ml, and 100ml flacons so you can
            discover a new scent or invest in your signature bottle.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-[#26231D] pt-8">
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
        >
          Explore the Collection
        </button>
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="border border-[#D4AF37]/60 px-6 py-3 text-xs font-semibold text-[#F1D27A] hover:bg-[#D4AF37]/10"
        >
          Contact Our Concierge
        </button>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [name, setName] = useState('');
  const [topic, setTopic] = useState('Fragrance Recommendation');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleOpenWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Please enter your name and inquiry message before opening WhatsApp.');
      return;
    }
    setError('');
    const text = `*${STORE_CONFIG.brandName} — Client Inquiry*\nName: ${name.trim()}\nTopic: ${topic}\nMessage: ${message.trim()}`;
    const url = buildWhatsAppInquiryUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directChatUrl = buildWhatsAppInquiryUrl(
    `Assalam-o-Alaikum ${STORE_CONFIG.brandName}, I would like assistance with your fragrances.`
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:py-20">
      <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
        PERSONAL CONCIERGE
      </p>
      <h1 className="mt-2 font-serif-display text-4xl font-semibold sm:text-5xl">
        Contact SK PERFUMES
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[#A39E93]">
        Connect directly with our team on WhatsApp for fragrance consultations, bottle size advice,
        or order inquiries across Pakistan.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Direct Contact Details */}
        <div className="lg:col-span-5 space-y-5">
          <div
            className={`border p-6 ${
              isLight
                ? 'border-[#E5DEC9] bg-white'
                : 'border-[#26231D] bg-[#141414]'
            }`}
          >
            <h2 className="font-serif-display text-2xl font-semibold text-[#D4AF37]">
              WhatsApp Ordering &amp; Support
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#A39E93]">
              Our official WhatsApp concierge line handles all fragrance inquiries, custom order
              requests, and delivery confirmations in Pakistan.
            </p>

            <dl className="mt-5 space-y-3 text-xs">
              <div>
                <dt className="text-[#A39E93]">Official WhatsApp Number</dt>
                <dd className="mt-0.5 font-mono-num text-base font-semibold text-[#F1D27A]">
                  {STORE_CONFIG.whatsappDisplay}
                </dd>
              </div>
              <div>
                <dt className="text-[#A39E93]">Concierge Hours</dt>
                <dd className="mt-0.5">{STORE_CONFIG.supportHours}</dd>
              </div>
              <div>
                <dt className="text-[#A39E93]">Service Area</dt>
                <dd className="mt-0.5">Nationwide Courier Delivery across Pakistan</dd>
              </div>
            </dl>

            <a
              href={directChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#D4AF37] px-5 py-3.5 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Open Direct WhatsApp Chat</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Right: Compose WhatsApp Message Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleOpenWhatsAppInquiry}
            className={`border p-6 sm:p-8 space-y-5 ${
              isLight
                ? 'border-[#E5DEC9] bg-white'
                : 'border-[#26231D] bg-[#141414]'
            }`}
          >
            <h2 className="font-serif-display text-2xl font-semibold">
              Send a Direct Message via WhatsApp
            </h2>
            <p className="text-xs text-[#A39E93]">
              Fill out the fields below to format your inquiry and open it directly in WhatsApp
              addressed to {STORE_CONFIG.whatsappDisplay}.
            </p>

            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium">
                Your Name <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                  isLight
                    ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                    : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                }`}
              />
            </div>

            <div>
              <label htmlFor="contact-topic" className="block text-xs font-medium">
                Inquiry Subject
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                  isLight
                    ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                    : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                }`}
              >
                <option value="Fragrance Recommendation">Fragrance Recommendation</option>
                <option value="Existing Order Follow-Up">Existing Order Follow-Up</option>
                <option value="Delivery & Cash on Delivery">Delivery &amp; Cash on Delivery</option>
                <option value="Bulk / Gift Order Inquiry">Bulk / Gift Order Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium">
                Message <span className="text-[#D4AF37]">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us which notes you enjoy or ask a question about an order..."
                className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                  isLight
                    ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                    : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
                }`}
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Continue to WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{
  type: 'shipping-policy' | 'returns-policy' | 'privacy-policy' | 'terms';
  onNavigate: (page: PageRoute) => void;
}> = ({ type, onNavigate }) => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:py-20">
      <div
        className={`border p-8 sm:p-12 ${
          isLight
            ? 'border-[#E5DEC9] bg-white text-[#2B2823]'
            : 'border-[#26231D] bg-[#141414] text-[#D6D0C4]'
        }`}
      >
        {type === 'shipping-policy' && (
          <div className="space-y-6 text-xs leading-relaxed">
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
              CLIENT CARE POLICY
            </p>
            <h1 className="font-serif-display text-3xl font-semibold text-[#F9F6F0] sm:text-4xl">
              Shipping &amp; Delivery Policy
            </h1>
            <p>
              SK PERFUMES delivers nationwide across Pakistan. All delivery charges are calculated
              transparently based on your order subtotal and destination city as configured in our
              store settings.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border border-[#26231D] p-4">
                <p className="font-semibold text-[#F1D27A]">Major Metro Cities</p>
                <p className="mt-1 font-mono-num text-lg font-semibold text-[#D4AF37]">
                  {formatPKR(STORE_CONFIG.delivery.majorCitiesFee)}
                </p>
                <p className="mt-1 text-[#A39E93]">
                  {STORE_CONFIG.delivery.majorCities.join(', ')}
                </p>
              </div>
              <div className="border border-[#26231D] p-4">
                <p className="font-semibold text-[#F1D27A]">All Other Cities &amp; Towns</p>
                <p className="mt-1 font-mono-num text-lg font-semibold text-[#D4AF37]">
                  {formatPKR(STORE_CONFIG.delivery.otherCitiesFee)}
                </p>
                <p className="mt-1 text-[#A39E93]">
                  Standard nationwide courier service across Pakistan.
                </p>
              </div>
              <div className="border border-[#D4AF37]/50 p-4">
                <p className="font-semibold text-[#F1D27A]">Complimentary Delivery</p>
                <p className="mt-1 font-mono-num text-lg font-semibold text-[#D4AF37]">Rs. 0</p>
                <p className="mt-1 text-[#A39E93]">
                  Automatically applied on orders with a subtotal of{' '}
                  {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)} or above.
                </p>
              </div>
            </div>

            <h2 className="font-serif-display text-xl font-semibold text-[#F1D27A]">
              Order Confirmation &amp; Dispatch Process
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Every order request is submitted by the customer via WhatsApp ({STORE_CONFIG.whatsappDisplay}).
              </li>
              <li>
                Dispatch occurs only after our seller team confirms stock availability, delivery
                address, and payment preference with you on WhatsApp.
              </li>
              <li>
                Estimated dispatch window: {STORE_CONFIG.delivery.estimatedDispatchDays}.
              </li>
              <li>
                Estimated transit time: {STORE_CONFIG.delivery.estimatedTransitDays}, subject to
                courier operations and weather or road conditions.
              </li>
            </ul>
          </div>
        )}

        {type === 'returns-policy' && (
          <div className="space-y-6 text-xs leading-relaxed">
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
              CLIENT CARE POLICY
            </p>
            <h1 className="font-serif-display text-3xl font-semibold text-[#F9F6F0] sm:text-4xl">
              Returns &amp; Exchange Policy
            </h1>
            <p>
              Because fine fragrances are personal care items, we maintain strict hygiene and
              quality standards while protecting our clients against transit damage or fulfillment
              errors.
            </p>
            <h2 className="font-serif-display text-xl font-semibold text-[#F1D27A]">
              Eligibility for Replacement or Exchange
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Damaged or Leaking Flacon on Arrival:</strong> If your perfume bottle
                arrives broken, leaking, or with an incorrect size/item compared to your confirmed
                WhatsApp order, please contact us on WhatsApp ({STORE_CONFIG.whatsappDisplay})
                within 48 hours of receiving the parcel with clear photographs of the outer box and
                bottle.
              </li>
              <li>
                <strong>Unopened &amp; Unused Items:</strong> Exchanges for a different scent may be
                requested within 5 days of delivery only if the outer packaging and atomizer remain
                completely unused and intact. Return courier charges apply for preference-based
                exchanges.
              </li>
              <li>
                <strong>Used or Sprayed Bottles:</strong> Opened or tested perfume bottles cannot be
                returned or exchanged due to hygiene regulations. We recommend ordering our 30ml
                size first when exploring a new fragrance family.
              </li>
            </ul>
          </div>
        )}

        {type === 'privacy-policy' && (
          <div className="space-y-6 text-xs leading-relaxed">
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
              DATA &amp; PRIVACY
            </p>
            <h1 className="font-serif-display text-3xl font-semibold text-[#F9F6F0] sm:text-4xl">
              Privacy Policy
            </h1>
            <p>
              SK PERFUMES is designed with a privacy-first architecture. This website operates
              without third-party tracking databases, hidden analytics scripts, or online card
              collection forms.
            </p>
            <h2 className="font-serif-display text-xl font-semibold text-[#F1D27A]">
              How Your Information is Handled
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Browser LocalStorage:</strong> Your shopping bag items, saved wishlist
                items, and theme preference are stored locally in your own web browser&apos;s{' '}
                <code>localStorage</code> so your selections persist when you refresh the page.
              </li>
              <li>
                <strong>WhatsApp Order Details:</strong> When you fill in your name, phone number,
                city, and delivery address at checkout, those details are used solely to format your
                WhatsApp order message on your device. They are transmitted only when you choose to
                send the message to our official WhatsApp number ({STORE_CONFIG.whatsappDisplay}).
              </li>
              <li>
                <strong>No Sensitive Payment Collection:</strong> We never ask for or store credit
                card numbers, CVV codes, or online banking credentials.
              </li>
            </ul>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-6 text-xs leading-relaxed">
            <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
              CONDITIONS OF USE
            </p>
            <h1 className="font-serif-display text-3xl font-semibold text-[#F9F6F0] sm:text-4xl">
              Terms &amp; Conditions
            </h1>
            <p>
              By browsing SK PERFUMES and submitting an order request via WhatsApp, you agree to the
              following transparent terms:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Original House Fragrances:</strong> All products listed on this website are
                original creations of SK PERFUMES and are not affiliated with or presented as
                third-party designer brands.
              </li>
              <li>
                <strong>Pricing &amp; Currency:</strong> All prices are listed in Pakistani Rupees (
                {STORE_CONFIG.currencyCode} / {STORE_CONFIG.currencySymbol}). Product prices and
                delivery charges are derived directly from our catalogue configuration.
              </li>
              <li>
                <strong>Order Confirmation &amp; Reference Numbers:</strong> Locally generated order
                references (e.g., <code>SK-YYMMDD-XXXX</code>) are for chat identification only and
                do not constitute an automated database record or binding contract until the customer
                sends the WhatsApp order message and SK PERFUMES confirms stock, pricing, and
                delivery details.
              </li>
              <li>
                <strong>Cash on Delivery (COD):</strong> Cash on Delivery is offered as a requested
                payment preference across Pakistan and remains subject to seller verification prior
                to dispatch.
              </li>
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3 border-t border-[#26231D] pt-6">
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="bg-[#D4AF37] px-5 py-2.5 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="border border-[#2A2721] px-5 py-2.5 text-xs text-[#D6D0C4] hover:border-[#D4AF37]"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="font-mono-num text-xs tracking-[0.2em] text-[#D4AF37]">
        ERROR 404
      </p>
      <h1 className="mt-2 font-serif-display text-4xl font-semibold sm:text-5xl">
        Page or Fragrance Not Found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-[#A39E93]">
        The page you requested does not exist or may have moved. Explore our signature fragrance
        collections below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="bg-[#D4AF37] px-6 py-3 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
        >
          Return to Homepage
        </button>
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="border border-[#D4AF37] px-6 py-3 text-xs font-semibold text-[#F1D27A] hover:bg-[#D4AF37]/10"
        >
          Browse All Fragrances
        </button>
      </div>
    </div>
  );
};
