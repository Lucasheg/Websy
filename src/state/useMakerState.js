import { useState, useEffect, useCallback } from "react";

const DEFAULT = {
  brand: {
    name: "Brand",
    tagline: "A calm, professional default site.",
    logoUrl: "",
    locations: [],
  },
  theme: {
    primary: "#0F172A",
    accent: "#0EA5E9",
    neutral: "#F6F7F9",
    radius: 16,
    base: 16,
    container: 1200,
  },
  layout: { nav: ["Home", "Products", "About", "Contact"] },
  content: {
    hero: {
      title: "Clarity that converts.",
      subtitle: "Solid structure, small type, fine lines, and breathing room.",
      image: "",
    },
    features: [
      { title: "Clear value", text: "Straightforward messaging that reduces friction." },
      { title: "Fast & responsive", text: "Performance and responsiveness by default." },
      { title: "Accessible", text: "Readable contrast, keyboard-friendly controls." },
    ],
    gallery: { images: [] },
    testimonials: [{ quote: "Professional and reliable delivery.", author: "COO, Meridian" }],
    faq: [{ q: "Do you adapt to different industries?", a: "Yes—structure and tone adapt to fit." }],
    contact: { email: "contact@example.com", phone: "", locations: [] },
  },
};

export default function useMakerState() {
  const [maker, setMaker] = useState(() => {
    try {
      const saved = localStorage.getItem("maker");
      return saved ? JSON.parse(saved) : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try { localStorage.setItem("maker", JSON.stringify(maker)); } catch {}
  }, [maker]);

  const resetMaker = useCallback(() => setMaker(DEFAULT), []);

  const autoconfigure = useCallback((text = "") => {
    const t = text.trim();
    let name = (t.match(/^(.*?)(,|$)/)?.[1] || "").trim();
    if (!name) name = "Brand";
    setMaker((prev) => ({ ...prev, brand: { ...(prev.brand || {}), name } }));
  }, []);

  return { maker, setMaker, resetMaker, autoconfigure };
}
