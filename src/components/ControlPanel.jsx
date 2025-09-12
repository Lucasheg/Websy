import React, { useRef } from "react";
import { interpretPrompt } from "../lib/aiAssist.js";

export default function ControlPanel({ brief, setBrief }){
  const fileRef = useRef(null);

  function update(path, value){
    setBrief(prev=>{
      const clone = structuredClone(prev);
      const parts = path.split(".");
      let cur = clone;
      for (let i=0; i<parts.length-1; i++) cur = cur[parts[i]];
      cur[parts.at(-1)] = value;
      return clone;
    });
  }

  function onLocalHero(e){
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    update("company.brand.heroImage", url);
  }

  return (
    <div className="stack">
      {/* Brand */}
      <details className="accordion" open>
        <summary className="ts-h6"><b>Brand</b></summary>
        <div className="grid cols-2">
          <label>Company name
            <input className="input" value={brief.company.name} onChange={e=>update("company.name", e.target.value)} />
          </label>
          <label>Tagline
            <input className="input" value={brief.company.tagline} onChange={e=>update("company.tagline", e.target.value)} />
          </label>
          <label>Locations (comma)
            <input className="input" value={brief.company.locations.join(", ")} onChange={e=>update("company.locations", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
          </label>
          <label>Industry
            <select className="input" value={brief.company.industry} onChange={e=>update("company.industry", e.target.value)}>
              <option value="law">Law</option>
              <option value="clinic">Clinic</option>
              <option value="gym">Gym</option>
              <option value="saas">SaaS</option>
              <option value="generic">Generic</option>
            </select>
          </label>

          <label>Primary color
            <input className="input" value={brief.company.brand.primary} onChange={e=>update("company.brand.primary", e.target.value)} />
          </label>
          <label>Accent color
            <input className="input" value={brief.company.brand.accent} onChange={e=>update("company.brand.accent", e.target.value)} />
          </label>
          <label>Neutral background
            <input className="input" value={brief.company.brand.secondary} onChange={e=>update("company.brand.secondary", e.target.value)} />
          </label>
          <label>Animation level
            <select className="input" value={brief.motion.level} onChange={e=>update("motion.level", e.target.value)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>

          <label>Hero image URL (optional)
            <input className="input" value={brief.company.brand.heroImage || ""} onChange={e=>update("company.brand.heroImage", e.target.value)} />
            <small>…or upload a local image below</small>
          </label>
          <label>Upload hero image
            <input type="file" accept="image/*" className="input" ref={fileRef} onChange={onLocalHero}/>
          </label>
        </div>
      </div>
      </details>

      {/* Value & Proof */}
      <details className="accordion" open>
        <summary className="ts-h6"><b>Value & Proof</b></summary>
        <div className="grid cols-2">
          <label>Primary goal
            <select className="input" value={brief.goals.primary} onChange={e=>update("goals.primary", e.target.value)}>
              <option>Consultation</option>
              <option>Book appointment</option>
              <option>Start demo</option>
              <option>Get quote</option>
            </select>
          </label>
          <label>Differentiators (one per line)
            <textarea className="input" rows={4} value={brief.differentiators.join("\n")} onChange={e=>update("differentiators", e.target.value.split("\n").map(s=>s.trim()).filter(Boolean))}/>
          </label>
          <label>Testimonials (quote — author, one per line)
            <textarea className="input" rows={4} value={brief.proof.testimonials.map(t=>`${t.quote} — ${t.author}`).join("\n")} onChange={e=>{
              const arr = e.target.value.split("\n").map(l=>{
                const [q, a] = l.split("—").map(s=>s?.trim());
                return q ? {quote:q, author:a||""} : null;
              }).filter(Boolean);
              update("proof.testimonials", arr);
            }}/>
          </label>
          <label>Client logos (comma)
            <input className="input" value={brief.proof.logos.join(", ")} onChange={e=>update("proof.logos", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}/>
          </label>
          <label>Metrics (Label: Value, one per line)
            <textarea className="input" rows={3} value={brief.proof.metrics.map(m=>`${m.label}: ${m.value}`).join("\n")} onChange={e=>{
              const arr = e.target.value.split("\n").map(l=>{
                const [label, value] = l.split(":").map(s=>s?.trim());
                return label && value ? {label, value} : null;
              }).filter(Boolean);
              update("proof.metrics", arr);
            }}/>
          </label>
        </div>
      </details>

      {/* Pages */}
      <details className="accordion" open>
        <summary className="ts-h6"><b>Pages</b></summary>
        <div className="grid cols-2">
          {["home","services","pricing","contact","about","blog"].map(p=>(
            <label key={p} className="ts-h6" style={{display:"flex", alignItems:"center", gap:8}}>
              <input
                type="checkbox"
                checked={brief.pages.mustHave.includes(p)}
                onChange={e=>{
                  const has = brief.pages.mustHave.includes(p);
                  const next = has ? brief.pages.mustHave.filter(x=>x!==p) : [...brief.pages.mustHave, p];
                  update("pages.mustHave", next);
                }}
              />
              {p[0].toUpperCase()+p.slice(1)}
            </label>
          ))}
        </div>
      </details>

      {/* AI Assist */}
      <details className="accordion">
        <summary className="ts-h6"><b>AI Assist (keyword parser stub)</b></summary>
        <div className="stack">
          <textarea className="input" rows={4} placeholder="e.g. “DogToys, friendly minimal ecommerce for pet owners, needs shop + about + contact, bright accent, low animation…”" id="aiPrompt"></textarea>
          <div style={{display:"flex", gap:8}}>
            <button className="btn" onClick={()=>{
              const prompt = document.getElementById("aiPrompt").value;
              const patch = interpretPrompt(prompt);
              if (!patch) return;
              // merge patch into brief (shallow/arrays)
              setBrief(prev=>{
                const next = structuredClone(prev);
                Object.assign(next.company, patch.company||{});
                if (patch.company?.brand) Object.assign(next.company.brand, patch.company.brand);
                if (patch.goals?.primary) next.goals.primary = patch.goals.primary;
                if (Array.isArray(patch.pages?.mustHave)) next.pages.mustHave = Array.from(new Set([...(next.pages.mustHave||[]), ...patch.pages.mustHave]));
                if (Array.isArray(patch.differentiators)) next.differentiators = patch.differentiators;
                if (patch.motion?.level) next.motion.level = patch.motion.level;
                return next;
              });
            }}>Apply</button>
            <button className="btn ghost" onClick={()=>document.getElementById("aiPrompt").value=""}>Clear</button>
          </div>
          <small>This is deterministic parsing (no API). Later we can wire a real LLM safely behind a prompt+schema gate.</small>
        </div>
      </details>

      {/* Actions */}
      <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
        <button className="btn" onClick={()=>{
          // Load a fast example
          setBrief({
            company:{
              name:"Harbor & Sage Law",
              tagline:"Practical counsel for complex transactions",
              locations:["Oslo","New York","Amsterdam"],
              industry:"law",
              brand:{primary:"#0F172A", secondary:"#F7F7F9", accent:"#0EA5E9", heroImage:""}
            },
            goals:{primary:"Consultation"},
            motion:{level:"Low"},
            differentiators:["Clear fee structures","Bench of ex-in-house lawyers","Deal-first, not theory-first"],
            proof:{logos:["Aldin Capital","Meridian Partners","Koto Energy"], testimonials:[{quote:"Guided a complex cross-border deal with clarity.", author:"COO, Meridian"}], metrics:[{label:"Deals advised", value:"220"}]},
            pages:{mustHave:["home","services","pricing","contact"]}
          });
        }}>Load example</button>
        <button className="btn ghost" onClick={()=>window.scrollTo({top:document.body.scrollHeight, behavior:"smooth"})}>Jump to Preview</button>
      </div>
    </div>
  );
}
