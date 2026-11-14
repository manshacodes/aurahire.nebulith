// Reading resumes from files: plain .txt, or PDF (text pulled out with Mozilla's pdf.js).
// pdf.js is only downloaded the first time someone picks a PDF, so it never slows the site down.
// PDF resumes come with headers, contact details and section titles, so we keep only the
// lines that look like achievements before AuraGPT judges them.

const PDFJS_VERSION = "3.11.174";
const PDFJS = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDF_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
const MAX_PAGES = 3;

let loading = null;
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PDFJS;
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

// Keep lines that look like achievements; drop contact info, links and section headings
const HEADING = /^(education|experience|work experience|projects?|skills|technical skills|achievements|certifications?|summary|objective|profile|contact|interests|hobbies|languages|positions? of responsibility|extra.?curricular|activities|awards|publications|references|coursework)\b/i;
export function cleanResumeLines(lines) {
  const seen = new Set();
  return lines
    .map((l) => l.replace(/^[\s•●▪◦\-*·–—]+/, "").replace(/\s+/g, " ").trim())
    .filter((l) => {
      if (l.length < 12 || l.length > 180) return false;                  // too short to judge, or a paragraph
      if (/@|https?:|www\.|linkedin\.com|github\.com/i.test(l)) return false;   // contact + links
      if (/(\+?\d[\d\s-]{8,}\d)/.test(l)) return false;                   // phone numbers
      if (HEADING.test(l) && l.split(" ").length <= 4) return false;      // section titles
      if (l === l.toUpperCase() && l.split(" ").length <= 4) return false; // ALL CAPS headers
      const key = l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

// Read a resume file → text with one achievement per line. Throws a friendly Error for other types.
export async function readResumeFile(file) {
  if (/\.txt$/i.test(file.name) || file.type === "text/plain") return (await file.text()).trim();
  if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") {
    const lines = cleanResumeLines(await pdfLines(file));
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
