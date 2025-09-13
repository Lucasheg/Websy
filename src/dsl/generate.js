/** Turn maker state into a neutral, basic DSL (no agency terms) */
export default function generateDSL(maker) {
  const brand = {
    name: maker?.brand?.name || "Example Co.",
    tagline:
      maker?.brand?.tagline ||
      "A clear, simple headline that explains your value.",
    colors: maker?.brand?.colors || {
      primary: "#0F172A",
      secondary: "#F6F7F9",
      accent: "#2563EB",
    },
    heroImage: maker?.brand?.heroImage || null,
  };

  const nav = ["Home", "About", "Services", "Pricing", "Contact"].filter(
    (item) => maker?.pages?.[item.toLowerCase()]
  );

  const features =
    maker?.blocks?.features?.length
      ? maker.blocks.features
      : ["Feature one", "Feature two", "Feature three"];

  const testimonials =
    maker?.blocks?.testimonials?.length
      ? maker.blocks.testimonials
      : [{ quote: "Short proof point goes here.", author: "Happy customer" }];

  const metrics =
    maker?.blocks?.metrics?.length
      ? maker.blocks.metrics
      : [{ label: "Years in business", value: "10+" }];

  const sections = [];

  // Header & Hero (generic)
  sections.push({
    type: "header",
    brandName: brand.name,
    nav,
  });

  sections.push({
    type: "hero",
    title: brand.name,
    subtitle: brand.tagline,
    heroImage: brand.heroImage, // null = gradient fallback in PreviewShell
    primaryCta: { label: "Get started", href: "#contact" },
    secondaryCta: { label: "Learn more", href: "#about" },
  });

  // Features
  sections.push({
    type: "features",
    title: "What you get",
    items: features.map((f) => ({
      title: f,
      text: "A short explanation of how this benefits your customer.",
    })),
  });

  // Optional social proof
  sections.push({
    type: "proof",
    testimonials,
    metrics,
  });

  // Pricing (generic, no agency wording)
  if (maker?.pages?.pricing) {
    sections.push({
      type: "pricing",
      title: "Pricing",
      note: "Transparent, simple options. Customize as needed.",
      tiers: [
        { name: "Basic", price: "$499", items: ["Up to 3 pages", "Responsive", "Email support"] },
        { name: "Standard", price: "$1,499", items: ["Up to 7 pages", "SEO basics", "Priority support"] },
        { name: "Plus", price: "$3,499", items: ["10+ pages", "SEO & analytics", "Custom components"] },
      ],
    });
  }

  // CTA + Contact
  sections.push({
    type: "cta",
    title: "Ready to begin?",
    cta: { label: "Contact us", href: "#contact" },
  });

  sections.push({
    type: "contact",
    title: "Contact",
    email: "hello@example.com",
    locations: [],
  });

  sections.push({
    type: "footer",
    brandName: brand.name,
  });

  return {
    meta: { brand },
    pages: [{ slug: "home", sections }],
  };
}

