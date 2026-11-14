// Switching "vibes" (themes): every colour and font reads from CSS variables in themes.css,
// so changing data-theme on <html> restyles the whole app instantly.
import * as S from "./state.js";

export function applyTheme(id) {
  document.documentElement.dataset.theme = id;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
  meta.content = getComputedStyle(document.documentElement).getPropertyValue("--meta").trim();
}

// Apply + remember (used by the topbar vibe sheet and the landing page vibe cards)
export function setTheme(id) {
  S.set({ theme: id });
  applyTheme(id);
}
