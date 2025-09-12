import React, { useMemo } from "react";

/**
 * PreviewShell
 * - Renders a plausible “real site” preview based on Maker config
 * - Includes: header, hero, value/services, proof, optional pricing, contact, footer
 * - Interactive CTAs use data-action so your action system handles them
 */
export default function PreviewShell({ config }) {
  const {
    brand,
    layout,
    content: { goal, differentiators, testimonials, logos, metrics },
  } = config;

  // map goal -> CTA label
  const goalLabel = useMemo(() => {
    const g = (goal || "").toLowerCase();
    if (/book|appointment|schedule/.test(g)) return "Book appointment";
    if (/consult/.test(g)) return "Book consultation";
    if (/demo|trial/.test(g)) return "Start demo";
    if (/quote|estimate|price/.test(g)) return "Get quote";
    return "Contact us";
  }, [goal]);

  // minor industry-based tweaks
  const industryNotes = useMemo(() => {
    switch (brand.industry) {
      case "law":
        return {
          nav: ["Services", "Expertise", "Pricing", "Contact"],
          heroKicker: brand.locations?.length ? brand.locations.join(" · ") : "",
        };
      case "clinic":
        return {
          nav: ["Care", "Doctors", "Pricing", "Contact"],
          heroKicker: "Same-week booking",
        };
      case "gym":
        return {
          nav: ["Programs", "Coaches", "Pricing", "Contact"],
          heroKicker: "Train with accountability",
        };
      case "saas":
        return {
          nav: ["Product", "Pricing", "Docs", "Contact"],
          heroKicker: "Faster time-to-value",
        };
      default:
        return { nav: ["Services", "Work", "Pricing", "Contact"], heroKicker: "" };
    }
  }, [brand.industry, brand.locations]);

  // theme vars (apply per-preview)
  const themeVars = {
    "--ink": brand.colors.primary,
    "--accent": brand.colors.accent,
    "--bg": brand.colors.neutral,
  };

  return (
    <div className="site" style={themeVars}>
      <style>{SITE_CSS}</style>

      {/* HEADER */}
      <header className="hdr">
        <div className="hdr-in">
          <a href="#top" className="logo">
            {brand.name}
          </a>
          <nav className="nav">
            {industryNotes.nav.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>
                {item}
              </a>
            ))}
          </nav>
          <div className="hdr-cta">
            <a
              href="#contact"
              className="btn"
              data-action="book-call"
              aria-label="Book a call"
            >
              Book a call
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="hero">
        {brand.heroImage ? (
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${brand.heroImage})` }}
          />
        ) : (
          <div
            className="hero-bg"
            style={{
              backgroundImage: `linear-gradient(120deg, ${brand.colors.primary}, ${brand.colors.accent})`,
            }}
          />
        )}
        <div className="hero-scrim" />
        <div className="hero-in">
          {industryNotes.heroKicker && (
            <div className="badge">{industryNotes.heroKicker}</div>
          )}
          <h1 className="ts-h1">{brand.name}</h1>
          <p className="ts-h6 hero-sub">
            {brand.tagline || "We build, measure, and iterate for outcomes."}
          </p>
          <div className="cta-row">
            <a href="#contact" className="btn" data-action="open-contact">
              {goalLabel}
            </a>
            <a href="#services" className="btn sec">
              Explore services
            </a>
          </div>
        </div>
      </section>

      {/* VALUE / DIFFERENTIATORS */}
      <section id="services" className="section">
        <div className="sec-h">
          <h2 className="ts-h2">What you get</h2>
          <p className="ts-h6 sub">
            Outcomes over ornament. Strategy, structure, and clean execution.
          </p>
        </div>
        <div className="cards">
          {differentiators.slice(0, 6).map((t) => (
            <article key={t} className="card">
              <div className="ts-h5" style={{ fontWeight: 600 }}>
                {t}
              </div>
              <p className="ts-h6 muted">Built into our day-to-day process.</p>
            </article>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <section className="section" id="work">
        <div className="sec-h">
          <h2 className="ts-h2">Proof</h2>
          <p className="ts-h6 sub">
            Quiet signals of trust. No hype — just real outcomes.
          </p>
        </div>

        {!!logos.length && (
          <div className="logo-row">
            {logos.map((l) => (
              <div key={l} className="logo-chip">
                {l}
              </div>
            ))}
          </div>
        )}

        {!!testimonials.length && (
          <div className="cards">
            {testimonials.map((t, i) => (
              <article key={i} className="card">
                <div className="ts-h6" style={{ fontStyle: "italic" }}>
                  “{t.quote}”
                </div>
                <div className="ts-h6 muted" style={{ marginTop: 6 }}>
                  {t.author}
                </div>
              </article>
            ))}
          </div>
        )}

        {!!metrics.length && (
          <div className="metrics">
            {metrics.map((m, i) => (
              <div key={i} className="metric">
                <div className="ts-h3 accent">{m.value}</div>
                <div className="ts-h6 muted">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PRICING (optional) */}
      {layout.showPricing && (
        <section id="pricing" className="section">
          <div className="sec-h">
            <h2 className="ts-h2">Pricing</h2>
            <p className="ts-h6 sub">Transparent estimates. No surprises.</p>
          </div>
          <div className="cards">
            {[
              {
                name: "Starter",
                price: "$900",
                items: ["2–3 pages", "Responsive", "Lead form"],
              },
              {
                name: "Growth",
                price: "$2,300",
                items: [
                  "5–7 pages",
                  "SEO + schema",
                  "Booking & Maps",
                  "Integrations",
                ],
              },
              {
                name: "Scale",
                price: "$7,000",
                items: [
                  "10+ pages",
                  "Strategy + funnel",
                  "Advanced SEO/analytics",
                  "CRM / e-com",
                ],
              },
            ].map((t) => (
              <article key={t.name} className="card">
                <div className="ts-h5" style={{ fontWeight: 600 }}>
                  {t.name}
                </div>
                <div className="ts-h3 accent" style={{ marginTop: 4 }}>
                  {t.price}
                </div>
                <ul className="ts-h6 muted" style={{ marginTop: 8 }}>
                  {t.items.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
                <button
                  className="btn"
                  data-action="select-plan"
                  data-plan={t.name}
                  style={{ marginTop: 12 }}
                >
                  Choose {t.name}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="sec-h">
          <h2 className="ts-h2">Contact</h2>
          <p className="ts-h6 sub">
            We reply quickly. Include context and any timelines.
          </p>
        </div>
        <div className="contact">
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Name" />
            <input placeholder="Email" />
            <textarea rows="5" placeholder="Message" />
            <div className="row">
              <button className="btn" data-action="book-call">
                {goalLabel}
              </button>
              <a href="#top" className="btn sec">
                Back to top
              </a>
            </div>
          </form>
          {!!brand.locations?.length && (
            <div className="aside ts-h6 muted">
              Locations: {brand.locations.join(" · ")}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ftr">
        <div className="ftr-in">
          <div className="ts-h6 muted">© {new Date().getFullYear()} {brand.name}</div>
          <nav className="nav">
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/* Minimal site CSS (scoped to PreviewShell) */
const SITE_CSS = `
.site{--ink: #0f172a; --accent:#0ea5e9; --bg:#f7f7f7; color:var(--ink)}
.muted{color:#475569}
.accent{color:var(--accent)}

.hdr{position:sticky; top:0; z-index:10; backdrop-filter:saturate(140%) blur(6px); background:rgba(255,255,255,.7); border-bottom:1px solid #e5e7eb}
.hdr-in{max-width:1200px; margin:0 auto; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px}
.logo{font-weight:700; text-decoration:none; color:inherit}
.nav a{color:inherit; text-decoration:none; margin-left:16px}
.nav a:hover{opacity:.7}
.hdr-cta .btn{padding:8px 12px;}

.hero{position:relative; height:56vh; min-height:420px; border-bottom:1px solid #e5e7eb}
.hero-bg{position:absolute; inset:0; background-position:center; background-size:cover; transform:scale(1.02)}
.hero-scrim{position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.2))}
.hero-in{position:relative; max-width:1200px; margin:0 auto; padding:24px 16px; color:#fff; display:flex; flex-direction:column; justify-content:flex-end; height:100%}
.badge{display:inline-block; padding:4px 10px; border-radius:999px; background:rgba(255,255,255,.15); color:#fff; font-size:14px;}
.hero-sub{color:rgba(255,255,255,.88); margin-top:6px}
.cta-row{display:flex; gap:10px; margin-top:12px}

.section{max-width:1200px; margin:24px auto; padding:0 16px}
.sec-h{display:flex; align-items:baseline; justify-content:space-between; gap:12px}
.sec-h .sub{margin-left:auto}

.cards{display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:12px; margin-top:12px}
.card{background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:16px; box-shadow:0 10px 30px rgba(0,0,0,.04)}

.logo-row{display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:10px; margin-top:12px}
.logo-chip{border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; text-align:center}

.metrics{display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin-top:12px}
.metric{background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:16px}

.contact{display:grid; grid-template-columns:1fr 280px; gap:12px}
.contact-form{background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:16px; display:grid; gap:10px}
.contact-form input, .contact-form textarea{width:100%; padding:10px 12px; border:1px solid #e5e7eb; border-radius:12px}
.contact .aside{display:flex; align-items:flex-start; justify-content:flex-end}

.ftr{border-top:1px solid #e5e7eb; margin-top:24px; background:#fff}
.ftr-in{max-width:1200px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; justify-content:space-between}
.btn{display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#fff; padding:10px 14px; border-radius:999px; text-decoration:none; border:none; cursor:pointer;}
.btn.sec{background:#0f172a; color:#fff;}

@media (max-width: 800px){
  .contact{grid-template-columns:1fr}
}
`;
