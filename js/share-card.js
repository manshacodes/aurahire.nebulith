// "Share my aura": draws your score as a 1080×1350 image (Instagram portrait) in the current vibe,
// then opens the phone's share sheet, or downloads it on desktop. Also builds the "beat my aura"
// challenge link, which carries only your name, score, tier and profile colour (never your resume).
import { SHARE_TEXT as T, FACTORS } from "./data.js";
import { signed, toast } from "./fx.js";
import { initials } from "./identity.js";
import { stampFor } from "./aura-engine.js";

const W = 1080, H = 1350, PAD = 72;

// ---------- challenge links: #/vs/<code> ----------
// The code is base64url JSON plus a tiny checksum, so an edited link gets called out as cap.
const check = (s) => ([...s].reduce((h, c) => (h * 33 + c.charCodeAt(0)) | 0, 5381) >>> 0).toString(36).slice(-4);
const toB64 = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64 = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));

export function encodeChallenge({ name, aura, tier, color }) {
  const data = { n: String(name).slice(0, 40), a: Math.round(aura), t: tier, c: color || "lilac" };
  const body = JSON.stringify(data);
  return toB64(JSON.stringify({ ...data, k: check(body) }));
}

// → { name, aura, tier, color, edited } or null if the link is broken
export function decodeChallenge(code) {
  try {
    const { n, a, t, c, k } = JSON.parse(fromB64(code));
    if (typeof n !== "string" || !n.trim() || !Number.isFinite(a) || Math.abs(a) > 99999 || typeof t !== "string") return null;
    const edited = k !== check(JSON.stringify({ n, a, t, c }));
    return { name: n.slice(0, 40), aura: a, tier: t.slice(0, 40), color: c, edited };
  } catch {
    return null;
  }
}

export const challengeLink = (me) => `${location.origin}${location.pathname}#/vs/${encodeChallenge(me)}`;

// ---------- drawing ----------
// Read the current vibe's colours and fonts straight from the CSS variables
function themeTokens() {
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  return {
    bg: v("--bg"), surface: v("--surface-solid"), surface2: v("--surface-2"), ink: v("--ink"), sub: v("--sub"),
    num: v("--num") || v("--ink"), accent: v("--accent"), accentInk: v("--accent-ink"), accent2: v("--accent-2"),
    display: v("--font-display"), body: v("--font-body"), weight: v("--display-weight") || "900",
  };
}

// Sticker colours are fixed (components.css), so read them off a throwaway sticker
function stickerColors(c) {
  const el = document.createElement("span");
  el.className = "stk";
  el.dataset.c = c;
  el.style.cssText = "position:absolute;visibility:hidden";
  document.body.appendChild(el);
  const css = getComputedStyle(el);
  const out = { bg: css.getPropertyValue("--c-bg").trim() || "#CDBEFF", ink: css.getPropertyValue("--c-ink").trim() || "#111" };
  el.remove();
  return out;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Wrap text into at most `max` lines, with "…" if it doesn't fit
function wrap(ctx, text, width, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= width) { line = test; continue; }
    lines.push(line);
    line = word;
    if (lines.length === max) break;
  }
  if (lines.length < max) lines.push(line);
  else {
    let last = lines[max - 1];
    while (ctx.measureText(`${last}…`).width > width && last.length) last = last.slice(0, -1);
    lines[max - 1] = `${last.trimEnd()}…`;
  }
  return lines.filter(Boolean);
}

// A die-cut sticker: coloured pill, white outline, slight rotation
function stickerAt(ctx, text, x, y, { c, size = 40, rot = -3 }) {
  const col = stickerColors(c);
  ctx.save();
  ctx.font = `900 ${size}px Inter, system-ui, sans-serif`;
  const w = ctx.measureText(text).width + size * 1.1, h = size * 1.7;
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.shadowColor = "rgba(0,0,0,0.18)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
  roundRect(ctx, -w / 2 - 8, -h / 2 - 8, w + 16, h + 16, h / 2 + 8);
  ctx.fillStyle = "#fff"; ctx.fill();
  ctx.shadowColor = "transparent";
  roundRect(ctx, -w / 2, -h / 2, w, h, h / 2);
  ctx.fillStyle = col.bg; ctx.fill();
  ctx.fillStyle = col.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, 0, size * 0.05);
  ctx.restore();
  return w;
}

