import { STORE_CONFIG } from '../config/storeConfig';
import { PageRoute, Product } from '../types/store';
import { getEffectiveVariantPrice } from './pricing';

interface SeoMeta {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
}

const ROUTE_META: Record<Exclude<PageRoute, 'product'>, SeoMeta> = {
  home: {
    title: 'SK PERFUMES — Luxury Fragrances & Timeless Elegance in Pakistan',
    description:
      'Discover your signature scent with SK PERFUMES. Explore captivating Men’s, Women’s, and Unisex fragrances crafted for every moment in Pakistan.',
  },
  shop: {
    title: 'Shop All Fragrances — SK PERFUMES Luxury Collection',
    description:
      'Browse the complete SK PERFUMES collection of Extraits and Eaux de Parfum in 30ml, 50ml, and 100ml flacons with nationwide delivery across Pakistan.',
  },
  men: {
    title: "Men's Luxury Fragrances — Oud, Leather & Woods | SK PERFUMES",
    description:
      "Explore commanding Men's fragrances by SK PERFUMES featuring smoked agarwood, saffron leather, Java vetiver, and royal spices.",
  },
  women: {
    title: "Women's Luxury Fragrances — Rose, Jasmine & Amber | SK PERFUMES",
    description:
      "Discover radiant Women's perfumes by SK PERFUMES crafted with Damascus rose, night-blooming jasmine sambac, cashmere woods, and golden amber.",
  },
  unisex: {
    title: 'Unisex Niche Fragrances — Oud, Amber & Citrus | SK PERFUMES',
    description:
      'Shop genderless luxury fragrances by SK PERFUMES. Balanced compositions of smoked oud, creamy sandalwood, and sunlit Calabrian bergamot.',
  },
  'best-sellers': {
    title: 'Best Selling Perfumes in Pakistan — SK PERFUMES Signature Icons',
    description:
      'Explore the most coveted fragrances from SK PERFUMES, chosen for exceptional longevity, sillage, and timeless character.',
  },
  'new-arrivals': {
    title: 'New Arrivals — Latest Fragrance Releases | SK PERFUMES',
    description:
      'Discover the newest fragrance creations from SK PERFUMES. Freshly bottled Extraits and Eaux de Parfum available in 30ml, 50ml, and 100ml.',
  },
  'special-offers': {
    title: 'Special Offers & Seasonal Privileges — SK PERFUMES',
    description:
      'Enjoy special pricing on selected SK PERFUMES luxury flacons and complimentary delivery across Pakistan on qualifying orders.',
  },
  cart: {
    title: 'Your Shopping Bag — SK PERFUMES',
    description:
      'Review your selected SK PERFUMES fragrances, adjust bottle sizes or quantities, and proceed to WhatsApp checkout.',
  },
  checkout: {
    title: 'Checkout via WhatsApp Concierge — SK PERFUMES',
    description:
      'Complete your SK PERFUMES order request with Cash on Delivery preference and direct WhatsApp confirmation across Pakistan.',
  },
  wishlist: {
    title: 'Saved Fragrances Wishlist — SK PERFUMES',
    description: 'View and manage your saved luxury fragrances at SK PERFUMES.',
  },
  about: {
    title: 'Our Story & Craftsmanship — SK PERFUMES Pakistan',
    description:
      'Learn about SK PERFUMES, our devotion to fine fragrance oils, balanced maceration, and timeless black-and-gold presentation.',
  },
  contact: {
    title: 'Contact Us & WhatsApp Concierge — SK PERFUMES',
    description:
      'Connect directly with SK PERFUMES on WhatsApp at +92 304 1333131 for fragrance consultations, order inquiries, and customer support.',
  },
  'shipping-policy': {
    title: 'Shipping & Delivery Policy — SK PERFUMES Pakistan',
    description:
      'Transparent delivery charges, dispatch timelines, and Cash on Delivery terms for SK PERFUMES orders across Pakistan.',
  },
  'returns-policy': {
    title: 'Returns & Exchange Policy — SK PERFUMES',
    description:
      'Read our straightforward returns, damaged parcel replacement, and exchange guidelines for SK PERFUMES orders.',
  },
  'privacy-policy': {
    title: 'Privacy Policy — SK PERFUMES',
    description:
      'Understand how SK PERFUMES respects your privacy, uses local browser storage for your cart, and processes WhatsApp order details.',
  },
  terms: {
    title: 'Terms & Conditions — SK PERFUMES',
    description:
      'Terms of service, pricing in Pakistani Rupees (PKR), and WhatsApp order confirmation conditions for SK PERFUMES.',
  },
  '404': {
    title: 'Page Not Found — SK PERFUMES',
    description: 'The page or fragrance you are looking for could not be found. Explore the SK PERFUMES collection.',
  },
};

export function updateDocumentSeo(page: PageRoute, product?: Product | null): void {
  let meta: SeoMeta;

  if (page === 'product' && product) {
    const lowestPrice = Math.min(...product.variants.map((v) => getEffectiveVariantPrice(v)));
    const highestPrice = Math.max(...product.variants.map((v) => getEffectiveVariantPrice(v)));

    meta = {
      title: `${product.name} (${product.concentration}) — ${STORE_CONFIG.brandName}`,
      description: `${product.name}: ${product.description} Available in 30ml, 50ml, and 100ml from Rs. ${lowestPrice.toLocaleString('en-PK')}.`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        sku: product.id,
        category: `${product.category} Fragrance`,
        brand: {
          '@type': 'Brand',
          name: STORE_CONFIG.brandName,
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: STORE_CONFIG.currencyCode,
          lowPrice: lowestPrice,
          highPrice: highestPrice,
          offerCount: product.variants.length,
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      },
    };
  } else {
    meta = ROUTE_META[page === 'product' ? '404' : page] || ROUTE_META.home;
  }

  document.title = meta.title;

  const setMetaTag = (selector: string, content: string) => {
    const el = document.querySelector<HTMLMetaElement>(selector);
    if (el) {
      el.setAttribute('content', content);
    }
  };

  setMetaTag('meta[name="description"]', meta.description);
  setMetaTag('meta[property="og:title"]', meta.title);
  setMetaTag('meta[property="og:description"]', meta.description);
  setMetaTag('meta[name="twitter:title"]', meta.title);
  setMetaTag('meta[name="twitter:description"]', meta.description);

  // Manage dynamic Product JSON-LD script
  const existingProductSchema = document.getElementById('sk-product-jsonld');
  if (meta.jsonLd) {
    const scriptEl =
      existingProductSchema ||
      (() => {
        const s = document.createElement('script');
        s.id = 'sk-product-jsonld';
        s.type = 'application/ld+json';
        document.head.appendChild(s);
        return s;
      })();
    scriptEl.textContent = JSON.stringify(meta.jsonLd);
  } else if (existingProductSchema) {
    existingProductSchema.remove();
  }
}
