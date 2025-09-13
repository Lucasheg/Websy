import React, { useEffect } from "react";

export default function PreviewShell({ dsl }) {
  if (!dsl || !dsl.meta || !Array.isArray(dsl.pages)) {
    return <div style={card()}>Loading…</div>;
  }
  const { brand = {}, theme = {}, nav = [] } = dsl.meta;
  const page = dsl.pages[0] || { sections: [] };

  useEffect(() => {
    const obs = new IntersectionObserver((entries)=> entries.forEach(e=> e.isIntersecting && e.target.classList.add("vis")), { threshold: 0.25 });
    document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [dsl]);

  return (
    <div>
      <Style theme={theme} />

      <header className="hd">
        <div className="shell">
          <div className="logo">{brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name || "Brand"} /> : <span>{brand.name || "Brand"}</span>}</div>
          <nav className="nav">
            {(nav || []).map((it) => <a key={it} href={`#${it.toLowerCase().replace(/\s+/g,"")}`}>{it}</a>)}
            <a data-action="open-contact" href="#contact" className="btn">Contact</a>
          </nav>
        </div>
      </header>

      {(page.sections || []).map((s,i)=> <Section key={i} s={s} />)}

      <footer className="ft">
        <div className="shell">
          <div className="ft-grid">
            <div>
              <div className="brand">{brand.name || "Brand"}</div>
              <div className="muted">© {new Date().getFullYear()} — All rights reserved</div>
            </div>
            <div className="muted" style={{ textAlign: "right" }}>
              <a href="#top">Back to top</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ s }) {
  if (!s) return null;

  if (s.type === "hero") {
    return (
      <section className="hero rv" id="home">
        <div className="hero-bg" style={s.heroImage ? { backgroundImage: `url(${s.heroImage})` } : undefined} />
        <div className="hero-scrim" />
        <div className="shell">
          {s.badge ? <div className="badge">{s.badge}</div> : null}
          <h1 className="h1">{s.title || "Headline"}</h1>
          {s.subtitle ? <p className="lead">{s.subtitle}</p> : null}
          <div className="cta-row">
            {s.primaryCta && <a href={s.primaryCta.href || "#"} className="btn">{s.primaryCta.label || "Learn more"}</a>}
            {s.secondaryCta && <a href={s.secondaryCta.href || "#"} className="btn ghost">{s.secondaryCta.label}</a>}
          </div>
        </div>
      </section>
    );
  }

  if (s.type === "features") {
    const items = Array.isArray(s.items) ? s.items : [];
    return (
      <section className="sec rv" id="products">
        <div className="shell">
          <h2 className="h2">{s.title || "What you’ll get"}</h2>
          <div className="grid">
            {items.map((it, i) => (
              <div className="card" key={i}>
                <div className="h5">{it.title || "Feature"}</div>
                {it.text ? <p className="p muted">{it.text}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (s.type === "gallery") {
    const imgs = Array.isArray(s.images) ? s.images : [];
    if (!imgs.length) return null;
    return (
      <section className="sec rv">
        <div className="shell">
          <h2 className="h2">{s.title || "Show, don’t tell"}</h2>
          <div className="gallery">
            {imgs.map((src, i) => (
              <figure key={i} className="ph">
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (s.type === "testimonials") {
    const quotes = Array.isArray(s.quotes) ? s.quotes : [];
    if (!quotes.length) return null;
    return (
      <section className="sec rv">
        <div className="shell">
          <h2 className="h2">{s.title || "What clients say"}</h2>
          <div className="grid">
            {quotes.map((q, i) => (
              <blockquote className="card quote" key={i}>
                <p>“{q.quote || ""}”</p>
                <cite className="muted">{q.author || ""}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (s.type === "faq") {
    const items = Array.isArray(s.items) ? s.items : [];
    if (!items.length) return null;
    return (
      <section className="sec rv" id="about">
        <div className="shell">
          <h2 className="h2">{s.title || "FAQ"}</h2>
          <div className="faq">
            {items.map((f, i) => (
              <details key={i} className="faq-item">
                <summary>{f.q || "Question"}</summary>
                <div className="p muted">{f.a || ""}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (s.type === "contact") {
    const email = s.email || "contact@example.com";
    const locations = Array.isArray(s.locations) ? s.locations : [];
    return (
      <section className="sec rv" id="contact">
        <div className="shell">
          <h2 className="h2">{s.title || "Contact"}</h2>
          <div className="contact">
            <div className="card">
              <div className="p"><b>Email:</b> {email}</div>
              {s.phone ? <div className="p"><b>Phone:</b> {s.phone}</div> : null}
              {locations.length ? <div className="p muted">Locations: {locations.join(" · ")}</div> : null}
              <a href={`mailto:${email}`} className="btn" data-action="open-contact">Send email</a>
            </div>
            <form className="card">
              <input className="in" placeholder="Name" />
              <input className="in" placeholder="Email" />
              <textarea className="in" rows={5} placeholder="Message" />
              <button className="btn" type="button" data-action="open-contact">Send</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

function Style({ theme = {} }) {
  const primary = theme.primary || "#0F172A";
  const accent = theme.accent || "#0EA5E9";
  const neutral = theme.neutral || "#F6F7F9";
  const radius = theme.radius ?? 16;
  const base = theme.base ?? 16;
  const container = theme.container ?? 1200;

  return (
    <style>{`
      :root{
        --ink:${primary}; --accent:${accent}; --bg:${neutral};
        --hair:#e8eaef; --muted:#64748b; --r:${radius}px; --base:${base}px; --w:${container}px;
      }
      .shell{max-width:var(--w); margin:0 auto; padding:0 16px;}
      .p{font-size:var(--base); line-height:1.55}
      .muted{color:var(--muted)}
      .h1{font-size:calc(var(--base) * 2.4); letter-spacing:-0.02em; line-height:1.05; font-weight:700}
      .h2{font-size:calc(var(--base) * 1.7); letter-spacing:-0.015em; line-height:1.15; font-weight:700}
      .h5{font-size:calc(var(--base) * 1.125); font-weight:600}
      .btn{display:inline-flex; align-items:center; gap:8px; padding:10px 16px;
           background:var(--accent); color:#fff; border-radius:999px; text-decoration:none; border:1px solid transparent}
      .btn.ghost{background:#fff; color:var(--ink); border:1px solid var(--hair)}
      .card{background:#fff; border:1px solid var(--hair); border-radius:var(--r); padding:16px}
      .ph{background:#fff; border:1px solid var(--hair); border-radius:var(--r); overflow:hidden}
      .ph img{display:block; width:100%; height:100%; object-fit:cover}
      .rv{opacity:0; transform:translateY(10px); transition:opacity .4s ease, transform .4s ease}
      .rv.vis{opacity:1; transform:translateY(0)}
      .hd{position:sticky; top:0; z-index:10; background:rgba(255,255,255,.82); backdrop-filter:saturate(1.2) blur(6px);
          border-bottom:1px solid var(--hair)}
      .hd .shell{display:flex; align-items:center; justify-content:space-between; height:56px}
      .logo img{height:22px}
      .logo span{font-weight:700; letter-spacing:.02em}
      .nav{display:flex; align-items:center; gap:18px}
      .nav a{color:var(--ink); text-decoration:none}
      .hero{position:relative; overflow:hidden; border-bottom:1px solid var(--hair)}
      .hero-bg{position:absolute; inset:0; background:linear-gradient(135deg,#fdfdfd,#f2f5f8); background-size:cover; background-position:center}
      .hero .shell{position:relative; padding:72px 16px}
      .hero .lead{color:#1f2937; max-width:720px; margin-top:6px}
      .badge{display:inline-block; padding:4px 10px; border-radius:999px; background:rgba(255,255,255,.6); border:1px solid var(--hair); margin-bottom:8px}
      .hero-scrim{position:absolute; inset:0; pointer-events:none}
      .cta-row{display:flex; gap:12px; margin-top:16px}
      .sec{padding:56px 0}
      .grid{display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(260px,1fr))}
      .gallery{display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(220px,1fr))}
      .quote p{font-style:italic; margin:0 0 6px 0}
      .faq{display:grid; gap:8px}
      .faq-item{border:1px solid var(--hair); border-radius:var(--r); padding:10px 14px; background:#fff}
      .faq-item > summary{cursor:pointer; font-weight:600}
      .contact{display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); align-items:start}
      .in{width:100%; padding:10px 12px; border:1px solid var(--hair); border-radius:10px}
      .ft{border-top:1px solid var(--hair); background:#fff; padding:24px 0 28px}
      .ft-grid{display:grid; gap:12px; grid-template-columns:1fr 1fr; align-items:center}
      .brand{font-weight:700}
      @media (max-width: 720px){
        .h1{font-size:calc(var(--base) * 2.0)}
        .h2{font-size:calc(var(--base) * 1.45)}
        .hero .shell{padding:56px 16px}
      }
    `}</style>
  );
}

function card(){ return { background:"#fff", border:"1px solid #e8eaef", borderRadius:16, padding:16 }; }
