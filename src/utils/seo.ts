import { STORE_CONFIG } from '../config/storeConfig';
import { HERO_IMAGE, PRODUCTS } from '../data/products';
import { PageRoute, Product } from '../types/store';
import { getEffectiveVariantPrice } from './pricing';

export interface RouteSeoData {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogType: 'website' | 'product';
  image: string;
  robots: string;
  jsonLd?: Record<string, unknown>;
}

const HOME_FAQS_SCHEMA = [
  {
    '@type': 'Question',
    name: 'How do I place an order on SK PERFUMES?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Select your preferred fragrance and bottle size (30ml, 50ml, or 100ml), add it to your bag, and proceed to checkout. Fill in your delivery details in Pakistan and click Send Order via WhatsApp (+92 304 1333131) for personal confirmation with our team.',
    },
  },
  {
    '@type': 'Question',
    name: 'What are the delivery charges across Pakistan?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: `Orders with a subtotal of Rs. ${STORE_CONFIG.delivery.freeDeliveryThreshold.toLocaleString('en-PK')} or above qualify for complimentary delivery nationwide. Below that threshold, delivery is Rs. ${STORE_CONFIG.delivery.majorCitiesFee} for major cities and Rs. ${STORE_CONFIG.delivery.otherCitiesFee} for all other cities and towns.`,
    },
  },
  {
    '@type': 'Question',
    name: 'Is Cash on Delivery (COD) available?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes, Cash on Delivery (COD) is supported as a payment preference across Pakistan, subject to order verification and confirmation with our seller team on WhatsApp before dispatch.',
    },
  },
  {
    '@type': 'Question',
    name: 'Are SK PERFUMES original house creations?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes. Every fragrance in our catalogue is an original SK PERFUMES house composition bottled in our signature flacons.',
    },
  },
];

const BASE_ROUTE_META: Record<
  Exclude<PageRoute, 'product'>,
  {
    title: string;
    description: string;
    keywords: string;
    canonicalPath: string;
    breadcrumbName: string;
    robots?: string;
  }
