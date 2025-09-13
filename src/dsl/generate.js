// src/dsl/generate.js
// Turns the maker config into a neutral, professional example website (no agency sections).

const DEFAULTS = {
  brand: {
    name: "ExampleCo",
    tagline: "We design products people actually use.",
    colors: { primary: "#0F172A", secondary: "#F6F7F9", accent: "#0EA5E9" },
    heroImage: null,
  },
  nav: ["Home", "Products", "Services", "About", "Contact"],
};

export default function generateDSL(maker = {}) {
  const brand = {
    name: maker?.brand?.name?.trim() || DEFAULTS.brand.name,
    tagline: maker?.brand?.tagline?.trim() || DEFAULTS.brand.tagline,
    colors: {
      primary: maker?.brand?.primary || DEFAULTS.brand.colors.primary,
      secondary: maker?.brand?.secondary || DEFAULTS.brand.colors.secondary,
      accent: maker?.brand?.accent || DEFAULTS.brand.colors.accent,
    },
    heroImage: maker?.brand?.hero || DEFAULTS.brand.heroImage,
  };

  const nav =
    (maker?.pages?.nav && maker.pages.nav.length
      ? maker.pages.nav
      : DEFAULTS.nav);

  // Sections: header → hero → features → services → products → testimonial → faq → contact → footer
  const sections = [
    { type: "header", nav },

    {
      type: "hero",
      title: brand.name,
      subtitle: brand.tagline,
      heroImage: brand.heroImage,
      primaryCta: { label: "Get started", href: "#contact" },
      secondaryCta: { label: "Learn more", href: "#about" },
    },

    {
      type: "features",
      title: "Why customers choose us",
      items: [
        { title: "Clear value", text: "Your user instantly sees what matters." },
        { title: "Credible proof", text: "Evidence and results over buzzwords." },
        { title: "Fast & accessible", text: "Performance and usability first." },
      ],
    },

    {
      type: "services",
      title: "What we offer",
      items: [
        { title: "Service A", text: "Explain the core outcome in one line." },
        { title: "Service B", text: "Tie the service to a business result." },
        { title: "Service C", text: "Set expectations clearly and simply." },
      ],
    },

    {
      type: "products",
      title: "Highlighted work",
      cards: [
        {
          title: "Product One",
          text: "A short sentence about the problem it solves.",
          img: null,
          cta: { label: "View details", href: "#product-1" },
        },
        {
          title: "Product Two",
          text: "A short sentence about the outcome it delivers.",
          img: null,
          cta: { label: "View details", href: "#product-2" },
        },
        {
          title: "Product Three",
          text: "A short sentence about who it is best for.",
          img: null,
          cta: { label: "View details", href: "#product-3" },
        },
      ],
    },

    {
      type: "testimonial",
      quote: "“They delivered on time and the results were measurable.”",
      author: "Operations Lead, Northlake",
    },

    {
      type: "faq",
      title: "Frequently asked questions",
      items: [
        { q: "What do you specialize in?", a: "Clarity, quality, and outcomes." },
        { q: "How long does a project take?", a: "Most sites ship in weeks, not months." },
        { q: "Do you provide copy?", a: "Yes—light guidance or full support on higher tiers." },
      ],
    },

    {
      type: "contact",
      title: "Let’s talk",
      email: "contact@citeks.net",
      locations: ["Oslo", "New York", "Amsterdam"],
    },

    { type: "footer", nav, company: brand.name },
  ];

  return { meta: { brand }, pages: [{ slug: "home", sections }] };
}
