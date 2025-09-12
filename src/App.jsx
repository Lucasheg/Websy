import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * CITEKS Website Maker – Minimal single-file version
 * - Collapsible control groups (Brand, Hero, Content, Sections, Layout & Motion)
 * - Live preview below (updates instantly)
 * - Local image upload OR URL for hero image
 * - Animation level: Low / Medium / High
 * - Include/exclude common sections
 * - Export HTML (downloads a static HTML of the generated page)
 *
 * No external deps. All styles inline or in <style>.
 */

const DEFAULT_BRAND = {
  name: "Your Company",
  tagline: "We make websites pay for themselves.",
  locations: "Oslo, New York, Amsterdam",
  colors: {
    ink: "#0F172A",
    accent: "#0EA5E9",
    neutral: "#F7F7F7",
  },
};

const DEFAULT_CONTENT = {
  differentiators: [
    "Clarity-first structure",
    "Trust signals above the fold",
    "Motion with restraint",
  ],
  services: [
    "Strategy & IA — goals, sitemap, decision paths",
    "Design System — reusable components, AA contrast",
    "Performance & SEO — schema, speed budgets",
  ],
  testimonials: [
    { quote: "They moved us from pretty to profitable.", author: "COO, Meridian" },
  ],
  logos: "Aldin Capital, Meridian Partners, Koto Energy",
  metrics: [
    { label: "Projects shipped", value: "180+" },
    { label: "Avg. time to launch", value: "9 days" },
  ],
  pricingNote: "Transparent estimates. Fixed-fee options available.",
};

const DEFAULT_FLAGS = {
  sections: {
    value: true,
    services: true,
    proof: true,
    pricing: true,
    cta: true,
    contact: true,
  },
  animation: "medium", // "low" | "medium" | "high"
};

