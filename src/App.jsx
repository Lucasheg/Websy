import React, { useMemo, useState, useCallback } from "react";
import MakerPanel from "./components/MakerPanel.jsx";
import PreviewShell from "./components/PreviewShell.jsx";
import Modal from "./components/Modal.jsx";
import { performAction } from "./actions/index.js";
import useMakerState from "./state/useMakerState.js";
import generateDSL from "./dsl/generate.js";

export default function App() {
  const { maker, setMaker, resetMaker, autoconfigure } = useMakerState();

  const [modal, setModal] = useState(null);
  const openModal = useCallback((cfg) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);

  const helpers = {
    openModal,
    closeModal,
    scrollTo: (id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    navigate: (hash) => {
      window.location.hash = hash;
    },
    toast: (msg) => alert(msg),
  };

  const onPreviewClick = useCallback(
    async (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      e.preventDefault();
      const action = target.getAttribute("data-action");
      const payload = {};
      for (const { name, value } of Array.from(target.attributes)) {
        if (name.startsWith("data-") && name !== "data-action") {
          const key = name
            .replace(/^data-/, "")
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          payload[key] = value;
        }
      }
      await performAction(action, helpers, payload);
    },
    [helpers]
  );

  const dsl = useMemo(() => generateDSL(maker), [maker]);

  return (
    <div style={{ background: "#f6f7f9", minHeight: "100vh" }}>
      {/* Maker — full width card at top */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: 16,
          background: "#f6f7f9",
        }}
      >
        <MakerPanel
          maker={maker}
          setMaker={setMaker}
          resetMaker={resetMaker}
          autoconfigure={autoconfigure}
        />
      </section>

      {/* Preview */}
      <section
        style={{ maxWidth: 1240, margin: "0 auto", padding: "0 16px 32px" }}
        onClick={onPreviewClick}
      >
        <PreviewShell dsl={dsl} />
      </section>

      <Modal modal={modal} onClose={closeModal} />
    </div>
  );
}
