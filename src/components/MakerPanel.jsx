export default function MakerPanel({ maker, setMaker, resetMaker, autoconfigure }) {
  const { brand = {}, theme = {}, layout = {}, content = {} } = maker || {};
  const set = (patch) => setMaker((prev) => ({ ...prev, ...patch }));

  return (
    <div style={card()}>
      <div style={topbar()}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Website Maker</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={resetMaker} style={btn("ghost")}>Reset</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginTop: 8 }}>
        <input
          placeholder='Guide me (e.g., "Alder & Co, software")'
          onKeyDown={(e) => { if (e.key === "Enter") autoconfigure(e.currentTarget.value); }}
          style={input()}
        />
        <button
          onClick={(e) => {
            const val = e.currentTarget.parentElement.querySelector("input")?.value || "";
            autoconfigure(val);
          }}
          style={btn("solid")}
        >
          Apply
        </button>
      </div>

      <div style={grid()}>
        <Card title="Brand">
          <label>Name</label>
          <input
            style={input()}
            value={brand.name || ""}
            onChange={(e) => set({ brand: { ...brand, name: e.target.value } })}
            placeholder="Your brand"
          />
          <label style={{ marginTop: 8 }}>Tagline</label>
          <input
            style={input()}
            value={brand.tagline || ""}
            onChange={(e) => set({ brand: { ...brand, tagline: e.target.value } })}
            placeholder="Short value proposition"
          />
          <label style={{ marginTop: 8 }}>Logo URL (optional)</label>
          <input
            style={input()}
            value={brand.logoUrl || ""}
            onChange={(e) => set({ brand: { ...brand, logoUrl: e.target.value } })}
            placeholder="https://…/logo.svg"
          />
          <label style={{ marginTop: 8 }}>Locations (comma)</label>
          <input
            style={input()}
            value={(brand.locations || []).join(", ")}
            onChange={(e) =>
              set({ brand: { ...brand, locations: e.target.value.split(",").map(x=>x.trim()).filter(Boolean) } })
            }
            placeholder="Oslo, New York, Amsterdam"
          />
        </Card>

        <Card title="Theme">
          <Row3>
            <Field label="Primary">
              <input
                style={input()}
                value={theme.primary || "#0F172A"}
                onChange={(e) => set({ theme: { ...theme, primary: e.target.value } })}
              />
            </Field>
            <Field label="Accent">
              <input
                style={input()}
                value={theme.accent || "#0EA5E9"}
                onChange={(e) => set({ theme: { ...theme, accent: e.target.value } })}
              />
            </Field>
            <Field label="Neutral">
              <input
                style={input()}
                value={theme.neutral || "#F6F7F9"}
                onChange={(e) => set({ theme: { ...theme, neutral: e.target.value } })}
              />
            </Field>
          </Row3>
          <Row2>
            <Field label="Radius">
              <input
                style={input()}
                value={theme.radius ?? 16}
                onChange={(e) => set({ theme: { ...theme, radius: Number(e.target.value) || 0 } })}
              />
            </Field>
            <Field label="Base size">
              <input
                style={input()}
                value={theme.base ?? 16}
                onChange={(e) => set({ theme: { ...theme, base: Number(e.target.value) || 16 } })}
              />
            </Field>
          </Row2>
          <Row2>
            <Field label="Container">
              <input
                style={input()}
                value={theme.container ?? 1200}
                onChange={(e) => set({ theme: { ...theme, container: Number(e.target.value) || 1200 } })}
              />
            </Field>
            <Field label="Scale (read-only)">
              <input style={input()} value={1.25} readOnly />
            </Field>
          </Row2>
        </Card>

        <Card title="Navigation">
          <label>Items (comma)</label>
          <input
            style={input()}
            value={(layout.nav || ["Home", "Products", "About", "Contact"]).join(", ")}
            onChange={(e) =>
              set({ layout: { ...layout, nav: e.target.value.split(",").map(x=>x.trim()).filter(Boolean) } })
            }
          />
        </Card>

        <Card title="Hero">
          <label>Title</label>
          <input
            style={input()}
            value={content?.hero?.title || ""}
            onChange={(e) => set({ content: { ...content, hero: { ...(content.hero || {}), title: e.target.value } } })}
          />
          <label style={{ marginTop: 8 }}>Subtitle</label>
          <input
            style={input()}
            value={content?.hero?.subtitle || ""}
            onChange={(e) => set({ content: { ...content, hero: { ...(content.hero || {}), subtitle: e.target.value } } })}
          />
          <label style={{ marginTop: 8 }}>Hero image URL</label>
          <input
            style={input()}
            value={content?.hero?.image || ""}
            onChange={(e) => set({ content: { ...content, hero: { ...(content.hero || {}), image: e.target.value } } })}
            placeholder="https://…/hero.jpg (optional)"
          />
        </Card>
      </div>
    </div>
  );
}

/* UI helpers */
function card(){ return { background:"#fff",border:"1px solid #e8eaef",borderRadius:16,boxShadow:"0 10px 30px rgba(0,0,0,.04)",padding:16 }; }
function topbar(){ return { display:"flex",justifyContent:"space-between",alignItems:"center",gap:12 }; }
function grid(){ return { display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginTop:12 }; }
function input(){ return { width:"100%",padding:"10px 12px",border:"1px solid #e8eaef",borderRadius:10,background:"#fff" }; }
function btn(kind){ const base={display:"inline-flex",alignItems:"center",gap:8,borderRadius:999,padding:"8px 14px",cursor:"pointer",border:"1px solid transparent",fontWeight:600};
  if(kind==="solid")return{...base,background:"#0EA5E9",color:"#fff"}; return{...base,background:"#fff",color:"#0F172A",border:"1px solid #e8eaef"}; }
function Card({ title, children }){ return <div style={{background:"#fff",border:"1px solid #e8eaef",borderRadius:14,padding:12}}><div style={{fontWeight:600,marginBottom:8}}>{title}</div><div style={{display:"grid",gap:8}}>{children}</div></div>; }
function Row2({ children }){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{children}</div>; }
function Row3({ children }){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{children}</div>; }
function Field({ label, children }){ return (<div><label>{label}</label>{children}</div>); }
