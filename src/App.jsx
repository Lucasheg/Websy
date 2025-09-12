import React, { useEffect, useMemo, useState } from "react";
import ControlPanel from "./components/ControlPanel.jsx";
import Preview from "./components/Preview.jsx";
import { SAMPLE_BRIEF } from "./lib/schema.js";
import { generateDSL } from "./lib/generator.js";

export default function App(){
  const [brief, setBrief] = useState(SAMPLE_BRIEF);
  const dsl = useMemo(()=> generateDSL(brief), [brief]);

  // Intersection reveal
  useEffect(()=>{
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("visible"); });
    }, {threshold:0.2});
    document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  }, [dsl]);

  return (
    <div className="wrapper stack">
      <header className="panel" style={{padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div className="ts-h5" style={{fontWeight:700}}>CITEKS Website Maker</div>
        <div className="ts-h6" style={{color:"#64748b"}}>Private tool · Live preview below</div>
      </header>

      <section className="panel" style={{padding:"16px"}}>
        <ControlPanel brief={brief} setBrief={setBrief}/>
      </section>

      <section className="stack">
        <Preview dsl={dsl}/>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <button className="btn" onClick={()=>{
            const html = buildExportHTML(dsl);
            const blob = new Blob([html], {type:"text/html"});
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "generated-site.html";
            a.click();
            URL.revokeObjectURL(a.href);
          }}>Export HTML</button>
          <button className="btn ghost" onClick={()=>window.scrollTo({top:0, behavior:"smooth"})}>Back to Controls</button>
        </div>
      </section>
    </div>
  );
}

function buildExportHTML(dsl){
  // Minimal static export. In the future we can inline CSS/JS separately.
  const css = `
    ${document.querySelector("style[data-vite-dev-id]") ? "" : ""}
  `;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${dsl?.meta?.brand?.name || "Site"}</title>
<style>${document.querySelector('style')?.innerText || ""}</style>
</head><body>
<div class="wrapper stack">
${document.getElementById("preview-root")?.innerHTML || ""}
</div>
</body></html>`;
}
