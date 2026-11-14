// Meme stickers: real images in assets/stickers, shown as die-cut cards (white border, tilt).
import { esc } from "./fx.js";
import { MEMES, memeSrc } from "./data.js";

// <img> for a meme sticker. cls picks the size: "meme" (chat), "meme-thumb" (tray), "meme-pick" (picker)
export function memeImg(id, cls = "meme", rot = 0) {
  const m = MEMES[id];
  if (!m) return "";
  return `<img class="${cls}" src="${memeSrc(id)}" alt="${esc(m.alt)}" loading="lazy" style="--rot:${rot}deg" />`;
}

// Spread the items of `b` evenly through `a`: mix([m,m,m,m], [t,t]) -> [m,m,t,m,m,t]
// (used to shuffle text stickers in between the meme stickers)
export function mix(a, b) {
  if (!b.length) return [...a];
  const out = [], every = a.length / b.length;
  let next = 0;
  a.forEach((item, i) => {
    out.push(item);
    while (next < b.length && i + 1 >= (next + 1) * every) out.push(b[next++]);
  });
  return out.concat(b.slice(next));
}

// Mix in groups: `size` items of `a` (e.g. a row of 3 memes), then a few of `b`, repeat.
// `brk` (optional) goes after every group, e.g. a line break so each group gets its own row.
export function mixGroups(a, b, size = 3, brk = "") {
  const groups = [];
  for (let i = 0; i < a.length; i += size) groups.push(a.slice(i, i + size));
  const per = Math.ceil(b.length / groups.length);
  const bGroups = [];
  for (let i = 0; i < b.length; i += per) bGroups.push(b.slice(i, i + per));
  const withBreak = (g) => (g.length && brk ? [...g, brk] : g);
  return groups.flatMap((g, i) => [...withBreak(g), ...withBreak(bGroups[i] || [])])
    .concat(bGroups.slice(groups.length).flat());
}

// Saved personality stickers can be text labels or memes, stored as "img:<id>"
export const isMemePick = (value) => String(value).startsWith("img:");
export const memeIdOf = (value) => String(value).slice(4);
