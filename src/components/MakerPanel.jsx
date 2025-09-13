import React, { useMemo, useState } from "react";

export default function MakerPanel({ maker, setMaker, resetMaker, autoconfigure }) {
  const { brand, layout, pages, content, animation } = maker;
  const [openGroup, setOpenGroup] = useState("brand");
  const [prompt, setPrompt] = useState("");

  const ui = styles();

  return (
    <div style={ui.panel}>
      <div style={ui.header}>
        <div style={ui.title}>
          <span style={ui.dot} /> CITEKS Website Maker
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={ui.btnGhost} onClick={resetMaker}>Reset</button>
          <button
            style={ui.btn}
            onClick={() => {
              const p = prompt?.trim();
              if (p) autoconfigure(p);
            }}
          >
            AI Autopilot
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {/* Prompt */}
        <fieldset style={ui.group(openGroup === "ai")} onClick={() => setOpenGroup("ai")}>
          <legend style={ui.legend}>AI prompt</legend>
          <div style={ui.groupBody}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`e.g.\n"We are a boutique law firm. Tone: calm and authoritative. Prefer editorial hero.\nEnable pricing and FAQ. Use green accent."`}
              style={ui.textarea}
              rows={3}
            />
            <div style={ui.hint}>Type a brief and hit <b>AI Autopilot</b> above.</div>
          </div>
        </fieldset>

        {/* Brand */}
        <fieldset style={ui.group(openGroup === "brand")} onClick={() => setOpenGroup("brand")}>
          <legend style={ui.legend}>Branding</legend>
          <div style={ui.groupBody}>
            <LabeledInput
              label="Brand name"
              value={brand.name}
              onChange={(v) => setMaker({ brand: { name: v } })}
            />
            <LabeledInput
              label="Tagline"
              value={brand.tagline}
              onChange={(v) => setMaker({ brand: { tagline: v } })}
            />
            <div style={ui.cols2}>
              <LabeledInput
                label="Primary color"
                value={brand.colors.primary}
                onChange={(v) => setMaker({ brand: { colors: { primary: v } } })}
              />
              <LabeledInput
                label="Accent color"
                value={brand.colors.accent}
                onChange={(v) => setMaker({ brand: { colors: { accent: v } } })}
              />
            </div>
            <LabeledInput
              label="Neutral background"
              value={brand.colors.neutral}
              onChange={(v) => setMaker({ brand: { colors: { neutral: v } } })}
            />
            <LabeledInput
              label="Logo URL (optional)"
              value={brand.logoUrl}
              onChange={(v) => setMaker({ brand: { logoUrl: v } })}
            />
            <LabeledInput
              label="Hero image URL (optional)"
              value={brand.heroImage}
              onChange={(v) => setMaker({ brand: { heroImage: v } })}
            />
          </div>
        </fieldset>

        {/* Layout & Typography */}
        <fieldset style={ui.group(openGroup === "layout")} onClick={() => setOpenGroup("layout")}>
          <legend style={ui.legend}>Layout & Typography</legend>
          <div style={ui.groupBody}>
            <div style={ui.cols3}>
              <LabeledNumber
                label="Container (px)"
                value={layout.container}
                min={960}
                max={1440}
                step={20}
                onChange={(v) => setMaker({ layout: { container: v } })}
              />
              <LabeledNumber
                label="Radius (px)"
                value={layout.radius}
                min={0}
                max={28}
                step={1}
                onChange={(v) => setMaker({ layout: { radius: v } })}
              />
              <LabeledSelect
                label="Card style"
                value={layout.card}
                options={[
                  ["soft", "Soft shadow"],
                  ["outline", "Outline"],
                  ["minimal", "Minimal"]
                ]}
                onChange={(v) => setMaker({ layout: { card: v } })}
              />
            </div>
            <div style={ui.cols2}>
              <LabeledNumber
                label="Base font (px)"
                value={layout.typography.base}
                min={14}
                max={18}
                step={1}
                onChange={(v) => setMaker({ layout: { typography: { base: v } } })}
              />
              <LabeledSelect
                label="Scale"
                value={layout.typography.scale}
                options={[
                  [1.2, "Minor Third (1.20)"],
                  [1.25, "Major Third (1.25)"],
                  [1.333, "Perfect Fourth (1.333)"]
                ]}
                onChange={(v) => setMaker({ layout: { typography: { scale: parseFloat(v) } } })}
              />
            </div>
          </div>
        </fieldset>

        {/* Sections */}
        <fieldset style={ui.group(openGroup === "sections")} onClick={() => setOpenGroup("sections")}>
          <legend style={ui.legend}>Sections</legend>
          <div style={ui.groupBody}>
            <div style={ui.hint}>Toggle and reorder. The preview follows this order.</div>
            {pages.sectionsOrder.map((key, i) => (
              <div key={key} style={ui.row}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={pages.enabled[key]}
                    onChange={(e) => setMaker({ pages: { enabled: { [key]: e.target.checked } } })}
                  />
                  <span style={ui.badge}>{key}</span>
                </label>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  <button
                    style={ui.pillBtn}
                    disabled={i === 0}
                    onClick={() => reorder(setMaker, pages.sectionsOrder, i, i - 1)}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    style={ui.pillBtn}
                    disabled={i === pages.sectionsOrder.length - 1}
                    onClick={() => reorder(setMaker, pages.sectionsOrder, i, i + 1)}
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Hero */}
        <fieldset style={ui.group(openGroup === "hero")} onClick={() => setOpenGroup("hero")}>
          <legend style={ui.legend}>Hero</legend>
          <div style={ui.groupBody}>
            <LabeledSelect
              label="Variant"
              value={content.hero.variant}
              options={[
                ["image", "Image"],
                ["editorial", "Editorial"],
                ["product", "Product"],
                ["minimal", "Minimal"]
              ]}
              onChange={(v) => setMaker({ content: { hero: { variant: v } } })}
            />
            <div style={ui.cols2}>
              <LabeledInput
                label="Primary CTA"
                value={content.hero.primaryCta}
                onChange={(v) => setMaker({ content: { hero: { primaryCta: v } } })}
              />
              <LabeledInput
                label="Secondary CTA"
                value={content.hero.secondaryCta}
                onChange={(v) => setMaker({ content: { hero: { secondaryCta: v } } })}
              />
            </div>
            <LabeledTextarea
              label="Hero KPIs (one per line)"
              value={(content.hero.kpi || []).join("\n")}
              onChange={(v) =>
                setMaker({ content: { hero: { kpi: v.split("\n").map((x) => x.trim()).filter(Boolean) } } })
              }
              rows={3}
            />
          </div>
        </fieldset>

        {/* Features */}
        <fieldset style={ui.group(openGroup === "features")} onClick={() => setOpenGroup("features")}>
          <legend style={ui.legend}>Features</legend>
          <div style={ui.groupBody}>
            <LabeledPairs
              label="Items (Title | Text per line)"
              value={(content.features || []).map((i) => `${i.title} | ${i.text}`).join("\n")}
              onChange={(arr) => setMaker({ content: { features: arr.map(toTitleText) } })}
            />
          </div>
        </fieldset>

        {/* Gallery */}
        <fieldset style={ui.group(openGroup === "gallery")} onClick={() => setOpenGroup("gallery")}>
          <legend style={ui.legend}>Gallery</legend>
          <div style={ui.groupBody}>
            <LabeledTextarea
              label="Image URLs (one per line)"
              value={(content.gallery || []).join("\n")}
              onChange={(v) =>
                setMaker({ content: { gallery: v.split("\n").map((x) => x.trim()).filter(Boolean) } })
              }
              rows={4}
            />
          </div>
        </fieldset>

        {/* Testimonials */}
        <fieldset style={ui.group(openGroup === "testimonials")} onClick={() => setOpenGroup("testimonials")}>
          <legend style={ui.legend}>Testimonials</legend>
          <div style={ui.groupBody}>
            <LabeledPairs
              label='Items (“Quote” — Author per line)'
              value={(content.testimonials || []).map((i) => `${i.quote} — ${i.author}`).join("\n")}
              onChange={(arr) => setMaker({ content: { testimonials: arr.map(toQuoteAuthor) } })}
            />
          </div>
        </fieldset>

        {/* Pricing */}
        <fieldset style={ui.group(openGroup === "pricing")} onClick={() => setOpenGroup("pricing")}>
          <legend style={ui.legend}>Pricing</legend>
          <div style={ui.groupBody}>
            <LabeledTextarea
              label="Plans (Name | Price | Feature, Feature, … per line)"
              value={(content.pricing || [])
                .map((p) => `${p.name} | ${p.price} | ${(p.items || []).join(", ")}`)
                .join("\n")}
              onChange={(v) => setMaker({ content: { pricing: parsePlans(v) } })}
              rows={4}
            />
          </div>
        </fieldset>

        {/* FAQ */}
        <fieldset style={ui.group(openGroup === "faq")} onClick={() => setOpenGroup("faq")}>
          <legend style={ui.legend}>FAQ</legend>
          <div style={ui.groupBody}>
            <LabeledPairs
              label="Items (Q? | A. per line)"
              value={(content.faq || []).map((i) => `${i.q} | ${i.a}`).join("\n")}
              onChange={(arr) => setMaker({ content: { faq: arr.map(toQA) } })}
            />
          </div>
        </fieldset>

        {/* Contact */}
        <fieldset style={ui.group(openGroup === "contact")} onClick={() => setOpenGroup("contact")}>
          <legend style={ui.legend}>Contact</legend>
          <div style={ui.groupBody}>
            <div style={ui.cols3}>
              <LabeledInput
                label="Email"
                value={content.contact?.email || ""}
                onChange={(v) => setMaker({ content: { contact: { email: v } } })}
              />
              <LabeledInput
                label="Phone"
                value={content.contact?.phone || ""}
                onChange={(v) => setMaker({ content: { contact: { phone: v } } })}
              />
              <LabeledInput
                label="Locations (comma)"
                value={(content.contact?.locations || []).join(", ")}
                onChange={(v) =>
                  setMaker({ content: { contact: { locations: v.split(",").map((x) => x.trim()).filter(Boolean) } } })
                }
              />
            </div>
          </div>
        </fieldset>

        {/* Animation */}
        <fieldset style={ui.group(openGroup === "animation")} onClick={() => setOpenGroup("animation")}>
          <legend style={ui.legend}>Animation</legend>
          <div style={ui.groupBody}>
            <LabeledSelect
              label="Intensity"
              value={animation.level}
              options={[
                ["low", "Low"],
                ["medium", "Medium"],
                ["high", "High"]
              ]}
              onChange={(v) => setMaker({ animation: { level: v } })}
            />
          </div>
        </fieldset>
      </div>
    </div>
  );
}

/* ---------- helpers & micro components ---------- */

function reorder(setMaker, arr, from, to) {
  const next = arr.slice();
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m);
  setMaker({ pages: { sectionsOrder: next } });
}

