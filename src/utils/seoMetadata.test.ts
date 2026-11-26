import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECTS } from '../data/portfolioData';
import {
  PROJECT_SEO_CONFIG,
  SECTION_SEO_CONFIG,
  buildPortfolioJsonLd,
  injectSeoIntoHtml,
  parseSeoTargetFromLocation,
  resolveSeoMetadata,
  type SeoTarget,
} from './seoMetadata';

test('all section and project SEO entries satisfy title (30-60 chars) and description (120-160 chars) guidelines', () => {
  const entries = [
    ...Object.values(SECTION_SEO_CONFIG),
    ...Object.values(PROJECT_SEO_CONFIG),
  ];

  assert.ok(entries.length >= 10, 'Expected home + 7 sections + 2 projects');

  for (const entry of entries) {
    assert.ok(
      entry.title.length >= 30 && entry.title.length <= 60,
      `Title length out of 30-60 range for ${entry.id}: "${entry.title}" (${entry.title.length})`,
    );
    assert.ok(
      entry.description.length >= 120 && entry.description.length <= 160,
      `Description length out of 120-160 range for ${entry.id}: "${entry.description}" (${entry.description.length})`,
    );
    assert.equal(entry.twitterCard, 'summary_large_image');
    assert.ok(entry.ogImagePath.startsWith('/assets/'), `Expected asset path for ${entry.id}`);
    assert.ok(entry.twitterImagePath.startsWith('/assets/'));
  }
});

test('parseSeoTargetFromLocation resolves project paths, queries, project hashes, and section hashes', () => {
  assert.equal(parseSeoTargetFromLocation({ pathname: '/projects/teamorbit' }), 'project:teamorbit');
  assert.equal(parseSeoTargetFromLocation({ pathname: '/projects/pixelcraft/' }), 'project:pixelcraft');
  assert.equal(parseSeoTargetFromLocation({ search: '?project=teamorbit' }), 'project:teamorbit');
  assert.equal(parseSeoTargetFromLocation({ hash: '#project-pixelcraft' }), 'project:pixelcraft');
  assert.equal(parseSeoTargetFromLocation({ hash: '#about' }), 'about');
  assert.equal(parseSeoTargetFromLocation({ hash: '#projects' }), 'projects');
  assert.equal(parseSeoTargetFromLocation({ hash: '#contact' }), 'contact');
  assert.equal(parseSeoTargetFromLocation({ pathname: '/', hash: '' }), 'home');
  assert.equal(parseSeoTargetFromLocation({ pathname: '/projects/unknown' }), 'home');
});

test('resolveSeoMetadata resolves absolute Open Graph, Twitter, and canonical URLs per project and section', () => {
  const origin = 'https://smitmorjariya.vercel.app';

  for (const project of PROJECTS) {
    const target: SeoTarget = `project:${project.id}`;
    const meta = resolveSeoMetadata(target, origin);

    assert.equal(meta.ogType, 'article');
    assert.equal(meta.canonicalUrl, `${origin}/projects/${project.id}`);
    assert.equal(meta.ogUrl, `${origin}/projects/${project.id}`);
    assert.equal(meta.ogImage, `${origin}${project.images[0].src}`);
    assert.equal(meta.twitterImage, `${origin}${project.images[0].src}`);
    assert.ok(meta.ogTitle.includes(project.title));
    assert.ok(meta.twitterTitle.includes(project.title));
  }

  const aboutMeta = resolveSeoMetadata('about', origin);
  assert.equal(aboutMeta.canonicalUrl, `${origin}/#about`);
  assert.equal(aboutMeta.ogUrl, `${origin}/#about`);
  assert.ok(aboutMeta.ogImage.startsWith(`${origin}/assets/`));
});

test('buildPortfolioJsonLd emits valid Schema.org graph for home and individual project pages', () => {
  const origin = 'https://smitmorjariya.vercel.app';
  const homeLd = buildPortfolioJsonLd('home', origin) as {
    '@context': string;
    '@graph': Array<{ '@type': string; itemListElement?: unknown[] }>;
  };

  assert.equal(homeLd['@context'], 'https://schema.org');
  assert.ok(homeLd['@graph'].some((node) => node['@type'] === 'WebSite'));
  assert.ok(homeLd['@graph'].some((node) => node['@type'] === 'Person'));
  const itemList = homeLd['@graph'].find((node) => node['@type'] === 'ItemList');
  assert.equal(itemList?.itemListElement?.length, PROJECTS.length);

  const projectLd = buildPortfolioJsonLd('project:pixelcraft', origin) as {
    '@graph': Array<{ '@type': string; name?: string }>;
  };
  const projectNode = projectLd['@graph'].find((node) => node['@type'] === 'SoftwareSourceCode');
  assert.ok(projectNode?.name?.includes('PixelCraft'));
});

test('injectSeoIntoHtml rewrites head Open Graph, Twitter, canonical, and JSON-LD for static project pages', () => {
  const baseHtml = `<!doctype html><html><head>
    <title>Old Title</title>
    <meta name="description" content="Old desc" />
    <meta property="og:title" content="Old OG" />
    <meta name="twitter:title" content="Old Twitter" />
  </head><body></body></html>`;

  const rendered = injectSeoIntoHtml(
    baseHtml,
    'project:teamorbit',
    'https://smitmorjariya.vercel.app',
  );

  assert.ok(rendered.includes('<title>TeamOrbit Task Manager — Smit Morjariya</title>'));
  assert.ok(rendered.includes('property="og:type" content="article"'));
  assert.ok(
    rendered.includes(
      'property="og:image" content="https://smitmorjariya.vercel.app/assets/projects/teamorbit-preview.png"',
    ),
  );
  assert.ok(
    rendered.includes(
      'name="twitter:image" content="https://smitmorjariya.vercel.app/assets/projects/teamorbit-preview.png"',
    ),
  );
  assert.ok(
    rendered.includes(
      '<link rel="canonical" href="https://smitmorjariya.vercel.app/projects/teamorbit" />',
    ),
  );
  assert.ok(rendered.includes('type="application/ld+json"'));
  assert.ok(rendered.includes('TeamOrbit — Task Management System'));
});
