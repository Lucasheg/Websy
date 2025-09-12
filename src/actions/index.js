// Lazy-load actions based on a name. Each action is its own file.
export async function performAction(name, helpers, payload = {}) {
  const registry = {
    'book-call':      () => import('./bookCall.js'),
    'open-contact':   () => import('./openContact.js'),
    'select-plan':    () => import('./selectPlan.js'),
    // add more: 'open-scheduler', 'toggle-anim', 'play-hero', etc.
  };
  const loader = registry[name];
  if (!loader) { console.warn('[actions] Unknown action:', name); return; }
  const mod = await loader();
  if (typeof mod.default === 'function') return mod.default(helpers, payload);
}
