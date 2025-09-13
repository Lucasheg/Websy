export async function performAction(action, helpers, payload) {
  switch (action) {
    case "open-contact":
      helpers.scrollTo("contact");
      break;
    case "book-call":
      helpers.openModal({
        title: "Book a call",
        body: "Placeholder. Later: embed your scheduler here.",
      });
      break;
    default:
      console.warn("Unknown action:", action, payload);
  }
}
