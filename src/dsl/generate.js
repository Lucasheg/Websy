export default function generateDSL(maker) {
  const { brand, layout, pages, blocks } = maker;

  const radiusPx = layout.radius === "subtle" ? 10 : layout.radius === "soft" ? 20 : 14;
  const shadow =
    layout.shadow === "none"
      ? "none"
      : layout.shadow === "medium"
      ? "0 18px 50px rgba(0,0,0,.10)"
      : "0 10px 30px rgba(0,0,0,.06)";
  const rhythm = layout.rhythm === "compact" ? 12 : layout.rhythm === "spacious" ? 24 : 16;
  const animMs = layout.animation === "low" ? 180 : layout.animation === "high" ? 360 : 260;

  const meta = {
    brand,
    layout: { container: layout.container, header: layout.header, navDensity: layout.navDensity },
    tokens: { radius: radiusPx, shadow, rhythm, animMs },
  };

  // Assemble sections based on order + page toggles
  const sections = [];

  blocks.order.forEach((key) => {
    if (key === "hero" && pages.home) sections.push(heroSection(brand, blocks.heroVariant));
    if (key === "value" && pages.home) sections.push(valueSection());
    if (key === "services" && pages.services) sections.push(servicesSection(brand.industry));
    if (key === "proof" && pages.home) sections.push(proofSection(blocks.proofVariant));
    if (key === "pricing" && pages.pricing) sections.push(pricingSection());
    if (key === "cta" && (pages.home || pages.contact)) sections.push(ctaSection(brand, maker));
    if (key === "faq" && pages.faq) sections.push(faqSection());
    if (key === "contact" && pages.contact) sections.push(contactSection(brand));
  });

  return {
    meta,
    pages: [{ slug: "home", sections }],
  };
}

/* ----- Sections ----- */

function heroSection(brand, variant) {
  const base = {
    type: "hero",
    title: brand.name || "Your brand",
    subtitle: brand.tagline || "We make websites pay for themselves.",
    badge: (brand.locations || []).join(" · "),
    primaryCta: { label: primaryCtaFor(brand.industry), href: "#contact" },
    secondaryCta: { label: "See work", href: "#work" },
    heroImage: brand.heroImage || null,
  };

  // You can expand variants later; content stays focused here
  switch (variant) {
    case "editorial":
      return { ...base, subtitle: base.subtitle + " Clear copy. Quiet authority." };
    case "product":
      return { ...base, subtitle: "Fast to value, calm to scale." };
    case "stack":
      return { ...base, subtitle: "A layered system that adapts to your business." };
    default:
      return base;
  }
}

function valueSection() {
  return {
    type: "value",
    title: "What you get with us",
    items: [
      { title: "Clarity over clever", text: "Single goal per page. Action-oriented copy." },
      { title: "Trust quickly", text: "Proof, guarantees, and transparent pricing." },
      { title: "Friction down", text: "Mobile-first speed, fewer steps to act." },
      { title: "Motion with restraint", text: "Micro-interactions that reward intent." },
    ],
  };
}

function servicesSection(industry = "generic") {
  if (industry === "law")
    return {
      type: "services",
      title: "Services",
      items: [
        { title: "M&A & Transactions", text: "Deal structuring, diligence, closing guidance." },
        { title: "Commercial Contracts", text: "Clear, enforceable agreements that move business forward." },
        { title: "Data & Compliance", text: "Practical counsel on privacy and regulatory obligations." },
      ],
    };
  if (industry === "clinic")
    return {
      type: "services",
      title: "Services",
      items: [
        { title: "Primary care", text: "Accessible care with fast booking." },
        { title: "Specialists", text: "Targeted expertise with clear referrals." },
        { title: "Diagnostics", text: "Modern equipment, gentle guidance." },
      ],
    };
  if (industry === "saas")
    return {
      type: "services",
      title: "Product capabilities",
      items: [
        { title: "Onboarding flows", text: "Reduce time-to-value with frictionless onboarding." },
        { title: "Pricing architecture", text: "Plans, entitlements, clarity that convert." },
        { title: "Docs & SEO", text: "Content that compounds organic growth." },
      ],
    };
  if (industry === "gym")
    return {
      type: "services",
      title: "Programs",
      items: [
        { title: "Elite Coaching", text: "High-intensity coaching for rapid progress." },
        { title: "Strength Builder", text: "Progressive overload with accountability." },
        { title: "Conditioning Lab", text: "Cardio and mobility for sustainable energy." },
      ],
    };
  return {
    type: "services",
    title: "Services",
    items: [
      { title: "Strategy & IA", text: "Goals, sitemap, and decision pathways." },
      { title: "Design System", text: "Reusable components with accessibility baked in." },
      { title: "Performance & SEO", text: "Lighthouse-focused with schema and structure." },
    ],
  };
}

function proofSection(variant = "mixed") {
  const base = {
    type: "proof",
    logos: ["Aldin Capital", "Meridian Partners", "Koto Energy"],
    testimonials: [{ quote: "They guided a complex deal with clarity.", author: "COO, Meridian" }],
    metrics: [
      { label: "Projects shipped", value: "120+" },
      { label: "Average turnaround", value: "8 days" },
    ],
  };
  if (variant === "logos") return { ...base, testimonials: [], metrics: [] };
  if (variant === "testimonials") return { ...base, logos: [], metrics: [] };
  if (variant === "metrics") return { ...base, logos: [], testimonials: [] };
  return base; // mixed
}

function pricingSection() {
  return {
    type: "pricing",
    title: "Packages",
    note: "Transparent estimates. Fixed-fee options available.",
    tiers: [
      { name: "Starter", price: "$900", items: ["2–3 pages", "Responsive", "Lead form"] },
      { name: "Growth", price: "$2,300", items: ["5–7 pages", "SEO + schema", "Booking & Maps", "Integrations"] },
      { name: "Scale", price: "$7,000", items: ["10+ pages", "Strategy + funnel", "Advanced SEO/analytics", "CRM / e-com"] },
    ],
  };
}

function ctaSection(brand, maker) {
  const goal = primaryCtaFor(brand.industry);
  return { type: "cta", title: "Ready to move faster?", cta: { label: goal, href: "#contact" } };
}

function faqSection() {
  return {
    type: "faq",
    title: "FAQ",
    items: [
      { q: "How fast can we launch?", a: "Starter in ~4 days, Growth in ~8, Scale in ~14 (rush available)." },
      { q: "Do you handle content?", a: "We guide content on Starter/Growth and support copy on Scale." },
    ],
  };
}

function contactSection(brand) {
  return { type: "contact", title: "Contact", email: "contact@citeks.net", locations: brand.locations || [] };
}

function primaryCtaFor(industry) {
  switch ((industry || "").toLowerCase()) {
    case "law":
      return "Book consultation";
    case "clinic":
      return "Book appointment";
    case "saas":
      return "Start demo";
    case "gym":
      return "Start trial";
    default:
      return "Get in touch";
  }
}
