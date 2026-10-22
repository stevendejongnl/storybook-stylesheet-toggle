// Smoke test: serve storybook-static, open the toolbar popover, pick a
// stylesheet and check that the preview iframe gets the <link>.
// Usage: node scripts/smoke-test.mjs [dir]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const root = process.argv[2] || "storybook-static";
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await readFile(join(root, path.endsWith("/") ? `${path}index.html` : path));
    res.writeHead(200, { "content-type": types[extname(path)] || "text/html" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}/?path=/story/example-button--primary`;

const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto(url);
  // Storybook 10.1+ renders a Button with an aria-label, older versions an IconButton with a title
  const toggle = page.locator('[aria-label="Toggle stylesheet"], button[title="Toggle Stylesheet"]').first();
  await toggle.click({ timeout: 30_000 });

  const option = page.getByText("second-custom-theme", { exact: true });
  await option.waitFor({ timeout: 10_000 });
  await option.click();

  // Selecting reloads the page; wait for the decorator to inject the stylesheet
  const href = await page
    .frameLocator("#storybook-preview-iframe")
    .locator("#stylesheetToggle")
    .getAttribute("href", { timeout: 30_000 });

  if (href !== "https://second.com/custom-theme.css") {
    throw new Error(`Unexpected stylesheet href: ${href}`);
  }
  if (errors.length) {
    throw new Error(`Page errors:\n${errors.join("\n")}`);
  }
  console.log("Smoke test passed");
} finally {
  await browser.close();
  server.close();
}
