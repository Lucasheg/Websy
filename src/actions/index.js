export async function performAction(action, helpers, payload) {
  switch (action) {
    case "open-contact":
      helpers.scrollTo("contact");
      break;
    case "book-call":
      helpers.openModal({
        title: "Book a call",
        body: "A simple placeholder. Later you can embed Calendly/Cal.com here.",
      });
      break;
    default:
      console.warn("Unknown action:", action, payload);
  }
}
