// src/state/useMakerState.js
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "maker_neutral_v1";

const NEUTRAL_BASELINE = {
  brand: {
    name: "Your brand",
    tagline: "A short value proposition lives here.",
    logoUrl: "",
    locations: [],
  },
  theme: {
    primary: "#0F172A",
    accent:  "#0EA5E9",
    neutral: "#F6F7F9",
    radius: 16,
    base: 16,
    scale: 1.25,
    card: "soft",        // soft | outline | minimal
    animation: "medium", // low | medium | high
    container: 1200,
  },
  layout: {
    nav: ["Home", "Products", "About", "Contact"],
  },
  content: {
    // Leave empty to let the generator provide neutral defaults
    // (hero/features/gallery/testimonials/faq/contact)
  },
};

export default function useMakerState() {
  const [maker, setMaker] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return NEUTRAL_BASELINE;
  });

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(maker)); } catch {}
  }, [maker]);

  const resetMaker = useCallback(() => {
    setMaker(NEUTRAL_BASELINE);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(NEUTRAL_BASELINE)); } catch {}
  }, []);

  // very light “AI-ish” autoconfigure that sets brand & nav only
  const autoconfigure = useCallback((idea) => {
    if (!idea || typeof idea !== "string") return;
    const s = idea.toLowerCase();

    // pick an “industry mood” just for initial nav style
    let nav = ["Home", "Products", "About", "Contact"];
    if (/(law|legal|attorney|advokat)/.test(s)) {
      nav = ["Home", "Services", "Team", "Contact"];
    } else if (/(clinic|dentist|health|medical)/.test(s)) {
      nav = ["Home", "Services", "Locations", "Contact"];
    } else if (/(saas|software|platform|app)/.test(s)) {
      nav = ["Home", "Product", "Pricing", "Contact"];
    }

    // try to extract a simple name: “called X” / “named X”
    const nameMatch = idea.match(/(?:called|named)\s+([A-Za-z0-9&\-\s]{2,})/i);
    const name = nameMatch ? nameMatch[1].trim() : "Your brand";

    setMaker((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        name,
      },
      layout: {
        ...prev.layout,
        nav,
      },
    }));
  }, []);

  return { maker, setMaker, resetMaker, autoconfigure };
}