> = {
  home: {
    title: 'SK PERFUMES — Luxury Fragrances & Fine Perfumery in Pakistan',
    description:
      'Discover your signature scent with SK PERFUMES. Explore captivating Men’s, Women’s, and Unisex Extraits & Eaux de Parfum crafted for every moment in Pakistan.',
    keywords:
      'SK PERFUMES, luxury perfumes Pakistan, oud perfume Pakistan, extrait de parfum, long lasting perfumes Karachi Lahore Islamabad, cash on delivery perfumes',
    canonicalPath: '/',
    breadcrumbName: 'Home',
  },
  shop: {
    title: 'Shop All Fragrances — SK PERFUMES Luxury Collection',
    description:
      'Browse the complete SK PERFUMES collection of Extraits and Eaux de Parfum in 30ml, 50ml, and 100ml flacons with nationwide delivery across Pakistan.',
    keywords:
      'buy perfumes online Pakistan, SK PERFUMES catalogue, 30ml 50ml 100ml perfumes, niche fragrances Pakistan',
    canonicalPath: '/?page=shop',
    breadcrumbName: 'Shop All Fragrances',
  },
  men: {
    title: "Men's Luxury Fragrances — Oud, Leather & Woods | SK PERFUMES",
    description:
      "Explore commanding Men's fragrances by SK PERFUMES featuring smoked agarwood, saffron leather, Java vetiver, and royal spices.",
    keywords:
      "men's perfumes Pakistan, oud perfume for men, leather fragrance Pakistan, long lasting men cologne SK PERFUMES",
    canonicalPath: '/?page=men',
    breadcrumbName: "Men's Fragrances",
  },
  women: {
    title: "Women's Luxury Fragrances — Rose, Jasmine & Amber | SK PERFUMES",
    description:
      "Discover radiant Women's perfumes by SK PERFUMES crafted with Damascus rose, night-blooming jasmine sambac, cashmere woods, and golden amber.",
    keywords:
      "women's perfumes Pakistan, rose amber perfume, jasmine perfume Pakistan, luxury floral fragrances SK PERFUMES",
    canonicalPath: '/?page=women',
    breadcrumbName: "Women's Fragrances",
  },
  unisex: {
    title: 'Unisex Niche Fragrances — Oud, Amber & Citrus | SK PERFUMES',
    description:
      'Shop genderless luxury fragrances by SK PERFUMES. Balanced compositions of smoked oud, creamy sandalwood, and sunlit Calabrian bergamot.',
    keywords:
      'unisex perfumes Pakistan, niche oud amber fragrances, sandalwood perfume Pakistan, SK PERFUMES unisex',
    canonicalPath: '/?page=unisex',
    breadcrumbName: 'Unisex Fragrances',
  },
  'best-sellers': {
    title: 'Best Selling Perfumes in Pakistan — SK PERFUMES Signature Icons',
    description:
      'Explore the most coveted fragrances from SK PERFUMES, chosen for exceptional longevity, sillage, and timeless character.',
    keywords:
      'best selling perfumes Pakistan, top rated fragrances SK PERFUMES, most popular oud perfume',
    canonicalPath: '/?page=best-sellers',
    breadcrumbName: 'Best Sellers',
  },
  'new-arrivals': {
    title: 'New Arrivals — Latest Fragrance Releases | SK PERFUMES',
    description:
      'Discover the newest fragrance creations from SK PERFUMES. Freshly bottled Extraits and Eaux de Parfum available in 30ml, 50ml, and 100ml.',
    keywords:
      'new perfumes Pakistan, latest fragrance releases SK PERFUMES, new extrait de parfum',
    canonicalPath: '/?page=new-arrivals',
    breadcrumbName: 'New Arrivals',
  },
  'special-offers': {
    title: 'Special Offers & Seasonal Privileges — SK PERFUMES',
    description:
      'Enjoy special pricing on selected SK PERFUMES luxury flacons and complimentary delivery across Pakistan on qualifying orders.',
    keywords:
      'perfume sale Pakistan, luxury fragrance offers, SK PERFUMES special offers',
    canonicalPath: '/?page=special-offers',
    breadcrumbName: 'Special Offers',
  },
  cart: {
    title: 'Your Shopping Bag — SK PERFUMES',
    description:
      'Review your selected SK PERFUMES fragrances, adjust bottle sizes or quantities, and proceed to WhatsApp checkout.',
    keywords: 'shopping bag, SK PERFUMES cart',
    canonicalPath: '/?page=cart',
    breadcrumbName: 'Shopping Bag',
    robots: 'noindex, follow',
  },
  checkout: {
    title: 'Checkout via WhatsApp Concierge — SK PERFUMES',
    description:
      'Complete your SK PERFUMES order request with Cash on Delivery preference and direct WhatsApp confirmation across Pakistan.',
    keywords: 'WhatsApp perfume checkout Pakistan, cash on delivery checkout',
    canonicalPath: '/?page=checkout',
    breadcrumbName: 'Checkout',
    robots: 'noindex, follow',
  },
  wishlist: {
    title: 'Saved Fragrances Wishlist — SK PERFUMES',
    description: 'View and manage your saved luxury fragrances at SK PERFUMES.',
    keywords: 'saved perfumes wishlist, SK PERFUMES',
    canonicalPath: '/?page=wishlist',
    breadcrumbName: 'Wishlist',
    robots: 'noindex, follow',
  },
  about: {
    title: 'Our Story & Craftsmanship — SK PERFUMES Pakistan',
    description:
      'Learn about SK PERFUMES, our devotion to fine fragrance oils, balanced maceration, and timeless black-and-gold presentation.',
    keywords: 'about SK PERFUMES, Pakistan luxury fragrance house, perfume craftsmanship',
    canonicalPath: '/?page=about',
    breadcrumbName: 'About Us',
  },
  contact: {
    title: 'Contact Us & WhatsApp Concierge — SK PERFUMES',
    description:
      'Connect directly with SK PERFUMES on WhatsApp at +92 304 1333131 for fragrance consultations, order inquiries, and customer support.',
    keywords: 'contact SK PERFUMES, WhatsApp perfume order Pakistan, +923041333131',
    canonicalPath: '/?page=contact',
    breadcrumbName: 'Contact Us',
  },
  'shipping-policy': {
    title: 'Shipping & Delivery Policy — SK PERFUMES Pakistan',
    description:
      'Transparent delivery charges, dispatch timelines, and Cash on Delivery terms for SK PERFUMES orders across Pakistan.',
    keywords: 'SK PERFUMES shipping policy, Pakistan courier charges, free delivery perfumes',
    canonicalPath: '/?page=shipping-policy',
    breadcrumbName: 'Shipping Policy',
  },
  'returns-policy': {
    title: 'Returns & Exchange Policy — SK PERFUMES',
    description:
      'Read our straightforward returns, damaged parcel replacement, and exchange guidelines for SK PERFUMES orders.',
    keywords: 'SK PERFUMES returns policy, fragrance exchange policy Pakistan',
    canonicalPath: '/?page=returns-policy',
    breadcrumbName: 'Returns Policy',
  },
  'privacy-policy': {
    title: 'Privacy Policy — SK PERFUMES',
    description:
      'Understand how SK PERFUMES respects your privacy, uses local browser storage for your cart, and processes WhatsApp order details.',
    keywords: 'SK PERFUMES privacy policy',
    canonicalPath: '/?page=privacy-policy',
    breadcrumbName: 'Privacy Policy',
  },
  'terms': {
    title: 'Terms & Conditions — SK PERFUMES',
    description:
      'Terms of service, pricing in Pakistani Rupees (PKR), and WhatsApp order confirmation conditions for SK PERFUMES.',
    keywords: 'SK PERFUMES terms and conditions',
    canonicalPath: '/?page=terms',
    breadcrumbName: 'Terms & Conditions',
  },
  '404': {
    title: 'Page Not Found — SK PERFUMES',
    description:
      'The page or fragrance you are looking for could not be found. Explore the SK PERFUMES collection.',
    keywords: '404 not found, SK PERFUMES',
    canonicalPath: '/?page=404',
    breadcrumbName: 'Not Found',
    robots: 'noindex, nofollow',
  },
};

