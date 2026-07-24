/**
 * LD Axyum - multipath helpers (Foundry v13/v14 ApplicationV2 + settings)
 */

export const MODULE_ID = 'ld-axyum';

/** List settings stored as Object multipath shape { items: [] } (bare Array breaks multipath). */
export function readListSetting(key, fallback = []) {
  try {
    const v = game.settings.get(MODULE_ID, key);
    if (Array.isArray(v)) return v;
    if (v?.items && Array.isArray(v.items)) return v.items;
    if (v && typeof v === 'object') {
      return Object.values(v).filter((x) => x != null && typeof x === 'object' && !Array.isArray(x));
    }
  } catch {
    /* unregistered or missing */
  }
  return Array.isArray(fallback) ? fallback : [];
}

export async function writeListSetting(key, arr) {
  await game.settings.set(MODULE_ID, key, { items: Array.isArray(arr) ? arr : [] });
}

/** Map settings as { byId: { [id]: value } }. */
export function readMapSetting(key) {
  try {
    const v = game.settings.get(MODULE_ID, key);
    if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
    if (v.byId && typeof v.byId === 'object') return { ...v.byId };
    // legacy: flat object of records
    const out = {};
    for (const [k, val] of Object.entries(v)) {
      if (k === 'byId' || k === 'items') continue;
      if (val && typeof val === 'object') out[k] = val;
    }
    return out;
  } catch {
    return {};
  }
}

export async function writeMapSetting(key, byId) {
  await game.settings.set(MODULE_ID, key, { byId: byId && typeof byId === 'object' ? byId : {} });
}

/**
 * Force-render ApplicationV2 (and legacy) apps reliably.
 */
export async function forceRender(app, options = {}) {
  if (!app) return null;
  try {
    if (typeof app.render === 'function') {
      const result = app.render({ force: true, ...options });
      if (result?.then) await result;
    }
  } catch (err) {
    console.error('LD Axyum | forceRender failed', err);
    throw err;
  }
  // Bring to front after paint
  queueMicrotask(() => {
    try {
      const el = app.element instanceof HTMLElement ? app.element : app.element?.[0];
      if (el) {
        const apps = document.querySelectorAll('.application, .window-app, .app');
        let maxZ = 100;
        apps.forEach((node) => {
          const z = parseInt(window.getComputedStyle(node).zIndex, 10);
          if (Number.isFinite(z) && z > maxZ) maxZ = z;
        });
        el.style.zIndex = String(maxZ + 1);
      }
      app.bringToFront?.();
    } catch {
      /* ignore */
    }
  });
  return app;
}

/** Find an open ApplicationV2 by id. */
export function getOpenApp(id) {
  const instances = foundry.applications?.instances;
  if (instances?.values) {
    for (const app of instances.values()) {
      if (app?.id === id || app?.options?.id === id) return app;
    }
  }
  return Object.values(ui.windows ?? {}).find((w) => w?.id === id) || null;
}
