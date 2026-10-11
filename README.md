# SK PERFUMES — Luxury Fragrances E-Commerce Website (Pakistan)

**Tagline:** *Luxury Fragrances. Timeless Elegance.*

A complete, production-ready luxury fragrance e-commerce web application built with **React 19**, **TypeScript**, and **Tailwind CSS** for **SK PERFUMES**, serving customers across Pakistan with **Pakistani Rupee (PKR / Rs.)** pricing, **localStorage cart & wishlist persistence**, and **direct WhatsApp click-to-chat ordering (`+92 304 1333131`)**.

---

## 1. Key Features & Architecture

- **Zero External Database Dependencies**: No Supabase, Firebase, or paid backend APIs required. Runs entirely from local TypeScript configuration and browser `localStorage`.
- **18 Complete Storefront Views**:
  1. Home (`/?page=home`)
  2. Shop All (`/?page=shop`)
  3. Men's Fragrances (`/?page=men`)
  4. Women's Fragrances (`/?page=women`)
  5. Unisex Fragrances (`/?page=unisex`)
  6. Best Sellers (`/?page=best-sellers`)
  7. New Arrivals (`/?page=new-arrivals`)
  8. Special Offers (`/?page=special-offers`)
  9. Individual Product Details (`/?product=<slug>`)
  10. Shopping Bag (`/?page=cart`)
  11. WhatsApp Checkout (`/?page=checkout`)
  12. Saved Wishlist (`/?page=wishlist`)
  13. About Us (`/?page=about`)
  14. Contact Us (`/?page=contact`)
  15. Shipping & Delivery Policy (`/?page=shipping-policy`)
  16. Returns & Exchange Policy (`/?page=returns-policy`)
  17. Privacy Policy (`/?page=privacy-policy`)
  18. Terms & Conditions (`/?page=terms`)
  19. Custom 404 Page (`/?page=404`)

---

## 2. Installation & Local Development

### Prerequisites
- **Node.js** v18+ and **npm**

### Setup Steps
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server on port 3000
npm run dev

# 3. Type-check the codebase
npm run lint

# 4. Build production bundle
npm run build
```

---

## 3. Editing Products & Prices (`src/data/products.ts`)

All 12 sample fragrances live in [`src/data/products.ts`](src/data/products.ts).
Each product entry follows the `Product` interface in [`src/types/store.ts`](src/types/store.ts):

```ts
{
  id: 'sk-001',
  slug: 'nuit-dor-imperial',
  name: "Nuit d'Or Impérial",
  subtitle: 'Smoked Agarwood, Kashmiri Saffron & Golden Amber',
  concentration: 'Extrait de Parfum',
  category: 'Unisex', // "Men's" | "Women's" | "Unisex"
  fragranceFamily: 'Oud & Woody',
  variants: [
    { size: '30ml', price: 3800, salePrice: 3400, inStock: true },
    { size: '50ml', price: 5800, salePrice: 5200, inStock: true },
    { size: '100ml', price: 9500, salePrice: 8500, inStock: true },
  ],
  // ...
}
```
- **To change prices**: Update `price` (and optional `salePrice`) in PKR for any size variant (`30ml`, `50ml`, `100ml`).
- **Cart synchronization**: `StoreContext` automatically re-syncs stored cart items against `src/data/products.ts` on page load so displayed totals always reflect current product data.

---

## 4. Configuring Delivery Charges (`src/config/storeConfig.ts`)

Delivery charges and brand settings are centralized in [`src/config/storeConfig.ts`](src/config/storeConfig.ts):

- **`freeDeliveryThreshold`**: Default `10000` (Orders of Rs. 10,000 or above receive complimentary Rs. 0 delivery).
- **`majorCitiesFee`**: Default `250` (Rs. 250 for Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad).
- **`otherCitiesFee`**: Default `350` (Rs. 350 for all other cities and towns across Pakistan).

---

## 5. Testing WhatsApp Ordering

1. Add one or more fragrances (in 30ml, 50ml, or 100ml) to your Shopping Bag.
2. Navigate to **Checkout** (`/?page=checkout`).
3. Try submitting an empty or invalid form first to verify field validation.
4. Enter valid recipient details (Full Name, Pakistani Mobile/WhatsApp number, City, Complete Address, optional Notes) and click **Review & Generate WhatsApp Order Message**.
5. Click **Open WhatsApp & Send Order** to launch `https://wa.me/923041333131?text=ENCODED_MESSAGE` in a new tab, or use the **Copy Message** fallback button.

---

## 6. Deploying to GitHub & Vercel

1. Push the repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Use the default **Vite** framework preset:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. No environment variables or database credentials are required.
