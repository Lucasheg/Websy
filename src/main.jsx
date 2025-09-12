import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const el = document.getElementById("root");
if (!el) {
  // Safety net: show a visible error if #root is missing
  const warn = document.createElement("pre");
  warn.textContent = "Mount point #root not found.";
  document.body.appendChild(warn);
} else {
  createRoot(el).render(<App />);
}
