import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/store';
import { formatPKR } from '../utils/pricing';
import { buildWhatsAppInquiryUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const whatsappDirectUrl = buildWhatsAppInquiryUrl(
    `Assalam-o-Alaikum ${STORE_CONFIG.brandName}, I would like to inquire about your fragrance collection.`
  );

  return (
    <footer
      className={`border-t transition-colors ${
        isLight
          ? 'border-[#E5DEC9] bg-[#F3EFE4] text-[#2B2823]'
          : 'border-[#221F1A] bg-[#0B0B0B] text-[#D6D0C4]'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Identity */}
          <div>
            <a
              href="/?page=home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="font-serif-display text-2xl font-semibold tracking-[0.14em] text-[#D4AF37]"
            >
              {STORE_CONFIG.brandName}
            </a>
            <p className="mt-2 font-serif-display text-base italic text-[#F1D27A]">
              {STORE_CONFIG.tagline}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#A39E93]">
              Crafted for discerning fragrance connoisseurs in Pakistan. High-concentration
              Extraits and Eaux de Parfum presented in signature black and gold flacons.
            </p>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h3 className="font-serif-display text-lg font-semibold text-[#D4AF37]">
              Fragrance Collections
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {[
                { label: 'Shop All Fragrances', route: 'shop' as PageRoute },
                { label: "Men's Fragrances", route: 'men' as PageRoute },
                { label: "Women's Fragrances", route: 'women' as PageRoute },
                { label: 'Unisex Fragrances', route: 'unisex' as PageRoute },
                { label: 'Best Sellers', route: 'best-sellers' as PageRoute },
                { label: 'New Arrivals', route: 'new-arrivals' as PageRoute },
                { label: 'Special Offers', route: 'special-offers' as PageRoute },
              ].map((link) => (
                <li key={link.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.route)}
                    className="transition-colors hover:text-[#D4AF37]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: House & Policies */}
          <div>
            <h3 className="font-serif-display text-lg font-semibold text-[#D4AF37]">
              Client Care &amp; Policies
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {[
                { label: 'About SK PERFUMES', route: 'about' as PageRoute },
                { label: 'Contact Us', route: 'contact' as PageRoute },
                { label: 'Shipping & Delivery Policy', route: 'shipping-policy' as PageRoute },
                { label: 'Returns & Exchange Policy', route: 'returns-policy' as PageRoute },
                { label: 'Privacy Policy', route: 'privacy-policy' as PageRoute },
                { label: 'Terms & Conditions', route: 'terms' as PageRoute },
              ].map((link) => (
                <li key={link.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.route)}
                    className="transition-colors hover:text-[#D4AF37]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct WhatsApp Ordering & Support */}
          <div>
            <h3 className="font-serif-display text-lg font-semibold text-[#D4AF37]">
              WhatsApp Concierge
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-[#A39E93]">
              Have a question about fragrance notes, bottle sizes, or nationwide delivery across
              Pakistan? Reach our team directly on WhatsApp.
            </p>
            <div className="mt-4 space-y-1.5 text-xs">
              <p>
                <span className="text-[#A39E93]">WhatsApp: </span>
                <span className="font-mono-num font-medium text-[#F1D27A]">
                  {STORE_CONFIG.whatsappDisplay}
                </span>
              </p>
              <p>
                <span className="text-[#A39E93]">Hours: </span>
                <span>{STORE_CONFIG.supportHours}</span>
              </p>
              <p>
                <span className="text-[#A39E93]">Complimentary Delivery: </span>
                <span className="font-mono-num">
                  Orders {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}+
                </span>
              </p>
            </div>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 border border-[#D4AF37] px-4 py-2.5 text-xs font-semibold text-[#D4AF37] whitespace-nowrap shrink-0 transition-colors hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#221F1A] pt-8 text-xs text-[#8C8577] lg:flex-row">
          <p className="text-center lg:text-left">
            &copy; {new Date().getFullYear()} {STORE_CONFIG.brandName}. All rights reserved. Prices
            shown in Pakistani Rupees ({STORE_CONFIG.currencyCode}).
          </p>
          <p className="text-center">
            Orders are placed via WhatsApp and confirmed directly with the seller prior to dispatch.
          </p>
          <p className="text-center lg:text-right whitespace-nowrap shrink-0">
            Powered by{' '}
            <span className="font-serif-display text-sm font-semibold tracking-[0.12em] text-[#D4AF37]">
              SK DEV TEAM
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
