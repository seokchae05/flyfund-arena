import { SETTINGS, SYMBOLS } from "./config.mjs";
import { FlyProxy, marketFeatures, proxyDisclosure } from "./fly-proxy.mjs";
import { hashText, mulberry32 } from "./random.mjs";

const ACTION_SCORE = { BUY: 1, HOLD: 0, SELL: -1 };
const RISK_BUCKETS = Array.from({ length: 10 }, (_, index) => (index * 10 + 5) / 100);
const PORTFOLIO_EXPOSURE_BUCKETS = Array.from({ length: 10 }, (_, index) => 0.5 + index * 0.05);
const PURE_FLY_POLICY = {
  startingExposure: 0.5,
  minimumExposure: 0.2,
  maximumExposure: 0.8,
  step: 0.1,
  confirmationDays: 2
};

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

function nextPureFlyTarget(currentTarget, action, signalState) {
  if (action === "HOLD") return { target: currentTarget, direction: null, streak: 0 };
  const streak = signalState.direction === action ? signalState.streak + 1 : 1;
  if (streak < PURE_FLY_POLICY.confirmationDays) return { target: currentTarget, direction: action, streak };
  const change = action === "BUY" ? PURE_FLY_POLICY.step : -PURE_FLY_POLICY.step;
  return {
    target: Math.max(PURE_FLY_POLICY.minimumExposure, Math.min(PURE_FLY_POLICY.maximumExposure, currentTarget + change)),
    direction: action,
    streak
  };
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
  pure.target = PURE_FLY_POLICY.startingExposure;
  const flyRisk = account(SETTINGS.sleeveCash);
  flyRisk.target = SETTINGS.riskBaseExposure;
  const individualAccounts = flies.map(() => {
    const portfolio = account(SETTINGS.sleeveCash);
    portfolio.target = PURE_FLY_POLICY.startingExposure;
    return portfolio;
  });
  const buyHold = account();
  const sma = account();
  const randomPortfolio = account();
  let previousEquity = SETTINGS.sleeveCash;
  let pendingPureTarget = PURE_FLY_POLICY.startingExposure;
  let pendingRiskTarget = SETTINGS.riskBaseExposure;
  let pendingSmaTarget = 0;
  let pendingRandomTarget = 0;
  let pendingIndividualTargets = flies.map(() => PURE_FLY_POLICY.startingExposure);
  let pureSignalState = { direction: null, streak: 0 };
  let individualSignalStates = flies.map(() => ({ direction: null, streak: 0 }));
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
    pureSignalState = nextPureFlyTarget(pure.target, action, pureSignalState);
    pendingPureTarget = pureSignalState.target;
    individualSignalStates = votes.map((vote, flyIndex) =>
      nextPureFlyTarget(individualAccounts[flyIndex].target, vote.action, individualSignalStates[flyIndex])
    );
    pendingIndividualTargets = individualSignalStates.map((decision) => decision.target);

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
    const pureStockValue = pure.shares * prices.close;

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
      flyNextTarget: pendingPureTarget,
      flyExecuted: pureTraded,
      flyEquity: pureEquity,
      flyCash: pure.cash,
      flyShares: pure.shares,
      flyStockValue: pureStockValue,
      flyActualExposure: pureEquity ? pureStockValue / pureEquity : 0,
      flySignalDirection: pureSignalState.direction,
      flySignalStreak: pureSignalState.streak,
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

function stockAllocationScore(point) {
  const voteScore = mean(point.votes.map((vote) => ACTION_SCORE[vote.action] * vote.confidence));
  const trendScore = point.trendPositive ? 0.18 : -0.22;
  const volatilityPenalty = Math.max(0, point.annualizedVolatility - 0.45) * 0.35;
  return point.signalScore * 0.55 + voteScore * 0.25 + trendScore - volatilityPenalty;
}

function nearestPortfolioExposure(value) {
  const bounded = Math.max(SETTINGS.riskMinimumExposure, Math.min(SETTINGS.riskMaximumExposure, value));
  return PORTFOLIO_EXPOSURE_BUCKETS.reduce((best, level) =>
    Math.abs(level - bounded) < Math.abs(best - bounded) ? level : best
  );
}

function cappedSoftmaxWeights(scores, totalExposure) {
  const entries = Object.entries(scores);
  const strongest = Math.max(...entries.map(([, score]) => score), 0);
  const attractiveness = Object.fromEntries(entries.map(([symbol, score]) => [symbol, Math.exp((score - strongest) * 4)]));
  const weights = Object.fromEntries(entries.map(([symbol]) => [symbol, 0]));
  let active = entries.map(([symbol]) => symbol);
  let remaining = totalExposure;

  while (active.length && remaining > 1e-9) {
    const denominator = active.reduce((sum, symbol) => sum + attractiveness[symbol], 0) || active.length;
    const capped = active.filter((symbol) => remaining * attractiveness[symbol] / denominator > SETTINGS.riskMaximumStockWeight);
    if (!capped.length) {
      active.forEach((symbol) => { weights[symbol] = remaining * attractiveness[symbol] / denominator; });
      break;
    }
    capped.forEach((symbol) => { weights[symbol] = SETTINGS.riskMaximumStockWeight; });
    remaining -= SETTINGS.riskMaximumStockWeight * capped.length;
    active = active.filter((symbol) => !capped.includes(symbol));
  }
  return weights;
}

function proposePortfolioAllocation(latestPoints) {
  const scores = Object.fromEntries(Object.entries(latestPoints).map(([symbol, point]) => [symbol, stockAllocationScore(point)]));
  const values = Object.values(scores);
  const breadth = values.length ? values.filter((score) => score > 0).length / values.length : 0;
  const rawExposure = 0.7 + mean(values) * 0.25 + (breadth - 0.5) * 0.2;
  const targetExposure = nearestPortfolioExposure(rawExposure);
  return { scores, targetExposure, weights: cappedSoftmaxWeights(scores, targetExposure) };
}

function simulateUnifiedFlyRisk(sleeves) {
  const traceMaps = new Map(sleeves.map((sleeve) => [sleeve.symbol, new Map(sleeve.trace.map((point) => [point.date, point]))]));
  const dates = [...new Set(sleeves.flatMap((sleeve) => sleeve.trace.map((point) => point.date)))].sort();
  const cashAccount = { cash: SETTINGS.initialCash, fees: 0 };
  const shares = Object.fromEntries(SYMBOLS.map(({ symbol }) => [symbol, 0]));
  const lastUsdPrice = {};
  const latestPoints = {};
  let nextTargets = Object.fromEntries(SYMBOLS.map(({ symbol }) => [symbol, 0]));
  let daysSinceAllocation = SETTINGS.riskMinimumRebalanceDays;
  const curve = [];
  const portfolioTrace = [];

  for (const date of dates) {
    const currentPoints = Object.fromEntries(SYMBOLS.flatMap(({ symbol }) => {
      const point = traceMaps.get(symbol)?.get(date);
      return point ? [[symbol, point]] : [];
    }));
    const openMarks = { ...lastUsdPrice };
    Object.entries(currentPoints).forEach(([symbol, point]) => { openMarks[symbol] = point.open / point.fx; });
    const openEquity = cashAccount.cash + SYMBOLS.reduce((sum, { symbol }) => sum + shares[symbol] * (openMarks[symbol] || 0), 0);
    const executed = Object.fromEntries(SYMBOLS.map(({ symbol }) => [symbol, false]));

    for (const [symbol, point] of Object.entries(currentPoints)) {
      const price = point.open / point.fx;
      const currentValue = shares[symbol] * price;
      const desiredValue = openEquity * (nextTargets[symbol] || 0);
      const sale = Math.min(Math.max(0, currentValue - desiredValue), currentValue);
      if (sale > Math.max(1, openEquity * 0.002)) {
        const fee = sale * SETTINGS.feeRate;
        shares[symbol] -= sale / price;
        cashAccount.cash += sale - fee;
        cashAccount.fees += fee;
        executed[symbol] = true;
      }
    }
    for (const [symbol, point] of Object.entries(currentPoints)) {
      const price = point.open / point.fx;
      const currentValue = shares[symbol] * price;
      const desiredValue = openEquity * (nextTargets[symbol] || 0);
      const purchase = Math.min(Math.max(0, desiredValue - currentValue), cashAccount.cash / (1 + SETTINGS.feeRate));
      if (purchase > Math.max(1, openEquity * 0.002)) {
        const fee = purchase * SETTINGS.feeRate;
        shares[symbol] += purchase / price;
        cashAccount.cash -= purchase + fee;
        cashAccount.fees += fee;
        executed[symbol] = true;
      }
    }

    Object.entries(currentPoints).forEach(([symbol, point]) => {
      lastUsdPrice[symbol] = point.close / point.fx;
      latestPoints[symbol] = point;
    });
    const closingStock = SYMBOLS.reduce((sum, { symbol }) => sum + shares[symbol] * (lastUsdPrice[symbol] || 0), 0);
    const closingEquity = cashAccount.cash + closingStock;
    const allSignalsReady = Object.keys(latestPoints).length === SYMBOLS.length;
    const proposal = allSignalsReady
      ? proposePortfolioAllocation(latestPoints)
      : {
          scores: Object.fromEntries(SYMBOLS.map(({ symbol }) => [symbol, 0])),
          targetExposure: 0,
          weights: Object.fromEntries(SYMBOLS.map(({ symbol }) => [symbol, 0]))
        };
    const largestChange = Math.max(...SYMBOLS.map(({ symbol }) => Math.abs((proposal.weights[symbol] || 0) - (nextTargets[symbol] || 0))));
    if (allSignalsReady && daysSinceAllocation >= SETTINGS.riskMinimumRebalanceDays && largestChange >= 0.02) {
      nextTargets = Object.fromEntries(SYMBOLS.map(({ symbol }) => [symbol, proposal.weights[symbol] || 0]));
      daysSinceAllocation = 0;
    } else {
      daysSinceAllocation += 1;
    }
    const targetExposure = Object.values(nextTargets).reduce((sum, value) => sum + value, 0);
    const holdings = Object.fromEntries(SYMBOLS.map(({ symbol }) => {
      const stockValue = shares[symbol] * (lastUsdPrice[symbol] || 0);
      const latest = latestPoints[symbol];
      return [symbol, {
        shares: shares[symbol],
        usdPrice: lastUsdPrice[symbol] || 0,
        rawPrice: latest?.rawClose ?? latest?.close ?? 0,
        stockValue,
        weight: closingEquity ? stockValue / closingEquity : 0,
        target: nextTargets[symbol] || 0,
        score: proposal.scores[symbol] || 0,
        executed: executed[symbol],
        marketDate: latest?.date || null
      }];
    }));

    curve.push({ date, value: closingEquity });
    portfolioTrace.push({
      date,
      value: closingEquity,
      cash: cashAccount.cash,
      stockValue: closingStock,
      actualExposure: closingEquity ? closingStock / closingEquity : 0,
      targetExposure,
      fees: cashAccount.fees,
      holdings
    });

    for (const [symbol, point] of Object.entries(currentPoints)) {
      const holding = holdings[symbol];
      point.riskAction = holding.target > holding.weight + 0.005 ? "BUY" : holding.target < holding.weight - 0.005 ? "SELL" : "HOLD";
      point.riskTarget = holding.target;
      point.riskAppliedTarget = holding.weight;
      point.riskExecuted = holding.executed;
      point.riskEquity = closingEquity;
      point.riskCash = cashAccount.cash;
      point.riskShares = holding.shares;
      point.riskStockValue = holding.stockValue;
      point.riskActualExposure = holding.weight;
      point.portfolioActualExposure = closingEquity ? closingStock / closingEquity : 0;
      point.portfolioTargetExposure = targetExposure;
      point.allocationScore = holding.score;
    }
  }
  return { curve, portfolioTrace, fees: cashAccount.fees };
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

export function runSimulation(market, seed = 2) {
  const sleeves = SYMBOLS.map(({ symbol, currency }) =>
    simulateSleeve(market.series[symbol], symbol, currency, market.fx, seed)
  );
  const shuffledSleeves = SYMBOLS.map(({ symbol, currency }) =>
    simulateSleeve(market.series[symbol], symbol, currency, market.fx, seed, true)
  );
  const unifiedRisk = simulateUnifiedFlyRisk(sleeves);
  const curves = {
    flyRisk: unifiedRisk.curve,
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
  feesByStrategy.flyRisk = unifiedRisk.fees;
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
      pureFlyPolicy: "starts at 50%; moves 10 percentage points after two consecutive same-direction signals; bounded to 20%-80%",
      riskPolicy: "cross-sectional brain, trend and volatility scores; 50%-95% total exposure; 25% single-stock cap; three-session allocation hold",
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
    portfolioTrace: unifiedRisk.portfolioTrace,
    sleeves: Object.fromEntries(sleeves.map((sleeve) => [sleeve.symbol, { trace: sleeve.trace }]))
  };
}
