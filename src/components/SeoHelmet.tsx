import React, { useEffect } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import { HERO_IMAGE } from '../data/products';
import { PageRoute, Product } from '../types/store';
import { getEffectiveVariantPrice } from '../utils/pricing';
import { getRouteSeoConfig } from '../utils/seo';

export interface SeoHelmetProps {
  /** Current page route identifier */
  page: PageRoute;
  /** Optional product when viewing a product detail page */
  product?: Product | null;
  /** Optional explicit title override */
  title?: string;
  /** Optional explicit description override */
  description?: string;
  /** Optional OpenGraph type override */
  ogType?: 'website' | 'product';
  /** Optional OpenGraph image path override */
  ogImage?: string;
  /** Optional robots directive (e.g., "noindex, nofollow" for 404) */
  robots?: string;
  /** Optional search query to contextualize shop titles */
  searchQuery?: string;
}

/**
 * Helper to create or update a <meta> tag in <head>
 */
function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
): void {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`
  );
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to create or update a <link> tag in <head>
 */
function upsertLinkTag(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`
  );
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Reusable Helmet-like declarative SEO component (`<SeoHelmet />`).
 * Dynamically synchronizes document.title, meta description, canonical URL,
 * robots directives, Open Graph tags, Twitter Card tags, and Schema.org JSON-LD
 * based on the active view or product.
 */
export const SeoHelmet: React.FC<SeoHelmetProps> = ({
  page,
  product,
  title,
  description,
  ogType,
  ogImage,
  robots,
  searchQuery,
}) => {
  useEffect(() => {
    const resolved = getRouteSeoConfig(page, product, searchQuery);

    const finalTitle = title || resolved.title;
    const finalDescription = description || resolved.description;
    const finalOgType = ogType || resolved.ogType;
    const finalRobots = robots || resolved.robots;

    // Resolve absolute URLs safely in browser environment
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const canonicalPath = resolved.canonicalPath;
    const canonicalUrl = `${origin}${canonicalPath}`;

    const rawImage = ogImage || resolved.image || HERO_IMAGE;
    const absoluteImageUrl = rawImage.startsWith('http')
      ? rawImage
      : `${origin}${rawImage}`;

    // 1. Update Document Title
    document.title = finalTitle;

    // 2. Standard SEO Meta Tags
    upsertMetaTag('name', 'description', finalDescription);
    upsertMetaTag('name', 'keywords', resolved.keywords);
    upsertMetaTag('name', 'robots', finalRobots);
    upsertMetaTag('name', 'author', STORE_CONFIG.brandName);
    upsertMetaTag('name', 'theme-color', '#0B0B0B');
    upsertLinkTag('canonical', canonicalUrl);

    // 3. Open Graph Metadata
    upsertMetaTag('property', 'og:site_name', STORE_CONFIG.brandName);
    upsertMetaTag('property', 'og:type', finalOgType);
    upsertMetaTag('property', 'og:title', finalTitle);
    upsertMetaTag('property', 'og:description', finalDescription);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', absoluteImageUrl);
    upsertMetaTag('property', 'og:locale', 'en_PK');

    // Product-specific OpenGraph tags when on a product page
    if (page === 'product' && product) {
      const lowestPrice = Math.min(
        ...product.variants.map((v) => getEffectiveVariantPrice(v))
      );
      upsertMetaTag('property', 'product:brand', STORE_CONFIG.brandName);
      upsertMetaTag(
        'property',
        'product:availability',
        product.inStock ? 'in stock' : 'out of stock'
      );
      upsertMetaTag('property', 'product:price:amount', String(lowestPrice));
      upsertMetaTag(
        'property',
        'product:price:currency',
        STORE_CONFIG.currencyCode
      );
    }

    // 4. Twitter Card Metadata
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', finalTitle);
    upsertMetaTag('name', 'twitter:description', finalDescription);
    upsertMetaTag('name', 'twitter:image', absoluteImageUrl);

    // 5. Dynamic Schema.org JSON-LD Structured Data
    const scriptId = 'sk-dynamic-seo-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (resolved.jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(resolved.jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [page, product, title, description, ogType, ogImage, robots, searchQuery]);

  return null;
};
