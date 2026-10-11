export type ProductCategory = "Men's" | "Women's" | "Unisex";

export type FragranceFamily =
  | 'Oud & Woody'
  | 'Amber & Oriental'
  | 'Floral & Rose'
  | 'Fresh & Citrus'
  | 'Leather & Spice';

export interface ProductSizeVariant {
  size: '30ml' | '50ml' | '100ml';
  price: number; // Regular price in PKR
  salePrice?: number; // Optional discounted price in PKR
  inStock: boolean;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  concentration: 'Extrait de Parfum' | 'Eau de Parfum';
  category: ProductCategory;
  fragranceFamily: FragranceFamily;
  description: string;
  story: string;
  images: string[];
  variants: ProductSizeVariant[];
  notes: FragranceNotes;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  inStock: boolean;
  longevity: string;
  sillage: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: ProductCategory;
  concentration: string;
  image: string;
  size: '30ml' | '50ml' | '100ml';
  unitPrice: number;
  regularPrice: number;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  paymentPreference: 'Cash on Delivery';
}

export type PageRoute =
  | 'home'
  | 'shop'
  | 'men'
  | 'women'
  | 'unisex'
  | 'best-sellers'
  | 'new-arrivals'
  | 'special-offers'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'wishlist'
  | 'about'
  | 'contact'
  | 'shipping-policy'
  | 'returns-policy'
  | 'privacy-policy'
  | 'terms'
  | '404';