function toTitleText(line) {
  const [t, x] = line.split("|").map((s) => (s || "").trim());
  return { title: t || "", text: x || "" };
}
function toQuoteAuthor(line) {
  const [q, a] = line.split("—").map((s) => (s || "").trim().replace(/^"|"$/g, ""));
  return { quote: q || "", author: a || "" };
}
function toQA(line) {
  const [q, a] = line.split("|").map((s) => (s || "").trim());
  return { q: q || "", a: a || "" };
}
function parsePlans(v) {
  return v
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [name, price, rest] = l.split("|").map((s) => (s || "").trim());
      const items = (rest || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return { name: name || "", price: price || "", items };
    });
}

function LabeledInput({ label, value, onChange, placeholder }) {
  const ui = styles();
  return (
    <label style={ui.label}>
      <span style={ui.labelText}>{label}</span>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={ui.input}
      />
    </label>
  );
}

function LabeledTextarea({ label, value, onChange, rows = 3, placeholder }) {
  const ui = styles();
  return (
    <label style={ui.label}>
      <span style={ui.labelText}>{label}</span>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={ui.textarea}
      />
    </label>
  );
}

function LabeledNumber({ label, value, onChange, min, max, step = 1 }) {
  const ui = styles();
  return (
    <label style={ui.label}>
      <span style={ui.labelText}>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
        style={ui.input}
      />
    </label>
  );
}

