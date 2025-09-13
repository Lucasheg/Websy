export default function Modal({ modal, onClose }) {
  if (!modal) return null;
  return (
    <div style={backdrop()} onClick={onClose}>
      <div style={sheet()} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>{modal.title || "Modal"}</div>
          <button onClick={onClose} style={btn()}>Close</button>
        </div>
        <div style={{ marginTop: 12 }}>{modal.body || "…"}</div>
      </div>
    </div>
  );
}
function backdrop(){return{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"grid",placeItems:"center",zIndex:50}}
function sheet(){return{background:"#fff",border:"1px solid #e8eaef",borderRadius:14,padding:16,width:"min(560px,90vw)"}}
function btn(){return{padding:"6px 12px",border:"1px solid #e8eaef",borderRadius:999,background:"#fff",cursor:"pointer"}}
