import bookCall from "./bookCall.jsx";
import openContact from "./openContact.jsx";
import selectPlan from "./selectPlan.jsx";

const registry = {
  "book-call": bookCall,
  "open-contact": openContact,
  "select-plan": selectPlan,
};

export async function performAction(name, helpers, payload) {
  const fn = registry[name];
  if (!fn) {
    helpers.toast?.(`Unknown action: ${name}`);
    return;
  }
  await fn(helpers, payload);
}
