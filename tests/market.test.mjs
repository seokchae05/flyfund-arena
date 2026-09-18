import test from "node:test";
import assert from "node:assert/strict";
import { demoMarket } from "../lib/market.mjs";

test("demo market contains valid OHLC bars for every configured asset", () => {
  const market = demoMarket();
  assert.equal(Object.keys(market.series).length, 5);
  assert.ok(market.fx.bars.length >= 300);
  for (const series of Object.values(market.series)) {
    assert.ok(series.bars.length >= 300);
    for (const bar of series.bars.slice(0, 10)) {
      assert.ok(bar.high >= Math.max(bar.open, bar.close));
      assert.ok(bar.low <= Math.min(bar.open, bar.close));
      assert.ok(Number.isFinite(bar.rawClose));
      assert.match(bar.date, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});
