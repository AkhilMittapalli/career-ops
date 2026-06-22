// Temporary JD extractor using Playwright (used for SPA career pages WebFetch can't read).
// Usage: node extract-jd.mjs <url>
import { chromium } from 'playwright';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node extract-jd.mjs <url>');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
});
const page = await ctx.newPage();
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
} catch (e) {
  console.error('navigation:', e.message);
}
await page.waitForTimeout(3000);

const title = await page.title();
const finalUrl = page.url();
const text = await page.evaluate(() => document.body.innerText);
const applyVisible = await page.evaluate(() => {
  const labels = ['apply', 'apply now', 'apply online'];
  const els = Array.from(document.querySelectorAll('a, button'));
  return els.some(e => labels.some(l => (e.innerText || '').trim().toLowerCase().includes(l)));
});

console.log('===TITLE===');
console.log(title);
console.log('===FINAL_URL===');
console.log(finalUrl);
console.log('===APPLY_BUTTON===');
console.log(applyVisible);
console.log('===BODY_TEXT===');
console.log(text);

await browser.close();
