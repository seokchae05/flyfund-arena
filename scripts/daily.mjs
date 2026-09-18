import { updateMarketData } from "../lib/market.mjs";
import { runMaleCnsLatest } from "../lib/malecns.mjs";

try {
  const market = await updateMarketData();
  const neural = await runMaleCnsLatest();
  console.log(JSON.stringify({
    ok: true,
    generatedAt: market.generatedAt,
    marketSource: market.source,
    marketWarning: market.warning,
    maleCns: neural.available,
    neuralReason: neural.reason || null
  }, null, 2));
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}

