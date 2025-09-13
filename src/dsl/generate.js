/** Convert maker config -> renderable DSL the preview understands */
export default function generateDSL(maker) {
  const theme = {
    primary: maker.brand.colors.primary,
    accent: maker.brand.colors.accent,
    neutral: maker.brand.colors.neutral,
    radius: maker.layout.radius,
    container: maker.layout.container,
    base: maker.layout.typography.base,
    scale: maker.layout.typography.scale,
    card: maker.layout.card,
    animation: maker.animation.level
  };

  const sections = [];
  const enabled = maker.pages.enabled || {};
  const order = maker.pages.sectionsOrder || [];

  for (const key of order) {
    if (!enabled[key]) continue;

    if (key === "hero") {
      sections.push({
        type: "hero",
        variant: maker.content.hero.variant,
        title: maker.brand.name,
        subtitle: maker.brand.tagline,
        badge: (maker.content?.contact?.locations || []).join(" · "),
        primaryCta: { label: maker.content.hero.primaryCta, href: "#contact" },
        secondaryCta: maker.content.hero.secondaryCta
          ? { label: maker.content.hero.secondaryCta, href: "#contact" }
          : null,
        heroImage: maker.brand.heroImage || ""
      });
    }

    if (key === "features") {
      sections.push({
        type: "features",
        title: "What you’ll get",
        items: (maker.content.features || []).map((f) => ({ title: f.title, text: f.text }))
      });
    }

    if (key === "gallery") {
      sections.push({
        type: "gallery",
        title: "Gallery",
        images: maker.content.gallery || []
      });
    }

    if (key === "testimonials") {
      sections.push({
        type: "testimonials",
        title: "Testimonials",
        quotes: maker.content.testimonials || []
      });
    }

    if (key === "pricing") {
      sections.push({
        type: "pricing",
        title: "Pricing",
        note: "Transparent estimates.",
        tiers: maker.content.pricing || []
      });
    }

    if (key === "faq") {
      sections.push({
        type: "faq",
        title: "FAQ",
        items: maker.content.faq || []
      });
    }

    if (key === "contact") {
      sections.push({
        type: "contact",
        title: "Contact",
        email: maker.content.contact?.email || "",
        phone: maker.content.contact?.phone || "",
        locations: maker.content.contact?.locations || []
      });
    }
  }

  return {
    meta: {
      brand: {
        name: maker.brand.name,
        tagline: maker.brand.tagline,
        logoUrl: maker.brand.logoUrl || ""
      },
      nav: maker.content.nav || ["Home", "Services", "Pricing", "Contact"],
      theme
    },
    pages: [{ slug: "home", sections }]
  };
}
