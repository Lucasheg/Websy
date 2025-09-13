export default function generateDSL(maker = {}) {
  const brand = maker.brand || {};
  const theme = maker.theme || {};
  const layout = maker.layout || {};
  const content = maker.content || {};

  const nav = Array.isArray(layout.nav) ? layout.nav : ["Home", "Products", "About", "Contact"];

  const hero = content.hero || {};
  const features = Array.isArray(content.features) ? content.features : [];
  const gallery = (content.gallery && Array.isArray(content.gallery.images)) ? content.gallery.images : [];
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
  const faq = Array.isArray(content.faq) ? content.faq : [];
  const contact = content.contact || {};

  const sections = [
    {
      type: "hero",
      title: hero.title || brand.name || "Headline",
      subtitle: hero.subtitle || "",
      badge: (brand.locations || []).join(" · ") || "",
      primaryCta: { label: "Learn more", href: "#products" },
      secondaryCta: { label: "Contact", href: "#contact" },
      heroImage: hero.image || null,
    },
  ];

  if (features.length) sections.push({ type: "features", title: "What you’ll get", items: features });
  if (gallery.length)  sections.push({ type: "gallery", title: "Show, don’t tell", images: gallery });
  if (testimonials.length) sections.push({ type: "testimonials", title: "What clients say", quotes: testimonials });
  if (faq.length) sections.push({ type: "faq", title: "FAQ", items: faq });

  sections.push({
    type: "contact",
    title: "Contact",
    email: contact.email || "contact@example.com",
    phone: contact.phone || "",
    locations: contact.locations || brand.locations || [],
  });

  return {
    meta: {
      brand: {
        name: brand.name || "Brand",
        tagline: brand.tagline || "",
        logoUrl: brand.logoUrl || "",
        locations: brand.locations || [],
      },
      theme: {
        primary: theme.primary || "#0F172A",
        accent: theme.accent || "#0EA5E9",
        neutral: theme.neutral || "#F6F7F9",
        radius: theme.radius ?? 16,
        base: theme.base ?? 16,
        container: theme.container ?? 1200,
      },
      nav,
    },
    pages: [{ slug: "home", sections }],
  };
}
