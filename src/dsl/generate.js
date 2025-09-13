// src/dsl/generate.js
/**
 * Neutral, professional demo generator (no agency specifics).
 * Sections: Header → Hero → Features → Gallery → Testimonials → FAQ → Contact
 * Pricing is OMITTED by default (only renders if maker.content.pricing exists).
 */

function pick(v, fallback) {
  return v === undefined || v === null || v === "" ? fallback : v;
}

export default function generateDSL(maker = {}) {
  const brand = maker.brand || {};
  const themeIn = maker.theme || {};
  const content = maker.content || {};
  const layout = maker.layout || {};

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

  const nav = Array.isArray(layout.nav) && layout.nav.length
    ? layout.nav
    : ["Home", "Products", "About", "Contact"];

  const sections = [];

  // HERO (neutral copy and CTAs)
  const hero = content.hero || {};
  sections.push({
    type: "hero",
    title: pick(hero.title, brandName),
    subtitle: pick(hero.subtitle, tagline),
    badge: pick(hero.badge, (brand.locations || [])?.join(" · ")),
    heroImage: pick(hero.image, null),
    primaryCta: { label: pick(hero.primaryCta?.label, "Learn more"), href: pick(hero.primaryCta?.href, "#about") },
    secondaryCta: hero.secondaryCta?.label
      ? { label: hero.secondaryCta.label, href: pick(hero.secondaryCta.href, "#contact") }
      : { label: "Contact us", href: "#contact" },
  });

  // FEATURES (generic product/service benefits)
  const features = Array.isArray(content.features) ? content.features : null;
  sections.push({
    type: "features",
    title: pick(content.featuresTitle, "What you’ll get"),
    items: features?.length
      ? features.slice(0, 8)
      : [
          { title: "Fast to load",      text: "Performance-focused pages that respect your users’ time." },
          { title: "Clear to scan",     text: "Hierarchy and copy that help people decide quickly." },
          { title: "Accessible",        text: "Contrast, keyboard support, and labels — baked in." },
          { title: "Search-friendly",   text: "Clean structure and metadata for discoverability." },
        ],
  });

  // GALLERY (optional: empty by default)
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

  // FAQ
  const faqItems = Array.isArray(content.faq?.items) ? content.faq.items : null;
  sections.push({
    type: "faq",
    title: pick(content.faqTitle, "FAQ"),
    items: faqItems?.length
      ? faqItems
      : [
          { q: "How long does it take?",   a: "Most small sites are ready in days, not weeks." },
          { q: "Can I update it myself?",  a: "Yes. We structure content so updates are simple." },
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

  // NOTE: Pricing is intentionally NOT included by default.
  // If you ever want it, set maker.content.pricing = { tiers:[...] }.

  return {
    meta: {
      brand: { name: brandName, tagline, logoUrl },
      theme,
      nav,
    },
    pages: [
      { slug: "home", sections },
    ],
  };
}
