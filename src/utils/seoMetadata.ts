import { PERSONAL_INFO, PROJECTS, type ProjectItem } from '../data/portfolioData';

export type SeoSectionId =
  | 'home'
  | 'about'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'services'
  | 'contact';

export type SeoTarget = SeoSectionId | `project:${string}`;

export interface SeoMetaConfig {
  id: SeoTarget;
  title: string;
  description: string;
  keywords: string;
  ogType: 'website' | 'profile' | 'article';
  ogTitle: string;
  ogDescription: string;
  ogSiteName: string;
  ogImagePath: string;
  ogImageAlt: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImagePath: string;
  twitterImageAlt: string;
  canonicalPath: string;
}

export interface ResolvedSeoMetadata extends SeoMetaConfig {
  canonicalUrl: string;
  ogUrl: string;
  ogImage: string;
  twitterImage: string;
}

export const SITE_NAME = 'Smit Morjariya Portfolio';

export const SEO_SECTION_IDS: Exclude<SeoSectionId, 'home'>[] = [
  'about',
  'skills',
  'experience',
  'education',
  'projects',
  'services',
  'contact',
];

const DEFAULT_OG_IMAGE_PATH = '/assets/projects/teamorbit-preview.png';
const DEFAULT_OG_IMAGE_ALT =
  'Smit Morjariya Front-End Developer portfolio showcasing TeamOrbit and PixelCraft web applications';

