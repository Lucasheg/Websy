import React from 'react';

export default function Modal({ modal, onClose }) {
  if (!modal) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,.35)',
        display:'grid', placeItems:'center', zIndex:1000
      }}
      aria-modal="true" role="dialog"
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        style={{ background:'#fff', borderRadius:16, padding:16, width:'min(560px, 92vw)', boxShadow:'0 12px 40px rgba(0,0,0,.2)' }}
      >
        <div className="ts-h5" style={{fontWeight:700}}>{modal.title || 'Modal'}</div>
        <div style={{marginTop:8}}>{modal.content}</div>
        <div style={{display:'flex', justifyContent:'flex-end', marginTop:16}}>
          <button onClick={onClose} className="btn sec">Close</button>
        </div>
      </div>
    </div>
  );
}
