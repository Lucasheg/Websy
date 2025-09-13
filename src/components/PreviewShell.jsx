import React from "react";

function Section({ children }) {
  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.04)",
        padding: 16,
      }}
    >
      {children}
    </section>
  );
}

export default function PreviewShell({ dsl }) {
  const brand = dsl?.meta?.brand || {
    name: "Example Co.",
    colors: { primary: "#0F172A", secondary: "#F6F7F9", accent: "#2563EB" },
  };

  const sections = dsl?.pages?.[0]?.sections || [];

  const renderSection = (s, i) => {
    switch (s.type) {
      case "header":
        return (
          <header
            key={`hdr-${i}`}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            <div style={{ fontWeight: 700 }}>{s.brandName || "Example Co."}</div>
            <nav style={{ display: "flex", gap: 16 }}>
              {(s.nav || ["Home", "About", "Services", "Pricing", "Contact"]).map(
                (item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="ts-h6">
                    {item}
                  </a>
                )
              )}
            </nav>
          </header>
        );

      case "hero":
        return (
          <div key={`hero-${i}`} style={{ position: "relative" }}>
            <div
              className="ar-2-1"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: s.heroImage
                    ? `url(${s.heroImage}) center/cover`
                    : `linear-gradient(120deg, ${brand.colors.primary}, ${brand.colors.accent})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.2))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  bottom: 16,
                  color: "#fff",
                  maxWidth: 720,
                }}
              >
                <div className="badge" style={{ background: "rgba(255,255,255,.15)", borderRadius: 999, display: "inline-block", padding: "4px 10px" }}>Example</div>
                <h1 className="ts-h1" style={{ marginTop: 8, fontWeight: 700 }}>
                  {s.title || brand.name}
                </h1>
                <p className="ts-h6" style={{ marginTop: 6, opacity: 0.9 }}>
                  {s.subtitle ||
                    "Use this area for a short, clear explanation of what you do and why it matters."}
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  {s.primaryCta && (
                    <a
                      data-action="open-contact"
                      href={s.primaryCta.href || "#contact"}
                      className="btn"
                      style={{
                        background: brand.colors.accent,
                        color: "#fff",
                        borderRadius: 999,
                        padding: "10px 14px",
                        textDecoration: "none",
                      }}
                    >
                      {s.primaryCta.label}
                    </a>
                  )}
                  {s.secondaryCta && (
                    <a
                      href={s.secondaryCta.href || "#"}
                      className="btn"
                      style={{
                        background: "#0F172A",
                        color: "#fff",
                        borderRadius: 999,
                        padding: "10px 14px",
                        textDecoration: "none",
                      }}
                    >
                      {s.secondaryCta.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "features":
        return (
          <Section key={`feat-${i}`}>
            <h2 className="ts-h2" style={{ fontWeight: 700 }}>
              {s.title || "Features"}
            </h2>
            <div
              className="grid cols-auto"
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
                marginTop: 12,
              }}
            >
              {(s.items || []).map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div className="ts-h5" style={{ fontWeight: 600 }}>
                    {it.title || "Feature"}
                  </div>
                  <div className="ts-h6" style={{ color: "#475569", marginTop: 6 }}>
                    {it.text ||
                      "A short explanation of how this benefits your customer."}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );

      case "proof":
        return (
          <Section key={`proof-${i}`}>
            <h2 className="ts-h2" style={{ fontWeight: 700 }}>
              Social proof
            </h2>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", marginTop: 12 }}>
              {(s.testimonials || []).map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div className="ts-h6" style={{ fontStyle: "italic" }}>
                    “{t.quote}”
                  </div>
                  <div className="ts-h6" style={{ color: "#475569", marginTop: 6 }}>
                    {t.author || ""}
                  </div>
                </div>
              ))}
            </div>
            {(s.metrics || []).length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                  marginTop: 12,
                }}
              >
                {s.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: 16,
                    }}
                  >
                    <div className="ts-h3" style={{ color: brand.colors.accent, fontWeight: 700 }}>
                      {m.value}
                    </div>
                    <div className="ts-h6" style={{ color: "#475569" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        );

      case "pricing":
        return (
          <Section key={`pricing-${i}`}>
            <h2 className="ts-h2" style={{ fontWeight: 700 }}>
              {s.title || "Pricing"}
            </h2>
            {s.note && (
              <p className="ts-h6" style={{ color: "#475569", marginTop: 6 }}>
                {s.note}
              </p>
            )}
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
                marginTop: 12,
              }}
            >
              {(s.tiers || []).map((t) => (
                <div
                  key={t.name}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div className="ts-h5" style={{ fontWeight: 600 }}>
                    {t.name}
                  </div>
                  <div
                    className="ts-h3"
                    style={{ color: brand.colors.accent, fontWeight: 700, marginTop: 6 }}
                  >
                    {t.price}
                  </div>
                  <ul className="ts-h6" style={{ color: "#475569", marginTop: 8 }}>
                    {(t.items || []).map((x) => (
                      <li key={x} style={{ marginTop: 4 }}>
                        • {x}
                      </li>
                    ))}
                  </ul>
                  <button
                    data-action="select-plan"
                    data-plan={t.name}
                    className="btn"
                    style={{
                      background: brand.colors.accent,
                      color: "#fff",
                      borderRadius: 999,
                      padding: "10px 14px",
                      marginTop: 12,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Choose {t.name}
                  </button>
                </div>
              ))}
            </div>
          </Section>
        );

      case "cta":
        return (
          <Section key={`cta-${i}`}>
            <div style={{ textAlign: "center" }}>
              <h2 className="ts-h2" style={{ fontWeight: 700 }}>
                {s.title || "Ready to begin?"}
              </h2>
              <a
                data-action="open-contact"
                href={s?.cta?.href || "#contact"}
                className="btn"
                style={{
                  display: "inline-block",
                  background: brand.colors.accent,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "10px 14px",
                  textDecoration: "none",
                  marginTop: 12,
                }}
              >
                {s?.cta?.label || "Contact us"}
              </a>
            </div>
          </Section>
        );

      case "contact":
        return (
          <Section key={`contact-${i}`} id="contact">
            <h2 className="ts-h2" style={{ fontWeight: 700 }}>
              {s.title || "Contact"}
            </h2>
            <div className="ts-h6" style={{ marginTop: 8 }}>
              Email:{" "}
              <a href={`mailto:${s.email || "hello@example.com"}`} style={{ color: brand.colors.accent }}>
                {s.email || "hello@example.com"}
              </a>
            </div>
            {Array.isArray(s.locations) && s.locations.length > 0 && (
              <div className="ts-h6" style={{ color: "#475569", marginTop: 4 }}>
                Locations: {s.locations.join(" · ")}
              </div>
            )}
            <form
              className="panel"
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 16,
                marginTop: 12,
                display: "grid",
                gap: 12,
              }}
            >
              <input placeholder="Name" className="input" style={inputStyle} />
              <input placeholder="Email" className="input" style={inputStyle} />
              <textarea rows="5" placeholder="Message" className="input" style={inputStyle} />
              <button
                type="button"
                className="btn"
                data-action="open-contact"
                style={{
                  background: brand.colors.accent,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "10px 14px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>
          </Section>
        );

      case "footer":
        return (
          <footer
            key={`ftr-${i}`}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 12,
              marginTop: 12,
            }}
          >
            <div className="ts-h6" style={{ color: "#475569" }}>
              © {new Date().getFullYear()} {s.brandName || brand.name}
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {sections.map((s, i) => renderSection(s, i))}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
};
