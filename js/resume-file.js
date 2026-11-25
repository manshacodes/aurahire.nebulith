// Reading resumes from files: plain .txt, or PDF (text pulled out with Mozilla's pdf.js).
// pdf.js is only downloaded the first time someone picks a PDF, so it never slows the site down.
// PDF resumes come with headers, contact details, section titles and wrapped lines, so
// tidyLines (in aura-engine.js) cleans them up before AuraGPT judges them.

import { tidyLines } from "./aura-engine.js";

const PDFJS_VERSION = "3.11.174";
const PDFJS = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDF_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
// Subresource integrity: the browser refuses pdf.min.js if cdnjs ever serves a different file.
// (This is cdnjs's own published sha512 for 3.11.174. Web workers can't take an integrity check, so the worker can't.)
const PDFJS_SRI = "sha512-q+4liFwdPC/bNdhUpZx6aXDx/h77yEQtn4I1slHydcbZK34nLaR3cAeYSJshoxIOq3mjEf7xJE8YWIUHMn+oCQ==";
const MAX_PAGES = 3;

let loading = null;
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PDFJS;
    s.integrity = PDFJS_SRI;
    s.crossOrigin = "anonymous";   // needed for the integrity check on another domain
    s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER; resolve(window.pdfjsLib); };
    s.onerror = () => { loading = null; reject(new Error("pdf.js didn't load")); };
    document.head.appendChild(s);
  });
  return loading;
}

// PDF → lines of text. pdf.js gives words with positions, so we group words on the same row.
async function pdfLines(file) {
  const lib = await loadPdfJs();
  const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  const lines = [];
  for (let n = 1; n <= Math.min(doc.numPages, MAX_PAGES); n++) {
    const content = await (await doc.getPage(n)).getTextContent();
    const rows = new Map();   // y position -> words on that row
    for (const item of content.items) {
      if (!item.str.trim()) continue;
      const y = Math.round(item.transform[5] / 3) * 3;   // words a few px apart count as one row
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y).push(item);
    }
    [...rows.entries()]
      .sort((a, b) => b[0] - a[0])                        // top of the page first
      .forEach(([, items]) => lines.push(items.sort((a, b) => a.transform[4] - b.transform[4]).map((i) => i.str).join(" ")));
  }
  return lines;
}

// Read a resume file → text with one achievement per line. Throws a friendly Error for other types.
export async function readResumeFile(file) {
  if (/\.txt$/i.test(file.name) || file.type === "text/plain") return (await file.text()).trim();
  if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") {
    const lines = tidyLines(await pdfLines(file));
    if (!lines.length) throw new Error("couldn't find any text in that PDF (is it a scan?). paste it instead.");
    return lines.join("\n");
  }
  throw new Error("only .pdf and .txt files, twin.");
}

// Text boxes that grow with their content (up to ~60% of the screen, then they scroll inside)
export function autoGrow(textarea) {
  const fit = () => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight + 2, innerHeight * 0.6)}px`;
  };
  textarea.addEventListener("input", fit);
  fit();
  return fit;   // call it after setting .value from code
}
