import React, { useMemo } from "react";

export default function PreviewShell({ config }) {
  const {
    brand,
    layout,
    content: { goal, differentiators, testimonials, logos, metrics },
  } = config;

  const goalLabel = useMemo(() => {
    const g = (goal || "").toLowerCase();
    if (/book|appointment|schedule/.test(g)) return "Book appointment";
    if (/consult/.test(g)) return "Book consultation";
    if (/demo|trial/.test(g)) return "Start demo";
    if (/quote|estimate|price/.test(g)) return "Get quote";
    return "Contact us";
  }, [goal]);

  const industryNotes = useMemo(() => {
    switch (brand.industry) {
      case "law":
        return { nav: ["Services", "Expertise", "Pricing", "Contact"], heroKicker: brand.locations?.length ? brand.locations.join(" · ") : "" };
      case "clinic":
        return { nav: ["Care", "Doctors", "Pricing", "Contact"], heroKicker: "Same-week booking" };
      case "gym":
        return { nav: ["Programs", "Coaches", "Pricing", "Contact"], heroKicker: "Train with accountability" };
      case "saas":
        return { nav: ["Product", "Pricing",
