import { useState } from "react";

/** Neutral starter config (no agency wording) */
const INITIAL_MAKER = {
  brand: {
    name: "Example Co.",
    tagline: "A clear, simple headline that explains your value.",
    colors: { primary: "#0F172A", secondary: "#F6F7F9", accent: "#2563EB" },
    heroImage: null,
  },
  layout: { container: 1200, radius: 16, density: "cozy" },
  pages: { home: true, about: true, services: true, pricing: true, contact: true },
  blocks: {
    features: ["Feature one", "Feature two", "Feature three"],
    testimonials: [{ quote: "Short proof point goes here.", author: "Happy customer" }],
    metrics: [{ label: "Years in business", value: "10+" }],
  },
};

export default function useMakerState() {
  const [maker, setMaker] = useState(INITIAL_MAKER);

  const resetMaker = () => setMaker(INITIAL_MAKER);

  /** Safe neutral autoconfigure: fills only what’s provided, stays generic otherwise */
  const autoconfigure = (brief) => {
    setMaker((prev) => ({
      ...INITIAL_MAKER,
      brand: {
        ...INITIAL_MAKER.brand,
        name: brief?.company?.name || INITIAL_MAKER.brand.name,
        tagline: brief?.company?.tagline || INITIAL_MAKER.brand.tagline,
        colors:
          brief?.company?.brand?.colors ||
          brief?.company?.brand ||
          INITIAL_MAKER.brand.colors,
        heroImage: brief?.company?.brand?.heroImage || null,
      },
      // keep generic pages/blocks unless explicitly provided later
    }));
  };

  return { maker, setMaker, resetMaker, autoconfigure };
}
