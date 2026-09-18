import test from "node:test";
import assert from "node:assert/strict";
import { demoMarket } from "../lib/market.mjs";
import { marketFeatures } from "../lib/fly-proxy.mjs";
import { runSimulation } from "../lib/simulation.mjs";

test("market features use only data through the selected index", () => {
  const market = demoMarket();
  const bars = market.series.NVDA.bars;
  const before = marketFeatures(bars, 100);
  bars[101].close *= 100;
  bars[101].adjustedClose *= 100;
  const after = marketFeatures(bars, 100);
  assert.deepEqual(after, before);
});

test("simulation is deterministic for a fixed seed", () => {
  const market = demoMarket();
  const a = runSimulation(market, 77);
  const b = runSimulation(market, 77);
  assert.deepEqual(a.curves, b.curves);
  assert.deepEqual(a.flyLeague.curves, b.flyLeague.curves);
  assert.deepEqual(a.sleeves.NVDA.trace.at(-1).votes, b.sleeves.NVDA.trace.at(-1).votes);
});

test("simulation exposes paper-only settings and all five assets", () => {
  const result = runSimulation(demoMarket(), 42);
  assert.equal(result.engine.actualConnectome, false);
  assert.equal(result.settings.initialCash, 10_000);
  assert.equal(result.settings.flyCount, 4);
  assert.deepEqual(result.symbols.map((item) => item.symbol), ["NVDA", "000660.KS", "AAPL", "MSFT", "AMZN"]);
  assert.ok(result.curves.fly.length > 200);
  assert.ok(Number.isFinite(result.metrics.fly.returnPct));
  assert.ok(result.walkForward.flyRisk.windows > 0);
  assert.ok(Number.isFinite(result.walkForward.flyRisk.medianReturnPct));
  assert.equal(result.sleeves.NVDA.trace.at(-1).votes.length, 4);
  for (const vote of result.sleeves.NVDA.trace.at(-2).votes) {
    for (const field of ["buyDrive", "sellDrive", "memorySignal", "memoryMagnitude", "memoryChange"]) {
      assert.ok(Number.isFinite(vote[field]), `${field} should expose a finite proxy decision value`);
    }
  }
  assert.deepEqual(Object.keys(result.flyLeague.curves), ["fly1", "fly2", "fly3", "fly4"]);
  assert.equal(result.flyLeague.profiles[3].viewDays, 130);
  for (const sleeve of Object.values(result.sleeves)) {
    const holding = sleeve.trace.at(-1);
    assert.ok(Number.isFinite(holding.riskShares));
    assert.ok(Number.isFinite(holding.riskCash));
    assert.ok(Number.isFinite(holding.riskStockValue));
    assert.ok(Number.isFinite(holding.riskActualExposure));
    assert.ok(holding.riskActualExposure >= 0 && holding.riskActualExposure <= 1);
    assert.ok(Math.abs(holding.riskCash + holding.riskStockValue - holding.riskEquity) < 1e-8);
  }
});

test("portfolio totals carry each sleeve forward across different market calendars", () => {
  const result = runSimulation(demoMarket(), 42);
  const pureTotal = Object.values(result.sleeves).reduce((sum, sleeve) => sum + sleeve.trace.at(-1).equity, 0);
  const riskTotal = Object.values(result.sleeves).reduce((sum, sleeve) => sum + sleeve.trace.at(-1).riskEquity, 0);
  assert.ok(Math.abs(result.metrics.fly.value - pureTotal) < 1e-8);
  assert.ok(Math.abs(result.metrics.flyRisk.value - riskTotal) < 1e-8);
});

test("fly strategies avoid all-in/all-out and Fly+Risk uses ten exposure levels", () => {
  const result = runSimulation(demoMarket(), 42);
  const targets = Object.values(result.sleeves).flatMap((sleeve) => sleeve.trace.map((point) => point.riskTarget));
  const allowed = Array.from({ length: 10 }, (_, index) => (index * 10 + 5) / 100);
  assert.ok(targets.every((target) => allowed.includes(target)));
  assert.ok(Object.values(result.sleeves).every((sleeve) =>
    sleeve.trace.every((point) => point.riskTarget > 0 && point.riskTarget < 1 && point.flyTarget > 0 && point.flyTarget < 1)
  ));
  for (const key of ["flyRisk", "fly", "buyHold", "sma", "random"]) {
    assert.ok(result.feesByStrategy[key] > 0);
  }
});
