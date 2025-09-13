// src/components/MakerPanel.jsx
import React, { useMemo } from "react";

export default function MakerPanel({ maker, setMaker, resetMaker, autoconfigure }) {
  // Defensive defaults — never trust nested objects to exist
  const safe = useMemo(() => {
    const m = maker || {};
    return {
      brand: {
        name: m?.brand?.name ?? "ExampleCo",
        tagline: m?.brand?.tagline ?? "",
        primary: m?.brand?.primary ?? "#0F172A",
        secondary: m?.brand?.secondary ?? "#F6F7F9",
        accent: m?.brand?.accent ?? "#0EA5E9",
        hero: m?.brand?.hero ?? "",
      },
      pages: {
        nav: Array.isArray(m?.pages?.nav) ? m.pages.nav : [],
      },
      layout: {
        container: m?.layout?.container ?? 1040,
      },
    };
  }, [maker]);

  const updateBrand = (patch) =>
    setMaker((prev) => ({
      ...prev,
      brand: { ...(prev.brand || {}), ...patch },
    }));

  const updateNav = (navArray) =>
    setMaker((prev) => ({
      ...prev,
      pages: { ...(prev.pages || {}), nav: navArray },
    }));

  const updateLayout = (patch) =>
    setMaker((prev) => ({
      ...prev,
      layout: { ...(prev.layout || {}), ...patch },
    }));

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Website Maker</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => autoconfigure({ industry: "generic" })}
            style={btn}
          >
            Autoconfigure
          </button>
          <button type="button" onClick={resetMaker} style={{ ...btn, background: "#0f172a" }}>
            Reset
          </button>
        </div>
      </div>

      {/* Brand */}
      <fieldset style={fieldset}>
        <legend style={legend}>Brand</legend>
        <div style={grid2}>
          <label style={label}>
            Name
            <input
              value={safe.brand.name}
              onChange={(e) => updateBrand({ name: e.target.value })}
              style={input}
              placeholder="Company name"
            />
          </label>
          <label style={label}>
            Tagline
            <input
              value={safe.brand.tagline}
              onChange={(e) => updateBrand({ tagline: e.target.value })}
              style={input}
              placeholder="Short promise/value"
            />
          </label>
        </div>
        <div style={grid3}>
          <label style={label}>
            Primary
            <input
              type="color"
              value={safe.brand.primary}
              onChange={(e) => updateBrand({ primary: e.target.value })}
              style={input}
            />
          </label>
          <label style={label}>
            Accent
            <input
              type="color"
              value={safe.brand.accent}
              onChange={(e) => updateBrand({ accent: e.target.value })}
              style={input}
            />
          </label>
          <label style={label}>
            Neutral
            <input
              type="color"
              value={safe.brand.secondary}
              onChange={(e) => updateBrand({ secondary: e.target.value })}
              style={input}
            />
          </label>
        </div>
        <label style={label}>
          Hero image URL (optional)
          <input
            value={safe.brand.hero}
            onChange={(e) => updateBrand({ hero: e.target.value })}
            style={input}
            placeholder="https://…/image.jpg"
          />
        </label>
      </fieldset>

      {/* Navigation */}
      <fieldset style={fieldset}>
        <legend style={legend}>Navigation</legend>
        <label style={label}>
          Items (comma separated)
          <input
            value={safe.pages.nav.join(", ")}
            onChange={(e) =>
              updateNav(
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
            style={input}
            placeholder="Home, Products, Services, About, Contact"
          />
        </label>
      </fieldset>

      {/* Layout */}
      <fieldset style={fieldset}>
        <legend style={legend}>Layout</legend>
        <label style={label}>
          Container width (px)
          <input
            type="number"
            value={safe.layout.container}
            onChange={(e) => updateLayout({ container: Math.max(840, Number(e.target.value || 1040)) })}
            style={input}
            placeholder="1040"
          />
        </label>
      </fieldset>

      <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
        Tip: The live preview updates instantly below. Use Autoconfigure to get a sensible base, then tweak.
      </div>
    </div>
  );
}

const fieldset = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
};

const legend = {
  fontWeight: 700,
  padding: "0 6px",
  color: "#0f172a",
};

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 };

const label = { display: "grid", gap: 6, fontSize: 14, color: "#0f172a" };
const input = {
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
  fontSize: 14,
};

const btn = {
  padding: "8px 12px",
  background: "#0ea5e9",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
};
