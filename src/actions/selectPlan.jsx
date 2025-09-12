import React from "react";

export default async function selectPlan(helpers, payload) {
  const plan = payload?.plan || "Plan";
  helpers.openModal?.({
    title: `Selected: ${plan}`,
    body: (
      <div>
        <p className="ts-h6">
          We’ll pre-fill your brief with the <b>{plan}</b> tier in your production flow.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <a href="#contact" className="btn sec" data-action="open-contact">
            Continue to contact
          </a>
        </div>
      </div>
    ),
  });
}
