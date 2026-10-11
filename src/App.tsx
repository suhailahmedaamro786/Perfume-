/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { DiscoveryBar } from './components/DiscoveryBar';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { StoreProvider, useStore } from './context/StoreContext';
import { PRODUCTS } from './data/products';
import { CartPage } from './pages/CartPage';
import { CataloguePage } from './pages/CataloguePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import {
  AboutPage,
  ContactPage,
  NotFoundPage,
  PolicyPage,
} from './pages/StaticPages';
import { PageRoute } from './types/store';
import { updateDocumentSeo } from './utils/seo';

const VALID_ROUTES: PageRoute[] = [
  'home',
  'shop',
  'men',
  'women',
  'unisex',
  'best-sellers',
  'new-arrivals',
  'special-offers',
  'product',
  'cart',
  'checkout',
  'wishlist',
  'about',
  'contact',
  'shipping-policy',
  'returns-policy',
  'privacy-policy',
  'terms',
  '404',
];

function parseUrlRoute(): { page: PageRoute; productSlug: string | null } {
  try {
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get('product');
    if (productSlug) {
      const exists = PRODUCTS.some((p) => p.slug === productSlug);
      return exists
        ? { page: 'product', productSlug }
        : { page: '404', productSlug: null };
    }
    const pageParam = params.get('page');
    if (!pageParam || pageParam === 'home') {
      return { page: 'home', productSlug: null };
    }
    if (VALID_ROUTES.includes(pageParam as PageRoute)) {
      return { page: pageParam as PageRoute, productSlug: null };
    }
    return { page: '404', productSlug: null };
  } catch {
    return { page: 'home', productSlug: null };
  }
}

const AppShell: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [{ page, productSlug }, setRouteState] = useState<{
    page: PageRoute;
    productSlug: string | null;
  }>(() => parseUrlRoute());

  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateTo = useCallback((nextPage: PageRoute) => {
    setRouteState({ page: nextPage, productSlug: null });
    try {
      const url = nextPage === 'home' ? '/' : `/?page=${nextPage}`;
      window.history.pushState({}, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Ignore history security errors in restricted sandboxes
    }
  }, []);

  const selectProduct = useCallback((slug: string) => {
    const exists = PRODUCTS.some((p) => p.slug === slug);
    const targetPage: PageRoute = exists ? 'product' : '404';
    setRouteState({
      page: targetPage,
      productSlug: exists ? slug : null,
    });
    try {
      const url = exists ? `/?product=${encodeURIComponent(slug)}` : '/?page=404';
      window.history.pushState({}, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseUrlRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectedProduct = productSlug
    ? PRODUCTS.find((p) => p.slug === productSlug) || null
    : null;

  useEffect(() => {
    updateDocumentSeo(page, selectedProduct);
  }, [page, selectedProduct]);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (
      q.trim() !== '' &&
      page !== 'shop' &&
      page !== 'men' &&
      page !== 'women' &&
      page !== 'unisex' &&
      page !== 'best-sellers' &&
      page !== 'new-arrivals' &&
      page !== 'special-offers'
    ) {
      navigateTo('shop');
    }
  };

  const handleSearchSubmit = () => {
    if (
      page !== 'shop' &&
      page !== 'men' &&
      page !== 'women' &&
      page !== 'unisex'
    ) {
      navigateTo('shop');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isLight
          ? 'bg-[#FAF7F0] text-[#141413]'
          : 'bg-[#0B0B0B] text-[#F9F6F0]'
      }`}
    >
      <Header currentPage={page} onNavigate={navigateTo} />

      <DiscoveryBar
        currentPage={page}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onNavigate={navigateTo}
      />

      <main className="flex-1">
        {page === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectProduct={selectProduct}
          />
        )}

        {(page === 'shop' ||
          page === 'men' ||
          page === 'women' ||
          page === 'unisex' ||
          page === 'best-sellers' ||
          page === 'new-arrivals' ||
          page === 'special-offers' ||
          page === 'wishlist') && (
          <CataloguePage
            mode={page}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={selectProduct}
            onNavigate={navigateTo}
          />
        )}

        {page === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={navigateTo}
            onSelectProduct={selectProduct}
          />
        )}

        {page === 'product' && !selectedProduct && (
          <NotFoundPage onNavigate={navigateTo} />
        )}

        {page === 'cart' && (
          <CartPage
            onNavigate={navigateTo}
            onSelectProduct={selectProduct}
          />
        )}

        {page === 'checkout' && <CheckoutPage onNavigate={navigateTo} />}

        {page === 'about' && <AboutPage onNavigate={navigateTo} />}

        {page === 'contact' && <ContactPage />}

        {(page === 'shipping-policy' ||
          page === 'returns-policy' ||
          page === 'privacy-policy' ||
          page === 'terms') && (
          <PolicyPage type={page} onNavigate={navigateTo} />
        )}

        {page === '404' && <NotFoundPage onNavigate={navigateTo} />}
      </main>

      <Footer onNavigate={navigateTo} />

      <ToastContainer onNavigate={navigateTo} />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}

