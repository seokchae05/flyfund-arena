import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getMarketData, updateMarketData } from "./lib/market.mjs";
import { applyMaleCnsLatest, readMaleCnsLatest, runMaleCnsLatest } from "./lib/malecns.mjs";
import { runSimulation } from "./lib/simulation.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, "public");
const SHARED = path.join(ROOT, "lib");
const BROWSER_MODULES = new Set(["config.mjs", "random.mjs", "fly-proxy.mjs", "simulation.mjs"]);
const PORT = Number(process.env.PORT || 4173);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

async function refreshAll() {
  const market = await updateMarketData();
  let neural = { available: false };
  try {
    neural = await runMaleCnsLatest();
  } catch (error) {
    neural = { available: false, reason: error.message };
  }
  return { market, neural };
}

function json(response, status, value) {
  response.writeHead(status, {
    "Content-Type": MIME[".json"],
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(value));
}

async function staticFile(requestPath, response) {
  if (requestPath.startsWith("/shared/")) {
    const filename = requestPath.slice("/shared/".length);
    if (!BROWSER_MODULES.has(filename)) return json(response, 404, { error: "Not found" });
    try {
      const body = await fs.readFile(path.join(SHARED, filename));
      response.writeHead(200, { "Content-Type": MIME[".js"] });
      response.end(body);
    } catch {
      json(response, 404, { error: "Not found" });
    }
    return;
  }
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const target = path.resolve(PUBLIC, `.${normalized}`);
  if (!target.startsWith(PUBLIC)) return json(response, 403, { error: "Forbidden" });
  try {
    const body = await fs.readFile(target);
    response.writeHead(200, { "Content-Type": MIME[path.extname(target)] || "application/octet-stream" });
    response.end(body);
  } catch {
    json(response, 404, { error: "Not found" });
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  try {
    if (url.pathname === "/api/health") {
      const actual = await readMaleCnsLatest();
      return json(response, 200, { ok: true, mode: "paper", engine: actual?.engine?.id || "fly-proxy-v1" });
    }
    if (url.pathname === "/api/dashboard" && request.method === "GET") {
      const seed = Math.max(1, Math.min(999999, Number(url.searchParams.get("seed") || 42)));
      const market = await getMarketData({ allowUpdate: false });
      const simulation = runSimulation(market, seed);
      return json(response, 200, applyMaleCnsLatest(simulation, await readMaleCnsLatest()));
    }
    if (url.pathname === "/api/update" && request.method === "POST") {
      const { market, neural } = await refreshAll();
      return json(response, 200, {
        ok: true,
        source: market.source,
        generatedAt: market.generatedAt,
        warning: market.warning,
        neural
      });
    }
    return staticFile(url.pathname, response);
  } catch (error) {
    console.error(error);
    return json(response, 500, { error: error.message });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`FlyFund Arena: http://127.0.0.1:${PORT}`);
  refreshAll().catch((error) => console.warn(`초기 업데이트 실패: ${error.message}`));
});

const refreshTimer = setInterval(() => {
  refreshAll().catch((error) => console.warn(`예약 업데이트 실패: ${error.message}`));
}, 6 * 60 * 60 * 1000);
refreshTimer.unref();
