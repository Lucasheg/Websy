import { useState, useCallback } from "react";

/** A solid, agency-grade baseline the AI can modify */
const DEFAULT_MAKER = {
  brand: {
    name: "Acme Co.",
    tagline: "We make it simple to choose you.",
    colors: { primary: "#0F172A", accent: "#0EA5E9", neutral: "#F6F7F9" },
    logoUrl: "",
    heroImage: ""
  },
  layout: {
    container: 1200,
    radius: 16,
    card: "soft", // soft | outline | minimal
    typography: { base: 16, scale: 1.25 } // Major Third default
  },
  animation: {
    level: "medium" // low | medium | high
  },
  pages: {
    sectionsOrder: ["hero", "features", "gallery", "testimonials", "pricing", "faq", "contact"],
    enabled: {
      hero: true,
      features: true,
      gallery: false,
      testimonials: true,
      pricing: false,
      faq: false,
      contact: true
    }
  },
  content: {
    nav: ["Home", "Services", "Pricing", "Contact"],
    hero: {
      variant: "image", // image | editorial | product | minimal
      primaryCta: "Get started",
      secondaryCta: "Contact us",
      kpi: ["Rated 4.9/5", "Trusted by 200+ clients"]
    },
    features: [
      { title: "Clarity-first design", text: "Make decisions easy with focused layouts and copy." },
      { title: "Fast & accessible", text: "Performance budgets and WCAG-minded components." },
      { title: "SEO foundations", text: "Schema, IA, and internal linking, baked in." }
    ],
    gallery: [
      // image URLs; leave empty if none
    ],
    testimonials: [
      { quote: "They lifted our conversions without the drama.", author: "COO, Meridian" }
    ],
    pricing: [
      { name: "Starter", price: "$900", items: ["2–3 pages", "Responsive", "Lead form"] },
      { name: "Growth", price: "$2,300", items: ["5–7 pages", "SEO + schema", "Booking & Maps"] },
      { name: "Scale", price: "$7,000", items: ["10+ pages", "Strategy + funnel", "Advanced SEO/analytics"] }
    ],
    faq: [
      { q: "How quickly can we launch?", a: "Most launches take 4–14 days depending on scope." },
      { q: "Do you handle content?", a: "We provide guidance and can support copy as needed." }
    ],
    contact: {
      email: "contact@citeks.net",
      phone: "",
      locations: ["Oslo", "New York", "Amsterdam"]
    }
  }
};

function deepMerge(base, patch) {
  if (Array.isArray(base) || Array.isArray(patch)) return patch;
  if (typeof base === "object" && typeof patch === "object") {
    const out = { ...base };
    for (const k of Object.keys(patch)) {
      out[k] = deepMerge(base[k], patch[k]);
    }
    return out;
  }
  return patch;
}

export default function useMakerState() {
  const [maker, setMaker] = useState(DEFAULT_MAKER);

  const update = useCallback((patch) => {
    setMaker((prev) => deepMerge(prev, patch));
  }, []);

  const resetMaker = useCallback(() => setMaker(DEFAULT_MAKER), []);

  /** Deterministic “AI autopilot”: maps a brief/prompt to config choices
   *  (You can swap this later with a real LLM call; the shape remains compatible.)
   */
  const autoconfigure = useCallback((prompt) => {
    const s = (prompt || "").toLowerCase();

    // detect industry
    let industry = "generic";
    if (/law|attorney|legal|advokat|juridisk/.test(s)) industry = "law";
    else if (/clinic|dental|dentist|doctor|health|hospital/.test(s)) industry = "clinic";
    else if (/saas|software|platform|app/.test(s)) industry = "saas";
    else if (/gym|fitness|training|coach/.test(s)) industry = "gym";
    else if (/e-?commerce|shop|store|products?/.test(s)) industry = "ecom";

    // hero & sections
    const heroVariant =
      industry === "saas" ? "product" :
      industry === "law" ? "editorial" :
      industry === "gym" || industry === "ecom" || industry === "clinic" ? "image" :
      "minimal";

    const featuresOn = !/no features/.test(s);
    const galleryOn = /gallery|portfolio|work|products?/.test(s);
    const testimonialsOn = !/no testimonials/.test(s);
    const pricingOn = /pricing|plans|packages/.test(s);
    const faqOn = /faq|questions?/.test(s);
    const contactOn = true;

    const sectionsOrder = [
      "hero",
      featuresOn && "features",
      galleryOn && "gallery",
      testimonialsOn && "testimonials",
      pricingOn && "pricing",
      faqOn && "faq",
      contactOn && "contact"
    ].filter(Boolean);

    // animation
    const animLevel = /playful|flashy|bold|high motion/.test(s) ? "high" :
                      /calm|minimal|serene|quiet/.test(s) ? "low" : "medium";

    // palette rough heuristics
    const wantsDark = /dark|noir|night/.test(s);
    const wantsGreen = /green|forest|nature|eco/.test(s);
    const wantsBlue = /blue|trust|tech/.test(s);
    const colors = {
      primary: wantsDark ? "#0B1324" : wantsGreen ? "#0F3D2E" : wantsBlue ? "#0F172A" : "#101828",
      accent: wantsGreen ? "#16A34A" : wantsBlue ? "#0EA5E9" : "#7C3AED",
      neutral: "#F6F7F9"
    };

    const ctaPrimary =
      industry === "law" ? "Book consultation" :
      industry === "clinic" ? "Book appointment" :
      industry === "saas" ? "Start demo" :
      industry === "ecom" ? "Shop now" :
      "Get started";

    const ctaSecondary =
      industry === "saas" ? "Talk to sales" :
      industry === "law" ? "Download brochure" :
      "Contact us";

    update({
      brand: { colors },
      animation: { level: animLevel },
      pages: {
        sectionsOrder,
        enabled: {
          hero: true,
          features: featuresOn,
          gallery: galleryOn,
          testimonials: testimonialsOn,
          pricing: pricingOn,
          faq: faqOn,
          contact: contactOn
        }
      },
      content: {
        hero: { variant: heroVariant, primaryCta: ctaPrimary, secondaryCta: ctaSecondary }
      }
    });
  }, [update]);

  return { maker, setMaker: update, resetMaker, autoconfigure };
}
