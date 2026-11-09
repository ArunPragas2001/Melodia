const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const root = path.resolve(process.env.MELODIA_EXPORT_DIR || "dist");
assert(
  fs.existsSync(path.join(root, "index.html")),
  "Export web first (expo export --platform web)",
);
const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};
const server = http.createServer((req, res) => {
  const file = path.resolve(
    root,
    "." + new URL(req.url, "http://localhost").pathname,
  );
  if (!file.startsWith(root + path.sep) && file !== root) {
    res.writeHead(403).end();
    return;
  }
  const target =
    fs.existsSync(file) && fs.statSync(file).isFile()
      ? file
      : path.join(root, "index.html");
  res.setHeader(
    "Content-Type",
    mime[path.extname(target)] || "application/octet-stream",
  );
  fs.createReadStream(target).pipe(res);
});
(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({
      executablePath:
        process.env.CHROMIUM_PATH ||
        (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    const expectText = (text) =>
      page.getByText(text, { exact: true }).filter({ visible: true }).waitFor();
    await page.goto(base);
    await expectText("Discover your sound.");
    await page
      .getByRole("button", { name: "Browse string instruments", exact: true })
      .click();
    await expectText("3 instruments to discover");
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expectText("12 instruments to discover");
    await page.getByTestId("instrument-list").getByText("Guitar", { exact: true }).waitFor();
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('[data-testid="instrument-list"] img'));
      return (
        images.length >= 12 &&
        images.every((image) => image.complete && image.naturalWidth > 0)
      );
    });
    for (const family of ["Strings", "Wind", "Percussion", "Keyboard"]) {
      await page.goto(base + "/categories");
      await expectText("Every sound has a family.");
      await page
        .getByRole("button", { name: family + " →", exact: true })
        .click();
      await expectText("3 instruments to discover");
      await page.reload();
      await expectText("3 instruments to discover");
    }
    await page.goto(base + "/explore?family=unknown");
    await expectText("12 instruments to discover");
    await page.getByRole("button", { name: "Wind", exact: true }).click();
    await expectText("3 instruments to discover");
    await page.getByText("Show all families →", { exact: true }).click();
    await expectText("12 instruments to discover");
    for (const width of [320, 390, 820]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ["/", "/explore", "/categories"]) {
        await page.goto(base + route);
        await expectText(
          route === "/"
            ? "Discover your sound."
            : route === "/explore"
              ? "12 instruments to discover"
              : "Every sound has a family.",
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          route + " must not overflow at " + width + "px",
        );
      }
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: Home, Explore, Categories, four family filters, reloads, all 12 images, unknown families and three viewport widths; no page errors.",
    );
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
