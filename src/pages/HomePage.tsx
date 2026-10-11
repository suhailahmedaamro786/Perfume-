import React, { useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { LuxuryImage } from '../components/LuxuryImage';
import { ProductCard } from '../components/ProductCard';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { HERO_IMAGE, PRODUCTS } from '../data/products';
import { PageRoute } from '../types/store';
import { formatPKR } from '../utils/pricing';
import { buildWhatsAppInquiryUrl } from '../utils/whatsapp';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (slug: string) => void;
}

const FAQS = [
  {
    question: 'How do I place an order on SK PERFUMES?',
    answer:
      'Select your preferred fragrance and bottle size (30ml, 50ml, or 100ml), add it to your bag, and proceed to checkout. Fill in your delivery details in Pakistan and click "Send Order via WhatsApp". Your complete itemized order request opens directly in WhatsApp (+92 304 1333131) for personal confirmation with our team.',
  },
  {
    question: 'What are the delivery charges across Pakistan?',
    answer: `Orders with a subtotal of ${formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)} or above qualify for complimentary delivery nationwide. For orders below ${formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}, delivery is ${formatPKR(STORE_CONFIG.delivery.majorCitiesFee)} for major metropolitan cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad) and ${formatPKR(STORE_CONFIG.delivery.otherCitiesFee)} for all other cities and towns.`,
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes, Cash on Delivery (COD) is supported as a payment preference across Pakistan, subject to order verification and confirmation with our seller team on WhatsApp before dispatch.',
  },
  {
    question: 'What is the difference between Extrait de Parfum and Eau de Parfum?',
    answer:
      'Our Extrait de Parfum creations contain a higher concentration of fine fragrance oils for deeper projection and 10–14 hours of wear, while our Eaux de Parfum offer versatile, radiant diffusion ideal for both daytime and evening wear.',
  },
  {
    question: 'Are SK PERFUMES original house creations?',
    answer:
      'Yes. Every fragrance in our catalogue is an original SK PERFUMES house composition bottled in our signature flacons. We never misrepresent our creations as third-party designer brands.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { theme } = useStore();
  const isLight = theme === 'light';
  const [curatedTab, setCuratedTab] = useState<'featured' | 'best-sellers' | 'new-arrivals'>('featured');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const displayedProducts = PRODUCTS.filter((p) => {
    if (curatedTab === 'best-sellers') return p.bestSeller;
    if (curatedTab === 'new-arrivals') return p.newArrival;
    return p.featured;
  }).slice(0, 6);

  const categoryCards: {
    title: string;
    subtitle: string;
    notes: string;
    route: PageRoute;
    image: string;
  }[] = [
    {
      title: "Men's Fragrances",
      subtitle: 'Commanding & Structured',
      notes: 'Smoked Oud · Saffron Leather · Java Vetiver',
      route: 'men',
      image: PRODUCTS[1].images[0],
    },
    {
      title: "Women's Fragrances",
      subtitle: 'Radiant & Velvety',
      notes: 'Damascus Rose · Sambac Jasmine · Cashmere Wood',
      route: 'women',
      image: PRODUCTS[2].images[0],
    },
    {
      title: 'Unisex Creations',
      subtitle: 'Artisanal & Timeless',
      notes: 'Kashmiri Saffron · Baltic Amber · Calabrian Bergamot',
      route: 'unisex',
      image: PRODUCTS[3].images[0],
    },
  ];

  return (
    <div>
      {/* 1. Full-Width Cinematic Hero Section */}
      <section className="relative overflow-hidden border-b border-[#26231D] bg-[#0B0B0B] text-[#F9F6F0]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-24">
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
            {/* Left Editorial Column */}
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
                {STORE_CONFIG.brandName} · PAKISTAN
              </p>

              <h1
                className="mt-4 font-serif-display font-semibold tracking-tight text-[#F9F6F0]"
                style={{
                  fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                  lineHeight: 1.08,
                  textWrap: 'balance',
                }}
              >
                Discover Your Signature Scent.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#D6D0C4]">
                Explore captivating fragrances crafted for every moment. Composed with aged
                agarwood, Damascus rose, golden amber resin, and sunlit citrus in 30ml, 50ml, and
                100ml flacons.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2.5 bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold text-[#0B0B0B] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#F1D27A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('best-sellers')}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#D4AF37]/60 bg-transparent px-6 py-3.5 text-xs font-semibold text-[#F1D27A] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  <span>Explore Best Sellers</span>
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-y-2 gap-x-4 border-t border-[#221F1A] pt-6 text-xs text-[#A39E93]">
                <span>30ml, 50ml &amp; 100ml Sizes</span>
                <span aria-hidden="true">·</span>
                <span>Nationwide Delivery in Pakistan</span>
                <span aria-hidden="true">·</span>
                <span>Cash on Delivery Available</span>
              </div>
            </div>

            {/* Right Cinematic Hero Visual */}
            <div className="relative lg:col-span-6">
              <div className="relative h-full overflow-hidden border border-[#2A261E] bg-[#121212]">
                <LuxuryImage
                  src={HERO_IMAGE}
                  alt="Nuit d'Or Impérial bespoke black and gold crystal perfume bottle on obsidian marble"
                  aspectClassName="aspect-[16/10] lg:aspect-auto lg:h-full"
                  priority={true}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/85 via-transparent to-transparent" />
                <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#F1D27A]">Signature House Creation</p>
                    <p className="font-serif-display text-2xl font-semibold text-white">
                      Nuit d&apos;Or Impérial · Extrait de Parfum
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct('nuit-dor-imperial')}
                    className="border border-[#D4AF37] bg-[#0B0B0B]/85 px-3.5 py-2 text-xs font-medium text-[#F1D27A] whitespace-nowrap shrink-0 transition-colors hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
                  >
                    Discover Bottle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category Cards */}
      <section
        className={`border-b py-16 lg:py-20 ${
          isLight ? 'border-[#E5DEC9] bg-[#FAF7F0]' : 'border-[#1F1D18] bg-[#0E0E0E]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs tracking-[0.18em] text-[#D4AF37]">OLFACTORY WARDROBE</p>
              <h2 className="mt-2 font-serif-display text-3xl font-semibold sm:text-4xl">
                Shop by Category
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline whitespace-nowrap shrink-0"
            >
              <span>View Complete Catalogue ({PRODUCTS.length} Creations)</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {categoryCards.map((cat) => (
              <div
                key={cat.route}
                onClick={() => onNavigate(cat.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(cat.route);
                  }
                }}
                className="group relative cursor-pointer overflow-hidden border border-[#2A261E] bg-[#141414] text-left focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                <LuxuryImage
                  src={cat.image}
                  alt={cat.title}
                  aspectClassName="aspect-[4/3]"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs text-[#F1D27A]">{cat.subtitle}</p>
                  <h3 className="mt-1 font-serif-display text-2xl font-semibold text-white">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#D6D0C4]">{cat.notes}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Curated Showcase: Featured Products, Best Sellers & New Arrivals */}
      <section
        className={`border-b py-16 lg:py-24 ${
          isLight ? 'border-[#E5DEC9] bg-[#F5F1E6]' : 'border-[#1F1D18] bg-[#0B0B0B]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs tracking-[0.18em] text-[#D4AF37]">SIGNATURE FLACONS</p>
              <h2 className="mt-2 font-serif-display text-3xl font-semibold sm:text-4xl">
                Curated Fragrance Selection
              </h2>
            </div>

            {/* Interactive Filter Tabs */}
            <div
              className={`flex overflow-x-auto max-w-full items-center gap-1 border p-1 ${
                isLight ? 'border-[#DCD3BE] bg-white' : 'border-[#26231D] bg-[#141414]'
              }`}
              role="tablist"
              aria-label="Filter homepage collection"
            >
              {[
                { id: 'featured', label: 'Featured Creations' },
                { id: 'best-sellers', label: 'Best Sellers' },
                { id: 'new-arrivals', label: 'New Arrivals' },
              ].map((tab) => {
                const active = curatedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() =>
                      setCuratedTab(tab.id as 'featured' | 'best-sellers' | 'new-arrivals')
                    }
                    className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#D4AF37] text-[#0B0B0B]'
                        : isLight
                          ? 'text-[#5C564B] hover:text-[#141413]'
                          : 'text-[#A39E93] hover:text-[#F9F6F0]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Product Grid */}
          <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                theme={theme}
              />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  curatedTab === 'best-sellers'
                    ? 'best-sellers'
                    : curatedTab === 'new-arrivals'
                      ? 'new-arrivals'
                      : 'shop'
                )
              }
              className="border border-[#D4AF37] px-6 py-3 text-xs font-semibold text-[#D4AF37] whitespace-nowrap shrink-0 transition-colors hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
            >
              {curatedTab === 'best-sellers'
                ? 'View All Best Sellers'
                : curatedTab === 'new-arrivals'
                  ? 'View All New Arrivals'
                  : 'Explore All 12 Fragrances'}
            </button>
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner & Brand Story + Service Highlights */}
      <section
        className={`border-b py-16 lg:py-24 ${
          isLight ? 'border-[#E5DEC9] bg-[#FAF7F0]' : 'border-[#1F1D18] bg-[#111111]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          {/* Promotional Banner */}
          <div className="border border-[#D4AF37]/40 bg-gradient-to-r from-[#171510] via-[#1E1A12] to-[#12110E] p-8 sm:p-12 text-[#F9F6F0]">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-medium tracking-[0.2em] text-[#F1D27A]">
                  SEASONAL PRIVILEGE · PAKISTAN
                </p>
                <h2
                  className="mt-2 font-serif-display text-3xl font-semibold text-white sm:text-4xl"
                  style={{ textWrap: 'balance' }}
                >
                  Special Pricing on Selected Signature Flacons &amp; Complimentary Nationwide
                  Delivery on Orders Over{' '}
                  <span className="font-mono-num text-[#F1D27A]">
                    {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}
                  </span>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#D6D0C4]">
                  Discover our collector 100ml Extraits or experience multiple scents in 30ml and
                  50ml travel-ready flacons. Every order is carefully inspected before dispatch.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('special-offers')}
                  className="bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold text-[#0B0B0B] whitespace-nowrap shrink-0 transition-colors hover:bg-[#F1D27A]"
                >
                  Shop Special Offers
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('new-arrivals')}
                  className="border border-[#D4AF37]/60 px-5 py-3.5 text-xs font-semibold text-[#F1D27A] whitespace-nowrap shrink-0 transition-colors hover:bg-[#D4AF37]/10"
                >
                  Explore New Arrivals
                </button>
              </div>
            </div>
          </div>

          {/* Brand Story Split */}
          <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="text-xs tracking-[0.18em] text-[#D4AF37]">THE HOUSE OF SK PERFUMES</p>
              <h2
                className="mt-2 font-serif-display text-3xl font-semibold sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Luxury Fragrances. Timeless Elegance.
              </h2>
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  isLight ? 'text-[#4A453C]' : 'text-[#D6D0C4]'
                }`}
              >
                Founded with a devotion to fine perfumery for discerning clients in Pakistan, SK
                PERFUMES crafts original fragrances that honor both Eastern resinous heritage and
                contemporary French structure. From smoky Cambodian agarwood and Kashmiri saffron to
                sun-drenched Calabrian bergamot and velvet Damascus rose, each formula is composed
                for lasting presence in South Asian climates.
              </p>
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  isLight ? 'text-[#4A453C]' : 'text-[#D6D0C4]'
                }`}
              >
                Whether you select an intimate 30ml atomizer, a classic 50ml flacon, or a statement
                100ml bottle, our team personally confirms every order via WhatsApp to ensure
                accurate delivery to your doorstep.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline"
                >
                  <span>Read Our Complete Brand Story</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Three Genuine Service Highlights */}
            <div className="grid grid-cols-1 gap-5 lg:col-span-6">
              <div
                className={`border p-6 ${
                  isLight
                    ? 'border-[#E5DEC9] bg-white'
                    : 'border-[#26231D] bg-[#161616]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif-display text-xl font-semibold">
                      Direct WhatsApp Concierge Support
                    </h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isLight ? 'text-[#5C564B]' : 'text-[#A39E93]'
                      }`}
                    >
                      Speak directly with our team at{' '}
                      <span className="font-mono-num text-[#D4AF37]">
                        {STORE_CONFIG.whatsappDisplay}
                      </span>{' '}
                      for personalized scent recommendations, note comparisons, and order assistance.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border p-6 ${
                  isLight
                    ? 'border-[#E5DEC9] bg-white'
                    : 'border-[#26231D] bg-[#161616]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif-display text-xl font-semibold">
                      Transparent Nationwide Delivery in Pakistan
                    </h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isLight ? 'text-[#5C564B]' : 'text-[#A39E93]'
                      }`}
                    >
                      Clear, upfront delivery charges ({formatPKR(STORE_CONFIG.delivery.majorCitiesFee)}{' '}
                      for major cities, {formatPKR(STORE_CONFIG.delivery.otherCitiesFee)} for other
                      regions, and complimentary on orders of{' '}
                      {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}+). Protective
                      packaging for glass flacons.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border p-6 ${
                  isLight
                    ? 'border-[#E5DEC9] bg-white'
                    : 'border-[#26231D] bg-[#161616]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif-display text-xl font-semibold">
                      Privacy-First Checkout &amp; Cash on Delivery
                    </h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isLight ? 'text-[#5C564B]' : 'text-[#A39E93]'
                      }`}
                    >
                      We never ask for sensitive credit card numbers or banking passwords on our
                      website. Request Cash on Delivery and confirm payment and dispatch directly
                      with the seller on WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section
        className={`py-16 lg:py-24 ${
          isLight ? 'bg-[#F5F1E6]' : 'bg-[#0B0B0B]'
        }`}
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="text-xs tracking-[0.18em] text-[#D4AF37]">CLIENT ASSISTANCE</p>
            <h2 className="mt-2 font-serif-display text-3xl font-semibold sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 divide-y divide-[#26231D] border border-[#26231D]">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.question}
                  className={isLight ? 'bg-white' : 'bg-[#121212]'}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-serif-display text-lg font-semibold">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#D4AF37] transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      className={`px-6 pb-5 text-xs leading-relaxed ${
                        isLight ? 'text-[#4A453C]' : 'text-[#A39E93]'
                      }`}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#A39E93]">
              Need personal assistance selecting a gift or signature scent?{' '}
              <a
                href={buildWhatsAppInquiryUrl(
                  'Hello SK PERFUMES, I would like a fragrance recommendation.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#D4AF37] underline underline-offset-4 hover:text-[#F1D27A]"
              >
                Message us on WhatsApp ({STORE_CONFIG.whatsappDisplay})
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
