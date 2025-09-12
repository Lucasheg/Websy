import React from "react";

export default async function bookCall(helpers, payload) {
  const { openModal } = helpers;

  openModal({
    title: "Book a call",
    body: (
      <div>
        <p className="ts-h6">Pick a time and we’ll confirm by email.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <a
            href="https://cal.com/your-handle" // <- swap to your link
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            Open calendar
          </a>
          <a href="#contact" className="btn sec" data-action="open-contact">
            Or write to us
          </a>
        </div>
      </div>
    ),
  });
}
