import React from "react";

/**
 * PreviewShell
 * Renders a full "website-like" preview from a DSL.
 * - Header with nav + CTA
 * - Sections: hero, value, services, proof, pricing, faq, contact
 * - Footer
 * Use click delegation from parent (App) by passing onClick to the wrapper.
 */
export default function PreviewShell({ dsl, onClick }) {
  const brand = dsl?.meta?.brand || {
    name: "Your brand",
    tagline: "",
    colors: { primary: "#0F172A", neutral: "#F7F7F7", accent: "#0EA5E9" },
  };

  const page = dsl?.pages?.[0] || { sections: [] };
  const sections = Array.isArray(page.sections) ? page.sections : [];

  const navCfg = navItemsFor(brand?.industry, dsl?.content?.goal);
  const navItems = navCfg.nav;
  const ctaLabel = navCfg.cta;

  // Simple style helpers (keeps this component self-contained)
  const S = {
    shell: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "14px 16px",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: 0,
      background: "#fff",
      zIndex: 5,
    },
    brand: { fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" },
    nav: { display: "flex", gap: 16, alignItems: "center" },
    link: { textDecoration: "none", color: "#0f172a", fontSize: 14 },
    btn: {
      display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px",
      borderRadius: 999, background: brand.colors?.accent || "#0EA5E9", color: "#fff",
      border: "none", fontSize: 14, cursor: "pointer", textDecoration: "none"
    },
    main: { display: "grid", gap: 16, padding: 16 },
    panel: { border: "1px solid #e5e7eb", borderRadius: 14, padding: 16, background: "#fff" },
    h1: { fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, fontWeight: 700 },
    h2: { fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.018em", margin: 0, fontWeight: 700 },
    h3: { fontSize: 20, lineHeight: 1.25, letterSpacing: "-0.01em", margin: 0, fontWeight: 600 },
    p: { fontSize: 16, lineHeight: 1.5, color: "#475569", margin: "8px 0 0" },
    gridAuto: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" },
    chip: { display: "inline-block", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 12 },
    hero: {
      position: "relative", overflow: "hidden", borderRadius: 14, minHeight: 280,
      background: `linear-gradient(120deg, ${brand.colors?.primary || "#0F172A"}, ${brand.colors?.accent || "#0EA5E9"})`
    },
    heroCopy: { position: "relative", color: "#fff", padding: 20, maxWidth: 760 },
    scrim: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.15))" },
    footer: { padding: 16, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }
  };

  return (
    <div style={S.shell} onClick={onClick}>
      {/* Header */}
      <header style={S.header}>
        <div style={S.brand}>{brand.name || "Brand"}</div>
        <nav style={S.nav}>
          {navItems.map((label) => (
            <a key={label} href={`#${slugify(label)}`} style={S.link}>{label}</a>
          ))}
          <a href="#contact" className="btn" data-action="book-call" style={S.btn}>
            {ctaLabel}
          </a>
        </nav>
      </header>

      {/* Main sections from DSL */}
      <main style={S.main}>
        {sections.map((sec, i) => (
          <Section key={i} s={sec} brand={brand} styles={S} />
        ))}
      </main>

      {/* Footer */}
      <footer style={S.footer}>
        <div style={{ fontSize: 14, color: "#475569" }}>
          © {new Date().getFullYear()} {brand.name || "Brand"}
        </div>
        <a href="#contact" data-action="open-contact" style={{ ...S.btn, background: "#0f172a" }}>
          Contact
        </a>
      </footer>
    </div>
  );
}

/* ---------- Helpers ---------- */