export const SECTION_SEO_CONFIG: Record<SeoSectionId, SeoMetaConfig> = {
  home: {
    id: 'home',
    title: 'Smit Morjariya — Front-End Developer Portfolio',
    description:
      'Portfolio of Smit Morjariya, a Front-End Developer building modern, responsive web experiences with React.js, JavaScript, and Tailwind CSS.',
    keywords:
      'Smit Morjariya, Front-End Developer, React.js Developer, Junior Web Developer, Portfolio, Jetpur, Gujarat, Tailwind CSS, JavaScript',
    ogType: 'profile',
    ogTitle: 'Smit Morjariya — Front-End Developer Portfolio',
    ogDescription:
      'Portfolio of Smit Morjariya, a Front-End Developer building modern, responsive web experiences with React.js, JavaScript, and Tailwind CSS.',
    ogSiteName: SITE_NAME,
    ogImagePath: DEFAULT_OG_IMAGE_PATH,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    twitterCard: 'summary_large_image',
    twitterTitle: 'Smit Morjariya — Front-End Developer Portfolio',
    twitterDescription:
      'Portfolio of Smit Morjariya, a Front-End Developer building modern, responsive web experiences with React.js, JavaScript, and Tailwind CSS.',
    twitterImagePath: DEFAULT_OG_IMAGE_PATH,
    twitterImageAlt: DEFAULT_OG_IMAGE_ALT,
    canonicalPath: '/',
  },
  about: {
    id: 'about',
    title: 'About Smit Morjariya — Front-End Developer',
    description:
      "Learn about Smit Morjariya's B.E. Computer Science background (GTU), frontend engineering journey, and practical React.js development focus.",
    keywords:
      'About Smit Morjariya, B.E. Computer Science GTU, Noble Group of Institutions, Front-End Developer Jetpur Gujarat',
    ogType: 'profile',
    ogTitle: 'About Smit Morjariya — Front-End Developer',
    ogDescription:
      "Learn about Smit Morjariya's B.E. Computer Science background (GTU), frontend engineering journey, and practical React.js development focus.",
    ogSiteName: SITE_NAME,
    ogImagePath: PERSONAL_INFO.portraitUrl,
    ogImageAlt: 'Portrait of Smit Morjariya, Front-End Developer from Jetpur, Gujarat',
    twitterCard: 'summary_large_image',
    twitterTitle: 'About Smit Morjariya — Front-End Developer',
    twitterDescription:
      "Learn about Smit Morjariya's B.E. Computer Science background (GTU), frontend engineering journey, and practical React.js development focus.",
    twitterImagePath: PERSONAL_INFO.portraitUrl,
    twitterImageAlt: 'Portrait of Smit Morjariya, Front-End Developer from Jetpur, Gujarat',
    canonicalPath: '/#about',
  },
  skills: {
    id: 'skills',
    title: 'Technical Skills — Smit Morjariya Portfolio',
    description:
      "Explore Smit Morjariya's core frontend stack including HTML5, CSS3, JavaScript, Tailwind CSS, React.js, and daily Git, GitHub, and VS Code workflows.",
    keywords:
      'HTML5, CSS3, JavaScript, Tailwind CSS, React.js, Git, GitHub, VS Code, Google AI Studio, Front-End Developer Skills',
    ogType: 'website',
    ogTitle: 'Technical Skills — Smit Morjariya Portfolio',
    ogDescription:
      "Explore Smit Morjariya's core frontend stack including HTML5, CSS3, JavaScript, Tailwind CSS, React.js, and daily Git, GitHub, and VS Code workflows.",
    ogSiteName: SITE_NAME,
    ogImagePath: DEFAULT_OG_IMAGE_PATH,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    twitterCard: 'summary_large_image',
    twitterTitle: 'Technical Skills — Smit Morjariya Portfolio',
    twitterDescription:
      "Explore Smit Morjariya's core frontend stack including HTML5, CSS3, JavaScript, Tailwind CSS, React.js, and daily Git, GitHub, and VS Code workflows.",
    twitterImagePath: DEFAULT_OG_IMAGE_PATH,
    twitterImageAlt: DEFAULT_OG_IMAGE_ALT,
    canonicalPath: '/#skills',
  },
  experience: {
    id: 'experience',
    title: 'Internship Experience — Smit Morjariya',
    description:
      "Review Smit Morjariya's remote MERN Stack and Front-End internship experience at Zidio Development and Tech OctaNet Service.",
    keywords:
      'Zidio Development Intern, MERN Stack Development Intern, Tech OctaNet Service, Front-End Intern, Smit Morjariya',
    ogType: 'website',
    ogTitle: 'Internship Experience — Smit Morjariya',
    ogDescription:
      "Review Smit Morjariya's remote MERN Stack and Front-End internship experience at Zidio Development and Tech OctaNet Service.",
    ogSiteName: SITE_NAME,
    ogImagePath: '/assets/projects/teamorbit-preview.png',
    ogImageAlt: 'TeamOrbit MERN Stack task management dashboard built during Zidio Development internship',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Internship Experience — Smit Morjariya',
    twitterDescription:
      "Review Smit Morjariya's remote MERN Stack and Front-End internship experience at Zidio Development and Tech OctaNet Service.",
    twitterImagePath: '/assets/projects/teamorbit-preview.png',
    twitterImageAlt: 'TeamOrbit MERN Stack task management dashboard built during Zidio Development internship',
    canonicalPath: '/#experience',
  },
  education: {
    id: 'education',
    title: 'Education — B.E. CSE (GTU) | Smit Morjariya',
    description:
      'Academic background of Smit Morjariya, B.E. Computer Science & Engineering graduate from Noble Group of Institutions, Junagadh (GTU).',
    keywords:
      'B.E. Computer Science Engineering, Noble Group of Institutions Junagadh, Gujarat Technological University GTU, Smit Morjariya',
    ogType: 'website',
    ogTitle: 'Education — B.E. CSE (GTU) | Smit Morjariya',
    ogDescription:
      'Academic background of Smit Morjariya, B.E. Computer Science & Engineering graduate from Noble Group of Institutions, Junagadh (GTU).',
    ogSiteName: SITE_NAME,
    ogImagePath: PERSONAL_INFO.portraitUrl,
    ogImageAlt: 'Portrait of Smit Morjariya, B.E. Computer Science & Engineering graduate',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Education — B.E. CSE (GTU) | Smit Morjariya',
    twitterDescription:
      'Academic background of Smit Morjariya, B.E. Computer Science & Engineering graduate from Noble Group of Institutions, Junagadh (GTU).',
    twitterImagePath: PERSONAL_INFO.portraitUrl,
    twitterImageAlt: 'Portrait of Smit Morjariya, B.E. Computer Science & Engineering graduate',
    canonicalPath: '/#education',
  },
  projects: {
    id: 'projects',
    title: 'Featured Projects — Smit Morjariya Portfolio',
    description:
      'Inspect real applications built by Smit Morjariya, including the TeamOrbit MERN task manager and the live PixelCraft Creative Studio website.',
    keywords:
      'TeamOrbit Task Manager, PixelCraft Creative Studio, React.js Projects, MERN Stack Portfolio, Smit Morjariya',
    ogType: 'website',
    ogTitle: 'Featured Projects — Smit Morjariya Portfolio',
    ogDescription:
      'Inspect real applications built by Smit Morjariya, including the TeamOrbit MERN task manager and the live PixelCraft Creative Studio website.',
    ogSiteName: SITE_NAME,
    ogImagePath: '/assets/projects/teamorbit-preview.png',
    ogImageAlt: 'Featured web applications built by Smit Morjariya including TeamOrbit and PixelCraft',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Featured Projects — Smit Morjariya Portfolio',
    twitterDescription:
      'Inspect real applications built by Smit Morjariya, including the TeamOrbit MERN task manager and the live PixelCraft Creative Studio website.',
    twitterImagePath: '/assets/projects/teamorbit-preview.png',
    twitterImageAlt: 'Featured web applications built by Smit Morjariya including TeamOrbit and PixelCraft',
    canonicalPath: '/#projects',
  },
  services: {
    id: 'services',
    title: 'Front-End Services — Smit Morjariya',
    description:
      "Discover Smit Morjariya's front-end development capabilities across responsive websites, React.js applications, and modern web interfaces.",
    keywords:
      'Responsive Website Development, Frontend Development, React.js Development, Modern Web Interfaces, Smit Morjariya',
    ogType: 'website',
    ogTitle: 'Front-End Services — Smit Morjariya',
    ogDescription:
      "Discover Smit Morjariya's front-end development capabilities across responsive websites, React.js applications, and modern web interfaces.",
    ogSiteName: SITE_NAME,
    ogImagePath: '/assets/projects/pixelcraft-preview.png',
    ogImageAlt: 'PixelCraft responsive creative studio interface built by Smit Morjariya',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Front-End Services — Smit Morjariya',
    twitterDescription:
      "Discover Smit Morjariya's front-end development capabilities across responsive websites, React.js applications, and modern web interfaces.",
    twitterImagePath: '/assets/projects/pixelcraft-preview.png',
    twitterImageAlt: 'PixelCraft responsive creative studio interface built by Smit Morjariya',
    canonicalPath: '/#services',
  },
  contact: {
    id: 'contact',
    title: 'Contact Smit Morjariya — Front-End Developer',
    description:
      'Connect with Smit Morjariya for Frontend Developer, React.js Intern, and Junior Web Developer roles via email, LinkedIn, or GitHub.',
    keywords:
      'Contact Smit Morjariya, Hire Front-End Developer, React.js Intern, Junior Web Developer Gujarat',
    ogType: 'website',
    ogTitle: 'Contact Smit Morjariya — Front-End Developer',
    ogDescription:
      'Connect with Smit Morjariya for Frontend Developer, React.js Intern, and Junior Web Developer roles via email, LinkedIn, or GitHub.',
    ogSiteName: SITE_NAME,
    ogImagePath: PERSONAL_INFO.portraitUrl,
    ogImageAlt: 'Connect with Smit Morjariya, Front-End Developer',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Contact Smit Morjariya — Front-End Developer',
    twitterDescription:
      'Connect with Smit Morjariya for Frontend Developer, React.js Intern, and Junior Web Developer roles via email, LinkedIn, or GitHub.',
    twitterImagePath: PERSONAL_INFO.portraitUrl,
    twitterImageAlt: 'Connect with Smit Morjariya, Front-End Developer',
    canonicalPath: '/#contact',
  },
};

