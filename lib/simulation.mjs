import { SETTINGS, SYMBOLS } from "./config.mjs";
import { FlyProxy, marketFeatures, proxyDisclosure } from "./fly-proxy.mjs";
import { hashText, mulberry32 } from "./random.mjs";

const ACTION_SCORE = { BUY: 1, HOLD: 0, SELL: -1 };
const RISK_BUCKETS = Array.from({ length: 10 }, (_, index) => (index * 10 + 5) / 100);
const DIRECT_TARGET = { BUY: 0.95, HOLD: 0.55, SELL: 0.05 };

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values) {
  const average = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - average) ** 2)));
}

function drawdown(values) {
  let peak = values[0] ?? 1;
  let worst = 0;
  for (const value of values) {
    peak = Math.max(peak, value);
    worst = Math.min(worst, value / peak - 1);
  }
  return worst;
}

function metric(curve) {
  const values = curve.map((point) => point.value);
  const returns = values.slice(1).map((value, index) => value / values[index] - 1);
  const average = mean(returns);
  const variance = returns.reduce((sum, value) => sum + (value - average) ** 2, 0) / Math.max(1, returns.length - 1);
  return {
    value: values.at(-1) ?? SETTINGS.initialCash,
    returnPct: ((values.at(-1) ?? SETTINGS.initialCash) / SETTINGS.initialCash - 1) * 100,
    maxDrawdownPct: drawdown(values) * 100,
    sharpe: variance ? average / Math.sqrt(variance) * Math.sqrt(252) : 0
  };
}

function majority(votes) {
  const score = votes.reduce((sum, vote) => sum + ACTION_SCORE[vote.action], 0);
  return score > 0 ? "BUY" : score < 0 ? "SELL" : "HOLD";
}

function account(initialCash = SETTINGS.sleeveCash) {
  return { cash: initialCash, shares: 0, fees: 0, target: 0 };
}

function equity(portfolio, price) {
  return portfolio.cash + portfolio.shares * price;
}

function rebalance(portfolio, target, price) {
  const boundedTarget = Math.max(0, Math.min(1, target));
  const total = equity(portfolio, price);
  const currentStock = portfolio.shares * price;
  const desiredStock = total * boundedTarget;
  const difference = desiredStock - currentStock;
  let traded = false;

  if (difference > Math.max(0.01, total * 0.002)) {
    const purchase = Math.min(difference, portfolio.cash / (1 + SETTINGS.feeRate));
    if (purchase > 0) {
      const fee = purchase * SETTINGS.feeRate;
      portfolio.cash -= purchase + fee;
      portfolio.shares += purchase / price;
      portfolio.fees += fee;
      traded = true;
    }
  } else if (difference < -Math.max(0.01, total * 0.002)) {
    const sale = Math.min(-difference, currentStock);
    if (sale > 0) {
      const fee = sale * SETTINGS.feeRate;
      portfolio.shares -= sale / price;
      portfolio.cash += sale - fee;
      portfolio.fees += fee;
      traded = true;
    }
  }
  portfolio.target = boundedTarget;
  return traded;
}

function makeFxLookup(fxSeries) {
  const rates = new Map((fxSeries?.bars || []).map((bar) => [bar.date, bar.adjustedClose || bar.close]));
  const dates = [...rates.keys()].sort();
  let cursor = 0;
  let latest = rates.get(dates[0]) || 1_350;
  return (date) => {
    while (cursor < dates.length && dates[cursor] <= date) {
      latest = rates.get(dates[cursor]) || latest;
      cursor += 1;
    }
    return latest;
  };
}

function marketPrice(bar, currency, fxAt) {
  const fx = currency === "KRW" ? fxAt(bar.date) : 1;
  return {
    open: bar.open / fx,
    close: bar.close / fx,
    fx
  };
}

