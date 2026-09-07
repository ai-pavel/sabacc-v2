// =============================================================================
// Sabacc Tournament — i18n loader
//
// Provides:
//   window.i18n.register(code, strings)
//       Register a locale's string table. Code is e.g. "en", "ru".
//   window.i18n.list()
//       Returns [{ code, label }, ...] in registration order.
//   window.i18n.set(code)
//       Switches the active locale, updates window.STR, and re-applies the
//       DOM (elements with [data-i18n] / [data-i18n-ph] attributes). Also
//       re-renders the current game log/toasts state is left to game.js.
//   window.i18n.get(code)
//       Returns the raw string table for a code (or the active one).
//   window.STR
//       Active locale's string table (a live reference kept up to date by
//       i18n.set). Game logic reads STR.* — never a cached copy.
//
// Locale files (en.js, ru.js, etc.) call window.i18n.register("xx", {...}).
// =============================================================================

;(function (global) {
  const registry = new Map();
  const order = [];
  let activeCode = "EN";

  // Shallow-merge a locale's strings over the active one. We merge one level
  // deep (top-level groups like `log`, `toast`, `alt` are replaced wholesale
  // if present in the locale, otherwise kept from the previous table). Locale
  // files are expected to be complete, so in practice this is a full replace.
  // `__label` is preserved (it identifies the locale, not the active state).
  const activate = (code) => {
    if (!registry.has(code)) return false;
    activeCode = code;
    const tbl = registry.get(code);
    for (const k of Object.keys(global.STR)) {
      if (k !== "__label") delete global.STR[k];
    }
    Object.assign(global.STR, tbl);
    global.STR.__label = tbl.__label;
    return true;
  };

  global.i18n = {
    register(code, strings, label) {
      // `label` may be passed as a 3rd arg, otherwise read from strings.__label,
      // otherwise fall back to the code itself.
      strings.__label = label || strings.__label || code;
      registry.set(code, strings);
      if (!order.includes(code)) order.push(code);
      if (activeCode === code) activate(code);
      return strings;
    },
    list() {
      return order.map((code) => ({ code, label: registry.get(code).__label }));
    },
    set(code) {
      if (!activate(code)) return false;
      // Re-apply DOM strings if we're in a browser.
      if (typeof document !== "undefined") i18n.apply();
      return true;
    },
    get(code) {
      return registry.get(code || activeCode);
    },
    active() {
      return activeCode;
    },
    apply() {
      if (typeof document === "undefined") return;
      // [data-i18n] sets element text content.
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const val = resolve(global.STR, key);
        if (val != null) el.textContent = val;
      });
      // [data-i18n-ph] sets placeholder.
      document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
        const key = el.getAttribute("data-i18n-ph");
        const val = resolve(global.STR, key);
        if (val != null) el.setAttribute("placeholder", val);
      });
    },
  };

  // Resolve a dotted path like "log.welcome" against an object.
  const resolve = (obj, path) => {
    let cur = obj;
    for (const part of path.split(".")) {
      if (cur == null) return undefined;
      cur = cur[part];
    }
    return cur;
  };

  // Initialize the shared STR object. game.js reads this same reference.
  global.STR = global.STR || {};
})(typeof window !== "undefined" ? window : globalThis);