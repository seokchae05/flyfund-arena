import test from "node:test";
import assert from "node:assert/strict";
import { applyMaleCnsLatest } from "../lib/malecns.mjs";

test("actual MaleCNS decisions replace only the matching latest trace point", () => {
  const simulation = {
    engine: { id: "proxy" },
    sleeves: {
      NVDA: { trace: [
        { date: "2026-09-16", action: "HOLD", votes: [] },
        { date: "2026-09-17", action: "SELL", votes: [] }
      ] }
    }
  };
  const actual = {
    generatedAt: "2026-09-18T00:00:00Z",
    engine: { id: "malecns", actualConnectome: true },
    totalComputeSeconds: 2,
    decisions: {
      NVDA: { date: "2026-09-17", action: "BUY", votes: [{ fly: 1, action: "BUY" }] }
    }
  };
  const result = applyMaleCnsLatest(simulation, actual);
  assert.equal(result.sleeves.NVDA.trace[0].action, "HOLD");
  assert.equal(result.sleeves.NVDA.trace[1].action, "BUY");
  assert.equal(result.sleeves.NVDA.trace[1].engine, "malecns");
  assert.equal(result.engine.actualConnectome, true);
});