export default function App() {
  // ------------ STATE
  const [openPanel, setOpenPanel] = useState("brand");

  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [hero, setHero] = useState({
    type: "image", // "image" | "solid" | "split"
    imageUrl: "",
    imageObjectUrl: "", // created from local upload
    overlay: 0.35, // 0..0.7
    height: "66vh", // css value
    primaryCta: "Book consultation",
    secondaryCta: "",
  });

  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [flags, setFlags] = useState(DEFAULT_FLAGS);
  const [layout, setLayout] = useState({
    container: 1180,
    spacing: 12,
    radius: 16,
    hairline: "#E5E7EB",
  });

  // animation settings derived
  const anim = useMemo(() => {
    if (flags.animation === "low") return { dur: 300, y: 8, parallax: 0.02 };
    if (flags.animation === "high") return { dur: 700, y: 18, parallax: 0.08 };
    return { dur: 500, y: 12, parallax: 0.045 };
  }, [flags.animation]);

  // handle local hero upload
  function onHeroFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setHero((h) => ({ ...h, imageObjectUrl: url }));
  }

  // util parsers (textareas)
  const parseLines = (s) =>
    (s || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  const parseTestimonials = (s) =>
    parseLines(s).map((ln) => {
      const [q, a] = ln.split("—").map((x) => x && x.trim());
      return q ? { quote: q, author: a || "" } : null;
    }).filter(Boolean);

  const parseMetrics = (s) =>
    parseLines(s).map((ln) => {
      const [label, value] = ln.split(":").map((x) => x && x.trim());
      return label && value ? { label, value } : null;
    }).filter(Boolean);

  // ---------- EXPORT HTML
  function exportHTML() {
    const html = buildStaticHTML({
      brand,
      hero,
      content,
      flags,
      layout,
      anim,
    });
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = toFileName(brand.name) + ".html";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      {/* Global Styles */}
      <style>{globalCss(layout, brand, anim)}</style>

      {/* HEADER / TOOLBAR */}
      <header className="toolbar">
        <div className="brand">
          <strong>CITEKS</strong> Website Maker
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => {
            setBrand(DEFAULT_BRAND);
            setHero({
              type: "image",
              imageUrl: "",
              imageObjectUrl: "",
              overlay: 0.35,
              height: "66vh",
              primaryCta: "Book consultation",
              secondaryCta: "",
            });
            setContent(DEFAULT_CONTENT);
            setFlags(DEFAULT_FLAGS);
          }}>Reset</button>
          <button className="btn" onClick={exportHTML}>Export HTML</button>
        </div>
      </header>

      {/* CONTROLS */}
      <section className="controls">
        <Accordion
          id="brand"
          title="Brand"
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
        >
          <div className="grid two">
            <Input
              label="Name"
              value={brand.name}
              onChange={(v) => setBrand({ ...brand, name: v })}
            />
            <Input
              label="Tagline"
              value={brand.tagline}
              onChange={(v) => setBrand({ ...brand, tagline: v })}
            />
          </div>
          <Input
            label="Locations (comma)"
            value={brand.locations}
            onChange={(v) => setBrand({ ...brand, locations: v })}
          />
          <div className="grid two">
            <Input
              label="Primary (ink)"
              type="color"
              value={brand.colors.ink}
              onChange={(v) => setBrand({ ...brand, colors: { ...brand.colors, ink: v } })}
            />
            <Input
              label="Accent"
              type="color"
              value={brand.colors.accent}
              onChange={(v) => setBrand({ ...brand, colors: { ...brand.colors, accent: v } })}
            />
          </div>
          <Input
            label="Neutral background"
            type="color"
            value={brand.colors.neutral}
            onChange={(v) => setBrand({ ...brand, colors: { ...brand.colors, neutral: v } })}
          />
        </Accordion>

        <Accordion
          id="hero"
          title="Hero"
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
        >
          <div className="grid three">
            <Select
              label="Type"
              value={hero.type}
              onChange={(v) => setHero({ ...hero, type: v })}
              options={[
                ["image", "Image"],
                ["solid", "Solid color"],
                ["split", "Split layout"],
              ]}
            />
            <Input
              label="Height (vh/px)"
              value={hero.height}
              onChange={(v) => setHero({ ...hero, height: v })}
            />
            <Range
              label={`Overlay ${Math.round(hero.overlay * 100)}%`}
              min={0}
              max={0.7}
              step={0.01}
              value={hero.overlay}
              onChange={(v) => setHero({ ...hero, overlay: v })}
            />
          </div>

          <Input
            label="Hero image URL (optional)"
            value={hero.imageUrl}
            onChange={(v) => setHero({ ...hero, imageUrl: v })}
            placeholder="https://…/image.jpg"
          />
          <label className="label">Or upload (local preview only)</label>
          <input type="file" accept="image/*" onChange={onHeroFile} />

          <div className="grid two" style={{ marginTop: 8 }}>
            <Input
              label="Primary CTA"
              value={hero.primaryCta}
              onChange={(v) => setHero({ ...hero, primaryCta: v })}
            />
            <Input
              label="Secondary CTA"
              value={hero.secondaryCta}
              onChange={(v) => setHero({ ...hero, secondaryCta: v })}
            />
          </div>
        </Accordion>

        <Accordion
          id="content"
          title="Content"
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
        >
          <TextArea
            label="Differentiators (one per line)"
            value={content.differentiators.join("\n")}
            onChange={(v) =>
              setContent({ ...content, differentiators: parseLines(v) })
            }
          />
          <TextArea
            label="Services (one per line)"
            value={content.services.join("\n")}
            onChange={(v) => setContent({ ...content, services: parseLines(v) })}
          />
          <TextArea
            label="Testimonials (quote — author, one per line)"
            value={content.testimonials.map((t) => `${t.quote} — ${t.author}`).join("\n")}
            onChange={(v) => setContent({ ...content, testimonials: parseTestimonials(v) })}
          />
          <Input
            label="Client logos (comma)"
            value={content.logos}
            onChange={(v) => setContent({ ...content, logos: v })}
          />
          <TextArea
            label="Metrics (Label: Value, one per line)"
            value={content.metrics.map((m) => `${m.label}: ${m.value}`).join("\n")}
            onChange={(v) => setContent({ ...content, metrics: parseMetrics(v) })}
          />
          <Input
            label="Pricing note"
            value={content.pricingNote}
            onChange={(v) => setContent({ ...content, pricingNote: v })}
          />
        </Accordion>

        <Accordion
          id="sections"
          title="Sections"
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
        >
          <Checkbox
            label="Value"
            checked={flags.sections.value}
            onChange={(c) => setFlags({ ...flags, sections: { ...flags.sections, value: c } })}
          />
          <Checkbox
            label="Services"
            checked={flags.sections.services}
            onChange={(c) => setFlags({ ...flags, sections: { ...flags.sections, services: c } })}
          />
          <Checkbox
            label="Proof (logos, testimonials, metrics)"
            checked={flags.sections.proof}
            onChange={(c) => setFlags({ ...flags, sections: { ...flags.sections, proof: c } })}
          />
          <Checkbox
            label="Pricing"
            checked={flags.sections.pricing}
            onChange={(c) => setFlags({ ...flags, sections: { ...flags.sections, pricing: c } })}
          />
          <Checkbox
            label="Final CTA"
            checked={flags.sections.cta}
            onChange={(c) => setFlags({ ...flags, sections: { ...flags.sections, cta: c } })}
          />
          <Checkbox
            label="Contact"
            checked={flags.sections.contact}
            onChange={(c) => setFlags({ ...flags, sections: { ...flags.sections, contact: c } })}
          />
        </Accordion>

        <Accordion
          id="layout"
          title="Layout & Motion"
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
        >
          <div className="grid three">
            <Input
              label="Container width (px)"
              value={String(layout.container)}
              onChange={(v) => setLayout({ ...layout, container: clampInt(v, 920, 1440) })}
            />
            <Input
              label="Spacing (px)"
              value={String(layout.spacing)}
              onChange={(v) => setLayout({ ...layout, spacing: clampInt(v, 8, 24) })}
            />
            <Input
              label="Radius (px)"
              value={String(layout.radius)}
              onChange={(v) => setLayout({ ...layout, radius: clampInt(v, 8, 24) })}
            />
          </div>

          <Select
            label="Animation level"
            value={flags.animation}
            onChange={(v) => setFlags({ ...flags, animation: v })}
            options={[
              ["low", "Low"],
              ["medium", "Medium"],
              ["high", "High"],
            ]}
          />
        </Accordion>
      </section>

      {/* PREVIEW */}
      <Preview
        brand={brand}
        hero={hero}
        content={content}
        flags={flags}
        layout={layout}
        anim={anim}
      />
    </div>
  );
}

