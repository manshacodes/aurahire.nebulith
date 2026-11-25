// Tiny hash router: "#/job/ohio" -> the job screen with params { id: "ohio" }.
// Works on any static host (GitHub Pages, Netlify, Vercel) with no server config.

const routes = [];
let cleanup = null;
let fallback = null;   // the 404 screen, for links that match no route

export const notFound = (screen) => { fallback = screen; };

export function route(pattern, screen) {
  const keys = [];
  const regex = new RegExp(
    "^" + pattern.replace(/:(\w+)/g, (_, key) => { keys.push(key); return "([^/]+)"; }) + "$"
  );
  routes.push({ regex, keys, screen });
}

export const go = (path) => { location.hash = "#" + path; };

export function start(root) {
  const render = () => {
    const path = location.hash.slice(1) || "/";
    const match = routes.find((r) => r.regex.test(path)) || (fallback ? { regex: /.*/, keys: [], screen: fallback } : routes[0]);
    const values = path.match(match.regex) || [];
    const params = Object.fromEntries(match.keys.map((k, i) => [k, decodeURIComponent(values[i + 1] || "")]));

    if (typeof cleanup === "function") cleanup();   // stop timers from the old screen
    root.innerHTML = "";
    document.body.dataset.route = path.split("/")[1] || "home";
    cleanup = match.screen(root, params) || null;
    window.scrollTo({ top: 0 });
  };
  addEventListener("hashchange", render);
  render();
}
