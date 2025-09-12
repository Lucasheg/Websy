import React from "react";

export default async function openContact(helpers) {
  helpers.scrollTo?.("contact");
  // If you prefer a modal instead, uncomment:
  // helpers.openModal({
  //   title: "Contact",
  //   body: (<div><p className="ts-h6">Scroll to the contact form below.</p></div>)
  // });
}