// --num and --bg can be a plain colour or a CSS linear-gradient (wrapped, chrome). Turn it into a canvas fill
// spread over the box (x, y, w, h), following the CSS angle.
function numFill(ctx, value, x, y, w, h) {
  const m = value.match(/linear-gradient\(\s*(-?[\d.]+)deg\s*,(.*)\)/i);   // ignores a trailing "fixed"
  if (!m) return value;
  const stops = [...m[2].matchAll(/(#[0-9a-f]{3,8}|rgba?\([^)]*\))\s*([\d.]+%)?/gi)];
  const rad = ((Number(m[1]) - 90) * Math.PI) / 180;            // CSS 0deg points up; canvas 0 points right
  const cx = x + w / 2, cy = y + h / 2, dx = (Math.cos(rad) * w) / 2, dy = (Math.sin(rad) * h) / 2;
  const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  stops.forEach(([, color, pct], i) => g.addColorStop(pct ? parseFloat(pct) / 100 : i / Math.max(1, stops.length - 1), color));
  return g;
}

function glow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// card = { name, avatar, aura, tier, best, worst, scores }
export async function drawAuraCard(card) {
  await document.fonts?.ready;
  const t = themeTokens();
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // background + two soft glows in the vibe's accent colours
  ctx.fillStyle = numFill(ctx, t.bg, 0, 0, W, H); ctx.fillRect(0, 0, W, H);   // chrome's background is a gradient too
  glow(ctx, W - 120, 160, 620, t.accent);
  glow(ctx, 120, H - 160, 620, t.accent2);
  ctx.textBaseline = "alphabetic";

  // header: wordmark + tagline
  ctx.fillStyle = t.ink;
  ctx.font = `${t.weight} 54px ${t.display}`;
  ctx.fillText("aurahire", PAD, 120);
  ctx.fillStyle = t.sub; ctx.font = `600 26px ${t.body}`; ctx.textAlign = "right";
  ctx.fillText(T.card.tagline, W - PAD, 116);
  ctx.textAlign = "left";

  // you: profile circle + name
  const av = stickerColors(card.avatar?.color || "lilac");
  ctx.beginPath(); ctx.arc(PAD + 56, 236, 56, 0, Math.PI * 2); ctx.fillStyle = av.bg; ctx.fill();
  ctx.fillStyle = av.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = card.avatar?.emoji ? "56px sans-serif" : `900 42px Inter, sans-serif`;
  ctx.fillText(card.avatar?.emoji || initials(card.name), PAD + 56, 240);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = t.ink; ctx.font = `800 44px ${t.body}`;
  ctx.fillText(wrap(ctx, card.name, W - PAD * 2 - 140, 1)[0], PAD + 136, 230);
  ctx.fillStyle = t.sub; ctx.font = `600 26px ${t.body}`;
  ctx.fillText(T.card.judged, PAD + 136, 272);

  // the big number (tight like on the site, shrinks to fit), in the vibe's colour or gradient
  const score = signed(card.aura);
  let size = 230;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "-8px";
  ctx.font = `${t.weight} ${size}px ${t.display}`;
  while (ctx.measureText(score).width > W - PAD * 2 && size > 120) { size -= 10; ctx.font = `${t.weight} ${size}px ${t.display}`; }
  ctx.fillStyle = numFill(ctx, t.num, PAD, 520 - size * 0.75, ctx.measureText(score).width, size * 0.75);
  ctx.fillText(score, PAD - 8, 520);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.fillStyle = t.sub; ctx.font = `600 30px ${t.body}`;
  ctx.fillText(T.card.points, PAD, 612);

  // tier as a sticker
  stickerAt(ctx, card.tier, PAD, 640, { c: "lime", size: 40, rot: -3 });

  // best + worst line, each with its stamp
  const lineBox = (label, line, y) => {
    roundRect(ctx, PAD, y, W - PAD * 2, 132, 28);
    ctx.fillStyle = t.surface; ctx.fill();
    ctx.fillStyle = t.sub; ctx.font = `700 22px ${t.body}`;
    ctx.fillText(`${label} · ${signed(line.points)}`, PAD + 28, y + 40);
    ctx.fillStyle = t.ink; ctx.font = `700 28px ${t.body}`;
    wrap(ctx, `"${line.text}"`, W - PAD * 2 - 230, 2).forEach((l, i) => ctx.fillText(l, PAD + 28, y + 80 + i * 34));
    const [stamp, c] = stampFor(line);
    ctx.font = "900 30px Inter, system-ui, sans-serif";
    const sw = ctx.measureText(stamp).width + 33;
    stickerAt(ctx, stamp, W - PAD - sw - 30, y + 38, { c, size: 30, rot: 8 });
  };
  if (card.best) lineBox(T.card.best, card.best, 762);
  if (card.worst) lineBox(T.card.worst, card.worst, 910);

  // all 6 breakdown meters, 2 columns × 3 rows
  const colW = (W - PAD * 2 - 48) / 2;
  FACTORS.forEach((f, i) => {
    const x = PAD + (i % 2) * (colW + 48), y = 1092 + Math.floor(i / 2) * 62;
    const value = card.scores?.[f.id] ?? 0;
    ctx.fillStyle = t.ink; ctx.font = `800 24px ${t.body}`;
    ctx.fillText(f.label, x, y);
    ctx.textAlign = "right"; ctx.fillText(`${value}/10`, x + colW, y); ctx.textAlign = "left";
    roundRect(ctx, x, y + 12, colW, 14, 7); ctx.fillStyle = t.surface2; ctx.fill();
    if (value) { roundRect(ctx, x, y + 12, Math.max(14, (colW * value) / 10), 14, 7); ctx.fillStyle = t.ink; ctx.fill(); }
  });

  // footer: the dare + where to go
  ctx.fillStyle = t.ink; ctx.font = `900 32px ${t.body}`;
  ctx.fillText(T.card.cta, PAD, H - 50);
  ctx.fillStyle = t.sub; ctx.font = `600 24px ${t.body}`; ctx.textAlign = "right";
  ctx.fillText(location.host || "aurahire-nebulith.vercel.app", W - PAD, H - 52);
  ctx.textAlign = "left";
  return canvas;
}

// ---------- sharing ----------
// Phone: the share sheet with the image + link. Desktop (or no file sharing): download + copy the link.
// Returns true if something was shared or saved.
export async function shareAura(card) {
  const link = challengeLink({ name: card.name, aura: card.aura, tier: card.tier, color: card.avatar?.color });
  const message = T.message(card.name, signed(card.aura), card.tier);
  try {
    const canvas = await drawAuraCard(card);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const file = new File([blob], "my-aura.png", { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: `${message}\n${link}` });
        toast(T.shared);
        return true;
      } catch (err) {
        if (err.name === "AbortError") return false;   // they closed the share sheet: not an error
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my-aura.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    try { await navigator.clipboard.writeText(`${message} ${link}`); } catch { /* clipboard blocked: the image still saved */ }
    toast(T.saved);
    return true;
  } catch {
    toast(T.failed);
    return false;
  }
}
