import React from "react";

export default function MakerPanel({ maker, setMaker, resetMaker, autoconfigure }) {
  const { brand, layout, pages, blocks } = maker;

  const set = (path, value) => {
    // simple path setter "a.b.c"
    setMaker((prev) => {
      const next = structuredClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const moveBlock = (idx, dir) => {
    setMaker((prev) => {
      const arr = [...prev.blocks.order];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...prev, blocks: { ...prev.blocks, order: arr } };
    });
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.06)",
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ fontWeight: 700 }}>CITEKS Website Maker</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => autoconfigure(brand.industry)}
            style={btn()}
            title="Pick safe presets from industry"
          >
            Autoconfigure
          </button>
          <button onClick={resetMaker} style={btn("alt")}>
            Reset
          </button>
        </div>
      </div>

      {/* BRAND */}
      <details open style={sec()}>
        <summary style={sum()}>Brand</summary>
        <div style={grid(3)}>
          <label style={lbl()}>
            Name
            <input
              value={brand.name}
              onChange={(e) => set("brand.name", e.target.value)}
              style={inp()}
              placeholder="e.g., Harbor & Sage Law"
            />
          </label>
          <label style={lbl()}>
            Industry
            <select value={brand.industry} onChange={(e) => set("brand.industry", e.target.value)} style={inp()}>
              <option value="generic">Generic</option>
              <option value="law">Law</option>
              <option value="clinic">Clinic</option>
              <option value="saas">SaaS</option>
              <option value="gym">Gym</option>
            </select>
          </label>
          <label style={lbl()}>
            Tagline
            <input
              value={brand.tagline}
              onChange={(e) => set("brand.tagline", e.target.value)}
              style={inp()}
              placeholder="Practical counsel for complex transactions"
            />
          </label>
        </div>
        <div style={grid(3)}>
          <label style={lbl()}>
            Primary color
            <input value={brand.colors.primary} onChange={(e) => set("brand.colors.primary", e.target.value)} style={inp()} />
          </label>
          <label style={lbl()}>
            Neutral background
            <input value={brand.colors.neutral} onChange={(e) => set("brand.colors.neutral", e.target.value)} style={inp()} />
          </label>
          <label style={lbl()}>
            Accent color
            <input value={brand.colors.accent} onChange={(e) => set("brand.colors.accent", e.target.value)} style={inp()} />
          </label>
        </div>
        <div style={grid(2)}>
          <label style={lbl()}>
            Hero image URL (optional)
            <input
              value={brand.heroImage}
              onChange={(e) => set("brand.heroImage", e.target.value)}
              style={inp()}
              placeholder="https://…/hero.jpg"
            />
          </label>
          <label style={lbl()}>
            Locations (comma)
            <input
              value={(brand.locations || []).join(", ")}
              onChange={(e) => set("brand.locations", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
              style={inp()}
              placeholder="Oslo, New York, Amsterdam"
            />
          </label>
        </div>
      </details>

      {/* LAYOUT & ANIMATIONS */}
      <details open style={sec()}>
        <summary style={sum()}>Layout & Animations</summary>
        <div style={grid(4)}>
          <label style={lbl()}>
            Container
            <select value={layout.container} onChange={(e) => set("layout.container", e.target.value)} style={inp()}>
              <option value="narrow">Narrow</option>
              <option value="standard">Standard</option>
              <option value="wide">Wide</option>
            </select>
          </label>
          <label style={lbl()}>
            Header
            <select value={layout.header} onChange={(e) => set("layout.header", e.target.value)} style={inp()}>
              <option value="minimal">Minimal</option>
              <option value="split">Split</option>
              <option value="centered">Centered</option>
            </select>
          </label>
          <label style={lbl()}>
            Nav density
            <select value={layout.navDensity} onChange={(e) => set("layout.navDensity", e.target.value)} style={inp()}>
              <option value="sparse">Sparse</option>
              <option value="normal">Normal</option>
              <option value="dense">Dense</option>
            </select>
          </label>
          <label style={lbl()}>
            Section rhythm
            <select value={layout.rhythm} onChange={(e) => set("layout.rhythm", e.target.value)} style={inp()}>
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </label>
        </div>
        <div style={grid(3)}>
          <label style={lbl()}>
            Radius
            <select value={layout.radius} onChange={(e) => set("layout.radius", e.target.value)} style={inp()}>
              <option value="subtle">Subtle</option>
              <option value="medium">Medium</option>
              <option value="soft">Soft</option>
            </select>
          </label>
          <label style={lbl()}>
            Shadow
            <select value={layout.shadow} onChange={(e) => set("layout.shadow", e.target.value)} style={inp()}>
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
            </select>
          </label>
          <label style={lbl()}>
            Animation
            <select value={layout.animation} onChange={(e) => set("layout.animation", e.target.value)} style={inp()}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
      </details>

      {/* PAGES & BLOCKS */}
      <details open style={sec()}>
        <summary style={sum()}>Pages & Blocks</summary>
        <div style={grid(3)}>
          {Object.keys(pages).map((k) => (
            <label key={k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={pages[k]}
                onChange={(e) => set(`pages.${k}`, e.target.checked)}
              />
              <span style={{ fontSize: 14, color: "#0f172a" }}>{k}</span>
            </label>
          ))}
        </div>

        <div style={{ height: 10 }} />

        <div style={grid(3)}>
          <label style={lbl()}>
            Hero variant
            <select
              value={blocks.heroVariant}
              onChange={(e) => set("blocks.heroVariant", e.target.value)}
              style={inp()}
            >
              <option value="image">Image + copy</option>
              <option value="editorial">Editorial</option>
              <option value="product">Product</option>
              <option value="stack">Card stack</option>
            </select>
          </label>
          <label style={lbl()}>
            Proof variant
            <select
              value={blocks.proofVariant}
              onChange={(e) => set("blocks.proofVariant", e.target.value)}
              style={inp()}
            >
              <option value="mixed">Mixed</option>
              <option value="logos">Logo wall</option>
              <option value="testimonials">Testimonials</option>
              <option value="metrics">Metrics</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Homepage block order</div>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))" }}>
            {blocks.order.map((key, idx) => (
              <div
                key={key}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 10,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>{key}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => moveBlock(idx, -1)} style={miniBtn()} title="Up">
                    ↑
                  </button>
                  <button onClick={() => moveBlock(idx, +1)} style={miniBtn()} title="Down">
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}

/* ---- tiny style helpers ---- */
function btn(variant) {
  return {
    background: variant === "alt" ? "#0f172a" : "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 14,
  };
}
function sec() {
  return { marginTop: 12, borderTop: "1px solid #e5e7eb", paddingTop: 8 };
}
function sum() {
  return { fontWeight: 700, cursor: "pointer", listStyle: "none" };
}
function grid(n = 2) {
  return { display: "grid", gap: 10, gridTemplateColumns: `repeat(${n}, minmax(220px,1fr))`, marginTop: 8 };
}
function lbl() {
  return { display: "grid", gap: 4, fontSize: 14, color: "#0f172a" };
}
function inp() {
  return {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fff",
    fontSize: 14,
  };
}
function miniBtn() {
  return {
    background: "#f1f5f9",
    color: "#0f172a",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: 12,
  };
}