/* ===================== Preview ===================== */

function Preview({ brand, hero, content, flags, layout, anim }) {
  // reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("vis")),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [brand, hero, content, flags, layout, anim]);

  const heroBg =
    hero.imageObjectUrl || hero.imageUrl
      ? `url(${hero.imageObjectUrl || hero.imageUrl})`
      : `linear-gradient(120deg, ${brand.colors.ink}, ${brand.colors.accent})`;

  return (
    <main className="preview">
      {/* Hero */}
      <section
        className="hero"
        style={{
          height: hero.height,
          backgroundImage: heroBg,
        }}
      >
        <div
          className="hero-scrim"
          style={{ background: `linear-gradient(180deg, rgba(0,0,0,${hero.overlay}), rgba(0,0,0,${hero.overlay * 0.65}))` }}
        />
        <div className="hero-copy">
          <div className="badge">{brand.locations}</div>
          <h1 className="ts-h1">{brand.name}</h1>
          <p className="ts-h6 sub">{brand.tagline}</p>
          <div className="row">
            {hero.primaryCta && <a className="btn" href="#contact">{hero.primaryCta}</a>}
            {hero.secondaryCta && <a className="btn ghost" href="#contact">{hero.secondaryCta}</a>}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Value */}
        {flags.sections.value && (
          <Section title="What you get with us">
            <CardGrid items={content.differentiators.map((d) => ({ title: d, text: "Built into our day-to-day process." }))} />
          </Section>
        )}

        {/* Services */}
        {flags.sections.services && (
          <Section title="Services">
            <CardGrid items={content.services.map((s) => ({ title: s.split(" — ")[0] || s, text: s.split(" — ")[1] || "" }))} />
          </Section>
        )}

        {/* Proof */}
        {flags.sections.proof && (
          <section className="reveal block">
            <h2 className="ts-h2">Proof</h2>
            <div className="logos">
              {(content.logos || "")
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
                .map((l) => (
                  <div className="logo-chip" key={l}>
                    {l}
                  </div>
                ))}
            </div>
            {!!content.testimonials?.length && (
              <>
                <div className="thin" />
                <div className="testimonials">
                  {content.testimonials.map((t, i) => (
                    <div className="card" key={i}>
                      <div className="q">“{t.quote}”</div>
                      <div className="a">{t.author}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {!!content.metrics?.length && (
              <>
                <div className="thin" />
                <div className="metrics">
                  {content.metrics.map((m, i) => (
                    <div className="card metric" key={i}>
                      <div className="v">{m.value}</div>
                      <div className="l">{m.label}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Pricing */}
        {flags.sections.pricing && (
          <Section title="Pricing" note={content.pricingNote}>
            <div className="grid3">
              {[
                { name: "Starter", price: "$900", items: ["2–3 pages", "Responsive", "Lead form"] },
                { name: "Growth", price: "$2,300", items: ["5–7 pages", "SEO + schema", "Booking & Maps", "Integrations"] },
                { name: "Scale", price: "$7,000", items: ["10+ pages", "Strategy + funnel", "Advanced SEO/analytics", "CRM / e-com"] },
              ].map((t) => (
                <div className="card" key={t.name}>
                  <div className="title">{t.name}</div>
                  <div className="price">{t.price}</div>
                  <ul className="list">
                    {t.items.map((it) => (
                      <li key={it}>• {it}</li>
                    ))}
                  </ul>
                  <a className="btn" href="#contact" style={{ marginTop: 12 }}>
                    Choose {t.name}
                  </a>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        {flags.sections.cta && (
          <section className="reveal cta">
            <h2 className="ts-h2">Ready to move faster?</h2>
            <a className="btn" href="#contact">
              {hero.primaryCta || "Get started"}
            </a>
          </section>
        )}

        {/* Contact */}
        {flags.sections.contact && (
          <section className="reveal" id="contact">
            <h2 className="ts-h2">Contact</h2>
            <p className="muted">Email: <a href="mailto:contact@citeks.net">contact@citeks.net</a></p>
            <form className="card form">
              <input placeholder="Name" />
              <input placeholder="Email" />
              <textarea rows={4} placeholder="Message" />
              <button className="btn" type="button">Send</button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}

/* ===================== UI Bits ===================== */

function Accordion({ id, title, children, openPanel, setOpenPanel }) {
  const open = openPanel === id;
  return (
    <div className="acc">
      <button className="acc-h" onClick={() => setOpenPanel(open ? "" : id)}>
        <span>{title}</span>
        <span className="chev">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="acc-b">{children}</div>}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="label">
      {label}
      <input
        className="input"
        type={type}
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(type === "color" ? e.target.value : e.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="label">
      {label}
      <textarea className="input" value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="label">
      {label}
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([val, txt]) => (
          <option key={val} value={val}>
            {txt}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="label row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function Section({ title, note, children }) {
  return (
    <section className="reveal block">
      <h2 className="ts-h2">{title}</h2>
      {note && <p className="muted">{note}</p>}
      {children}
    </section>
  );
}

function CardGrid({ items }) {
  return (
    <div className="grid3">
      {items.map((it, i) => (
        <div className="card" key={i}>
          <div className="title">{it.title}</div>
          {it.text && <div className="muted" style={{ marginTop: 4 }}>{it.text}</div>}
        </div>
      ))}
    </div>
  );
}

/* ===================== Helpers ===================== */

function clampInt(v, min, max) {
  const n = parseInt(String(v).replace(/[^\d]/g, ""), 10);
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function toFileName(s) {
  return (s || "site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildStaticHTML({ brand, hero, content, flags, layout, anim }) {
  // Assemble a portable static HTML from current state
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(brand.name)}</title>
<style>${globalCss(layout, brand, anim)}</style>
<body>
  <main class="preview">
    <section class="hero" style="height:${hero.height};background-image:${
    hero.imageUrl
      ? `url(${hero.imageUrl})`
      : `linear-gradient(120deg, ${brand.colors.ink}, ${brand.colors.accent})`
  }">
      <div class="hero-scrim" style="background:linear-gradient(180deg, rgba(0,0,0,${
        hero.overlay
      }), rgba(0,0,0,${hero.overlay * 0.65}))"></div>
      <div class="hero-copy">
        <div class="badge">${escapeHtml(brand.locations)}</div>
        <h1 class="ts-h1">${escapeHtml(brand.name)}</h1>
        <p class="ts-h6 sub">${escapeHtml(brand.tagline)}</p>
        <div class="row">
          ${hero.primaryCta ? `<a class="btn" href="#contact">${escapeHtml(hero.primaryCta)}</a>` : ""}
          ${hero.secondaryCta ? `<a class="btn ghost" href="#contact">${escapeHtml(hero.secondaryCta)}</a>` : ""}
        </div>
      </div>
    </section>
    <div class="container">
      ${
        flags.sections.value
          ? `<section class="block">
              <h2 class="ts-h2">What you get with us</h2>
              <div class="grid3">
                ${content.differentiators
                  .map(
                    (d) => `<div class="card">
                      <div class="title">${escapeHtml(d)}</div>
                      <div class="muted">Built into our day-to-day process.</div>
                    </div>`
                  )
                  .join("")}
              </div>
            </section>`
          : ""
      }
      ${
        flags.sections.services
          ? `<section class="block">
              <h2 class="ts-h2">Services</h2>
              <div class="grid3">
                ${content.services
                  .map((s) => {
                    const [t, tx] = s.split(" — ");
                    return `<div class="card">
                      <div class="title">${escapeHtml(t || s)}</div>
                      ${tx ? `<div class="muted">${escapeHtml(tx)}</div>` : ""}
                    </div>`;
                  })
                  .join("")}
              </div>
            </section>`
          : ""
      }
      ${
        flags.sections.proof
          ? `<section class="block">
              <h2 class="ts-h2">Proof</h2>
              <div class="logos">
                ${(content.logos || "")
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
                  .map((l) => `<div class="logo-chip">${escapeHtml(l)}</div>`)
                  .join("")}
              </div>
              ${
                content.testimonials?.length
                  ? `<div class="thin"></div>
                     <div class="testimonials">
                       ${content.testimonials
                         .map(
                           (t) => `<div class="card">
                             <div class="q">“${escapeHtml(t.quote)}”</div>
                             <div class="a">${escapeHtml(t.author || "")}</div>
                           </div>`
                         )
                         .join("")}
                     </div>`
                  : ""
              }
              ${
                content.metrics?.length
                  ? `<div class="thin"></div>
                     <div class="metrics">
                       ${content.metrics
                         .map(
                           (m) => `<div class="card metric">
                             <div class="v">${escapeHtml(m.value)}</div>
                             <div class="l">${escapeHtml(m.label)}</div>
                           </div>`
                         )
                         .join("")}
                     </div>`
                  : ""
              }
            </section>`
          : ""
      }
      ${
        flags.sections.pricing
          ? `<section class="block">
              <h2 class="ts-h2">Pricing</h2>
              <p class="muted">${escapeHtml(content.pricingNote || "")}</p>
              <div class="grid3">
                ${[
                  { name: "Starter", price: "$900", items: ["2–3 pages", "Responsive", "Lead form"] },
                  { name: "Growth", price: "$2,300", items: ["5–7 pages", "SEO + schema", "Booking & Maps", "Integrations"] },
                  { name: "Scale", price: "$7,000", items: ["10+ pages", "Strategy + funnel", "Advanced SEO/analytics", "CRM / e-com"] },
                ]
                  .map(
                    (t) => `<div class="card">
                      <div class="title">${t.name}</div>
                      <div class="price">${t.price}</div>
                      <ul class="list">
                        ${t.items.map((it) => `<li>• ${it}</li>`).join("")}
                      </ul>
                      <a class="btn" href="#contact" style="margin-top:12px">Choose ${t.name}</a>
                    </div>`
                  )
                  .join("")}
              </div>
            </section>`
          : ""
      }
      ${flags.sections.cta ? `<section class="cta"><h2 class="ts-h2">Ready to move faster?</h2><a class="btn" href="#contact">${escapeHtml(hero.primaryCta || "Get started")}</a></section>` : ""}
      ${
        flags.sections.contact
          ? `<section id="contact">
              <h2 class="ts-h2">Contact</h2>
              <p class="muted">Email: <a href="mailto:contact@citeks.net">contact@citeks.net</a></p>
              <form class="card form">
                <input placeholder="Name"/>
                <input placeholder="Email"/>
                <textarea rows="4" placeholder="Message"></textarea>
                <button class="btn" type="button">Send</button>
              </form>
            </section>`
          : ""
      }
    </div>
  </main>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ===================== Styles ===================== */

function globalCss(layout, brand, anim) {
  const spacing = layout.spacing;
  const rad = layout.radius;
  return `
:root{
  --ink:${brand.colors.ink}; --accent:${brand.colors.accent}; --bg:${brand.colors.neutral};
  --hair:${layout.hairline};
  --p:16px; --h6:18px; --h5:20px; --h4:25px; --h3:31.25px; --h2:39.06px; --h1:48.83px;
  --container:${layout.container}px; --sp:${spacing}px; --rad:${rad}px;
  --dur:${anim.dur}ms; --rise:${anim.y}px;
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0; background:var(--bg); color:var(--ink); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;}

.ts-h1{font-size:var(--h1); line-height:1.0; letter-spacing:-.02em; margin:0}
.ts-h2{font-size:var(--h2); line-height:1.1; letter-spacing:-.018em; margin:0 0 calc(var(--sp)*.5)}
.ts-h6{font-size:var(--h6); line-height:1.3; letter-spacing:-.005em;}

.toolbar{
  position:sticky; top:0; z-index:10;
  display:flex; align-items:center; justify-content:space-between;
  padding: 10px var(--sp);
  background: rgba(255,255,255,.8); backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--hair);
}
.toolbar .actions{display:flex; gap:8px}
.btn{display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#fff; padding:10px 14px; border-radius:999px; border:none; cursor:pointer; text-decoration:none; font-weight:600}
.btn.ghost{background:transparent; color:var(--ink); border:1px solid var(--hair)}

.controls{
  max-width: var(--container);
  margin: calc(var(--sp)) auto;
  padding: 0 var(--sp);
  display:grid;
  gap: var(--sp);
}

.acc{background:#fff; border:1px solid var(--hair); border-radius: var(--rad); overflow:hidden}
.acc-h{width:100%; display:flex; justify-content:space-between; align-items:center; padding:12px var(--sp); background:#fff; border:none; cursor:pointer; font-weight:700}
.acc-b{padding: var(--sp)}
.label{display:block; font-weight:600; margin-top:6px; margin-bottom:6px}
.input{width:100%; border:1px solid var(--hair); border-radius:12px; padding:10px 12px; background:#fff}
.grid.two{display:grid; gap:var(--sp); grid-template-columns: 1fr 1fr}
.grid.three{display:grid; gap:var(--sp); grid-template-columns: 1fr 1fr 1fr}
.label.row{display:flex; align-items:center; gap:8px; font-weight:600}

.preview{padding-bottom: calc(var(--sp)*3)}
.container{max-width: var(--container); padding: 0 var(--sp); margin: calc(var(--sp)*1.5) auto}
.block{margin-bottom: calc(var(--sp)*2)}
.grid3{display:grid; gap: var(--sp); grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))}
.card{background:#fff; border:1px solid var(--hair); border-radius: var(--rad); padding: var(--sp); box-shadow: 0 10px 30px rgba(0,0,0,.04)}
.card .title{font-weight:700; font-size: var(--h5)}
.card .price{font-weight:800; color:var(--accent); font-size: var(--h3); margin-top:4px}
.card .list{margin:8px 0 0; padding:0 0 0 18px}
.muted{color:#475569}
.thin{height:1px; background:var(--hair); margin: var(--sp) 0}
.logos{display:grid; gap: var(--sp); grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); margin: var(--sp) 0}
.logo-chip{border:1px solid var(--hair); border-radius:12px; padding:10px 12px; text-align:center; background:#fff}
.testimonials{display:grid; gap: var(--sp); grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))}
.card .q{font-style:italic}
.card .a{margin-top:8px; color:#64748b}
.metrics{display:grid; gap: var(--sp); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))}
.metric .v{font-weight:800; color:var(--accent); font-size: var(--h3)}
.metric .l{color:#64748b}

.hero{
  position:relative; overflow:hidden; border-radius: var(--rad);
  margin: calc(var(--sp)*1.5) var(--sp) 0; background-position:center; background-size:cover;
}
.hero-scrim{position:absolute; inset:0}
.hero-copy{
  position:relative; z-index:1; color:#fff; max-width:720px; padding: var(--sp);
  transform: translateY(var(--rise)); opacity:.001; transition: all var(--dur) ease;
}
.hero-copy .row{display:flex; gap:8px; margin-top:8px}
.badge{display:inline-block; background: rgba(255,255,255,.14); color:#fff; padding:4px 10px; border-radius:999px; font-size: 14px}
.sub{color: rgba(255,255,255,.92); margin-top:6px}

.cta{display:grid; justify-items:center; text-align:center; gap: 8px; margin-bottom: calc(var(--sp)*2)}
.form{display:grid; gap:8px}

.reveal{opacity:.001; transform: translateY(var(--rise)); transition: all var(--dur) ease;}
.reveal.vis{opacity:1; transform:none}
.hero .hero-copy{opacity:1; transform:none}
@media (max-width: 720px){
  .grid.two, .grid.three{grid-template-columns: 1fr}
}
`;
}

/* ===================== Small controls ===================== */

function Range({ label, min, max, step, value, onChange }) {
  return (
    <label className="label">
      {label}
      <input
        className="input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}