export function getRouteSeoConfig(
  page: PageRoute,
  product?: Product | null,
  searchQuery?: string
): RouteSeoData {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://skperfumes.pk';

  if (page === 'product' && product) {
    const lowestPrice = Math.min(
      ...product.variants.map((v) => getEffectiveVariantPrice(v))
    );
    const highestPrice = Math.max(
      ...product.variants.map((v) => getEffectiveVariantPrice(v))
    );
    const allNotes = [
      ...product.notes.top,
      ...product.notes.heart,
      ...product.notes.base,
    ].join(', ');

    const canonicalPath = `/?product=${encodeURIComponent(product.slug)}`;
    const categoryRoute =
      product.category === "Men's"
        ? 'men'
        : product.category === "Women's"
          ? 'women'
          : 'unisex';

    return {
      title: `${product.name} (${product.concentration}) — ${STORE_CONFIG.brandName}`,
      description: `${product.name}: ${product.description} Notes: ${allNotes}. Available in 30ml, 50ml, and 100ml from Rs. ${lowestPrice.toLocaleString('en-PK')} in Pakistan.`,
      keywords: `${product.name}, ${product.category} perfume, ${product.fragranceFamily}, ${allNotes}, SK PERFUMES Pakistan`,
      canonicalPath,
      ogType: 'product',
      image: product.images[0] || HERO_IMAGE,
      robots: 'index, follow',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${origin}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: `${product.category} Fragrances`,
                item: `${origin}/?page=${categoryRoute}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: `${origin}${canonicalPath}`,
              },
            ],
          },
          {
            '@type': 'Product',
            name: product.name,
            description: product.description,
            sku: product.id,
            url: `${origin}${canonicalPath}`,
            image: product.images.map((img) =>
              img.startsWith('http') ? img : `${origin}${img}`
            ),
            category: `${product.category} Fragrance (${product.fragranceFamily})`,
            brand: {
              '@type': 'Brand',
              name: STORE_CONFIG.brandName,
              slogan: STORE_CONFIG.tagline,
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
              offers: product.variants.map((v) => ({
                '@type': 'Offer',
                name: `${product.name} — ${v.size}`,
                sku: `${product.id}-${v.size}`,
                priceCurrency: STORE_CONFIG.currencyCode,
                price: getEffectiveVariantPrice(v),
                availability: v.inStock
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              })),
            },
          },
        ],
      },
    };
  }

  const baseKey = page === 'product' ? '404' : page;
  const meta = BASE_ROUTE_META[baseKey] || BASE_ROUTE_META.home;

  const trimmedSearch = (searchQuery || '').trim();
  const isCatalogueView =
    page === 'shop' ||
    page === 'men' ||
    page === 'women' ||
    page === 'unisex' ||
    page === 'best-sellers' ||
    page === 'new-arrivals' ||
    page === 'special-offers';

  const dynamicTitle =
    isCatalogueView && trimmedSearch
      ? `Search: "${trimmedSearch}" — ${meta.title}`
      : meta.title;

  const graphNodes: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement:
        page === 'home'
          ? [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${origin}/`,
              },
            ]
          : [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${origin}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: meta.breadcrumbName,
                item: `${origin}${meta.canonicalPath}`,
              },
            ],
    },
  ];

  if (page === 'home') {
    graphNodes.push(
      {
        '@type': 'WebSite',
        name: STORE_CONFIG.brandName,
        alternateName: STORE_CONFIG.tagline,
        url: `${origin}/`,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/?page=shop&q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: HOME_FAQS_SCHEMA,
      }
    );
  }

  if (isCatalogueView) {
    graphNodes.push({
      '@type': 'CollectionPage',
      name: dynamicTitle,
      description: meta.description,
      url: `${origin}${meta.canonicalPath}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.slice(0, 12).map((p, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${origin}/?product=${encodeURIComponent(p.slug)}`,
          name: p.name,
        })),
      },
    });
  }

  return {
    title: dynamicTitle,
    description: meta.description,
    keywords: meta.keywords,
    canonicalPath: meta.canonicalPath,
    ogType: 'website',
    image: HERO_IMAGE,
    robots: meta.robots || 'index, follow',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': graphNodes,
    },
  };
}
