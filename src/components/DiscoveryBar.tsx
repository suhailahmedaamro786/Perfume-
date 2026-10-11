import React from 'react';
import { Heart, Search, Sparkles, Sun, Moon, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/store';

interface DiscoveryBarProps {
  currentPage: PageRoute;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onNavigate: (page: PageRoute) => void;
}

/**
 * Secondary Discovery & Utility Strip below the main header:
 * Provides instant access to Product Search, New Arrivals, Special Offers, Wishlist, and Theme Toggle.
 */
export const DiscoveryBar: React.FC<DiscoveryBarProps> = ({
  currentPage,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNavigate,
}) => {
  const { wishlistIds, theme, toggleTheme } = useStore();
  const isLight = theme === 'light';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div
      className={`border-b px-6 py-2.5 text-xs transition-colors ${
        isLight
          ? 'border-[#E5DEC9] bg-[#F3EFE4] text-[#4A453C]'
          : 'border-[#1F1D18] bg-[#111111] text-[#A39E93]'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        {/* Quick Collection Links */}
        <div className="hidden md:flex items-center gap-5">
          <button
            type="button"
            onClick={() => onNavigate('new-arrivals')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
              currentPage === 'new-arrivals' ? 'text-[#D4AF37] font-medium' : ''
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>New Arrivals</span>
          </button>

          <span aria-hidden="true" className="text-[#3A352C]">·</span>

          <button
            type="button"
            onClick={() => onNavigate('special-offers')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
              currentPage === 'special-offers' ? 'text-[#D4AF37] font-medium' : ''
            }`}
          >
            <Tag className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>Special Offers</span>
          </button>

          <span aria-hidden="true" className="text-[#3A352C]">·</span>

          <button
            type="button"
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
              currentPage === 'about' ? 'text-[#D4AF37] font-medium' : ''
            }`}
          >
            Our House
          </button>

          <span aria-hidden="true" className="text-[#3A352C]">·</span>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37] ${
              currentPage === 'contact' ? 'text-[#D4AF37] font-medium' : ''
            }`}
          >
            WhatsApp Concierge
          </button>
        </div>

        {/* Search Input + Wishlist + Theme */}
        <div className="flex flex-1 md:flex-initial items-center justify-end gap-4">
          <form onSubmit={handleFormSubmit} className="relative flex-1 md:w-64">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#A39E93]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notes, oud, rose, amber..."
              aria-label="Search fragrances by name or note"
              className={`w-full border py-1.5 pr-3 pl-8 text-xs transition-colors focus:border-[#D4AF37] focus:outline-none ${
                isLight
                  ? 'border-[#DCD3BE] bg-white text-[#141413] placeholder-[#8C8577]'
                  : 'border-[#26231D] bg-[#171717] text-[#F9F6F0] placeholder-[#736E64]'
              }`}
            />
          </form>

          <button
            type="button"
            onClick={() => onNavigate('wishlist')}
            aria-label={`View saved wishlist (${wishlistIds.length} items)`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border whitespace-nowrap shrink-0 transition-colors ${
              currentPage === 'wishlist'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : isLight
                  ? 'border-[#DCD3BE] bg-white text-[#141413] hover:border-[#D4AF37]'
                  : 'border-[#26231D] bg-[#171717] text-[#E8E2D5] hover:border-[#D4AF37]'
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                wishlistIds.length > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
              }`}
              aria-hidden="true"
            />
            <span className="font-mono-num">Wishlist ({wishlistIds.length})</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light ivory theme' : 'Switch to dark luxury theme'
            }
            title={theme === 'dark' ? 'Switch to Ivory Theme' : 'Switch to Obsidian Theme'}
            className={`hidden sm:flex h-7 w-7 items-center justify-center border transition-colors ${
              isLight
                ? 'border-[#DCD3BE] bg-white text-[#141413] hover:border-[#D4AF37]'
                : 'border-[#26231D] bg-[#171717] text-[#D4AF37] hover:border-[#D4AF37]'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Moon className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
