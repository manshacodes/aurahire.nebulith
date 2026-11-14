// Your identity: the funny surname generator and the profile circle (avatar).
import { esc } from "./fx.js";
import { SURNAMES, DEFAULT_FIRST } from "./data.js";

// "Mansha Mogwani" -> "MM". Ignores separators like "|", "(" and "."
export const initials = (name) =>
  String(name).split(/[\s|(.]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

// Same first name -> same surname every time; `roll` lets you reroll it
const hash = (s) => [...s.toLowerCase()].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;
// (shifted so the default "Aarav" still gets the original "Grindwala")
export const surnameFor = (first, roll = 0) => {
  const n = SURNAMES.length;
  const i = (hash(first.trim()) - hash(DEFAULT_FIRST) + roll) % n;
  return SURNAMES[(i + n) % n];
};

// Keep just a tidy first name: first word, letters only, capitalised
export function cleanFirst(raw) {
  const word = String(raw).trim().split(/\s+/)[0] || "";
  const letters = word.replace(/[^\p{L}'-]/gu, "").slice(0, 16);
  return letters ? letters[0].toUpperCase() + letters.slice(1) : "";
}

// The profile circle: an emoji face if you picked one, otherwise your initials
export function avatarHTML({ name, avatar = {} }, cls = "") {
  const face = avatar.emoji ? `<span class="av-emoji">${avatar.emoji}</span>` : esc(initials(name));
  return `<span class="av ${cls}" data-c="${avatar.color || "lilac"}" aria-hidden="true">${face}</span>`;
}
