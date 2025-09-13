export default function MakerPanel({ maker, setMaker, resetMaker, autoconfigure }) {
  const { brand = {}, theme = {}, layout = {}, content = {} } = maker;

  const set = (patch) => setMaker((prev) => ({ ...prev, ...patch }));

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8eaef",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.04)",
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Website Maker</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={resetMaker}
            style={btn("ghost")}
            title="Reset to neutral baseline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Quick “guide me” line */}
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
        <input
          placeholder='Guide me (e.g., "Named Alder & Co, software product")'
          onKeyDown={(e) => {
            if (e.key === "Enter") autoconfigure(e.currentTarget.value);
          }}
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

      {/* Grid: Brand / Theme / Navigation / Content */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginTop: 12 }}>
        {/* Brand */}
        <Card title="Brand">
          <label className="ts-h6">Name</label>
          <input
            style={input()}
            value={brand.name || ""}
            onChange={(e) => set({ brand: { ...brand, name: e.target.value } })}
            placeholder="Your brand"
          />
          <label className="ts-h6" style={{ marginTop: 8 }}>Tagline</label>
          <input
            style={input()}
            value={brand.tagline || ""}
            onChange={(e) => set({ brand: { ...brand, tagline: e.target.value } })}
            placeholder="Short value proposition"
          />
          <label className="ts-h6" style={{ marginTop: 8 }}>Logo URL (optional)</label>
          <input
            style={input()}
            value={brand.logoUrl || ""}
            onChange={(e) => set({ brand: { ...brand, logoUrl: e.target.value } })}
            placeholder="https://…/logo.svg"
          />
          <label className="ts-h6" style={{ marginTop: 8 }}>Locations (comma)</label>
          <input
            style={input()}
            value={(brand.locations || []).join(", ")}
            onChange={(e) =>
              set({
                brand: {
                  ...brand,
                  locations: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                },
              })
            }
            placeholder="Oslo, New York, Amsterdam"
          />
        </Card>

        {/* Theme */}
        <Card title="Theme">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div>
              <label className="ts-h6">Primary</label>
              <input
                style={input()}
                value={theme.primary || "#0F172A"}
                onChange={(e) => set({ theme: { ...theme, primary: e.target.value } })}
              />
            </div>
            <div>
              <label className="ts-h6">Accent</label>
              <input
                style={input()}
                value={theme.accent || "#0EA5E9"}
                onChange={(e) => set({ theme: { ...theme, accent: e.target.value } })}
              />
            </div>
            <div>
              <label className="ts-h6">Neutral</label>
              <input
                style={input()}
                value={theme.neutral || "#F6F7F9"}
                onChange={(e) => set({ theme: { ...theme, neutral: e.target.value } })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            <div>
              <label className="ts-h6">Radius</label>
              <input
                style={input()}
                value={theme.radius ?? 16}
                onChange={(e) => set({ theme: { ...theme, radius: Number(e.target.value) || 0 } })}
              />
            </div>
            <div>
              <label className="ts-h6">Base size</label>
              <input
                style={input()}
                value={theme.base ?? 16}
                onChange={(e) => set({ theme: { ...theme, base: Number(e.target.value) || 16 } })}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            <div>
              <label className="ts-h6">Scale</label>
              <input
                style={input()}
                value={theme.scale ?? 1.25}
                onChange={(e) => set({ theme: { ...theme, scale: Number(e.target.value) || 1.25 } })}
              />
            </div>
            <div>
              <label className="ts-h6">Container</label>
              <input
                style={input()}
                value={theme.container ?? 1200}
                onChange={(e) => set({ theme: { ...theme, container: Number(e.target.value) || 1200 } })}
              />
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <Card title="Navigation">
          <label className="ts-h6">Items (comma)</label>
          <input
            style={input()}
            value={(layout.nav || ["Home", "Products", "About", "Contact"]).join(", ")}
            onChange={(e) =>
              set({
                layout: {
                  ...layout,
                  nav: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                },
              })
            }
          />
        </Card>

        {/* Hero */}
        <Card title="Hero">
          <label className="ts-h6">Title</label>
          <input
            style={input()}
            value={content?.hero?.title || ""}
            onChange={(e) =>
              set({
                content: {
                  ...content,
                  hero: { ...(content.hero || {}), title: e.target.value },
                },
              })
            }
          />
          <label className="ts-h6" style={{ marginTop: 8 }}>Subtitle</label>
          <input
            style={input()}
            value={content?.hero?.subtitle || ""}
            onChange={(e) =>
              set({
                content: {
                  ...content,
                  hero: { ...(content.hero || {}), subtitle: e.target.value },
                },
              })
            }
          />
          <label className="ts-h6" style={{ marginTop: 8 }}>Hero image URL</label>
          <input
            style={input()}
            value={content?.hero?.image || ""}
            onChange={(e) =>
              set({
                content: {
                  ...content,
                  hero: { ...(content.hero || {}), image: e.target.value },
                },
              })
            }
            placeholder="https://…/hero.jpg (optional)"
          />
        </Card>
      </div>
    </div>
  );
}

/* ————— helpers ————— */

function Card({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8eaef",
        borderRadius: 14,
        padding: 12,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 8 }}>{children}</div>
    </div>
  );
}

function input() {
  return {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e8eaef",
    borderRadius: 10,
    background: "#fff",
  };
}

function btn(kind) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "8px 14px",
    cursor: "pointer",
    border: "1px solid transparent",
    fontWeight: 600,
  };
  if (kind === "solid") {
    return { ...base, background: "#0EA5E9", color: "#fff" };
  }
  return { ...base, background: "#fff", color: "#0F172A", border: "1px solid #e8eaef" };
}