function riskPolicy(series, index, votes, scoreHistory, currentTarget, daysSinceChange) {
  const confidenceScore = mean(votes.map((vote) => ACTION_SCORE[vote.action] * vote.confidence));
  scoreHistory.push(confidenceScore);
  const smoothedScore = mean(scoreHistory.slice(-3));
  const lookback = Math.min(100, index + 1);
  const closes = series.bars.slice(index - lookback + 1, index + 1).map((bar) => bar.adjustedClose);
  const trendAverage = mean(closes);
  const trendPositive = series.bars[index].adjustedClose >= trendAverage;
  const recent = series.bars.slice(Math.max(0, index - 20), index + 1);
  const returns = recent.slice(1).map((bar, offset) => bar.adjustedClose / recent[offset].adjustedClose - 1);
  const annualizedVolatility = standardDeviation(returns) * Math.sqrt(252);

  let rawTarget = SETTINGS.riskBaseExposure + smoothedScore * 0.2;
  if (smoothedScore > 0.15) rawTarget += 0.1;
  if (smoothedScore < -0.15) rawTarget -= 0.15;
  if (!trendPositive) rawTarget -= 0.25;
  if (annualizedVolatility > 0.75) rawTarget *= 0.85;
  else if (annualizedVolatility > 0.55) rawTarget *= 0.92;

  const suggestedTarget = RISK_BUCKETS.reduce((best, value) =>
    Math.abs(value - rawTarget) < Math.abs(best - rawTarget) ? value : best
  );
  const canChange = daysSinceChange >= SETTINGS.riskMinimumRebalanceDays;
  const target = canChange ? suggestedTarget : currentTarget;
  const action = target > currentTarget ? "BUY" : target < currentTarget ? "SELL" : "HOLD";
  return { action, target, confidenceScore, smoothedScore, trendPositive, annualizedVolatility };
}

