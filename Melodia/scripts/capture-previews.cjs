const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(process.env.MELODIA_EXPORT_DIR || "dist");
const output = path.resolve("previews");
assert(fs.existsSync(path.join(root, "index.html")), "Export the web app first");
fs.mkdirSync(output, { recursive: true });

const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

const server = http.createServer((request, response) => {
  const requested = path.resolve(
    root,
    `.${new URL(request.url, "http://localhost").pathname}`,
  );
  const target =
    requested.startsWith(`${root}${path.sep}`) &&
    fs.existsSync(requested) &&
    fs.statSync(requested).isFile()
      ? requested
      : path.join(root, "index.html");
  response.setHeader("Content-Type", types[path.extname(target)] || "application/octet-stream");
  fs.createReadStream(target).pipe(response);
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
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const base = `http://127.0.0.1:${server.address().port}`;

    await page.goto(`${base}/register`);
    await page.getByRole("textbox", { name: "Name" }).fill("Alex Rivera");
    await page.getByRole("textbox", { name: "Email" }).fill("preview@example.com");
    await page.getByLabel("Password", { exact: true }).filter({ visible: true }).fill("musicpass123");
    await page.getByLabel("Confirm password").fill("musicpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByText("Discover your sound.", { exact: true }).waitFor();
    await shot(page, "home.png", true);

    await page.goto(`${base}/explore`);
    await page.getByText("12 instruments to discover", { exact: true }).waitFor();
    await shot(page, "explore.png", true);

    await page.goto(`${base}/details?id=guitar`);
    await page.getByText("How to play", { exact: true }).waitFor();
    await shot(page, "guitar-details.png", true);

    await page.getByRole("button", { name: "Save to favourites" }).click();
    await page.goto(`${base}/favourites`);
    await page.getByText("1 saved instrument", { exact: true }).waitFor();
    await shot(page, "favourites.png", true);

    await page.goto(`${base}/quiz`);
    await page.getByText("Test your knowledge.", { exact: true }).waitFor();
    await shot(page, "quiz.png", true);

    await page.goto(`${base}/profile`);
    await page.getByText("Alex Rivera", { exact: true }).waitFor();
    await shot(page, "profile.png", true);

    await page.getByRole("button", { name: "Sign out" }).click();
    await page.getByText("Sign in to Melodia.", { exact: true }).waitFor();
    await shot(page, "login.png", true);

    await page.goto(`${base}/register`);
    await page.getByText("Create an account.", { exact: true }).waitFor();
    await shot(page, "register.png", true);
    console.log(`Saved previews to ${output}`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function shot(page, name, fullPage) {
  await page.screenshot({ path: path.join(output, name), fullPage });
}
