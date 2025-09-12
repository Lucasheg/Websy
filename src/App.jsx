import React, { useMemo, useState, useCallback, useEffect } from "react";
import Modal from "./components/Modal.jsx";
import { performAction } from "./actions/index.js";

/**
 * CITEKS Website Maker — App.jsx
 * - Left: controls (brand, colors, content)
 * - Right: live preview (header, sections, footer)
 * - Actions system: data-action="..." on buttons; logic lives in /src/actions/*
 * - Modal for actions (book-call, select-plan, open-contact)
 */

const DEFAULT_BRIEF = {
  company: {
    name: "Your Company",
    tagline: "We make websites pay for themselves.",
    locations: "Oslo, New York, Amsterdam",
    primary: "#0F172A",
    secondary: "#F7F7F7",
    accent: "#0EA5E9",
    heroImage: "",
  },
  goal: "Consultation",
  differentiators: "Clear pricing\nFast delivery\nConversion-first layouts",
  testimonials: '“They delivered fast and nailed the brief.” — COO, Meridian',
  logos: "Aldin Capital, Meridian Partners, Koto Energy",
  metrics: "Projects delivered: 120\nAvg. timeline: 8 days",
  includePricing: true,
};

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "#home");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash.replace(/^#/, "") || "home";
}

export default function App() {
  // ---------- Maker state ----------
  const [brief, setBrief] = useState(DEFAULT_BRIEF);

  // Basic controlled inputs helpers
  const on = (key) => ({
    value: brief[key],
    onChange: (e) => setBrief((b) => ({ ...b, [key]: e.target.value })),
  });
  const onCompany = (key) => ({
    value: brief.company[key],
    onChange: (e) =>
      setBrief((b) => ({ ...b, company: { ...b.company, [key]: e.target.value } })),
  });
  const onToggle = (key) => ({
    checked: !!brief[key],
    onChange: (e) => setBrief((b) => ({ ...b, [key]: e.target.checked })),
  });

  // ---------- Modal + actions helpers ----------
  const [modal, setModal] = useState(null);
  const openModal = useCallback((cfg) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);
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
    [openModal, closeModal]
  );

  // One click delegate for all interactive elements in PREVIEW
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

  // ---------- Derived DSL for preview ----------
  const dsl = useMemo(() => makeDSL(brief), [brief]);

  // For the tiny router feel (anchors like #home, #services)
  const current = useHash();

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className="wrap">
        {/* LEFT: MAKER */}
        <aside className="panel" style={{ padding: 16, alignSelf: "start" }}>
          <div className="ts-h5" style={{ fontWeight: 700 }}>
            Maker
          </div>
          <p className="ts-h6 tips" style={{ marginTop: 4 }}>
            Adjust settings. The preview updates live.
          </p>

          <details open style={{ marginTop: 8 }}>
            <summary className="ts-h6" style={{ cursor: "pointer" }}>
              Brand
            </summary>
            <div className="grid" style={{ marginTop: 8 }}>
              <label className="ts-h6">
                Name
                <input className="input" placeholder="Brand" {...onCompany("name")} />
              </label>
              <label className="ts-h6">
                Tagline
                <input className="input" placeholder="Tagline" {...onCompany("tagline")} />
              </label>
              <label className="ts-h6">
                Locations (comma)
                <input
                  className="input"
                  placeholder="Oslo, New York, Amsterdam"
                  {...onCompany("locations")}
                />
              </label>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <label className="ts-h6">
                  Primary
                  <input className="input" type="color" {...onCompany("primary")} />
                </label>
                <label className="ts-h6">
                  Accent
                  <input className="input" type="color" {...onCompany("accent")} />
                </label>
                <label className="ts-h6">
                  Neutral
                  <input className="input" type="color" {...onCompany("secondary")} />
                </label>
              </div>
              <label className="ts-h6">
                Hero image URL (optional)
                <input className="input" placeholder="https://…" {...onCompany("heroImage")} />
              </label>
            </div>
          </details>

          <div className="thin" style={{ margin: "12px 0" }} />

          <details open>
            <summary className="ts-h6" style={{ cursor: "pointer" }}>
              Content
            </summary>
            <div className="grid" style={{ marginTop: 8 }}>
              <label className="ts-h6">
                Primary goal
                <select className="input" {...on("goal")}>
                  <option>Consultation</option>
                  <option>Book appointment</option>
                  <option>Start demo</option>
                  <option>Get quote</option>
                </select>
              </label>
              <label className="ts-h6">
                Differentiators (one per line)
                <textarea className="input" rows={3} {...on("differentiators")} />
              </label>
              <label className="ts-h6">
                Testimonials (quote — author per line)
                <textarea className="input" rows={3} {...on("testimonials")} />
              </label>
              <label className="ts-h6">
                Client logos (comma)
                <input className="input" {...on("logos")} />
              </label>
              <label className="ts-h6">
                Metrics (Label: Value per line)
                <textarea className="input" rows={3} {...on("metrics")} />
              </label>
              <label className="ts-h6" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" {...onToggle("includePricing")} />
                Include pricing section
              </label>
            </div>
          </details>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="btn"
              onClick={() => setBrief(DEFAULT_BRIEF)}
              type="button"
              title="Reset to defaults"
            >
              Reset
            </button>
            <button
              className="btn sec"
              onClick={() => exportHTML(dsl)}
              type="button"
              title="Export preview to single HTML"
            >
              Export HTML
            </button>
          </div>
        </aside>

        {/* RIGHT: PREVIEW (Header + Page + Footer) */}
        <section>
          <Header brand={dsl.meta.brand} />

          <main id="preview" onClick={onPreviewClick}>
            <PageView dsl={dsl} current={current} />
          </main>

          <Footer brand={dsl.meta.brand} />
        </section>
      </div>

      <Modal modal={modal} onClose={closeModal} />
    </>
  );
}

