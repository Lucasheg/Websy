// src/components/PreviewShell.jsx
import React, { useMemo } from "react";

/** Normalize theme whether it's {primary,...} or {colors:{primary,...}} */
function normalizeTheme(raw = {}) {
  const primary =
    raw.primary ?? raw.colors?.primary ?? "#0F172A";
  const accent =
    raw.accent ?? raw.colors?.accent ?? "#0EA5E9";
  const neutral =
    raw.neutral ?? raw.colors?.neutral ?? "#F6F7F9";
  const radius = raw.radius ?? 16;
  const container = raw.container ?? 1200;
  const base = raw.base ?? 16;
  const scale = raw.scale ?? 1.25;
  const card = raw.card ?? "soft"; // soft|outline|minimal
  const animation = raw.animation ?? "medium"; // low|medium|high
  return { primary, accent, neutral, radius, container, base, scale, card, animation };
}

function type(theme) {
  const h6 = Math.round(theme.base * theme.scale ** 1);
  const h5 = Math.round(theme.base * theme.scale ** 2);
  const h4 = Math.round(theme.base * theme.scale ** 3);
  const h3 = Math.round(theme.base * theme.scale ** 4);
  const h2 = Math.round(theme.base * theme.scale ** 5);
  const h1 = Math.round(theme.base * theme.scale ** 6);
  return { p: theme.base, h6, h5, h4, h3, h2, h1 };
}

function cardStyle(theme) {
  if (theme.card === "outline") {
    return { border: "1px solid #e5e7eb", borderRadius: theme.radius, background: "#fff" };
  }
  if (theme.card === "minimal") {
    return { borderRadius: theme.radius, background: "#fff" };
  }
  // soft
  return { border: "1px solid #eef0f2", borderRadius: theme.radius, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.05)" };
}

function anim(theme) {
  const dur = theme.animation === "high" ? "700ms" : theme.animation === "low" ? "200ms" : "450ms";
  return { transition: `opacity ${dur} ease, transform ${dur} ease` };
}

