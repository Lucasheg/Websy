import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(err, info){ console.error("Runtime error:", err, info); }

  render(){
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      return (
        <div style={{maxWidth:920,margin:"32px auto",padding:16,background:"#fff",
                     border:"1px solid #e8eaef",borderRadius:12}}>
          <h2 style={{margin:"0 0 8px"}}>Something broke while rendering</h2>
          <div style={{color:"#64748b"}}>This avoids the blank screen so you can see the error.</div>
          <pre style={{whiteSpace:"pre-wrap",marginTop:12}}>{msg}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
