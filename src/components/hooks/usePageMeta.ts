import { useEffect } from 'react';

interface ProductSchema {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
  brand?: string;
}

interface PageMetaOptions {
  title: string;
  description: string;
  image?: string;         // OG image URL
  url?: string;           // canonical URL
  type?: 'website' | 'product';
  product?: ProductSchema; // triggers JSON-LD schema
}

function setMeta(property: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setSchema(data: object) {
  let el = document.querySelector<HTMLScriptElement>('script[data-schema="product"]');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-schema', 'product');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeSchema() {
  document.querySelector('script[data-schema="product"]')?.remove();
}

export function usePageMeta(titleOrOptions: string | PageMetaOptions, description?: string) {
  useEffect(() => {
    const opts: PageMetaOptions = typeof titleOrOptions === 'string'
      ? { title: titleOrOptions, description: description ?? '' }
      : titleOrOptions;

    const siteUrl = 'https://grimmunited.com';
    const defaultImage = `${siteUrl}/assets/og-cover.jpg`;

    document.title = opts.title;

    // Basic meta
    setMeta('description', opts.description);

    // Open Graph
    setMeta('og:title', opts.title, 'property');
    setMeta('og:description', opts.description, 'property');
    setMeta('og:type', opts.type ?? 'website', 'property');
    setMeta('og:image', opts.image ?? defaultImage, 'property');
    setMeta('og:url', opts.url ?? (siteUrl + window.location.pathname), 'property');
    setMeta('og:site_name', 'Grimm United', 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', opts.title);
    setMeta('twitter:description', opts.description);
    setMeta('twitter:image', opts.image ?? defaultImage);

    // Product JSON-LD schema
    if (opts.product) {
      const p = opts.product;
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        description: p.description ?? '',
        image: p.image ?? defaultImage,
        brand: { '@type': 'Brand', name: p.brand ?? 'Grimm United' },
        offers: {
          '@type': 'Offer',
          priceCurrency: p.currency ?? 'INR',
          price: p.price ?? 0,
          availability: `https://schema.org/${p.availability ?? 'InStock'}`,
          seller: { '@type': 'Organization', name: 'Grimm United' },
        },
      });
    } else {
      removeSchema();
    }
  }, [titleOrOptions, description]);
}
