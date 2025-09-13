// src/dsl/generate.js
/**
 * Generate a generic, professional demo DSL from the Maker state.
 * - Neutral defaults (not agency-specific)
 * - Uses maker overrides when present (brand, theme, content arrays)
 * - Safe fallbacks so PreviewShell never crashes
 */

function pick(v, fallback) {
  return v === undefined || v === null || v === "" ? fallback : v;
}

export default function generateDSL(maker = {}) {
  const brand = maker.brand || {};
  const themeIn = maker.theme || {};
  const content = maker.content || {};
  const layout = maker.layout || {};

  // Neutral, professional theme
  const theme = {
    primary: pick(themeIn.primary, "#0F172A"),   // ink
    accent:  pick(themeIn.accent,  "#0EA5E9"),   // action
    neutral: pick(themeIn.neutral, "#F6F7F9"),   // background
    radius:  pick(themeIn.radius,  16),
    base:    pick(themeIn.base,    16),
    scale:   pick(themeIn.scale,   1.25),
    card:    pick(themeIn.card,    "soft"),      // soft | outline | minimal
    animation: pick(themeIn.animation, "medium"), // low | medium | high
    container: pick(themeIn.container, 1200),
  };

  const brandName = pick(brand.name, "Your brand");
  const tagline   = pick(brand.tagline, "A short value proposition lives here.");
  const logoUrl   = pick(brand.logoUrl, "");

  // Navigation: neutral defaults
  const nav = Array.isArray(layout.nav) && layout.nav.length
    ? layout.nav
    : ["Home", "Products", "About", "Contact"];

  // Sections (use maker.content if supplied, else defaults)
  const sections = [];

  // HERO
  const hero = content.hero || {};
  sections.push({
    type: "hero",
    title: pick(hero.title, brandName),
    subtitle: pick(hero.subtitle, tagline),
    badge: pick(hero.badge, (brand.locations || [])?.join(" · ")),
    heroImage: pick(hero.image, null),
    primaryCta: {
      label: pick(hero.primaryCta?.label, "Get started"),
      href: pick(hero.primaryCta?.href, "#contact"),
    },
    secondaryCta: hero.secondaryCta?.label
      ? { label: hero.secondaryCta.label, href: pick(hero.secondaryCta.href, "#contact") }
      : null,
  });

  // FEATURES
  const features = Array.isArray(content.features) ? content.features : null;
  sections.push({
    type: "features",
    title: pick(content.featuresTitle, "What you’ll get"),
    items: features?.length
      ? features.slice(0, 8)
      : [
          { title: "Fast to load", text: "Performance-focused pages that respect your users’ time." },
          { title: "Clear to scan", text: "Hierarchy and copy that help people decide fast." },
          { title: "Accessible",    text: "Contrast, keyboard support, labels — baked in." },
          { title: "Search-friendly", text: "Clean structure and metadata for discoverability." },
        ],
  });

  // GALLERY
  const gallery = Array.isArray(content.gallery?.images) ? content.gallery.images : [];
  sections.push({
    type: "gallery",
    title: pick(content.galleryTitle, "Show, don’t tell"),
    images: gallery.length ? gallery : [],
  });

  // TESTIMONIALS
  const testimonials = Array.isArray(content.testimonials?.quotes) ? content.testimonials.quotes : [];
  sections.push({
    type: "testimonials",
    title: pick(content.testimonialsTitle, "What clients say"),
    quotes: testimonials.length
      ? testimonials.slice(0, 6)
      : [
          { quote: "They made the complex feel simple.", author: "COO, Meridian" },
          { quote: "Launched quickly and looks premium.", author: "Founder, Alder & Co." },
        ],
  });

  // PRICING (neutral product/service style)
  const tiers = Array.isArray(content.pricing?.tiers) ? content.pricing.tiers : null;
  sections.push({
    type: "pricing",
    title: pick(content.pricingTitle, "Pricing"),
    tiers: tiers?.length
      ? tiers
      : [
          { name: "Basic",  price: "$199",  items: ["Up to 3 pages", "Responsive", "Email support"] },
          { name: "Pro",    price: "$499",  items: ["Up to 8 pages", "SEO basics", "Priority support"] },
          { name: "Elite",  price: "$1,200", items: ["Unlimited pages", "Advanced SEO", "Dedicated support"] },
        ],
  });

  // FAQ
  const faqItems = Array.isArray(content.faq?.items) ? content.faq.items : null;
  sections.push({
    type: "faq",
    title: pick(content.faqTitle, "FAQ"),
    items: faqItems?.length
      ? faqItems
      : [
          { q: "How long does it take?", a: "Most small sites are ready in days, not weeks." },
          { q: "Can I update it myself?", a: "Yes. We structure content so updates are simple." },
        ],
  });

  // CONTACT
  const contact = content.contact || {};
  sections.push({
    type: "contact",
    title: pick(contact.title, "Contact"),
    email: pick(contact.email, "contact@example.com"),
    phone: pick(contact.phone, ""),
    locations: Array.isArray(brand.locations) ? brand.locations : [],
  });

  return {
    meta: {
      brand: { name: brandName, tagline, logoUrl },
      theme,
      nav,
    },
    pages: [
      {
        slug: "home",
        sections,
      },
    ],
  };
}
