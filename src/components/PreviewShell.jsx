// src/components/PreviewShell.jsx
import React from "react";

export default function PreviewShell({ dsl }) {
  if (!dsl) return null;
  const brand = dsl.meta.brand;
  const page = dsl.pages[0];

  // Design tokens
  const ink = brand.colors.primary;
  const accent = brand.colors.accent;
  const bg = brand.colors.secondary;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,.06)",
      }}
    >
      {page.sections.map((s, i) => (
        <Section key={i} s={s} brand={brand} ink={ink} bg={bg} accent={accent} />
      ))}
    </div>
  );
}

function Section({ s, brand, ink, bg, accent }) {
  const wrap = (children, style = {}) => (
    <section style={{ padding: "28px 24px", ...style }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>{children}</div>
    </section>
  );

  if (s.type === "header") {
    return (
      <header
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, color: ink }}>{brand.name}</div>
          <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
            {s.nav?.map((item) => (
              <a key={item} href={"#"+item.toLowerCase()} style={{ color: "#475569", textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            data-action="open-contact"
            style={{
              padding: "8px 12px",
              background: accent,
              color: "#fff",
              borderRadius: 999,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Contact
          </a>
        </div>
      </header>
    );
  }

  if (s.type === "hero") {
    return (
      <section
        style={{
          position: "relative",
          background: s.heroImage
            ? `url(${s.heroImage}) center/cover no-repeat`
            : `linear-gradient(120deg, ${ink}, ${accent})`,
          color: "#fff",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ opacity: 0.9, fontSize: 14 }}>{brand.tagline ? "" : ""}</div>
          <h1 style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 700, marginTop: 8 }}>
            {s.title}
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9, marginTop: 8 }}>{s.subtitle}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {s.primaryCta && (
              <a
                href={s.primaryCta.href}
                data-action="open-contact"
                style={{
                  padding: "10px 14px",
                  background: "#fff",
                  color: "#0f172a",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {s.primaryCta.label}
              </a>
            )}
            {s.secondaryCta && (
              <a
                href={s.secondaryCta.href}
                style={{
                  padding: "10px 14px",
                  background: "rgba(255,255,255,.14)",
                  color: "#fff",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                {s.secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (s.type === "features") {
    return wrap(
      <>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: ink }}>{s.title}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          {(s.items || []).map((it, idx) => (
            <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 600, color: ink }}>{it.title}</div>
              <div style={{ color: "#475569", marginTop: 6 }}>{it.text}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (s.type === "services") {
    return wrap(
      <>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: ink }}>{s.title}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          {(s.items || []).map((it, idx) => (
            <div key={idx} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 600, color: ink }}>{it.title}</div>
              <div style={{ color: "#475569", marginTop: 6 }}>{it.text}</div>
              <a
                href="#contact"
                data-action="open-contact"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  fontSize: 14,
                  color: accent,
                  textDecoration: "none",
                }}
              >
                Enquire →
              </a>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (s.type === "products") {
    return wrap(
      <>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: ink }}>{s.title}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          {(s.cards || []).map((c, idx) => (
            <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <div
                style={{
                  background: c.img ? `url(${c.img}) center/cover` : "#f1f5f9",
                  aspectRatio: "3 / 2",
                }}
              />
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, color: ink }}>{c.title}</div>
                <div style={{ color: "#475569", marginTop: 6 }}>{c.text}</div>
                <a
                  href={c.cta?.href || "#"}
                  data-action="toast"
                  data-message={`Open ${c.title}`}
                  style={{ display: "inline-block", marginTop: 10, fontSize: 14, color: accent, textDecoration: "none" }}
                >
                  {c.cta?.label || "View"} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (s.type === "testimonial") {
    return (
      <section style={{ padding: "28px 24px", background: bg }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontStyle: "italic", color: ink }}>{s.quote}</div>
          <div style={{ marginTop: 8, color: "#475569" }}>— {s.author}</div>
        </div>
      </section>
    );
  }

  if (s.type === "faq") {
    return wrap(
      <>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: ink }}>{s.title}</h2>
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {(s.items || []).map((it, idx) => (
            <details key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, color: ink }}>{it.q}</summary>
              <div style={{ color: "#475569", marginTop: 6 }}>{it.a}</div>
            </details>
          ))}
        </div>
      </>
    );
  }

  if (s.type === "contact") {
    return wrap(
      <>
        <h2 id="contact" style={{ fontSize: 28, fontWeight: 700, color: ink }}>{s.title}</h2>
        <div style={{ color: "#475569", marginTop: 6 }}>
          Email:{" "}
          <a href={`mailto:${s.email}`} style={{ color: accent, textDecoration: "none" }}>
            {s.email}
          </a>
          {s.locations?.length ? (
            <span style={{ marginLeft: 8, opacity: 0.8 }}>• {s.locations.join(" · ")}</span>
          ) : null}
        </div>
        <form
          className="preview-contact-form"
          style={{
            marginTop: 12,
            display: "grid",
            gap: 8,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input placeholder="Name" style={field} />
          <input placeholder="Email" type="email" style={field} />
          <textarea placeholder="Message" rows={5} style={field} />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              data-action="open-contact"
              style={{ ...btn, background: accent, color: "#fff" }}
            >
              Send message
            </button>
            <button
              data-action="book-call"
              style={{ ...btn, background: "#0f172a", color: "#fff" }}
            >
              Book a call
            </button>
          </div>
        </form>
      </>
    );
  }

  if (s.type === "footer") {
    return (
      <footer style={{ padding: "20px 24px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            color: "#475569",
            fontSize: 14,
          }}
        >
          <div>© {new Date().getFullYear()} {s.company}</div>
          <nav style={{ display: "flex", gap: 16 }}>
            {s.nav?.map((item) => (
              <a key={item} href={"#"+item.toLowerCase()} style={{ color: "#475569", textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    );
  }

  return null;
}

const field = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
  fontSize: 14,
};

const btn = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
};
