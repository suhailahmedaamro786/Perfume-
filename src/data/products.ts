import { Product } from '../types/store';
import heroPerfumeLuxuryImg from '../assets/images/hero_perfume_luxury_1791710680466.jpg';
import perfumeOudObsidianImg from '../assets/images/perfume_oud_obsidian_1791710694027.jpg';
import perfumeRoseElixirImg from '../assets/images/perfume_rose_elixir_1791710706269.jpg';
import perfumeAmberNoirImg from '../assets/images/perfume_amber_noir_1791710716336.jpg';
import perfumeCitrusGoldImg from '../assets/images/perfume_citrus_gold_1791710726567.jpg';

export const HERO_IMAGE = heroPerfumeLuxuryImg;

const IMG_OUD = perfumeOudObsidianImg;
const IMG_ROSE = perfumeRoseElixirImg;
const IMG_AMBER = perfumeAmberNoirImg;
const IMG_CITRUS = perfumeCitrusGoldImg;

/**
 * SK PERFUMES — Official Original Fragrance Catalogue
 * Easily add, edit, or update product prices, sizes, and stock status below.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'sk-001',
    slug: 'nuit-dor-imperial',
    name: "Nuit d'Or Impérial",
    subtitle: 'Smoked Agarwood, Kashmiri Saffron & Golden Amber',
    concentration: 'Extrait de Parfum',
    category: 'Unisex',
    fragranceFamily: 'Oud & Woody',
    description:
      'An opulent nocturnal composition crafted around aged resinous agarwood, warm Kashmiri saffron threads, and gilded labdanum amber.',
    story:
      "Nuit d'Or Impérial is SK PERFUMES' signature house creation. Designed for cool evenings and formal occasions in Pakistan, it opens with a luminous spice accord before settling into a velvety, long-lasting trail of dark woods and warm amber resin.",
    images: [HERO_IMAGE, IMG_OUD, IMG_AMBER],
    variants: [
      { size: '30ml', price: 3800, salePrice: 3400, inStock: true },
      { size: '50ml', price: 5800, salePrice: 5200, inStock: true },
      { size: '100ml', price: 9500, salePrice: 8500, inStock: true },
    ],
    notes: {
      top: ['Kashmiri Saffron', 'Black Cardamom', 'Bergamot Zest'],
      heart: ['Bulgarian Rose Absolute', 'Dry Cedarwood', 'Cypriol'],
      base: ['Smoked Agarwood (Oud)', 'Golden Labdanum', 'Madagascar Vanilla', 'Dark Musk'],
    },
    featured: true,
    bestSeller: true,
    newArrival: false,
    inStock: true,
    longevity: '10 – 14 Hours',
    sillage: 'Strong & Commanding',
  },
  {
    id: 'sk-002',
    slug: 'oud-noir-sovereign',
    name: 'Oud Noir Sovereign',
    subtitle: 'Charred Oud, Dark Leather & Incense Smoke',
    concentration: 'Extrait de Parfum',
    category: "Men's",
    fragranceFamily: 'Oud & Woody',
    description:
      'A commanding masculine extrait blending dark Cambodian oud wood, supple black leather, and sacred frankincense.',
    story:
      'Composed for individuals who appreciate depth and structure, Oud Noir Sovereign pairs smoky woods with dry vetiver and a refined leather base that matures gracefully on skin.',
    images: [IMG_OUD, IMG_AMBER, HERO_IMAGE],
    variants: [
      { size: '30ml', price: 3600, inStock: true },
      { size: '50ml', price: 5400, inStock: true },
      { size: '100ml', price: 8900, inStock: true },
    ],
    notes: {
      top: ['Black Peppercorn', 'Omani Frankincense', 'Elemi Resin'],
      heart: ['Full-Grain Leather', 'Smoky Birch', 'Patchouli Leaf'],
      base: ['Aged Oud Wood', 'Haitian Vetiver', 'Black Amber'],
    },
    featured: true,
    bestSeller: true,
    newArrival: false,
    inStock: true,
    longevity: '12+ Hours',
    sillage: 'Pronounced',
  },
  {
    id: 'sk-003',
    slug: 'ambre-rose-velours',
    name: 'Ambre Rose Velours',
    subtitle: 'Damascus Rose, Pink Pepper & Warm Benzoin',
    concentration: 'Eau de Parfum',
    category: "Women's",
    fragranceFamily: 'Floral & Rose',
    description:
      'A radiant floral-amber elixir weaving velvet Damascus rose petals with sparkling pink peppercorn and creamy golden benzoin.',
    story:
      'Ambre Rose Velours balances classic floral romance with modern amber warmth. Never overly sweet, the rose heart is wrapped in cashmere woods and soft vanilla bean.',
    images: [IMG_ROSE, IMG_CITRUS, HERO_IMAGE],
    variants: [
      { size: '30ml', price: 3400, salePrice: 2950, inStock: true },
      { size: '50ml', price: 5100, salePrice: 4500, inStock: true },
      { size: '100ml', price: 8200, salePrice: 7400, inStock: true },
    ],
    notes: {
      top: ['Pink Peppercorn', 'Mandarin Blossom', 'Lychee Accord'],
      heart: ['Damascus Rose Absolute', 'Peony Petals', 'Iris Butter'],
      base: ['Siam Benzoin', 'Cashmere Wood', 'White Amber', 'Soft Musk'],
    },
    featured: true,
    bestSeller: true,
    newArrival: false,
    inStock: true,
    longevity: '8 – 10 Hours',
    sillage: 'Moderate to Strong',
  },
  {
    id: 'sk-004',
    slug: 'aurora-ambre-absolu',
    name: 'Aurora Ambre Absolu',
    subtitle: 'Fossilized Amber, Roasted Tonka & Sandalwood',
    concentration: 'Extrait de Parfum',
    category: 'Unisex',
    fragranceFamily: 'Amber & Oriental',
    description:
      'A rich, enveloping amber extrait featuring Baltic amber resin, roasted Venezuelan tonka bean, and creamy Mysore-style sandalwood.',
    story:
      'Warm, meditative, and deeply comforting, Aurora Ambre Absolu glows on the skin like liquid gold. Ideal for autumn nights, festive gatherings, and intimate dinners.',
    images: [IMG_AMBER, HERO_IMAGE, IMG_OUD],
    variants: [
      { size: '30ml', price: 3700, inStock: true },
      { size: '50ml', price: 5600, inStock: true },
      { size: '100ml', price: 9200, inStock: true },
    ],
    notes: {
      top: ['Ceylon Cinnamon Bark', 'Bitter Orange', 'Nutmeg'],
      heart: ['Golden Amber Resin', 'Myrrh', 'Heliotrope'],
      base: ['Roasted Tonka Bean', 'Creamy Sandalwood', 'Benzoin Tears'],
    },
    featured: true,
    bestSeller: false,
    newArrival: true,
    inStock: true,
    longevity: '10 – 12 Hours',
    sillage: 'Strong',
  },
  {
    id: 'sk-005',
    slug: 'aura-lumiere-dor',
    name: "Aura Lumière d'Or",
    subtitle: 'Calabrian Bergamot, Neroli Petals & Crisp Cedar',
    concentration: 'Eau de Parfum',
    category: 'Unisex',
    fragranceFamily: 'Fresh & Citrus',
    description:
      'A sunlit citrus and white-floral composition built around hand-pressed Calabrian bergamot, Tunisian neroli, and clean Atlas cedar.',
    story:
      "Crafted specifically to perform in Pakistan's warm daytime climate, Aura Lumière d'Or offers crisp sophistication without losing the longevity of a fine woody base.",
    images: [IMG_CITRUS, IMG_ROSE, HERO_IMAGE],
    variants: [
      { size: '30ml', price: 3200, inStock: true },
      { size: '50ml', price: 4800, inStock: true },
      { size: '100ml', price: 7800, inStock: true },
    ],
    notes: {
      top: ['Calabrian Bergamot', 'Sicilian Lemon', 'Petitgrain'],
      heart: ['Tunisian Neroli', 'Orange Blossom', 'White Tea'],
      base: ['Atlas Cedarwood', 'Ambroxan', 'Clean Vetiver'],
    },
    featured: true,
    bestSeller: true,
    newArrival: true,
    inStock: true,
    longevity: '7 – 9 Hours',
    sillage: 'Refined & Crisp',
  },
  {
    id: 'sk-006',
    slug: 'sultan-de-lahore',
    name: 'Sultan de Lahore',
    subtitle: 'Royal Spices, Tobacco Leaf & Aged Sandalwood',
    concentration: 'Extrait de Parfum',
    category: "Men's",
    fragranceFamily: 'Leather & Spice',
    description:
      'A regal spicy-woody fragrance combining green cardamom pods, cured golden tobacco leaf, and rich sandalwood.',
    story:
      'Inspired by the architectural grandeur and heritage gardens of Lahore, this bold creation blends traditional South Asian spice warmth with contemporary French perfumery.',
    images: [IMG_OUD, HERO_IMAGE, IMG_AMBER],
    variants: [
      { size: '30ml', price: 3500, salePrice: 3100, inStock: true },
      { size: '50ml', price: 5300, salePrice: 4750, inStock: true },
      { size: '100ml', price: 8600, salePrice: 7700, inStock: true },
    ],
    notes: {
      top: ['Green Cardamom', 'Crushed Coriander', 'Ginger Root'],
      heart: ['Cured Tobacco Leaf', 'Clove Bud', 'Moroccan Cedar'],
      base: ['Aged Sandalwood', 'Leather Accord', 'Dark Vanilla'],
    },
    featured: false,
    bestSeller: true,
    newArrival: false,
    inStock: true,
    longevity: '10 – 12 Hours',
    sillage: 'Strong',
  },
  {
    id: 'sk-007',
    slug: 'jasmin-de-minuit',
    name: 'Jasmin de Minuit',
    subtitle: 'Night-Blooming Sambac Jasmine, Tuberose & Silk Musk',
    concentration: 'Eau de Parfum',
    category: "Women's",
    fragranceFamily: 'Floral & Rose',
    description:
      'An intoxicating white-floral bouquet of night-blooming jasmine sambac, creamy tuberose, and warm sandalwood.',
    story:
      'Recalling the scent of jasmine garlands carried on a warm evening breeze, Jasmin de Minuit elevates white florals with a sophisticated amber-musk foundation.',
    images: [IMG_ROSE, IMG_CITRUS, IMG_AMBER],
    variants: [
      { size: '30ml', price: 3300, inStock: true },
      { size: '50ml', price: 4900, inStock: true },
      { size: '100ml', price: 7900, inStock: true },
    ],
    notes: {
      top: ['Green Mandarin', 'Pear Blossom', 'White Peach'],
      heart: ['Jasmine Sambac Absolute', 'Indian Tuberose', 'Ylang-Ylang'],
      base: ['Sandalwood', 'Silk Musk', 'Vanilla Orchid'],
    },
    featured: false,
    bestSeller: false,
    newArrival: true,
    inStock: true,
    longevity: '8 – 10 Hours',
    sillage: 'Moderate to Strong',
  },
  {
    id: 'sk-008',
    slug: 'vetiver-monolith',
    name: 'Vétiver Monolith',
    subtitle: 'Earthy Java Vetiver, Grapefruit Peel & Oakmoss',
    concentration: 'Eau de Parfum',
    category: "Men's",
    fragranceFamily: 'Fresh & Citrus',
    description:
      'An architectural woody-citrus fragrance pairing bitter ruby grapefruit with smoky Java vetiver roots and crisp oakmoss.',
    story:
      'Tailored for boardroom precision and daily signature wear, Vétiver Monolith is dry, poised, and unmistakably refined.',
    images: [IMG_AMBER, IMG_CITRUS, IMG_OUD],
    variants: [
      { size: '30ml', price: 3100, inStock: true },
      { size: '50ml', price: 4700, inStock: true },
      { size: '100ml', price: 7600, inStock: true },
    ],
    notes: {
      top: ['Ruby Grapefruit', 'Bergamot', 'Cypress Needle'],
      heart: ['Java Vetiver', 'Geranium Leaf', 'Nutmeg'],
      base: ['Oakmoss', 'Dry Cedar', 'Ambergris Accord'],
    },
    featured: false,
    bestSeller: false,
    newArrival: false,
    inStock: true,
    longevity: '8 – 9 Hours',
    sillage: 'Moderate',
  },
  {
    id: 'sk-009',
    slug: 'soie-de-cachemire',
    name: 'Soie de Cachemire',
    subtitle: 'White Iris, Almond Milk & Warm Cashmere Woods',
    concentration: 'Eau de Parfum',
    category: "Women's",
    fragranceFamily: 'Amber & Oriental',
    description:
      'A cocooning, powdery-woody fragrance blending Florentine iris pallida, toasted almond, and soft cashmere musk.',
    story:
      'Designed like a second skin of spun silk and cashmere, Soie de Cachemire leaves a graceful, intimate aura that lingers from morning through twilight.',
    images: [IMG_CITRUS, IMG_ROSE, HERO_IMAGE],
    variants: [
      { size: '30ml', price: 3400, salePrice: 3000, inStock: true },
      { size: '50ml', price: 5200, salePrice: 4600, inStock: true },
      { size: '100ml', price: 8400, salePrice: 7500, inStock: true },
    ],
    notes: {
      top: ['Toasted Almond', 'White Violet', 'Bergamot Mist'],
      heart: ['Florentine Iris Pallida', 'Rosewater', 'Heliotrope'],
      base: ['Cashmere Wood', 'White Suede', 'Tonka Bean'],
    },
    featured: false,
    bestSeller: true,
    newArrival: false,
    inStock: true,
    longevity: '8 – 10 Hours',
    sillage: 'Intimate to Moderate',
  },
  {
    id: 'sk-010',
    slug: 'cuir-dorient-intense',
    name: "Cuir d'Orient Intense",
    subtitle: 'Saffron Leather, Juniper Berry & Smoky Guaiac Wood',
    concentration: 'Extrait de Parfum',
    category: "Men's",
    fragranceFamily: 'Leather & Spice',
    description:
      'A bold leather and spice extrait uniting aromatic juniper berry, warm saffron, and smoky South American guaiac wood.',
    story:
      "Cuir d'Orient Intense pays homage to artisan saddle-makers and spice caravans, delivering an unforgettable masculine signature.",
    images: [IMG_AMBER, IMG_OUD, HERO_IMAGE],
    variants: [
      { size: '30ml', price: 3600, inStock: true },
      { size: '50ml', price: 5500, inStock: true },
      { size: '100ml', price: 8900, inStock: true },
    ],
    notes: {
      top: ['Juniper Berry', 'Red Saffron', 'Black Cardamom'],
      heart: ['Saddle Leather', 'Violet Leaf', 'Clary Sage'],
      base: ['Smoky Guaiac Wood', 'Cade Oil', 'Black Amber'],
    },
    featured: false,
    bestSeller: false,
    newArrival: true,
    inStock: true,
    longevity: '11 – 13 Hours',
    sillage: 'Strong',
  },
  {
    id: 'sk-011',
    slug: 'santal-dor-royal',
    name: "Santal d'Or Royal",
    subtitle: 'Creamy Sandalwood, Cardamom & Papyrus Wood',
    concentration: 'Eau de Parfum',
    category: 'Unisex',
    fragranceFamily: 'Oud & Woody',
    description:
      'A meditative woody fragrance centered on velvety sandalwood, dry papyrus reed, and aromatic green cardamom.',
    story:
      "Modern, genderless, and effortlessly sophisticated, Santal d'Or Royal transitions seamlessly from daytime meetings to evening gatherings.",
    images: [IMG_CITRUS, IMG_AMBER, IMG_OUD],
    variants: [
      { size: '30ml', price: 3300, salePrice: 2850, inStock: true },
      { size: '50ml', price: 5000, salePrice: 4350, inStock: true },
      { size: '100ml', price: 8100, salePrice: 7100, inStock: true },
    ],
    notes: {
      top: ['Guatemalan Cardamom', 'Violet Accord', 'Fig Leaf'],
      heart: ['Creamy Sandalwood', 'Papyrus Wood', 'Orris Root'],
      base: ['Virginia Cedar', 'Ambrette Seed', 'Warm Musk'],
    },
    featured: false,
    bestSeller: true,
    newArrival: false,
    inStock: true,
    longevity: '9 – 11 Hours',
    sillage: 'Moderate to Strong',
  },
  {
    id: 'sk-012',
    slug: 'fleur-de-safran',
    name: 'Fleur de Safran',
    subtitle: 'Honeyed Orange Blossom, Saffron & Dark Patchouli',
    concentration: 'Extrait de Parfum',
    category: "Women's",
    fragranceFamily: 'Floral & Rose',
    description:
      'An opulent floral-oriental extrait pairing luminous Moroccan orange blossom with golden saffron and rich Indonesian patchouli.',
    story:
      'Crafted for celebratory evenings and wedding festivities, Fleur de Safran radiates warmth, elegance, and golden luminosity.',
    images: [IMG_ROSE, HERO_IMAGE, IMG_CITRUS],
    variants: [
      { size: '30ml', price: 3750, inStock: true },
      { size: '50ml', price: 5700, inStock: true },
      { size: '100ml', price: 9300, inStock: true },
    ],
    notes: {
      top: ['Golden Saffron', 'Blood Orange', 'Pink Pepper'],
      heart: ['Moroccan Orange Blossom', 'Turkish Rose', 'Wild Honey Accord'],
      base: ['Indonesian Patchouli', 'Amber Resin', 'Vanilla Bean'],
    },
    featured: false,
    bestSeller: false,
    newArrival: true,
    inStock: true,
    longevity: '10 – 13 Hours',
    sillage: 'Strong',
  },
];
