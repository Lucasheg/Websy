import React, { useMemo, useState, useCallback } from "react";
import MakerPanel from "./components/MakerPanel.jsx";
import PreviewShell from "./components/PreviewShell.jsx";
import Modal from "./components/Modal.jsx";
import { performAction } from "./actions/index.js";
import useMakerState from "./state/useMakerState.js";
import generateDSL from "./dsl/generate.js";

/** Tiny Error Boundary so the app never goes “blank white” */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Component error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            A section failed to render
          </div>
          <div>{String(this.state.error?.message || this.state.error)}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Maker config (single source of truth)
  const { maker, setMaker, resetMaker, autoconfigure } = useMakerState();

  // Action modals
  const [modal, setModal] = useState(null);
  const openModal = useCallback((cfg) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);

  // Helpers given to actions
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

  // One click delegate for all [data-action] buttons/links inside preview
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

      try {
        await performAction(action, helpers, payload);
      } catch (err) {
        console.error("Action error:", err);
        alert("Action failed: " + (err?.message || err));
      }
    },
    [helpers]
  );

  // Generate DSL from maker config, never crash the app if something is off
  const [dslError, setDslError] = useState(null);
  const dsl = useMemo(() => {
    try {
      setDslError(null);
      const out = generateDSL(maker);
      if (!out || !Array.isArray(out?.pages)) {
        throw new Error("Bad DSL structure");
      }
      return out;
    } catch (e) {
      console.error("DSL error:", e);
      setDslError(e);
      return null;
    }
  }, [maker]);

  return (
    <div style={{ background: "#f6f7f9", minHeight: "100vh" }}>
      {/* MAKER (contained, scrolls with the page) */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: 16 }}>
        <ErrorBoundary>
          <MakerPanel
            maker={maker}
            setMaker={setMaker}
            resetMaker={resetMaker}
            autoconfigure={autoconfigure}
          />
        </ErrorBoundary>
      </section>

      {/* PREVIEW directly under maker */}
      <section
        style={{ maxWidth: 1240, margin: "0 auto", padding: "0 16px 32px 16px" }}
        onClick={onPreviewClick}
      >
        {dslError ? (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              Preview failed to render
            </div>
            <div>{String(dslError.message || dslError)}</div>
          </div>
        ) : (
          <ErrorBoundary>
            <PreviewShell dsl={dsl} />
          </ErrorBoundary>
        )}
      </section>

      <Modal modal={modal} onClose={closeModal} />
    </div>
  );
}
