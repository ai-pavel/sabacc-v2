// =============================================================================
// Sabacc Tournament — i18n init
//
// Populates the #langSelect dropdown from i18n.list(), applies the saved or
// default locale on page load, and re-applies DOM strings on change. The
// dropdown is wired up on DOMContentLoaded — no game.js changes needed.
//
// This file must load AFTER loader.js + all locale files.
// =============================================================================

;(function (i18n) {
  if (typeof document === "undefined") return;

  const STORAGE_KEY = "sabacc-lang";

  const getInitialLocale = () => {
    const saved = (typeof localStorage !== "undefined")
      && localStorage.getItem(STORAGE_KEY);
    if (saved && i18n.get(saved)) return saved;
    return "EN";
  };

  const populateDropdown = () => {
    const select = document.getElementById("langSelect");
    if (!select) return;
    select.innerHTML = "";
    i18n.list().forEach(({ code, label }) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = label;
      select.appendChild(opt);
    });
    select.value = i18n.active();
    select.addEventListener("change", () => {
      i18n.set(select.value);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, select.value);
      }
    });
  };

  const init = () => {
    i18n.set(getInitialLocale());
    populateDropdown();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window.i18n : undefined);