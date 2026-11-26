import { useEffect } from 'react';
import {
  buildPortfolioJsonLd,
  resolveSeoMetadata,
  type SeoTarget,
} from '../utils/seoMetadata';

function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string,
) {
  const selector = `meta[${attrName}="${attrValue}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertStructuredData(payload: Record<string, unknown>) {
  const id = 'portfolio-structured-data';
  let script = document.head.querySelector<HTMLScriptElement>(`script#${id}`);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

/**
 * Synchronizes document title, canonical URL, Open Graph tags, Twitter Card tags,
 * and Schema.org JSON-LD in <head> for the currently active portfolio section or project.
 */
export function useDocumentMetadata(target: SeoTarget) {
  useEffect(() => {
    const origin = window.location.origin;
    const seo = resolveSeoMetadata(target, origin);

    document.title = seo.title;
    upsertCanonicalLink(seo.canonicalUrl);

    upsertMetaTag('name', 'description', seo.description);
    upsertMetaTag('name', 'keywords', seo.keywords);

    // Open Graph metadata
    upsertMetaTag('property', 'og:type', seo.ogType);
    upsertMetaTag('property', 'og:site_name', seo.ogSiteName);
    upsertMetaTag('property', 'og:title', seo.ogTitle);
    upsertMetaTag('property', 'og:description', seo.ogDescription);
    upsertMetaTag('property', 'og:url', seo.ogUrl);
    upsertMetaTag('property', 'og:image', seo.ogImage);
    upsertMetaTag('property', 'og:image:alt', seo.ogImageAlt);

    // Twitter / X Card metadata
    upsertMetaTag('name', 'twitter:card', seo.twitterCard);
    upsertMetaTag('name', 'twitter:title', seo.twitterTitle);
    upsertMetaTag('name', 'twitter:description', seo.twitterDescription);
    upsertMetaTag('name', 'twitter:image', seo.twitterImage);
    upsertMetaTag('name', 'twitter:image:alt', seo.twitterImageAlt);

    // Schema.org JSON-LD structured data
    upsertStructuredData(buildPortfolioJsonLd(target, origin));
  }, [target]);
}
