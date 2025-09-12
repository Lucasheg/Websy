import { useState, useCallback } from "react";

const DEFAULTS = {
  brand: {
    name: "CITEKS Client",
    tagline: "Websites that pay for themselves.",
    colors: { primary: "#0F172A", neutral: "#F6F7F9", accent: "#0EA5E9" },
    industry: "generic",
    heroImage: "",
    locations: ["Oslo", "New York", "Amsterdam"],
  },
  layout: {
    container: "standard", // narrow | standard | wide
    header: "split",       // minimal | split | centered
    navDensity: "normal",  // sparse | normal | dense
    radius: "medium",      // subtle | medium | soft
    shadow: "light",       // none | light | medium
    animation: "medium",   // low | medium | high
    rhythm: "comfortable", // compact | comfortable | spacious
  },
  pages: {
    home: true,
    services: true,
    pricing: true,
    about: false,
    faq: false,
    blog: false,
    contact: true,
  },
  blocks: {
    heroVariant: "image",      // image | editorial | product | stack
    proofVariant: "mixed",     // logos | testimonials | metrics | mixed
    order: ["hero", "value", "services", "proof", "pricing", "cta", "faq", "contact"],
  },
};

export default function useMakerState() {
  const [maker, setMaker] = useState(DEFAULTS);

  const resetMaker = useCallback(() => setMaker(DEFAULTS), []);

  // Simple rule-based autoconfigure (no AI): picks presets from industry
  const autoconfigure = useCallback((industry) => {
    const ind = (industry || maker.brand.industry || "generic").toLowerCase();
    const next = structuredClone(maker);

    next.brand.industry = ind;

    if (ind === "law") {
      next.layout = { ...next.layout, container: "narrow", header: "split", navDensity: "sparse", rhythm: "comfortable" };
      next.blocks.heroVariant = "editorial";
      next.blocks.proofVariant = "mixed";
      next.pages = { ...next.pages, about: true, faq: true };
      next.brand.colors = { primary: "#101827", neutral: "#F6F7F9", accent: "#2563eb" };
      next.brand.tagline = "Practical counsel for complex transactions.";
    } else if (ind === "clinic") {
      next.layout = { ...next.layout, container: "standard", header: "centered", navDensity: "normal", rhythm: "comfortable" };
      next.blocks.heroVariant = "image";
      next.blocks.proofVariant = "testimonials";
      next.pages = { ...next.pages, about: true, faq: true };
      next.brand.colors = { primary: "#0F172A", neutral: "#F6FAFF", accent: "#0ea5e9" };
      next.brand.tagline = "Modern care, minimal wait.";
    } else if (ind === "saas") {
      next.layout = { ...next.layout, container: "wide", header: "minimal", navDensity: "dense", rhythm: "compact" };
      next.blocks.heroVariant = "product";
      next.blocks.proofVariant = "logos";
      next.pages = { ...next.pages, blog: true, faq: true };
      next.brand.colors = { primary: "#0B1220", neutral: "#F7F7F7", accent: "#7c3aed" };
      next.brand.tagline = "Ship faster with clarity.";
    } else if (ind === "gym") {
      next.layout = { ...next.layout, container: "standard", header: "split", navDensity: "normal", rhythm: "comfortable" };
      next.blocks.heroVariant = "image";
      next.blocks.proofVariant = "metrics";
      next.pages = { ...next.pages, about: true };
      next.brand.colors = { primary: "#0f172a", neutral: "#F7F7F7", accent: "#f59e0b" };
      next.brand.tagline = "Stronger every week.";
    } else {
      // generic
      next.layout = { ...next.layout, container: "standard", header: "split", navDensity: "normal", rhythm: "comfortable" };
      next.blocks.heroVariant = "image";
      next.blocks.proofVariant = "mixed";
      next.pages = { ...next.pages, about: true };
      next.brand.colors = { primary: "#0F172A", neutral: "#F6F7F9", accent: "#0EA5E9" };
      next.brand.tagline = "Websites that pay for themselves.";
    }

    setMaker(next);
  }, [maker]);

  return { maker, setMaker, resetMaker, autoconfigure };
}