export default function PreviewShell({ dsl }) {
  const theme = useMemo(() => normalizeTheme(dsl?.meta?.theme), [dsl]);
  const t = useMemo(() => type(theme), [theme]);
  const brand = dsl?.meta?.brand || {};
  const nav = dsl?.meta?.nav || ["Home", "Services", "Pricing", "Contact"];
  const sections = (dsl?.pages?.[0]?.sections) || [];

  return (
    <div style={{ background: theme.neutral, color: theme.primary, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          backdropFilter: "saturate(1.05) blur(6px)",
          background: "rgba(255,255,255,.7)",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        <div style={{ maxWidth: theme.container, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name || "Logo"} style={{ height: 28 }} />
            ) : (
              <div style={{ fontWeight: 700, fontSize: t.h6 }}>{brand.name || "Your brand"}</div>
            )}
          </div>
          <nav style={{ display: "flex", gap: 16, fontSize: t.h6, alignItems: "center" }}>
            {nav.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: theme.primary, textDecoration: "none", opacity: .9 }}>
                {item}
              </a>
            ))}
            <a
              href="#contact"
              data-action="book-call"
              style={{ background: theme.accent, color: "#fff", padding: "8px 14px", borderRadius: 999, textDecoration: "none" }}
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      {/* Sections */}
      <main style={{ maxWidth: theme.container, margin: "0 auto", padding: "16px" }}>
        {sections.map((s, i) => (
          <section key={i} style={{ margin: "16px 0" }}>
            {renderSection(s, theme, t)}
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", marginTop: 24, background: "#fff" }}>
        <div style={{ maxWidth: theme.container, margin: "0 auto", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: t.h6 }}>
          <div>© {new Date().getFullYear()} {brand.name || "Your brand"}</div>
          <div style={{ opacity: .7 }}>{brand.tagline || "We make it simple to choose you."}</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- section renderers ---------- */

function renderSection(s, theme, t) {
  try {
    switch (s?.type) {
      case "hero":
        return renderHero(s, theme, t);
      case "features":
        return renderFeatures(s, theme, t);
      case "gallery":
        return renderGallery(s, theme, t);
      case "testimonials":
        return renderTestimonials(s, theme, t);
      case "pricing":
        return renderPricing(s, theme, t);
      case "faq":
        return renderFaq(s, theme, t);
      case "contact":
        return renderContact(s, theme, t);
      default:
        return null;
    }
  } catch (err) {
    return (
      <div style={{ padding: 16, ...cardStyle(theme) }}>
        <div style={{ fontSize: t.h5, fontWeight: 700, color: "#DC2626" }}>A section failed to render</div>
        <div style={{ marginTop: 8, fontSize: t.h6 }}>{String(err?.message || err)}</div>
      </div>
    );
  }
}

function renderHero(s, theme, t) {
  const hasImage = !!s?.heroImage;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: theme.radius,
        minHeight: 360,
        color: hasImage ? "#fff" : theme.primary,
        background: hasImage ? "#000" : `linear-gradient(120deg, ${theme.primary}, ${theme.accent})`,
        ...anim(theme)
      }}
    >
      {hasImage && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${s.heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: .9
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.25))"
            }}
          />
        </>
      )}
      <div style={{ position: "relative", padding: 24 }}>
        {s?.badge && (
          <span style={{ display: "inline-block", padding: "6px 10px", borderRadius: 999, background: hasImage ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.25)", color: "#fff", fontSize: t.h6 }}>
            {s.badge}
          </span>
        )}
        <h1 style={{ marginTop: 8, fontSize: t.h1, lineHeight: 1.05, fontWeight: 800 }}>
          {s?.title || "Make your best first impression"}
        </h1>
        <p style={{ marginTop: 8, fontSize: t.h5, opacity: hasImage ? .95 : .9 }}>
          {s?.subtitle || "Modern, fast, accessible websites that convert."}
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {s?.primaryCta?.label && (
            <a
              href={s.primaryCta.href || "#contact"}
              data-action="open-contact"
              style={{ background: theme.accent, color: "#fff", padding: "10px 14px", borderRadius: 999, textDecoration: "none" }}
            >
              {s.primaryCta.label}
            </a>
          )}
          {s?.secondaryCta?.label && (
            <a
              href={s.secondaryCta.href || "#contact"}
              style={{ background: "#fff", color: theme.primary, padding: "10px 14px", borderRadius: 999, textDecoration: "none" }}
            >
              {s.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function renderFeatures(s, theme, t) {
  const items = Array.isArray(s?.items) ? s.items : [];
  return (
    <div style={{ ...cardStyle(theme), padding: 16 }}>
      <div style={{ fontSize: t.h2, fontWeight: 800 }}> {s?.title || "What you’ll get"} </div>
      <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ padding: 14, border: "1px solid #e5e7eb", borderRadius: theme.radius, background: "#fff" }}>
            <div style={{ fontSize: t.h5, fontWeight: 700 }}>{it?.title || "Untitled"}</div>
            <div style={{ marginTop: 6, fontSize: t.h6, color: "#475569" }}>{it?.text || ""}</div>
          </div>
        ))}
        {items.length === 0 && <div style={{ fontSize: t.h6, color: "#64748B" }}>Add feature items in the Maker.</div>}
      </div>
    </div>
  );
}