function LabeledSelect({ label, value, onChange, options }) {
  const ui = styles();
  return (
    <label style={ui.label}>
      <span style={ui.labelText}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={ui.input}
      >
        {options.map(([val, text]) => (
          <option key={String(val)} value={val}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function LabeledPairs({ label, value, onChange }) {
  const ui = styles();
  return (
    <label style={ui.label}>
      <span style={ui.labelText}>{label}</span>
      <textarea
        rows={5}
        value={value || ""}
        onChange={(e) => {
          const lines = (e.target.value || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          onChange(lines);
        }}
        style={ui.textarea}
      />
    </label>
  );
}

/* ---------- styles ---------- */
function styles() {
  return {
    panel: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(0,0,0,.04)",
      padding: 16
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8
    },
    title: { fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 },
    dot: { width: 8, height: 8, borderRadius: 999, background: "#0EA5E9", display: "inline-block" },
    btn: {
      background: "#0EA5E9",
      color: "#fff",
      border: "none",
      borderRadius: 999,
      padding: "8px 14px",
      cursor: "pointer"
    },
    btnGhost: {
      background: "#0F172A",
      color: "#fff",
      border: "none",
      borderRadius: 999,
      padding: "8px 14px",
      cursor: "pointer",
      opacity: 0.85
    },
    group: (open) => ({
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      background: open ? "#F9FAFB" : "#fff",
      transition: "background .2s ease"
    }),
    legend: { padding: "0 6px", fontWeight: 700, fontSize: 14 },
    groupBody: { display: "grid", gap: 10, marginTop: 8 },
    label: { display: "grid", gap: 6 },
    labelText: { fontSize: 13, color: "#475569" },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      background: "#fff"
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      background: "#fff",
      resize: "vertical"
    },
    cols2: { display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" },
    cols3: { display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr" },
    row: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 10px",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      background: "#fff"
    },
    pillBtn: {
      border: "1px solid #e5e7eb",
      background: "#fff",
      borderRadius: 12,
      padding: "4px 10px",
      cursor: "pointer"
    },
    badge: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      background: "#EEF2FF",
      color: "#1E293B",
      fontSize: 12
    },
    hint: { color: "#64748B", fontSize: 12 }
  };
}