/* ----------------------------------------------
 * DSL & RENDERING
 * --------------------------------------------*/

function makeDSL(brief) {
  const brand = {
    name: brief.company.name || "Your Company",
    tagline: brief.company.tagline || "",
    colors: {
      primary: brief.company.primary || "#0F172A",
      secondary: brief.company.secondary || "#F7F7F7",
      accent: brief.company.accent || "#0EA5E9",
    },
    heroImage: brief.company.heroImage || "",
    locations: (brief.company.locations || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  };

  const toLines = (s) =>
    (s || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  const diffs = toLines(brief.differentiators).slice(0, 6).map((t) => ({
    title: t,
    text: "Built into our day-to-day process.",
  }));

  const testimonials = toLines(brief.testimonials).map((row) => {
    const [q, a] = row.split("—").map((x) => (x && x.trim()) || "");
    return q ? { quote: q.replace(/^["“]+|["”]+$/g, ""), author: a } : null;
  }).filter(Boolean);

  const logos = (brief.logos || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const metrics = toLines(brief.metrics).map((row) => {
    const [label, value] = row.split(":").map((x) => (x && x.trim()) || "");
    return label && value ? { label, value } : null;
  }).filter(Boolean);

  const pages = [
    {
      slug: "home",
      sections: [
        {
          type: "hero",
          title: brand.name,
          subtitle: brand.tagline || "We make websites pay for themselves.",
          badge: brand.locations.join(" · "),
          primaryCta: { label: goalToCTA(brief.goal), href: "#contact" },
          secondaryCta: { label: "View services", href: "#services" },
          heroImage: brand.heroImage,
        },
        diffs.length ? { type: "value", title: "What you get with us", items: diffs } : null,
        { type: "services", title: "Services", items: deriveServices() },
        logos.length || testimonials.length || metrics.length
          ? { type: "proof", logos, testimonials, metrics }
          : null,
        brief.includePricing
          ? {
              type: "pricing",
              title: "Pricing",
              note: "Transparent estimates. Fixed-fee options available.",
              tiers: [
                { name: "Starter", price: "$900", items: ["2–3 pages", "Responsive", "Lead form"] },
                {
                  name: "Growth",
                  price: "$2,300",
                  items: ["5–7 pages", "SEO + schema", "Booking & Maps", "Integrations"],
                },
                {
                  name: "Scale",
                  price: "$7,000",
                  items: ["10+ pages", "Strategy + funnel", "Advanced SEO/analytics", "CRM / e-com"],
                },
              ],
            }
          : null,
        {
          type: "contact",
          title: "Contact",
          email: "contact@citeks.net",
          locations: brand.locations,
        },
      ].filter(Boolean),
    },
  ];

  return {
    meta: { brand },
    nav: [
      { label: "Home", href: "#home" },
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
    pages,
  };
}

function goalToCTA(goal) {
  if (/appointment|book/i.test(goal)) return "Book appointment";
  if (/demo|trial/i.test(goal)) return "Start demo";
  if (/quote|estimate/i.test(goal)) return "Get quote";
  return "Book consultation";
}

function deriveServices() {
  return [
    { title: "Strategy & IA", text: "Define goals, sitemap, and decision pathways." },
    { title: "Design System", text: "Reusable components with accessibility baked in." },
    { title: "Performance & SEO", text: "Lighthouse-focused builds with schema and structure." },
  ];
}

function Header({ brand }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--ink", brand.colors.primary);
    document.documentElement.style.setProperty("--accent", brand.colors.accent);
    document.documentElement.style.setProperty("--bg", brand.colors.secondary);
  }, [brand]);

  return (
    <header className="panel site">
      <div className="ts-h6" style={{ fontWeight: 600 }}>
        {brand.name}
      </div>
      <nav className="ts-h6">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Footer({ brand }) {
  return (
    <footer className="panel site">
      <div className="ts-h6 tips">
        © {new Date().getFullYear()} {brand.name}
      </div>
      <div className="ts-h6 tips">{(brand.locations || []).join(" · ")}</div>
    </footer>
  );
}

function PageView({ dsl, current }) {
  const page = dsl.pages[0]; // single-page preview
  return (
    <>
      {page.sections.map((s, idx) => (
        <Section key={idx} section={s} brand={dsl.meta.brand} />
      ))}
    </>
  );
}

function Section({ section, brand }) {
  const wrap = (children, id) => (
    <section id={id} className="panel reveal" style={{ padding: 16 }}>
      {children}
    </section>
  );

  if (section.type === "hero") {
    return (
      <section className="hero ar-2-1 reveal" id="home">
        <div
          className="hero-img"
          style={{
            backgroundImage: section.heroImage
              ? `url(${section.heroImage})`
              : `linear-gradient(120deg, ${brand.colors.primary}, ${brand.colors.accent})`,
          }}
        />
        <div className="hero-scrim" />
        <div className="hero-copy">
          {section.badge ? <div className="badge">{section.badge}</div> : null}
          <h1 className="ts-h1" style={{ fontWeight: 700, marginTop: 8, color: "#fff" }}>
            {section.title}
          </h1>
          <p className="ts-h6" style={{ marginTop: 8, color: "rgba(255,255,255,.9)" }}>
            {section.subtitle}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {section.primaryCta ? (
              <a href={section.primaryCta.href} data-action="book-call" className="btn">
                {section.primaryCta.label}
              </a>
            ) : null}
            {section.secondaryCta ? (
              <a href={section.secondaryCta.href} data-action="open-contact" className="btn sec">
                {section.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "value") {
    return wrap(
      <>
        <h2 className="ts-h2" style={{ fontWeight: 700 }}>
          {section.title}
        </h2>
        <div className="grid cols-auto" style={{ marginTop: 12 }}>
          {(section.items || []).map((it, i) => (
            <div key={i} className="panel" style={{ padding: 16 }}>
              <div className="ts-h5" style={{ fontWeight: 600 }}>
                {it.title}
              </div>
              <div className="ts-h6 tips" style={{ marginTop: 4 }}>
                {it.text}
              </div>
            </div>
          ))}
        </div>
      </>,
      "value"
    );
  }

  if (section.type === "services") {
    return wrap(
      <>
        <h2 className="ts-h2" style={{ fontWeight: 700 }}>
          {section.title}
        </h2>
        <div className="grid cols-auto" style={{ marginTop: 12 }}>
          {(section.items || []).map((it, i) => (
            <div key={i} className="panel" style={{ padding: 16 }}>
              <div className="ts-h5" style={{ fontWeight: 600 }}>
                {it.title}
              </div>
              <div className="ts-h6 tips" style={{ marginTop: 4 }}>
                {it.text}
              </div>
              <button
                className="btn"
                data-action="open-contact"
                style={{ marginTop: 12 }}
                title="Talk to us about this service"
              >
                Learn more
              </button>
            </div>
          ))}
        </div>
      </>,
      "services"
    );
  }

  if (section.type === "proof") {
    return wrap(
      <>
        <h2 className="ts-h2" style={{ fontWeight: 700 }}>
          Proof
        </h2>
        {Array.isArray(section.logos) && section.logos.length ? (
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginTop: 12 }}
          >
            {section.logos.map((l, i) => (
              <div key={i} className="logo-chip">
                {l}
              </div>
            ))}
          </div>
        ) : null}

        {Array.isArray(section.testimonials) && section.testimonials.length ? (
          <>
            <div className="thin" style={{ margin: "12px 0" }} />
            <div
              className="grid"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
            >
              {section.testimonials.map((t, i) => (
                <div key={i} className="panel" style={{ padding: 16 }}>
                  <div className="ts-h6" style={{ fontStyle: "italic" }}>
                    “{t.quote}”
                  </div>
                  <div className="ts-h6 tips" style={{ marginTop: 8 }}>
                    {t.author}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {Array.isArray(section.metrics) && section.metrics.length ? (
          <>
            <div className="thin" style={{ margin: "12px 0" }} />
            <div
              className="grid"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
            >
              {section.metrics.map((m, i) => (
                <div key={i} className="panel" style={{ padding: 16 }}>
                  <div className="ts-h3" style={{ color: "var(--accent)", fontWeight: 700 }}>
                    {m.value}
                  </div>
                  <div className="ts-h6 tips">{m.label}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </>,
      "proof"
    );
  }

  if (section.type === "pricing") {
    return wrap(
      <>
        <h2 className="ts-h2" style={{ fontWeight: 700 }}>
          {section.title}
        </h2>
        <p className="ts-h6 tips">{section.note}</p>
        <div className="grid cols-auto" style={{ marginTop: 12 }}>
          {(section.tiers || []).map((t, i) => (
            <div key={i} className="panel" style={{ padding: 16 }}>
              <div className="ts-h5" style={{ fontWeight: 600 }}>
                {t.name}
              </div>
              <div className="ts-h3" style={{ color: "var(--accent)", fontWeight: 700, marginTop: 4 }}>
                {t.price}
              </div>
              <ul className="ts-h6 tips" style={{ marginTop: 8 }}>
                {t.items.map((x, k) => (
                  <li key={k} style={{ marginTop: 4 }}>
                    • {x}
                  </li>
                ))}
              </ul>
              <button
                className="btn"
                style={{ marginTop: 12 }}
                data-action="select-plan"
                data-plan={t.name}
              >
                Choose {t.name}
              </button>
            </div>
          ))}
        </div>
      </>,
      "pricing"
    );
  }

  if (section.type === "contact") {
    return wrap(
      <>
        <h2 className="ts-h2" style={{ fontWeight: 700 }}>
          {section.title}
        </h2>
        <div className="ts-h6" style={{ marginTop: 8 }}>
          Email:{" "}
          <a href={`mailto:${section.email}`} style={{ color: "var(--accent)" }}>
            {section.email}
          </a>
        </div>
        {Array.isArray(section.locations) && section.locations.length ? (
          <div className="ts-h6 tips" style={{ marginTop: 4 }}>
            Locations: {section.locations.join(" · ")}
          </div>
        ) : null}
        <form
          id="contact"
          className="panel"
          style={{ padding: 16, marginTop: 12, display: "grid", gap: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            alert("Message sent (demo).");
          }}
        >
          <input placeholder="Name" className="input" />
          <input placeholder="Email" className="input" />
          <textarea rows="5" placeholder="Message" className="input" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" data-action="open-contact">
              Send
            </button>
            <a href="#home" className="btn sec">
              Back to top
            </a>
          </div>
        </form>
      </>,
      "contact"
    );
  }

  // Fallback
  return wrap(<div className="ts-h6">Unknown section</div>);
}

/* ----------------------------------------------
 * Export current page as plain HTML
 * --------------------------------------------*/
function exportHTML(dsl) {
  const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${dsl.meta.brand.name} — Preview</title>
<style>${GLOBAL_CSS}</style>
<body>
  <header class="panel site">
    <div class="ts-h6" style="font-weight:600">${dsl.meta.brand.name}</div>
    <nav class="ts-h6"><a href="#home">Home</a><a href="#services">Services</a><a href="#pricing">Pricing</a><a href="#contact">Contact</a></nav>
  </header>
  <main>
    ${document.getElementById("preview")?.innerHTML || ""}
  </main>
  <footer class="panel site">
    <div class="ts-h6 tips">© ${new Date().getFullYear()} ${dsl.meta.brand.name}</div>
  </footer>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "site-preview.html";
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ----------------------------------------------
 * Global CSS (kept inline to avoid external files)
 * --------------------------------------------*/
const GLOBAL_CSS = `
:root{
  --bg:#f7f7f7; --panel:#ffffff; --ink:#0f172a; --muted:#475569; --hair:#e5e7eb; --accent:#0ea5e9;
  --p:16px; --h6:18px; --h5:20px; --h4:25px; --h3:31.25px; --h2:39.06px; --h1:48.83px;
}
html,body{height:100%; background:var(--bg); color:var(--ink); font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}
*{box-sizing:border-box}
.wrap{display:grid; grid-template-columns:minmax(340px, 520px) 1fr; gap:16px; padding:16px; max-width:1440px; margin:0 auto;}
.panel{background:var(--panel); border:1px solid var(--hair); border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.04);}
.site{padding:12px 16px; display:flex; align-items:center; justify-content:space-between; border-radius:16px; margin-bottom:16px}
.site nav a{color:var(--ink); text-decoration:none; margin-left:16px}
main{display:grid; gap:16px}
footer.site{padding:16px; border-radius:16px; margin-top:16px}
.btn{display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#fff; padding:10px 14px; border-radius:999px; text-decoration:none; border:none; cursor:pointer;}
.btn.sec{background:#0f172a; color:#fff}
.thin{border-top:1px solid var(--hair);}
.ts-p{font-size:var(--p); line-height:1.5;}
.ts-h6{font-size:var(--h6); line-height:1.3; letter-spacing:-0.005em;}
.ts-h5{font-size:var(--h5); line-height:1.3; letter-spacing:-0.01em;}
.ts-h4{font-size:var(--h4); line-height:1.3; letter-spacing:-0.012em;}
.ts-h3{font-size:var(--h3); line-height:1.2; letter-spacing:-0.015em;}
.ts-h2{font-size:var(--h2); line-height:1.1; letter-spacing:-0.018em;}
.ts-h1{font-size:var(--h1); line-height:1.0; letter-spacing:-0.02em;}
.grid{display:grid; gap:12px}
.cols-auto{grid-template-columns:repeat(auto-fit, minmax(260px,1fr));}
.reveal{opacity:0; transform:translateY(12px); transition:opacity .45s ease, transform .45s ease;}
.reveal{opacity:1; transform:none;} /* always visible in builder */
.input{width:100%; padding:10px 12px; border:1px solid var(--hair); border-radius:12px; background:#fff}
textarea{resize:vertical}
.tips{color:var(--muted)}
.logo-chip{display:inline-block; padding:10px 12px; border:1px solid var(--hair); border-radius:12px; text-align:center}
.badge{display:inline-block; padding:4px 10px; border-radius:999px; background:rgba(255,255,255,.15); color:#fff; font-size:14px;}
.hero{position:relative; overflow:hidden; border-radius:16px; margin-bottom:0;}
.hero-img{position:absolute; inset:0; background-position:center; background-size:cover; transform:scale(1.02);}
.hero-scrim{position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.50), rgba(0,0,0,.15));}
.hero-copy{position:relative; color:#fff; padding:24px; max-width:720px;}
.ar-2-1{aspect-ratio:2/1;}
`;

/* ----------------------------------------------
 * (end)
 * --------------------------------------------*/