const PROJECT_SEO_COPY: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string;
  }
> = {
  teamorbit: {
    title: 'TeamOrbit Task Manager — Smit Morjariya',
    description:
      'Full-stack MERN task management system with role-based dashboards, Recharts analytics, Socket.IO chat, and Excel exports built at Zidio Development.',
    keywords:
      'TeamOrbit, Task Management System, MERN Stack, React.js, Tailwind CSS, Recharts, Socket.IO, MongoDB, Smit Morjariya',
  },
  pixelcraft: {
    title: 'PixelCraft Studio Website — Smit Morjariya',
    description:
      'Responsive creative digital agency website built with React.js, Tailwind CSS, and GSAP featuring dark editorial typography and live Vercel deployment.',
    keywords:
      'PixelCraft, Creative Studio Website, React.js, Tailwind CSS, GSAP, Responsive Web Design, Vercel, Smit Morjariya',
  },
};

export function getProjectSeoConfig(project: ProjectItem): SeoMetaConfig {
  const customCopy = PROJECT_SEO_COPY[project.id];
  const primaryImage = project.images[0];
  const title = customCopy?.title ?? `${project.title} — ${PERSONAL_INFO.name}`;
  const description = customCopy?.description ?? project.overview;
  const keywords =
    customCopy?.keywords ??
    `${project.title}, ${project.subtitle}, ${project.technologies.join(', ')}, ${PERSONAL_INFO.name}`;

  return {
    id: `project:${project.id}`,
    title,
    description,
    keywords,
    ogType: 'article',
    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE_NAME,
    ogImagePath: primaryImage?.src ?? DEFAULT_OG_IMAGE_PATH,
    ogImageAlt: primaryImage?.alt ?? `${project.title} — ${project.subtitle} preview`,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImagePath: primaryImage?.src ?? DEFAULT_OG_IMAGE_PATH,
    twitterImageAlt: primaryImage?.alt ?? `${project.title} — ${project.subtitle} preview`,
    canonicalPath: `/projects/${project.id}`,
  };
}

