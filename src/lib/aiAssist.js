// Zero-API keyword parser (deterministic).
// Later we can replace this with a real model behind a strict schema & safety checks.

export function interpretPrompt(s){
  if (!s || typeof s !== "string") return null;
  const t = s.toLowerCase();

  const industry =
    /law|attorney|legal|advokat/.test(t) ? "law" :
    /clinic|dentist|health|dental|doctor|klinikk/.test(t) ? "clinic" :
    /gym|fitness|pt|coaching/.test(t) ? "gym" :
    /saas|software|platform|app/.test(t) ? "saas" : "generic";

  let goal = "Get quote";
  if (/consult/.test(t)) goal = "Consultation";
  else if (/book|appointment/.test(t)) goal = "Book appointment";
  else if (/demo|trial/.test(t)) goal = "Start demo";

  let motion = /high|crazy|motion/.test(t) ? "High" : /medium/.test(t) ? "Medium" : "Low";

  const accent = /bright|vivid|playful/.test(t) ? "#22c55e" :
                 /calm|minimal/.test(t) ? "#0ea5e9" :
                 "#0ea5e9";

  const primary = /elegant|editorial|serif/.test(t) ? "#0f172a" : "#0f172a";
  const secondary = /dark/.test(t) ? "#0b1220" : "#f7f7f9";

  const mustHave = [
    /about/.test(t) && "about",
    /contact/.test(t) && "contact",
    /blog|news/.test(t) && "blog",
    /shop|ecom|store|product/.test(t) && "pricing"
  ].filter(Boolean);

  // Extract a simple name if given like "i want a website named DogToys"
  const nameMatch = s.match(/named\s+([A-Za-z0-9 &-]+)/i);
  const name = nameMatch ? nameMatch[1].trim() : null;

  return {
    company:{
      name: name || undefined,
      industry,
      brand:{ primary, secondary, accent }
    },
    goals:{ primary: goal },
    motion:{ level: motion },
    pages:{ mustHave },
    differentiators: []
  };
}
