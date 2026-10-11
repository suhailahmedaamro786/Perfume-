import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { FragranceFamily, PageRoute, ProductCategory } from '../types/store';
import { getEffectiveVariantPrice, isProductOnSale } from '../utils/pricing';

interface CataloguePageProps {
  mode:
    | 'shop'
    | 'men'
    | 'women'
    | 'unisex'
    | 'best-sellers'
    | 'new-arrivals'
    | 'special-offers'
    | 'wishlist';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (slug: string) => void;
  onNavigate: (page: PageRoute) => void;
}

const FRAGRANCE_FAMILIES: FragranceFamily[] = [
  'Oud & Woody',
  'Amber & Oriental',
  'Floral & Rose',
  'Fresh & Citrus',
  'Leather & Spice',
];

const CATEGORIES: ProductCategory[] = ["Men's", "Women's", 'Unisex'];

export const CataloguePage: React.FC<CataloguePageProps> = ({
  mode,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onNavigate,
}) => {
  const { wishlistIds, theme } = useStore();
  const isLight = theme === 'light';

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedFamily, setSelectedFamily] = useState<FragranceFamily | 'All'>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<'All' | '30ml' | '50ml' | '100ml'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');

  const pageHeader = useMemo(() => {
    switch (mode) {
      case 'men':
        return {
          kicker: 'MASCULINE EXTRAITS & EAUX DE PARFUM',
          title: "Men's Fragrances",
          description:
            'Commanding compositions built around smoked agarwood, saffron leather, Java vetiver, and royal spices.',
        };
      case 'women':
        return {
          kicker: 'FEMININE EXTRAITS & EAUX DE PARFUM',
          title: "Women's Fragrances",
          description:
            'Radiant florals, velvet Damascus rose, night-blooming jasmine sambac, and warm cashmere woods.',
        };
      case 'unisex':
        return {
          kicker: 'SHARED ARTISANAL PERFUMERY',
          title: 'Unisex Fragrances',
          description:
            'Balanced, genderless creations uniting rare agarwood, golden amber resin, and sunlit Calabrian bergamot.',
        };
      case 'best-sellers':
        return {
          kicker: 'MOST COVETED FLACONS',
          title: 'Best Sellers',
          description:
            'Our signature creations most frequently requested by clients across Pakistan for longevity and presence.',
        };
      case 'new-arrivals':
        return {
          kicker: 'LATEST RELEASES',
          title: 'New Arrivals',
          description:
            'Explore the newest additions to the SK PERFUMES collection, freshly bottled in 30ml, 50ml, and 100ml.',
        };
      case 'special-offers':
        return {
          kicker: 'SEASONAL PRIVILEGES',
          title: 'Special Offers',
          description:
            'Enjoy privileged pricing on selected SK PERFUMES flacons across 30ml, 50ml, and 100ml sizes.',
        };
      case 'wishlist':
        return {
          kicker: 'PERSONAL SELECTION',
          title: 'Your Saved Wishlist',
          description:
            'Fragrances saved in your browser for future exploration or ordering.',
        };
      default:
        return {
          kicker: 'COMPLETE HOUSE COLLECTION',
          title: 'Shop All Fragrances',
          description:
            'Explore all 12 original SK PERFUMES creations. Filter by fragrance family, bottle size, or category.',
        };
    }
  }, [mode]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Page Mode constraint
      if (mode === 'men' && product.category !== "Men's") return false;
      if (mode === 'women' && product.category !== "Women's") return false;
      if (mode === 'unisex' && product.category !== 'Unisex') return false;
      if (mode === 'best-sellers' && !product.bestSeller) return false;
      if (mode === 'new-arrivals' && !product.newArrival) return false;
      if (mode === 'special-offers' && !isProductOnSale(product)) return false;
      if (mode === 'wishlist' && !wishlistIds.includes(product.id)) return false;

      // 2. Category sub-filter (when on general pages)
      if (
        mode !== 'men' &&
        mode !== 'women' &&
        mode !== 'unisex' &&
        selectedCategory !== 'All' &&
        product.category !== selectedCategory
      ) {
        return false;
      }

      // 3. Fragrance Family filter
      if (selectedFamily !== 'All' && product.fragranceFamily !== selectedFamily) {
        return false;
      }

      // 4. Size availability filter
      if (
        selectedSizeFilter !== 'All' &&
        !product.variants.some((v) => v.size === selectedSizeFilter && v.inStock)
      ) {
        return false;
      }

      // 5. Search query filter (matches name, subtitle, description, family, or any note)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const allNotes = [
          ...product.notes.top,
          ...product.notes.heart,
          ...product.notes.base,
        ]
          .join(' ')
          .toLowerCase();

        const matches =
          product.name.toLowerCase().includes(q) ||
          product.subtitle.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.fragranceFamily.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          allNotes.includes(q);

        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      // Base price comparison uses 50ml or lowest variant
      const priceA = getEffectiveVariantPrice(
        a.variants.find((v) => v.size === '50ml') || a.variants[0]
      );
      const priceB = getEffectiveVariantPrice(
        b.variants.find((v) => v.size === '50ml') || b.variants[0]
      );

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return Number(b.featured) - Number(a.featured);
    });
  }, [
    mode,
    wishlistIds,
    selectedCategory,
    selectedFamily,
    selectedSizeFilter,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedFamily !== 'All' ||
    selectedSizeFilter !== 'All' ||
    searchQuery.trim() !== '';

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedFamily('All');
    setSelectedSizeFilter('All');
    onSearchChange('');
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      {/* Page Header */}
      <div className="border-b border-[#26231D] pb-8">
        <p className="text-xs font-medium tracking-[0.2em] text-[#D4AF37]">
          {pageHeader.kicker}
        </p>
        <h1 className="mt-2 font-serif-display text-4xl font-semibold sm:text-5xl">
          {pageHeader.title}
        </h1>
        <p
          className={`mt-3 max-w-2xl text-sm leading-relaxed ${
            isLight ? 'text-[#4A453C]' : 'text-[#A39E93]'
          }`}
        >
          {pageHeader.description}
        </p>
      </div>

      {/* Filter & Sort Controls Bar */}
      <div
        className={`mt-8 flex flex-col gap-4 border p-4 lg:flex-row lg:items-center lg:justify-between ${
          isLight
            ? 'border-[#E5DEC9] bg-white'
            : 'border-[#26231D] bg-[#141414]'
        }`}
      >
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#D4AF37]">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Refine:</span>
          </div>

          {/* Category Filter (if not already locked to Men/Women/Unisex route) */}
          {mode !== 'men' && mode !== 'women' && mode !== 'unisex' && (
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as ProductCategory | 'All')
              }
              className={`w-full sm:w-auto min-h-[40px] border px-3 py-1.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                isLight
                  ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                  : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
              }`}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {/* Fragrance Family Filter */}
          <select
            aria-label="Filter by fragrance family"
            value={selectedFamily}
            onChange={(e) =>
              setSelectedFamily(e.target.value as FragranceFamily | 'All')
            }
            className={`w-full sm:w-auto min-h-[40px] border px-3 py-1.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
              isLight
                ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
            }`}
          >
            <option value="All">All Fragrance Families</option>
            {FRAGRANCE_FAMILIES.map((fam) => (
              <option key={fam} value={fam}>
                {fam}
              </option>
            ))}
          </select>

          {/* Bottle Size Filter */}
          <select
            aria-label="Filter by bottle size"
            value={selectedSizeFilter}
            onChange={(e) =>
              setSelectedSizeFilter(
                e.target.value as 'All' | '30ml' | '50ml' | '100ml'
              )
            }
            className={`w-full sm:w-auto min-h-[40px] border px-3 py-1.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
              isLight
                ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
            }`}
          >
            <option value="All">All Sizes (30ml / 50ml / 100ml)</option>
            <option value="30ml">30ml Travel Flacon</option>
            <option value="50ml">50ml Signature Flacon</option>
            <option value="100ml">100ml Collector Flacon</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex min-h-[40px] items-center justify-center gap-1 border border-[#D4AF37]/40 px-3 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 whitespace-nowrap shrink-0"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Sort Control & Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#26231D] pt-3 lg:border-t-0 lg:pt-0 sm:justify-end">
          <span className="font-mono-num text-xs text-[#A39E93]">
            Showing {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'fragrance' : 'fragrances'}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-[#A39E93] whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | 'featured'
                    | 'price-asc'
                    | 'price-desc'
                    | 'name-asc'
                )
              }
              className={`min-h-[40px] border px-3 py-1.5 text-xs focus:border-[#D4AF37] focus:outline-none ${
                isLight
                  ? 'border-[#DCD3BE] bg-[#FAF7F0] text-[#141413]'
                  : 'border-[#2A2721] bg-[#0B0B0B] text-[#F9F6F0]'
              }`}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <div
          className={`mt-10 border p-12 text-center ${
            isLight
              ? 'border-[#E5DEC9] bg-white'
              : 'border-[#26231D] bg-[#141414]'
          }`}
        >
          <h2 className="font-serif-display text-2xl font-semibold">
            {mode === 'wishlist'
              ? 'Your Wishlist is Empty'
              : 'No Matching Fragrances Found'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-[#A39E93]">
            {mode === 'wishlist'
              ? 'Explore our fragrance collections and tap the heart icon on any bottle to save it here for quick access.'
              : 'Try clearing your search query or adjusting the fragrance family and category filters.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="border border-[#D4AF37] px-5 py-2.5 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0B0B]"
              >
                Reset All Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="bg-[#D4AF37] px-5 py-2.5 text-xs font-semibold text-[#0B0B0B] hover:bg-[#F1D27A]"
            >
              Browse All Fragrances
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
