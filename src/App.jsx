import React, { useCallback, useMemo, useState } from "react";
import Modal from "./components/Modal.jsx";
import { performAction } from "./actions/index.js";
import PreviewShell from "./components/PreviewShell.jsx";
import INDUSTRIES from "./presets/industries.json";
import { SECTION_LABELS, DEFAULT_SECTION_VISIBILITY } from "./lib/catalog.js";

export default function App() {
  // ===== Industry selection =====
  const [industryKey, setIndustryKey] = useState("law");
  const industry = INDUSTRIES[industryKey];

  // ===== Brand (seed from preset, editable) =====
  const [brand, setBrand] = useState({
    name: "Your Company",
    tagline: "We make websites pay for themselves.",
    locations: "Oslo, New York, Amsterdam",
    primary: industry.defaults.colors.primary,
    neutral: industry.defaults.colors.neutral,
    accent: industry.defaults.colors.accent,
    heroImage: "",
  });

  // When industry changes, gently reset colors + hero style/animation defaults
  const applyIndustryDefaults = (key) => {
    const preset = INDUSTRIES[key];
    setBrand((b) => ({
      ...b,
      primary: preset.defaults.colors.primary,
      neutral: preset.defaults.colors.neutral,
      accent: preset.defaults.colors.accent,
    }));
    setLayout((l) => ({
      ...l,
      heroStyle: preset.defaults.heroStyle,
      animationLevel: preset.defaults.animationLevel,
    }));
    // reset sections to preset order and visibility
    const vis = {};
    preset.sections.forEach((s) => (vis[s] = true));
    setSections({ order: [...preset.sections], visible: vis });
  };

  // ===== Layout & motion =====
  const [layout, setLayout] = useState({
    animationLevel: industry.defaults.animationLevel, // low | medium | high
    heroStyle: industry.defaults.heroStyle, // editorial | image | product
  });

  // ===== Page structure (ordered + toggles) =====
  const [sections, setSections] = useState(() => {
    const vis = { ...DEFAULT_SECTION_VISIBILITY };
    industry.sections.forEach((s) => (vis[s] = true));
    // Keep only known sections from preset
    const order = industry.sections.filter((s) => SECTION_LABELS[s]);
    return { order, visible: vis };
  });

  // ===== Content knobs =====
  const [content, setContent] = useState({
    goal: "Consultation",
    differentiators:
      "Clear fee structures\nBench of ex-in-house lawyers\nDeal-first, not theory-first",
    testimonials: "“They guided a complex deal.” — COO, Meridian",
    logos: "Aldin Capital, Meridian Partners, Koto Energy",
    metrics: "Deals advised: 220\nAverage close time: 14 days",
  });

  // ===== Modal for actions =====
  const [modal, setModal] = useState(null);
  const openModal = useCallback((cfg) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);

  // ===== Helpers for actions =====
  const helpers = useMemo(
    () => ({
      openModal,
      closeModal,
      scrollTo: (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      navigate: (hash) => {
        window.location.hash = hash;
      },
      toast: (msg) => alert(msg),
    }),
    [openModal]
  );

  // One delegated click handler for the entire preview
  const onPreviewClick = useCallback(
    async (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      e.preventDefault();
      const action = target.getAttribute("data-action");
      const payload = {};
      for (const { name, value } of Array.from(target.attributes)) {
        if (name.startsWith("data-") && name !== "data-action") {
          const key = name
            .replace(/^data-/, "")
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          payload[key] = value;
        }
      }
      await performAction(action, helpers, payload);
    },
    [helpers]
  );

  // ===== Derived preview config =====
  const previewConfig = useMemo(() => {
    const diffs = content.differentiators
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const tests = content.testimonials
      .split("\n")
      .map((l) => {
        const [q, a] = l.split("—").map((x) => (x ? x.trim() : ""));
        return q ? { quote: q.replace(/^“|”$/g, ""), author: a } : null;
      })
      .filter(Boolean);
    const logos = content.logos
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const metrics = content.metrics
      .split("\n")
      .map((l) => {
        const [label, value] = l.split(":").map((x) => (x ? x.trim() : ""));
        return label && value ? { label, value } : null;
      })
      .filter(Boolean);

    // Final section list = preset order filtered by visibility
    const chosenSections = sections.order.filter((s) => sections.visible[s]);

    return {
      brand: {
        name: brand.name,
        tagline: brand.tagline,
        locations: brand.locations
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        colors: {
          primary: brand.primary,
          neutral: brand.neutral,
          accent: brand.accent,
        },
        heroImage: brand.heroImage || null,
        industry: industryKey,
      },
      layout: {
        animationLevel: layout.animationLevel,
        heroStyle: layout.heroStyle,
        sections: chosenSections,
      },
      content: { goal: content.goal, differentiators: diffs, testimonials: tests, logos, metrics }
    };
  }, [brand, layout, content, sections, industryKey]);

  return (
    <div className="page">
      <style>{GLOBAL_CSS}</style>

      {/* ===== MAKER (full viewport) ===== */}
      <section id="maker" className="maker-screen panel">
        <div className="maker-header">
          <div className="brand">
            <div className="dot" />
            <div className="title">CITEKS Website Maker</div>
          </div>
          <a href="#preview" className="btn">Scroll to Preview</a>
        </div>

        <div className="maker-grid">
          {/* Industry & Preset */}
          <details open className="group">
            <summary>Industry & Preset</summary>
            <div className="group-body">
              <div className="grid2">
                <label>
                  <span className="lbl">Industry preset</span>
                  <select
                    value={industryKey}
                    onChange={(e) => {
                      const next = e.target.value;
                      setIndustryKey(next);
                      applyIndustryDefaults(next);
                    }}
                  >
                    {Object.entries(INDUSTRIES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </label>
                <div />
              </div>
            </div>
          </details>

          {/* Brand */}
          <details open className="group">
            <summary>Brand</summary>
            <div className="group-body">
              <div className="grid2">
                <label>
                  <span className="lbl">Company name</span>
                  <input
                    value={brand.name}
                    onChange={(e) => setBrand((b) => ({ ...b, name: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="lbl">Tagline</span>
                  <input
                    value={brand.tagline}
                    onChange={(e) => setBrand((b) => ({ ...b, tagline: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="lbl">Locations (comma)</span>
                  <input
                    value={brand.locations}
                    onChange={(e) => setBrand((b) => ({ ...b, locations: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="lbl">Hero image URL (optional)</span>
                  <input
                    placeholder="https://…/hero.jpg"
                    value={brand.heroImage}
                    onChange={(e) => setBrand((b) => ({ ...b, heroImage: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="lbl">Primary color</span>
                  <input
                    type="color"
                    value={brand.primary}
                    onChange={(e) => setBrand((b) => ({ ...b, primary: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="lbl">Accent color</span>
                  <input
                    type="color"
                    value={brand.accent}
                    onChange={(e) => setBrand((b) => ({ ...b, accent: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="lbl">Neutral background</span>
                  <input
                    type="color"
                    value={brand.neutral}
                    onChange={(e) => setBrand((b) => ({ ...b, neutral: e.target.value }))}
                  />
                </label>
              </div>
            </div>
          </details>

          {/* Layout & Motion */}
          <details open className="group">
            <summary>Layout & Motion</summary>
            <div className="group-body">
              <div className="grid2">
                <label>
                  <span className="lbl">Hero style</span>
                  <select
                    value={layout.heroStyle}
                    onChange={(e) => setLayout((l) => ({ ...l, heroStyle: e.target.value }))}
                  >
                    <option value="editorial">Editorial (type first)</option>
                    <option value="image">Image-forward</option>
                    <option value="product">Product/feature</option>
                  </select>
                </label>
                <label>
                  <span className="lbl">Animation level</span>
                  <select
                    value={layout.animationLevel}
                    onChange={(e) =>
                      setLayout((l) => ({ ...l, animationLevel: e.target.value }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
            </div>
          </details>

          {/* Page structure (preset-driven) */}
          <details open className="group">
            <summary>Page structure</summary>
            <div className="group-body">
              <div className="grid2">
                {sections.order.map((key) => (
                  <label key={key} className="chk">
                    <input
                      type="checkbox"
                      checked={!!sections.visible[key]}
                      onChange={(e) =>
                        setSections((s) => ({
                          ...s,
                          visible: { ...s.visible, [key]: e.target.checked },
                        }))
                      }
                    />
                    <span>{SECTION_LABELS[key] || key}</span>
                  </label>
                ))}
              </div>
              <p className="ts-h6" style={{ color: "var(--muted)", marginTop: 8 }}>
                (Reordering UI comes later. Current order follows the preset.)
              </p>
            </div>
          </details>

          {/* Content */}
          <details open className="group">
            <summary>Content</summary>
            <div className="group-body">
              <div className="grid2">
                <label>
                  <span className="lbl">Primary goal</span>
                  <select
                    value={content.goal}
                    onChange={(e) => setContent((c) => ({ ...c, goal: e.target.value }))}
                  >
                    <option>Consultation</option>
                    <option>Book appointment</option>
                    <option>Start demo</option>
                    <option>Get quote</option>
                  </select>
                </label>
                <div />
                <label className="span2">
                  <span className="lbl">Differentiators (one per line)</span>
                  <textarea
                    rows={4}
                    value={content.differentiators}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, differentiators: e.target.value }))
                    }
                  />
                </label>
                <label className="span2">
                  <span className="lbl">Testimonials (format: “Quote” — Name)</span>
                  <textarea
                    rows={3}
                    value={content.testimonials}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, testimonials: e.target.value }))
                    }
                  />
                </label>
                <label>
                  <span className="lbl">Client logos (comma)</span>
                  <input
                    value={content.logos}
                    onChange={(e) => setContent((c) => ({ ...c, logos: e.target.value }))}
                  />
                </label>
                <label>
                  <span className="lbl">Metrics (Label: Value per line)</span>
                  <textarea
                    rows={3}
                    value={content.metrics}
                    onChange={(e) => setContent((c) => ({ ...c, metrics: e.target.value }))}
                  />
                </label>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* ===== PREVIEW ===== */}
      <section id="preview" className="preview-wrap" onClick={onPreviewClick}>
        <PreviewShell config={previewConfig} />
      </section>

      <Modal modal={modal} onClose={closeModal} />
    </div>
  );
}

/* ---------- CSS ---------- */
const GLOBAL_CSS = `
:root{
  --ink:#0f172a; --muted:#475569; --hair:#e5e7eb; --panel:#ffffff; --bg:#f7f7f7;
  --p:16px; --h6:18px; --h5:20px; --h4:25px; --h3:31.25px; --h2:39.06px; --h1:48.83px;
}
*{box-sizing:border-box}
html, body, #root { height: 100%; background: var(--bg); color: var(--ink); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
.page{min-height:100%}
.ts-p{font-size:var(--p); line-height:1.5;}
.ts-h6{font-size:var(--h6); line-height:1.3; letter-spacing:-0.005em;}
.ts-h5{font-size:var(--h5); line-height:1.3; letter-spacing:-0.01em;}
.ts-h4{font-size:var(--h4); line-height:1.3; letter-spacing:-0.012em;}
.ts-h3{font-size:var(--h3); line-height:1.2; letter-spacing:-0.015em;}
.ts-h2{font-size:var(--h2); line-height:1.1; letter-spacing:-0.018em;}
.ts-h1{font-size:var(--h1); line-height:1.0; letter-spacing:-0.02em;}
.panel{background:var(--panel); border:1px solid var(--hair); border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.04);}
.btn{display:inline-flex; align-items:center; gap:8px; background:#0ea5e9; color:#fff; padding:10px 14px; border-radius:999px; text-decoration:none; border:none; cursor:pointer;}
.btn.sec{background:#0f172a; color:#fff;}
.maker-screen{min-height:100vh; padding:16px; display:flex; flex-direction:column; gap:16px;}
.maker-header{display:flex; align-items:center; justify-content:space-between; padding:12px 16px;}
.maker-header .brand{display:flex; align-items:center; gap:10px}
.maker-header .dot{width:10px; height:10px; border-radius:999px; background:#0ea5e9;}
.maker-header .title{font-weight:700}
.maker-grid{padding:0 16px 16px; display:grid; gap:12px;}
.group > summary{cursor:pointer; padding:12px 8px; font-weight:700}
.group .group-body{padding:12px; border-top:1px solid var(--hair)}
.grid2{display:grid; grid-template-columns:1fr 1fr; gap:12px}
.grid2 .span2{grid-column:1/-1}
label .lbl{display:block; font-size:14px; color:var(--muted); margin-bottom:4px}
label input, label select, label textarea{width:100%; padding:10px 12px; border:1px solid var(--hair); border-radius:12px; background:#fff}
label.chk{display:flex; align-items:center; gap:8px}
.preview-wrap{max-width:1200px; margin:24px auto; padding:0 16px 32px;}
`;
