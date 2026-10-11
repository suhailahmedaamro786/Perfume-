import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PRODUCTS } from '../data/products';
import { CartItem, Product } from '../types/store';
import { getEffectiveVariantPrice } from '../utils/pricing';

const CART_STORAGE_KEY = 'sk_perfumes_cart_v1';
const WISHLIST_STORAGE_KEY = 'sk_perfumes_wishlist_v1';
const THEME_STORAGE_KEY = 'sk_perfumes_theme_v1';

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type?: 'gold' | 'info';
}

interface StoreContextValue {
  cart: CartItem[];
  wishlistIds: string[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  addToCart: (product: Product, size: '30ml' | '50ml' | '100ml', quantity?: number) => void;
  removeFromCart: (productId: string, size: '30ml' | '50ml' | '100ml') => void;
  updateCartQuantity: (productId: string, size: '30ml' | '50ml' | '100ml', quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message?: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function safeLoadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Re-sync prices with current PRODUCTS source of truth so prices are never stale or tampered
    const validItems: CartItem[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry.productId !== 'string' || typeof entry.size !== 'string') continue;
      const product = PRODUCTS.find((p) => p.id === entry.productId);
      if (!product) continue;
      const variant = product.variants.find((v) => v.size === entry.size);
      if (!variant || !variant.inStock) continue;

      const qty = Math.max(1, Math.min(20, Number(entry.quantity) || 1));
      validItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        concentration: product.concentration,
        image: product.images[0] || '',
        size: variant.size,
        unitPrice: getEffectiveVariantPrice(variant),
        regularPrice: variant.price,
        quantity: qty,
      });
    }
    return validItems;
  } catch {
    return [];
  }
}

function safeLoadWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string' && PRODUCTS.some((p) => p.id === id));
  } catch {
    return [];
  }
}

function safeLoadTheme(): 'dark' | 'light' {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return raw === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => safeLoadCart());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => safeLoadWishlist());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => safeLoadTheme());
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore
    }
  }, [theme]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, message, type: 'gold' }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3200);
    },
    [dismissToast]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const addToCart = useCallback(
    (product: Product, size: '30ml' | '50ml' | '100ml', quantity = 1) => {
      const variant = product.variants.find((v) => v.size === size);
      if (!variant || !variant.inStock) return;

      const safeQty = Math.max(1, Math.min(20, Math.round(quantity)));
      const unitPrice = getEffectiveVariantPrice(variant);

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === product.id && item.size === size
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = Math.min(20, updated[existingIndex].quantity + safeQty);
          updated[existingIndex] = {
            ...updated[existingIndex],
            unitPrice,
            regularPrice: variant.price,
            quantity: newQty,
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            concentration: product.concentration,
            image: product.images[0] || '',
            size,
            unitPrice,
            regularPrice: variant.price,
            quantity: safeQty,
          },
        ];
      });

      showToast(
        `Added to Bag`,
        `${product.name} (${size}) × ${safeQty}`
      );
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string, size: '30ml' | '50ml' | '100ml') => {
      setCart((prev) =>
        prev.filter((item) => !(item.productId === productId && item.size === size))
      );
      showToast('Removed from Bag');
    },
    [showToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, size: '30ml' | '50ml' | '100ml', quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, size);
        return;
      }
      const safeQty = Math.max(1, Math.min(20, Math.round(quantity)));
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: safeQty }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          if (product) showToast('Removed from Wishlist', product.name);
          return prev.filter((id) => id !== productId);
        } else {
          if (product) showToast('Saved to Wishlist', product.name);
          return [...prev, productId];
        }
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlistIds,
        theme,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside a StoreProvider');
  }
  return ctx;
}
