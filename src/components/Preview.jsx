import React, { useEffect } from "react";

export default function Preview({ dsl }){
  const brand = dsl.meta.brand;

  // apply theme vars
  useEffect(()=>{
    document.documentElement.style.setProperty("--ink", brand.colors.primary);
    document.documentElement.style.setProperty("--accent", brand.colors.accent);
    document.documentElement.style.setProperty("--bg", brand.colors.secondary);
  }, [brand]);

  return (
    <div id="preview-root" className="stack">
      {/* HERO */}
      <section className="hero reveal" style={{aspectRatio:"16/9"}}>
        <div className="bg" style={{
          backgroundImage: dsl.pages[0].sections.hero.heroImage
            ? `url(${dsl.pages[0].sections.hero.heroImage})`
            : `linear-gradient(120deg, ${brand.colors.primary}, ${brand.colors.accent})`
        }}/>
        <div className="scrim"/>
        <div className="copy">
          {dsl.meta.locationsBadge && <div className="badge">{dsl.meta.locationsBadge}</div>}
          <h1 className="ts-h1" style={{fontWeight:700, marginTop:8}}>{brand.name}</h1>
          {brand.tagline && <p className="ts-h6" style={{color:"rgba(255,255,255,.9)"}}>{brand.tagline}</p>}
          <div style={{display:"flex", gap:12, marginTop:16}}>
            <a className="btn" href="#contact">{dsl.meta.primaryCTA}</a>
            {dsl.meta.secondaryCTA && <a className="btn ghost" href="#contact">{dsl.meta.secondaryCTA}</a>}
          </div>
        </div>
      </section>

      {/* VALUE */}
      {!!dsl.pages[0].sections.value.items.length && (
        <section className="panel reveal" style={{padding:16}}>
          <h2 className="ts-h2" style={{fontWeight:700}}>What you get</h2>
          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", marginTop:12}}>
            {dsl.pages[0].sections.value.items.map((v,i)=>(
              <div key={i} className="card">
                <div className="ts-h5" style={{fontWeight:600}}>{v.title}</div>
                <div className="ts-h6" style={{color:"var(--muted)", marginTop:4}}>{v.text}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROOF */}
      {(dsl.proof.logos.length || dsl.proof.testimonials.length || dsl.proof.metrics.length) && (
        <section className="panel reveal" style={{padding:16}}>
          <h2 className="ts-h2" style={{fontWeight:700}}>Proof</h2>
          {!!dsl.proof.logos.length && (
            <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))", marginTop:12}}>
              {dsl.proof.logos.map((l, i)=> <div key={i} className="chip">{l}</div>)}
            </div>
          )}
          {!!dsl.proof.testimonials.length && (
            <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", marginTop:12}}>
              {dsl.proof.testimonials.map((t,i)=>(
                <div key={i} className="card">
                  <div className="ts-h6" style={{fontStyle:"italic"}}>“{t.quote}”</div>
                  <div className="ts-h6" style={{color:"var(--muted)", marginTop:6}}>{t.author}</div>
                </div>
              ))}
            </div>
          )}
          {!!dsl.proof.metrics.length && (
            <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", marginTop:12}}>
              {dsl.proof.metrics.map((m,i)=>(
                <div key={i} className="card">
                  <div className="ts-h3" style={{color:"var(--accent)", fontWeight:700}}>{m.value}</div>
                  <div className="ts-h6" style={{color:"var(--muted)"}}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* PRICING (optional) */}
      {dsl.pricing && (
        <section className="panel reveal" style={{padding:16}}>
          <h2 className="ts-h2" style={{fontWeight:700}}>Pricing</h2>
          <p className="ts-h6" style={{color:"var(--muted)"}}>{dsl.pricing.note}</p>
          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", marginTop:12}}>
            {dsl.pricing.tiers.map((t,i)=>(
              <div key={i} className="card">
                <div className="ts-h5" style={{fontWeight:600}}>{t.name}</div>
                <div className="ts-h3" style={{color:"var(--accent)", fontWeight:700, marginTop:4}}>{t.price}</div>
                <ul className="ts-h6" style={{color:"var(--muted)", marginTop:8}}>
                  {t.items.map((x,j)=><li key={j} style={{marginTop:4}}>• {x}</li>)}
                </ul>
                <a className="btn" href="#contact" style={{marginTop:12}}>Choose {t.name}</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="panel reveal" style={{padding:16}}>
        <h2 className="ts-h2" style={{fontWeight:700}}>Contact</h2>
        <div className="ts-h6" style={{marginTop:8}}>Email: <a href={`mailto:${dsl.contact.email}`} style={{color:"var(--accent)"}}>{dsl.contact.email}</a></div>
        {!!dsl.meta.locationsBadge && <div className="ts-h6" style={{color:"var(--muted)", marginTop:4}}>Locations: {dsl.meta.locationsBadge}</div>}
        <form className="card" style={{marginTop:12, display:"grid", gap:12}}>
          <input className="input" placeholder="Name"/>
          <input className="input" placeholder="Email"/>
          <textarea className="input" rows="4" placeholder="Message"/>
          <button className="btn" type="button">Send</button>
        </form>
      </section>

      <footer className="panel reveal" style={{padding:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div className="ts-h6">© {new Date().getFullYear()} {brand.name}</div>
        <div className="ts-h6" style={{color:"var(--muted)"}}>{dsl.meta.primaryCTA}</div>
      </footer>
    </div>
  );
}