function simulateSleeve(series, symbol, currency, fxSeries, seed, shuffled = false) {
  const flies = Array.from({ length: SETTINGS.flyCount }, (_, index) =>
    new FlyProxy(seed + index * 9973, symbol, shuffled)
  );
  const random = mulberry32(seed ^ hashText(symbol) ^ 0xa11ce);
  const fxAt = makeFxLookup(fxSeries);
  const pure = account(SETTINGS.sleeveCash);
  pure.target = DIRECT_TARGET.HOLD;
  const flyRisk = account(SETTINGS.sleeveCash);
  flyRisk.target = SETTINGS.riskBaseExposure;
  const individualAccounts = flies.map(() => {
    const portfolio = account(SETTINGS.sleeveCash);
    portfolio.target = DIRECT_TARGET.HOLD;
    return portfolio;
  });
  const buyHold = account();
  const sma = account();
  const randomPortfolio = account();
  let previousEquity = SETTINGS.sleeveCash;
  let pendingPureTarget = DIRECT_TARGET.HOLD;
  let pendingRiskTarget = SETTINGS.riskBaseExposure;
  let pendingSmaTarget = 0;
  let pendingRandomTarget = 0;
  let pendingIndividualTargets = flies.map(() => DIRECT_TARGET.HOLD);
  let daysSinceRiskChange = SETTINGS.riskMinimumRebalanceDays;
  const scoreHistory = [];
  const trace = [];
  const curves = { flyRisk: [], fly: [], buyHold: [], sma: [], random: [] };
  const individualCurves = flies.map(() => []);

  for (let index = 20; index < series.bars.length; index++) {
    const bar = series.bars[index];
    const prices = marketPrice(bar, currency, fxAt);
    const pureTraded = rebalance(pure, pendingPureTarget, prices.open);
    const riskTraded = rebalance(flyRisk, pendingRiskTarget, prices.open);
    individualAccounts.forEach((portfolio, flyIndex) => rebalance(portfolio, pendingIndividualTargets[flyIndex], prices.open));
    rebalance(buyHold, 1, prices.open);
    rebalance(sma, pendingSmaTarget, prices.open);
    rebalance(randomPortfolio, pendingRandomTarget, prices.open);

    const pureEquity = equity(pure, prices.close);
    const reward = Math.max(-1, Math.min(1, (pureEquity / previousEquity - 1) * 50));
    const features = marketFeatures(series.bars, index);
    const votes = flies.map((fly, flyIndex) => ({ fly: flyIndex + 1, ...fly.step(features, reward) }));
    const action = majority(votes);
    pendingPureTarget = action === "HOLD" ? pure.target : DIRECT_TARGET[action];
    pendingIndividualTargets = votes.map((vote, flyIndex) => vote.action === "HOLD" ? individualAccounts[flyIndex].target : DIRECT_TARGET[vote.action]);

    const risk = riskPolicy(series, index, votes, scoreHistory, flyRisk.target, daysSinceRiskChange);
    if (risk.target !== flyRisk.target) daysSinceRiskChange = 0;
    else daysSinceRiskChange += 1;
    pendingRiskTarget = risk.target;

    const closes = series.bars.slice(index - 19, index + 1).map((item) => item.adjustedClose);
    const sma5 = mean(closes.slice(-5));
    const sma20 = mean(closes);
    pendingSmaTarget = sma5 > sma20 ? 1 : 0;
    const randomRoll = random();
    if (randomRoll < 0.08) pendingRandomTarget = 1;
    else if (randomRoll < 0.16) pendingRandomTarget = 0;
    previousEquity = pureEquity;

    const riskStockValue = flyRisk.shares * prices.close;
    const riskClosingEquity = equity(flyRisk, prices.close);

    const point = { date: bar.date };
    curves.flyRisk.push({ ...point, value: equity(flyRisk, prices.close) });
    curves.fly.push({ ...point, value: pureEquity });
    curves.buyHold.push({ ...point, value: equity(buyHold, prices.close) });
    curves.sma.push({ ...point, value: equity(sma, prices.close) });
    curves.random.push({ ...point, value: equity(randomPortfolio, prices.close) });
    individualAccounts.forEach((portfolio, flyIndex) => {
      individualCurves[flyIndex].push({ ...point, value: equity(portfolio, prices.close) });
    });
    trace.push({
      date: bar.date,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      rawClose: bar.rawClose ?? bar.close,
      volume: bar.volume,
      currency,
      fx: prices.fx,
      action,
      executed: pureTraded,
      equity: pureEquity,
      reward,
      features,
      votes,
      flyTarget: pure.target,
      riskAction: risk.action,
      riskTarget: risk.target,
      riskAppliedTarget: flyRisk.target,
      riskExecuted: riskTraded,
      riskEquity: riskClosingEquity,
      riskCash: flyRisk.cash,
      riskShares: flyRisk.shares,
      riskStockValue,
      riskActualExposure: riskClosingEquity ? riskStockValue / riskClosingEquity : 0,
      signalScore: risk.smoothedScore,
      trendPositive: risk.trendPositive,
      annualizedVolatility: risk.annualizedVolatility
    });
  }
  return {
    symbol,
    trace,
    curves,
    individualCurves,
    fees: {
      flyRisk: flyRisk.fees,
      fly: pure.fees,
      buyHold: buyHold.fees,
      sma: sma.fees,
      random: randomPortfolio.fees
    }
  };
}

function combineSeries(sleeves, selectPoints) {
  const allDates = [...new Set(sleeves.flatMap((sleeve) => selectPoints(sleeve).map((point) => point.date)))].sort();
  const lastValues = new Map(sleeves.map((sleeve) => [sleeve.symbol, SETTINGS.sleeveCash]));
  const bySymbol = new Map(sleeves.map((sleeve) => [
    sleeve.symbol,
    new Map(selectPoints(sleeve).map((point) => [point.date, point.value]))
  ]));
  return allDates.map((date) => {
    for (const sleeve of sleeves) {
      const value = bySymbol.get(sleeve.symbol).get(date);
      if (Number.isFinite(value)) lastValues.set(sleeve.symbol, value);
    }
    return { date, value: [...lastValues.values()].reduce((sum, value) => sum + value, 0) };
  });
}

function combineCurves(sleeves, key) {
  return combineSeries(sleeves, (sleeve) => sleeve.curves[key]);
}

