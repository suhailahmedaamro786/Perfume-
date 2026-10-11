import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/store';
import { formatPKR } from '../utils/pricing';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { cartCount, wishlistIds, theme, toggleTheme } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const isLight = theme === 'light';

  const primaryLinks: { label: string; route: PageRoute }[] = [
    { label: 'Shop All', route: 'shop' },
    { label: "Men's", route: 'men' },
    { label: "Women's", route: 'women' },
    { label: 'Unisex', route: 'unisex' },
    { label: 'Best Sellers', route: 'best-sellers' },
  ];

  const allMobileLinks: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Shop All', route: 'shop' },
    { label: "Men's Fragrances", route: 'men' },
    { label: "Women's Fragrances", route: 'women' },
    { label: 'Unisex Fragrances', route: 'unisex' },
    { label: 'Best Sellers', route: 'best-sellers' },
    { label: 'New Arrivals', route: 'new-arrivals' },
    { label: 'Special Offers', route: 'special-offers' },
    { label: `Saved Wishlist (${wishlistIds.length})`, route: 'wishlist' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact Us', route: 'contact' },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-40">
      {/* Slim Dismissible Announcement Bar (<= 36px height) */}
      {!bannerDismissed && (
        <div className="flex h-9 items-center justify-between border-b border-[#26231D] bg-[#12110E] px-4 text-xs text-[#E8E2D5]">
          <div className="mx-auto flex items-center gap-3 truncate">
            <span className="truncate">
              Complimentary delivery across Pakistan on orders of{' '}
              <strong className="font-mono-num text-[#F1D27A]">
                {formatPKR(STORE_CONFIG.delivery.freeDeliveryThreshold)}
              </strong>{' '}
              or above · Cash on Delivery available
            </span>
            <button
              type="button"
              onClick={() => handleNavClick('special-offers')}
              className="hidden underline decoration-[#D4AF37] underline-offset-4 hover:text-[#F1D27A] sm:inline whitespace-nowrap shrink-0"
            >
              View Offers
            </button>
          </div>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss announcement"
            className="ml-2 p-1 text-[#A39E93] hover:text-[#F9F6F0]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation Bar following strict 3-zone contract */}
      <header
        className={`flex items-center justify-between gap-4 sm:gap-8 border-b px-4 sm:px-6 py-3.5 sm:py-4 backdrop-blur-md transition-colors ${
          isLight
            ? 'border-[#E5DEC9] bg-[#FAF7F0]/95 text-[#141413]'
            : 'border-[#26231D] bg-[#0B0B0B]/95 text-[#F9F6F0]'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/?page=home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="font-serif-display text-xl sm:text-2xl font-semibold tracking-[0.14em] text-[#D4AF37] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
        >
          {STORE_CONFIG.brandName}
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {primaryLinks.map((item) => {
            const isActive = currentPage === item.route;
            return (
              <a
                key={item.route}
                href={`/?page=${item.route}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.route);
                }}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                  isActive
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : isLight
                      ? 'border-transparent text-[#3D3932] hover:border-[#D4AF37]/50 hover:text-[#141413]'
                      : 'border-transparent text-[#D6D0C4] hover:border-[#D4AF37]/50 hover:text-[#F9F6F0]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Shopping Bag Action (+ Mobile Menu button on small viewports) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('cart')}
            className="flex min-h-[40px] items-center gap-2 bg-[#D4AF37] px-3.5 sm:px-4 py-2 text-xs font-semibold text-[#0B0B0B] whitespace-nowrap shrink-0 transition-colors hover:bg-[#F1D27A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-mono-num">Bag ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className={`flex h-10 w-10 items-center justify-center border lg:hidden ${
              isLight
                ? 'border-[#E5DEC9] text-[#141413]'
                : 'border-[#2A2721] text-[#F9F6F0]'
            }`}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`max-h-[calc(100vh-4.5rem)] overflow-y-auto border-b px-4 sm:px-6 py-5 lg:hidden shadow-2xl ${
            isLight
              ? 'border-[#E5DEC9] bg-[#FAF7F0] text-[#141413]'
              : 'border-[#26231D] bg-[#121212] text-[#F9F6F0]'
          }`}
        >
          <nav aria-label="Mobile Navigation" className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {allMobileLinks.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleNavClick(item.route)}
                  className={`flex min-h-[44px] items-center justify-between px-2 py-2 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37]'
                      : 'hover:bg-[#D4AF37]/5'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-[#2A2721] flex items-center justify-between">
            <span className="text-xs text-[#A39E93]">Display Appearance</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="min-h-[38px] border border-[#D4AF37]/40 px-3.5 py-1.5 text-xs font-medium text-[#D4AF37] whitespace-nowrap shrink-0"
            >
              {theme === 'dark' ? 'Switch to Ivory Light' : 'Switch to Obsidian Dark'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