export const PROJECT_SEO_CONFIG: Record<string, SeoMetaConfig> = Object.fromEntries(
  PROJECTS.map((project) => [project.id, getProjectSeoConfig(project)]),
);

function normalizeOrigin(origin?: string): string {
  const fallback = PERSONAL_INFO.portfolioUrl.replace(/\/+$/, '');
  if (!origin || !/^https?:\/\//i.test(origin)) {
    return fallback;
  }
  return origin.replace(/\/+$/, '');
}

export function resolveAbsoluteUrl(pathOrUrl: string, origin?: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const base = normalizeOrigin(origin);
  if (!pathOrUrl || pathOrUrl === '/') {
    return `${base}/`;
  }
  if (pathOrUrl.startsWith('/')) {
    return `${base}${pathOrUrl}`;
  }
  return `${base}/${pathOrUrl}`;
}

export function parseSeoTargetFromLocation(location: {
  pathname?: string;
  hash?: string;
  search?: string;
}): SeoTarget {
  const pathname = (location.pathname ?? '').toLowerCase();
  const hash = (location.hash ?? '').replace(/^#/, '').toLowerCase();
  const params = new URLSearchParams(location.search ?? '');
  const queryProject = params.get('project')?.toLowerCase();

  // 1. Explicit project path: /projects/teamorbit or /projects/pixelcraft
  const pathMatch = pathname.match(/^\/projects\/([a-z0-9-]+)\/?$/);
  if (pathMatch && PROJECT_SEO_CONFIG[pathMatch[1]]) {
    return `project:${pathMatch[1]}`;
  }

  // 2. Query parameter: ?project=teamorbit
  if (queryProject && PROJECT_SEO_CONFIG[queryProject]) {
    return `project:${queryProject}`;
  }

  // 3. Project hash anchor: #project-teamorbit or #teamorbit
  if (hash.startsWith('project-')) {
    const id = hash.slice('project-'.length);
    if (PROJECT_SEO_CONFIG[id]) {
      return `project:${id}`;
    }
  }
  if (PROJECT_SEO_CONFIG[hash]) {
    return `project:${hash}`;
  }

  // 4. Section hash anchor: #about, #skills, #experience, #education, #projects, #services, #contact
  if ((SEO_SECTION_IDS as string[]).includes(hash)) {
    return hash as SeoSectionId;
  }

  return 'home';
}

export function resolveSeoMetadata(target: SeoTarget, origin?: string): ResolvedSeoMetadata {
  let config: SeoMetaConfig = SECTION_SEO_CONFIG.home;

  if (target.startsWith('project:')) {
    const projectId = target.slice('project:'.length);
    config = PROJECT_SEO_CONFIG[projectId] ?? SECTION_SEO_CONFIG.projects;
  } else if (target in SECTION_SEO_CONFIG) {
    config = SECTION_SEO_CONFIG[target as SeoSectionId];
  }

  const canonicalUrl = resolveAbsoluteUrl(config.canonicalPath, origin);
  const ogImage = resolveAbsoluteUrl(config.ogImagePath, origin);
  const twitterImage = resolveAbsoluteUrl(config.twitterImagePath, origin);

  return {
    ...config,
    canonicalUrl,
    ogUrl: canonicalUrl,
    ogImage,
    twitterImage,
  };
}

export function buildPortfolioJsonLd(target: SeoTarget, origin?: string): Record<string, unknown> {
  const baseUrl = normalizeOrigin(origin);
  const personId = `${baseUrl}/#person`;

  const personNode = {
    '@type': 'Person',
    '@id': personId,
    name: PERSONAL_INFO.name,
    jobTitle: PERSONAL_INFO.title,
    url: `${baseUrl}/`,
    email: `mailto:${PERSONAL_INFO.email}`,
    image: resolveAbsoluteUrl(PERSONAL_INFO.portraitUrl, baseUrl),
    sameAs: [PERSONAL_INFO.githubUrl, PERSONAL_INFO.linkedinUrl],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jetpur',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Noble Group of Institutions, Junagadh (Gujarat Technological University)',
    },
    knowsAbout: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'Tailwind CSS',
      'React.js',
      'Git',
      'GitHub',
      'VS Code',
      'Google AI Studio',
    ],
  };

  const buildProjectNode = (project: ProjectItem) => {
    const seo = resolveSeoMetadata(`project:${project.id}`, baseUrl);
    return {
      '@type': 'SoftwareSourceCode',
      '@id': `${baseUrl}/projects/${project.id}#project`,
      name: `${project.title} — ${project.subtitle}`,
      description: seo.description,
      url: project.liveUrl ?? seo.canonicalUrl,
      codeRepository: project.githubUrl,
      image: seo.ogImage,
      programmingLanguage: project.technologies,
      dateCreated: project.year,
      author: { '@id': personId },
      creator: { '@id': personId },
    };
  };

  if (target.startsWith('project:')) {
    const projectId = target.slice('project:'.length);
    const project = PROJECTS.find((item) => item.id === projectId);
    if (project) {
      const seo = resolveSeoMetadata(target, baseUrl);
      return {
        '@context': 'https://schema.org',
        '@graph': [
          personNode,
          {
            '@type': 'WebPage',
            '@id': seo.canonicalUrl,
            url: seo.canonicalUrl,
            name: seo.title,
            description: seo.description,
            isPartOf: { '@id': `${baseUrl}/#website` },
            mainEntity: { '@id': `${baseUrl}/projects/${project.id}#project` },
          },
          buildProjectNode(project),
        ],
      };
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: `${baseUrl}/`,
        name: SITE_NAME,
        description: SECTION_SEO_CONFIG.home.description,
        author: { '@id': personId },
      },
      personNode,
      {
        '@type': 'ItemList',
        name: 'Featured Projects by Smit Morjariya',
        itemListElement: PROJECTS.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: buildProjectNode(project),
        })),
      },
    ],
  };
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceMetaTag(
  html: string,
  attrName: 'name' | 'property',
  attrValue: string,
  content: string,
): string {
  const escapedContent = escapeHtmlAttr(content);
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attrName}="${attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*\\/?>`,
    'i',
  );
  const replacement = `<meta ${attrName}="${attrValue}" content="${escapedContent}" />`;
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

