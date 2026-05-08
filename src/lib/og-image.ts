/**
 * OG Image Generator Utility
 * 
 * This utility helps generate dynamic Open Graph images for social sharing.
 * Can be used with Lovable AI image generation or canvas-based generation.
 */

export interface OGImageConfig {
  title: string;
  subtitle?: string;
  category?: string;
  backgroundColor?: string;
  accentColor?: string;
}

/**
 * Generate OG image prompt for AI generation
 */
export const generateOGImagePrompt = (config: OGImageConfig): string => {
  const {
    title,
    subtitle = "Nextup Resources",
    category,
    backgroundColor = "#0080FF",
    accentColor = "#FFFFFF",
  } = config;

  return `A professional social media OG image (1200x630) for "${title}". ${
    category ? `Category: ${category}.` : ""
  } Tagline: "${subtitle}". Modern gradient design with primary color ${backgroundColor}, accent ${accentColor}. Clean typography, geometric shapes, premium SaaS style. Include subtle education/learning iconography. Ultra high resolution, 16:9 aspect ratio.`;
};

/**
 * Generate page-specific OG meta tags
 */
export const generateOGMetaTags = (config: {
  title: string;
  description: string;
  image?: string;
  url: string;
}): Record<string, string> => {
  const baseUrl = "https://nextup-resource.vercel.app";
  const defaultImage = `${baseUrl}/og-image.png`;

  return {
    "og:title": config.title,
    "og:description": config.description,
    "og:image": config.image || defaultImage,
    "og:url": `${baseUrl}${config.url}`,
    "og:type": "website",
    "og:site_name": "Nextup Resources",
    "twitter:card": "summary_large_image",
    "twitter:title": config.title,
    "twitter:description": config.description,
    "twitter:image": config.image || defaultImage,
  };
};

/**
 * Update page meta tags dynamically
 */
export const updatePageMeta = (config: {
  title: string;
  description: string;
  image?: string;
  url: string;
}): void => {
  // Update title
  document.title = config.title;

  // Update meta tags
  const metaTags = generateOGMetaTags(config);

  Object.entries(metaTags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[property="${name}"]`) ||
               document.querySelector(`meta[name="${name}"]`);

    if (!meta) {
      meta = document.createElement("meta");
      if (name.startsWith("og:")) {
        meta.setAttribute("property", name);
      } else {
        meta.setAttribute("name", name);
      }
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  });

  // Update description
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) {
    descMeta.setAttribute("content", config.description);
  }

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `https://nextup-resource.vercel.app${config.url}`;
};

/**
 * Page-specific SEO configurations
 */
export const pageSEOConfigs = {
  home: {
    title: "Nextup Resources | Premium Courses & Free Learning Resources",
    description: "Discover 50+ premium courses, free resources, ebooks, and apps. Master AI, web development, trading, cybersecurity and more. Quality education for everyone.",
    url: "/",
  },
  courses: {
    title: "All Courses - Nextup Resources",
    description: "Browse our complete collection of premium courses. Learn AI, web development, trading, cybersecurity, and more with expert-led training.",
    url: "/courses",
  },
  resources: {
    title: "Free Resources - Nextup Resources",
    description: "Download free resources including LUTs, fonts, sound effects, templates, and more. Premium assets for creators and learners.",
    url: "/resources",
  },
  ebooks: {
    title: "Ebooks - Nextup Resources",
    description: "Explore our collection of educational ebooks. Comprehensive guides on video editing, business, and professional development.",
    url: "/ebooks",
  },
  apps: {
    title: "Free Apps - Nextup Resources",
    description: "Download curated mobile apps including development tools, media players, and utility apps. Quality apps for Android users.",
    url: "/apps",
  },
  favorites: {
    title: "My Favorites - Nextup Resources",
    description: "Your saved courses and resources. Quick access to your favorite learning materials.",
    url: "/favorites",
  },
  contact: {
    title: "Contact Us - Nextup Resources",
    description: "Get in touch with Nextup Resources. We'd love to hear from you about courses, resources, or collaboration opportunities.",
    url: "/contact",
  },
  faq: {
    title: "FAQ - Nextup Resources",
    description: "Frequently asked questions about Nextup Resources. Learn how to access courses, download resources, and more.",
    url: "/faq",
  },
  install: {
    title: "Install App - Nextup Resources",
    description: "Install Nextup Resources as a progressive web app on your device for quick access to courses and resources.",
    url: "/install",
  },
};
