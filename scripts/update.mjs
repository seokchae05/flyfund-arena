import { updateMarketData } from "../lib/market.mjs";

try {
  const result = await updateMarketData();
  console.log(JSON.stringify({
    ok: true,
    source: result.source,
    generatedAt: result.generatedAt,
    warning: result.warning
  }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