function navItemsFor(industry, goal) {
  // Minimal, safe defaults; expand as you add industries
  switch ((industry || "").toLowerCase()) {
    case "law":
      return { nav: ["Services", "Clients", "Pricing", "Contact"], cta: "Book consultation" };
    case "saas":
      return { nav: ["Product", "Pricing", "Docs", "Contact"], cta: goal || "Start demo" };
    case "clinic":
      return { nav: ["Services", "Doctors", "Pricing", "Contact"], cta: "Book appointment" };
    case "gym":
      return { nav: ["Programs", "Coaches", "Pricing", "Contact"], cta: "Start trial" };
    default:
      return { nav: ["Work", "Services", "Pricing", "Contact"], cta: goal || "Get in touch" };
  }
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ---------- Section renderer ---------- */

function Section({ s, brand, styles: S }) {
  if (!s || !s.type) return null;

  // HERO
  if (s.type === "hero") {
    const img = s.heroImage;
    return (
      <section id="hero" style={S.hero}>
        {img ? (
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover", backgroundPosition: "center",
              filter: "contrast(1.05) saturate(1.05)"
            }}
            aria-hidden
          />
        ) : null}
        <div style={S.scrim} aria-hidden />
        <div style={S.heroCopy}>
          {s.badge ? (
            <span style={{
              display: "inline-block", padding: "4px 10px",
              background: "rgba(255,255,255,.18)", borderRadius: 999, fontSize: 14
            }}>
              {s.badge}
            </span>
          ) : null}
          <h1 style={{ ...S.h1, marginTop: 8 }}>{s.title || brand.name}</h1>
          {s.subtitle ? <p style={{ ...S.p, color: "rgba(255,255,255,.9)" }}>{s.subtitle}</p> : null}
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            {s.primaryCta ? (
              <a href={s.primaryCta.href || "#contact"} data-action="book-call" style={S.btn}>
                {s.primaryCta.label || "Get started"}
              </a>
            ) : null}
            {s.secondaryCta ? (
              <a href={s.secondaryCta.href || "#contact"} data-action="open-contact" style={{ ...S.btn, background: "#0f172a" }}>
                {s.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  // VALUE / SERVICES (card grids)
  if (s.type === "value" || s.type === "services" || s.type === "features" || s.type === "programs") {
    return (
      <section id={slugify(s.title || s.type)} style={S.panel}>
        {s.title ? <h2 style={S.h2}>{s.title}</h2> : null}
        <div style={{ ...S.gridAuto, marginTop: 12 }}>
          {(s.items || []).map((it, idx) => (
            <div key={idx} style={S.panel}>
              <div style={S.h3}>{it.title}</div>
              {it.text ? <p style={S.p}>{it.text}</p> : null}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // PROOF (logos, testimonials, metrics)
  if (s.type === "proof") {
    return (
      <section id="proof" style={S.panel}>
        <h2 style={S.h2}>Proof</h2>
        {(s.logos && s.logos.length) ? (
          <div style={{ ...S.gridAuto, marginTop: 12 }}>
            {s.logos.map((l, i) => (
              <div key={i} style={S.chip}>{l}</div>
            ))}
          </div>
        ) : null}
        {(s.testimonials && s.testimonials.length) ? (
          <div style={{ ...S.gridAuto, marginTop: 12 }}>
            {s.testimonials.map((t, i) => (
              <div key={i} style={S.panel}>
                <div style={{ ...S.p, fontStyle: "italic", color: "#0f172a" }}>
                  “{t.quote}”
                </div>
                {t.author ? <div style={{ ...S.p, marginTop: 8 }}>{t.author}</div> : null}
              </div>
            ))}
          </div>
        ) : null}
        {(s.metrics && s.metrics.length) ? (
          <div style={{ ...S.gridAuto, marginTop: 12 }}>
            {s.metrics.map((m, i) => (
              <div key={i} style={S.panel}>
                <div style={{ ...S.h2, color: brand.colors?.accent || "#0EA5E9" }}>{m.value}</div>
                <div style={S.p}>{m.label}</div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  // PRICING
  if (s.type === "pricing") {
    return (
      <section id="pricing" style={S.panel}>
        <h2 style={S.h2}>{s.title || "Pricing"}</h2>
        {s.note ? <p style={S.p}>{s.note}</p> : null}
        <div style={{ ...S.gridAuto, marginTop: 12 }}>
          {(s.tiers || []).map((t) => (
            <div key={t.name} style={S.panel}>
              <div style={S.h3}>{t.name}</div>
              <div style={{ ...S.h2, color: brand.colors?.accent || "#0EA5E9", marginTop: 4 }}>{t.price}</div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#475569", fontSize: 14 }}>
                {(t.items || []).map((x, i) => <li key={i} style={{ marginTop: 4 }}>{x}</li>)}
              </ul>
              <button
                data-action="select-plan"
                data-plan={t.name}
                style={{ ...S.btn, marginTop: 12 }}
              >
                Choose {t.name}
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // FAQ
  if (s.type === "faq") {
    return (
      <section id="faq" style={S.panel}>
        <h2 style={S.h2}>{s.title || "FAQ"}</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {(s.items || []).map((qa, i) => (
            <details key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{qa.q}</summary>
              <p style={{ ...S.p, marginTop: 8 }}>{qa.a}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }

  // CONTACT
  if (s.type === "contact") {
    return (
      <section id="contact" style={S.panel}>
        <h2 style={S.h2}>{s.title || "Contact"}</h2>
        {s.email ? (
          <p style={S.p}>
            Email: <a href={`mailto:${s.email}`} style={{ color: brand.colors?.accent || "#0EA5E9" }}>{s.email}</a>
          </p>
        ) : null}
        {(s.locations && s.locations.length) ? (
          <p style={S.p}>Locations: {s.locations.join(" · ")}</p>
        ) : null}
        <form style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <input className="input" placeholder="Name" style={inputStyle()} />
          <input className="input" placeholder="Email" style={inputStyle()} />
          <textarea className="input" rows={5} placeholder="Message" style={inputStyle()} />
          <button className="btn" data-action="open-contact" style={{ ...S.btn }}>Send</button>
        </form>
      </section>
    );
  }

  // Fallback generic panel
  return (
    <section id={slugify(s.title || s.type)} style={S.panel}>
      {s.title ? <h2 style={S.h2}>{s.title}</h2> : <h2 style={S.h2}>{s.type}</h2>}
      {s.text ? <p style={S.p}>{s.text}</p> : null}
    </section>
  );
}

function inputStyle() {
  return {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fff",
    fontSize: 14
  };
}