/**
 * Rewrites static HTML head tags (title, description, canonical, Open Graph, Twitter Cards, and JSON-LD)
 * so pre-rendered static project routes serve full project-specific social share previews without JS.
 */
export function injectSeoIntoHtml(html: string, target: SeoTarget, origin?: string): string {
  const seo = resolveSeoMetadata(target, origin);
  const jsonLd = JSON.stringify(buildPortfolioJsonLd(target, origin));

  let output = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(seo.title)}</title>`);
  output = replaceMetaTag(output, 'name', 'description', seo.description);
  output = replaceMetaTag(output, 'name', 'keywords', seo.keywords);
  output = replaceMetaTag(output, 'property', 'og:type', seo.ogType);
  output = replaceMetaTag(output, 'property', 'og:site_name', seo.ogSiteName);
  output = replaceMetaTag(output, 'property', 'og:title', seo.ogTitle);
  output = replaceMetaTag(output, 'property', 'og:description', seo.ogDescription);
  output = replaceMetaTag(output, 'property', 'og:url', seo.ogUrl);
  output = replaceMetaTag(output, 'property', 'og:image', seo.ogImage);
  output = replaceMetaTag(output, 'property', 'og:image:alt', seo.ogImageAlt);
  output = replaceMetaTag(output, 'name', 'twitter:card', seo.twitterCard);
  output = replaceMetaTag(output, 'name', 'twitter:title', seo.twitterTitle);
  output = replaceMetaTag(output, 'name', 'twitter:description', seo.twitterDescription);
  output = replaceMetaTag(output, 'name', 'twitter:image', seo.twitterImage);
  output = replaceMetaTag(output, 'name', 'twitter:image:alt', seo.twitterImageAlt);

  const canonicalPattern = /<link\s+[^>]*rel="canonical"[^>]*\/?>/i;
  const canonicalTag = `<link rel="canonical" href="${escapeHtmlAttr(seo.canonicalUrl)}" />`;
  if (canonicalPattern.test(output)) {
    output = output.replace(canonicalPattern, canonicalTag);
  } else {
    output = output.replace('</head>', `    ${canonicalTag}\n  </head>`);
  }

  const jsonLdPattern = /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i;
  const jsonLdTag = `<script type="application/ld+json" id="portfolio-structured-data">${jsonLd}</script>`;
  if (jsonLdPattern.test(output)) {
    output = output.replace(jsonLdPattern, jsonLdTag);
  } else {
    output = output.replace('</head>', `    ${jsonLdTag}\n  </head>`);
  }

  return output;
}
