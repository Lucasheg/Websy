import { PLAYBOOKS } from "./playbooks.js";

export function generateDSL(brief){
  const pb = PLAYBOOKS[brief.company.industry] || PLAYBOOKS.generic;

  const brand = {
    name: brief.company.name || "Your company",
    tagline: brief.company.tagline || "",
    colors: {
      primary: brief.company.brand.primary || "#0F172A",
      secondary: brief.company.brand.secondary || "#F7F7F9",
      accent: brief.company.brand.accent || "#0EA5E9"
    }
  };

  const locationsBadge = (brief.company.locations||[]).join(" · ") || "";
  const primaryCTA = brief.goals.primary || pb.primary;
  const secondaryCTA = pb.secondary;

  const hero = {
    kind: pb.heroKind,
    heroImage: brief.company.brand.heroImage || ""
  };

  const valueItems = (brief.differentiators||[]).slice(0,6).map(d=>({title:d, text:"Built into our day-to-day process."}));

  const proof = {
    logos: brief.proof.logos||[],
    testimonials: brief.proof.testimonials||[],
    metrics: brief.proof.metrics||[]
  };

  const pricing = (brief.pages.mustHave||[]).includes("pricing")
    ? {
        note:"Transparent estimates. Fixed-fee options available.",
        tiers:[
          { name:"Starter", price:"$900", items:["2–3 pages","Responsive","Lead form"] },
          { name:"Growth",  price:"$2,300", items:["5–7 pages","SEO + schema","Booking & Maps","Integrations"] },
          { name:"Scale",   price:"$7,000", items:["10+ pages","Strategy + funnel","Advanced SEO/analytics","CRM / e-com"] }
        ]
      }
    : null;

  const dsl = {
    meta:{
      brand, locationsBadge, primaryCTA, secondaryCTA, motion:brief.motion
    },
    proof,
    pricing,
    contact:{ email:"contact@citeks.net" },
    pages:[
      {
        slug:"home",
        sections:{
          hero,
          value:{ items:valueItems },
        }
      }
    ]
  };

  return dsl;
}
