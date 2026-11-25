// Smoke test: opens the real site in headless Chrome and clicks through the main flow.
// Fails if any step breaks or the page throws an error.
// Run: python3 -m http.server 8000   then   node tests/smoke.mjs   (BASE=http://... to point elsewhere)
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");   // require() also finds a global install

const BASE = process.env.BASE || "http://localhost:8000/";
const errors = [];
const browser = await chromium.launch();

async function check(name, viewport, steps) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`${name}: ${m.text()}`); });
  try {
    await steps(page);
    console.log(`ok - ${name}`);
  } catch (e) {
    errors.push(`${name}: ${e.message.split("\n")[0]}`);
    console.log(`not ok - ${name}`);
  }
  await page.close();
}

// skip the fake LinkedIn intro if it shows
const open = async (page, hash = "") => {
  await page.goto(BASE + hash);
  const skip = page.locator(".intro-skip");
  if (await skip.isVisible({ timeout: 3000 }).catch(() => false)) await skip.click();
};

await check("landing loads, enter the grind", { width: 1440, height: 900 }, async (page) => {
  await open(page);
  await page.locator("#ch-score").waitFor({ state: "attached" });
  await page.click("#start");                 // the hero button takes you to the upload screen
  await page.waitForURL(/#\/upload/);
});

await check("upload → scan → score → LinkedIn-ify", { width: 390, height: 844 }, async (page) => {
  await open(page, "#/upload");
  await page.fill("#first", "Test");
  await page.click('.persona[data-id="monk"]');
  await page.click("#scan");
  await page.waitForURL(/#\/scan/);
  await page.click("#skip");
  await page.waitForURL(/#\/score/, { timeout: 15000 });
  await page.locator("#rank").waitFor();
  await page.click("#linkedify");
  await page.locator(".li-post").waitFor();
});

await check("boss fight starts", { width: 1440, height: 900 }, async (page) => {
  await open(page, "#/boss/ohio");
  await page.locator("#bossHp").waitFor({ state: "attached" });
});

await check("unknown link shows the 404", { width: 390, height: 844 }, async (page) => {
  await open(page, "#/this-does-not-exist");
  await page.locator(".not-found").waitFor();
});

await check("privacy page", { width: 390, height: 844 }, async (page) => {
  await open(page, "#/privacy");
  await page.locator(".privacy-list li").first().waitFor();
});

await browser.close();
if (errors.length) {
  console.error("\nsmoke test failed:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("\nall smoke checks passed");
