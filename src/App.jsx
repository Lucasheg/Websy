import React from "react";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        color: "#0f172a",
        background: "#f7f7f7",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,.05)",
          padding: 24,
          maxWidth: 720,
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28 }}>CITEKS Website Maker</h1>
        <p style={{ marginTop: 8, color: "#475569", fontSize: 16 }}>
          If you see this, React mounted correctly. 🎉
        </p>
      </div>
    </div>
  );
}
