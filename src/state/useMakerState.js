// src/state/useMakerState.js
import { useState, useCallback } from "react";

const INITIAL = {
  brand: {
    name: "ExampleCo",
    tagline: "We design products people actually use.",
    primary: "#0F172A",
    secondary: "#F6F7F9",
    accent: "#0EA5E9",
    hero: "",
  },
  // Keep this object present so UI & DSL can rely on it
  pages: {
    nav: ["Home", "Products", "Services", "About", "Contact"],
  },
  layout: {
    container: 1040,
  },
  blocks: {},
};

export default function useMakerState() {
  const [maker, setMaker] = useState(INITIAL);

  const resetMaker = useCallback(() => setMaker(INITIAL), []);

  // Example “AI/autoconfigure” stub — safe & deterministic for now
  const autoconfigure = useCallback((hint = {}) => {
    setMaker((prev) => {
      const brandName = hint.name || prev.brand?.name || "ExampleCo";
      const industry = (hint.industry || "").toLowerCase();
      const nav =
        industry === "saas"
          ? ["Home", "Product", "Pricing", "Docs", "Contact"]
          : industry === "law"
          ? ["Home", "Services", "Industries", "Insights", "Contact"]
          : ["Home", "Products", "Services", "About", "Contact"];

      return {
        ...prev,
        brand: {
          ...prev.brand,
          name: brandName,
          tagline:
            hint.tagline || prev.brand?.tagline || "Built for clarity and outcomes.",
          primary: prev.brand?.primary || "#0F172A",
          secondary: prev.brand?.secondary || "#F6F7F9",
          accent: prev.brand?.accent || "#0EA5E9",
          hero: prev.brand?.hero || "",
        },
        pages: { ...(prev.pages || {}), nav },
      };
    });
  }, []);

  return { maker, setMaker, resetMaker, autoconfigure };
}