function renderGallery(s, theme, t) {
  const imgs = Array.isArray(s?.images) ? s.images : [];
  return (
    <div style={{ ...cardStyle(theme), padding: 16 }}>
      <div style={{ fontSize: t.h2, fontWeight: 800 }}>{s?.title || "Gallery"}</div>
      <div style={{ marginTop: 12, display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {imgs.map((src, i) => (
          <div key={i} style={{ borderRadius: theme.radius, overflow: "hidden", border: "1px solid #e5e7eb" }}>
            <img src={src} alt={`Gallery ${i + 1}`} style={{ width: "100%", height: 140, objectFit: "cover" }} />
          </div>
        ))}
        {imgs.length === 0 && <div style={{ fontSize: t.h6, color: "#64748B" }}>Add image URLs in the Maker.</div>}
      </div>
    </div>
  );
}

function renderTestimonials(s, theme, t) {
  const quotes = Array.isArray(s?.quotes) ? s.quotes : [];
  return (
    <div style={{ ...cardStyle(theme), padding: 16 }}>
      <div style={{ fontSize: t.h2, fontWeight: 800 }}>{s?.title || "Testimonials"}</div>
      <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {quotes.map((q, i) => (
          <div key={i} style={{ padding: 14, border: "1px solid #e5e7eb", borderRadius: theme.radius }}>
            <div style={{ fontStyle: "italic", fontSize: t.h6 }}>“{q?.quote || ""}”</div>
            <div style={{ marginTop: 8, fontSize: t.h6, color: "#64748B" }}>{q?.author || ""}</div>
          </div>
        ))}
        {quotes.length === 0 && <div style={{ fontSize: t.h6, color: "#64748B" }}>Add testimonials in the Maker.</div>}
      </div>
    </div>
  );
}

function renderPricing(s, theme, t) {
  const tiers = Array.isArray(s?.tiers) ? s.tiers : [];
  return (
    <div style={{ ...cardStyle(theme), padding: 16 }}>
      <div style={{ fontSize: t.h2, fontWeight: 800 }}>{s?.title || "Pricing"}</div>
      <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {tiers.map((p, i) => (
          <div key={i} style={{ padding: 14, border: "1px solid #e5e7eb", borderRadius: theme.radius, background: "#fff" }}>
            <div style={{ fontSize: t.h5, fontWeight: 700 }}>{p?.name || "Plan"}</div>
            <div style={{ marginTop: 4, fontSize: t.h3, fontWeight: 800, color: theme.accent }}>{p?.price || "$—"}</div>
            <ul style={{ marginTop: 8, paddingLeft: 16, fontSize: t.h6, color: "#475569" }}>
              {(p?.items || []).map((feat, idx) => (
                <li key={idx} style={{ marginTop: 4 }}>{feat}</li>
              ))}
            </ul>
            <button
              data-action="select-plan"
              data-plan={p?.name || "Plan"}
              style={{ marginTop: 10, background: theme.accent, color: "#fff", padding: "8px 12px", borderRadius: 12, border: "none", cursor: "pointer" }}
            >
              Choose {p?.name || "Plan"}
            </button>
          </div>
        ))}
        {tiers.length === 0 && <div style={{ fontSize: t.h6, color: "#64748B" }}>Enable pricing or add plans in the Maker.</div>}
      </div>
    </div>
  );
}

function renderFaq(s, theme, t) {
  const items = Array.isArray(s?.items) ? s.items : [];
  return (
    <div style={{ ...cardStyle(theme), padding: 16 }}>
      <div style={{ fontSize: t.h2, fontWeight: 800 }}>{s?.title || "FAQ"}</div>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {items.map((it, i) => (
          <details key={i} style={{ border: "1px solid #e5e7eb", borderRadius: theme.radius, padding: 12, background: "#fff" }}>
            <summary style={{ fontSize: t.h6, fontWeight: 700, cursor: "pointer" }}>{it?.q || "Question"}</summary>
            <div style={{ marginTop: 8, fontSize: t.h6, color: "#475569" }}>{it?.a || ""}</div>
          </details>
        ))}
        {items.length === 0 && <div style={{ fontSize: t.h6, color: "#64748B" }}>Add FAQs in the Maker.</div>}
      </div>
    </div>
  );
}

function renderContact(s, theme, t) {
  const email = s?.email || "";
  const phone = s?.phone || "";
  const locs = Array.isArray(s?.locations) ? s.locations : [];
  return (
    <div id="contact" style={{ ...cardStyle(theme), padding: 16 }}>
      <div style={{ fontSize: t.h2, fontWeight: 800 }}>{s?.title || "Contact"}</div>
      <div style={{ marginTop: 8, fontSize: t.h6 }}>
        {email && <>Email: <a href={`mailto:${email}`} style={{ color: theme.accent, textDecoration: "none" }}>{email}</a></>}
        {phone && <div style={{ marginTop: 4 }}>Phone: {phone}</div>}
        {locs.length > 0 && <div style={{ marginTop: 4, color: "#64748B" }}>Locations: {locs.join(" · ")}</div>}
      </div>
      <form style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <input placeholder="Name" style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 12 }} />
        <input placeholder="Email" style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 12 }} />
        <textarea rows={4} placeholder="Message" style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 12 }} />
        <button
          type="button"
          data-action="open-contact"
          style={{ background: theme.accent, color: "#fff", padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer", width: "fit-content" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