function recentMetric(curve, fraction = 0.25) {
  const start = Math.max(0, Math.floor(curve.length * (1 - fraction)));
  const subset = curve.slice(start);
  const initial = subset[0]?.value || SETTINGS.initialCash;
  return metric(subset.map((point) => ({ ...point, value: point.value / initial * SETTINGS.initialCash })));
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : mean(sorted.slice(middle - 1, middle + 1));
}

function walkForwardSummary(curve, window = 252, step = 63) {
  const windows = [];
  for (let start = 0; start + window < curve.length; start += step) {
    const subset = curve.slice(start, start + window + 1);
    const initial = subset[0].value;
    windows.push({
      start: subset[0].date,
      end: subset.at(-1).date,
      ...metric(subset.map((point) => ({ ...point, value: point.value / initial * SETTINGS.initialCash })))
    });
  }
  return {
    windowSessions: window,
    stepSessions: step,
    windows: windows.length,
    profitableWindows: windows.filter((item) => item.returnPct > 0).length,
    medianReturnPct: median(windows.map((item) => item.returnPct)),
    worstDrawdownPct: Math.min(...windows.map((item) => item.maxDrawdownPct)),
    medianSharpe: median(windows.map((item) => item.sharpe))
  };
}

export function runSimulation(market, seed = 42) {
  const sleeves = SYMBOLS.map(({ symbol, currency }) =>
    simulateSleeve(market.series[symbol], symbol, currency, market.fx, seed)
  );
  const shuffledSleeves = SYMBOLS.map(({ symbol, currency }) =>
    simulateSleeve(market.series[symbol], symbol, currency, market.fx, seed, true)
  );
  const curves = {
    flyRisk: combineCurves(sleeves, "flyRisk"),
    fly: combineCurves(sleeves, "fly"),
    shuffled: combineCurves(shuffledSleeves, "fly"),
    buyHold: combineCurves(sleeves, "buyHold"),
    sma: combineCurves(sleeves, "sma"),
    random: combineCurves(sleeves, "random")
  };
  const flyLeagueCurves = Object.fromEntries(Array.from({ length: SETTINGS.flyCount }, (_, index) => [
    `fly${index + 1}`,
    combineSeries(sleeves, (sleeve) => sleeve.individualCurves[index])
  ]));
  const feesByStrategy = Object.fromEntries(
    ["flyRisk", "fly", "buyHold", "sma", "random"].map((key) => [
      key,
      sleeves.reduce((sum, sleeve) => sum + sleeve.fees[key], 0)
    ])
  );
  return {
    generatedAt: new Date().toISOString(),
    seed,
    engine: proxyDisclosure,
    market: {
      source: market.source,
      generatedAt: market.generatedAt,
      stale: market.stale,
      warning: market.warning,
      historyRange: market.historyRange || SETTINGS.historyRange,
      fxAdjusted: true
    },
    methodology: {
      primary: "flyRisk",
      accounting: "carry-forward-adjusted-ohlc-fx-fees",
      execution: "next-open",
      riskPolicy: "three-day consensus, trend state, volatility scaling, ten 5%-95% exposure levels",
      validationWindow: "rolling-252-sessions-stepping-63-sessions"
    },
    settings: SETTINGS,
    symbols: SYMBOLS,
    curves,
    metrics: Object.fromEntries(Object.entries(curves).map(([key, curve]) => [key, metric(curve)])),
    recentMetrics: Object.fromEntries(Object.entries(curves).map(([key, curve]) => [key, recentMetric(curve)])),
    walkForward: Object.fromEntries(Object.entries(curves).map(([key, curve]) => [key, walkForwardSummary(curve)])),
    flyLeague: {
      curves: flyLeagueCurves,
      metrics: Object.fromEntries(Object.entries(flyLeagueCurves).map(([key, curve]) => [key, metric(curve)])),
      profiles: SETTINGS.flyViewDays.map((viewDays, index) => ({ fly: index + 1, viewDays }))
    },
    feesByStrategy,
    totalFees: feesByStrategy.flyRisk,
    sleeves: Object.fromEntries(sleeves.map((sleeve) => [sleeve.symbol, { trace: sleeve.trace }]))
  };
}
