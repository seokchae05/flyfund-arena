import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BROWSER_MODULES = ["config.mjs", "random.mjs", "fly-proxy.mjs", "simulation.mjs"];

await fs.rm(DIST, { recursive: true, force: true });
await fs.cp(path.join(ROOT, "public"), DIST, { recursive: true });
await fs.mkdir(path.join(DIST, "shared"), { recursive: true });
await fs.mkdir(path.join(DIST, "data"), { recursive: true });

await Promise.all(BROWSER_MODULES.map((filename) =>
  fs.copyFile(path.join(ROOT, "lib", filename), path.join(DIST, "shared", filename))
));
await Promise.all(["market-cache.json", "malecns-latest.json"].map((filename) =>
  fs.copyFile(path.join(ROOT, "data", filename), path.join(DIST, "data", filename))
));

const siteUrl = String(process.env.CF_PAGES_URL || process.env.SITE_URL || "").replace(/\/$/, "");
const indexPath = path.join(DIST, "index.html");
const index = await fs.readFile(indexPath, "utf8");
await fs.writeFile(indexPath, index.replaceAll("__SITE_URL__", siteUrl), "utf8");

await fs.writeFile(path.join(DIST, "_headers"), `
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY

/data/*
  Cache-Control: public, max-age=300, must-revalidate
`, "utf8");

console.log(`Static deployment built at ${DIST}`);
