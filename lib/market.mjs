import fs from "node:fs/promises";
import path from "node:path";
import { FX_SYMBOL, SYMBOLS, SETTINGS } from "./config.mjs";
import { hashText, mulberry32 } from "./random.mjs";

const CACHE_PATH = path.resolve("data", "market-cache.json");

function isoDate(timestamp) {
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

function cleanYahooResult(symbol, payload) {
  const result = payload?.chart?.result?.[0];
  const quote = result?.indicators?.quote?.[0];
  const adjusted = result?.indicators?.adjclose?.[0]?.adjclose ?? [];
  if (!result?.timestamp || !quote) {
    throw new Error(`${symbol}: Yahoo 응답에 가격 데이터가 없습니다.`);
  }
  const bars = result.timestamp.flatMap((timestamp, index) => {
    const open = quote.open?.[index];
    const high = quote.high?.[index];
    const low = quote.low?.[index];
    const close = quote.close?.[index];
    const volume = quote.volume?.[index];
    if (![open, high, low, close].every(Number.isFinite)) return [];
    const adjustedClose = Number.isFinite(adjusted[index]) ? adjusted[index] : close;
    const adjustment = close > 0 ? adjustedClose / close : 1;
    return [{
      date: isoDate(timestamp),
      open: open * adjustment,
      high: high * adjustment,
      low: low * adjustment,
      close: adjustedClose,
      adjustedClose,
      rawClose: close,
      volume: Number.isFinite(volume) ? volume : 0
    }];
  });
  if (bars.length < 40) throw new Error(`${symbol}: 유효한 일봉이 부족합니다.`);
  return {
    symbol,
    currency: result.meta?.currency ?? null,
    exchangeTimezone: result.meta?.exchangeTimezoneName ?? null,
    bars
  };
}

async function fetchSymbol(symbol) {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
  url.searchParams.set("range", SETTINGS.historyRange);
  url.searchParams.set("interval", SETTINGS.interval);
  url.searchParams.set("events", "div,splits");
  url.searchParams.set("includeAdjustedClose", "true");
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "FlyFund-Arena/0.1 paper-research"
    },
    signal: AbortSignal.timeout(20_000)
  });
  if (!response.ok) throw new Error(`${symbol}: HTTP ${response.status}`);
  return cleanYahooResult(symbol, await response.json());
}

function tradingDates(count) {
  const dates = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  while (dates.length < count) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) dates.unshift(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return dates;
}

function demoSeries(symbol, index, count = 360) {
  const random = mulberry32(hashText(symbol) ^ 0x51f15e);
  const dates = tradingDates(count);
  let price = [122, 172_000, 181, 426, 196][index];
  const bars = dates.map((date, i) => {
    const cycle = Math.sin(i / (18 + index * 2)) * 0.004;
    const shock = (random() - 0.48) * (index === 1 ? 0.035 : 0.028);
    const open = price * (1 + (random() - 0.5) * 0.008);
    const close = Math.max(1, open * (1 + cycle + shock));
    const spread = 0.006 + random() * 0.018;
    const high = Math.max(open, close) * (1 + spread * random());
    const low = Math.min(open, close) * (1 - spread * random());
    price = close;
    return {
      date,
      open,
      high,
      low,
      close,
      adjustedClose: close,
      rawClose: close,
      volume: Math.round((8_000_000 + random() * 80_000_000) * (1 + Math.abs(shock) * 10))
    };
  });
  return { symbol, currency: index === 1 ? "KRW" : "USD", exchangeTimezone: null, bars };
}

function demoFxSeries(count = 360) {
  const dates = tradingDates(count);
  return {
    symbol: FX_SYMBOL,
    currency: "KRW",
    exchangeTimezone: null,
    bars: dates.map((date, index) => {
      const close = 1_350 + Math.sin(index / 31) * 28;
      return { date, open: close, high: close, low: close, close, adjustedClose: close, rawClose: close, volume: 0 };
    })
  };
}

export function demoMarket(reason = "오프라인 데모 데이터") {
  return {
    source: "demo",
    generatedAt: new Date().toISOString(),
    stale: true,
    warning: reason,
    historyRange: SETTINGS.historyRange,
    series: Object.fromEntries(SYMBOLS.map((item, index) => [item.symbol, demoSeries(item.symbol, index)])),
    fx: demoFxSeries()
  };
}

export async function readCache() {
  try {
    const raw = JSON.parse(await fs.readFile(CACHE_PATH, "utf8"));
    const complete = SYMBOLS.every(({ symbol }) => raw.series?.[symbol]?.bars?.length > 30);
    if (!complete) throw new Error("캐시에 일부 종목이 없습니다.");
    return { ...raw, fx: raw.fx || demoFxSeries(raw.series[SYMBOLS[0].symbol].bars.length) };
  } catch {
    return null;
  }
}

export async function updateMarketData() {
  const previous = await readCache();
  const [results, fxResult] = await Promise.all([
    Promise.allSettled(SYMBOLS.map(({ symbol }) => fetchSymbol(symbol))),
    fetchSymbol(FX_SYMBOL).then((value) => ({ status: "fulfilled", value }), (reason) => ({ status: "rejected", reason }))
  ]);
  const series = {};
  const failures = [];
  let successful = 0;
  results.forEach((result, index) => {
    const symbol = SYMBOLS[index].symbol;
    if (result.status === "fulfilled") {
      series[symbol] = result.value;
      successful += 1;
    }
    else if (previous?.series?.[symbol]) {
      series[symbol] = previous.series[symbol];
      failures.push(`${symbol}: ${result.reason.message} — 기존 캐시 사용`);
    } else {
      series[symbol] = demoSeries(symbol, index);
      failures.push(`${symbol}: ${result.reason.message} — 데모 데이터 사용`);
    }
  });
  let fx;
  if (fxResult.status === "fulfilled") {
    fx = fxResult.value;
  } else if (previous?.fx) {
    fx = previous.fx;
    failures.push(`${FX_SYMBOL}: ${fxResult.reason.message} — 기존 환율 캐시 사용`);
  } else {
    fx = demoFxSeries();
    failures.push(`${FX_SYMBOL}: ${fxResult.reason.message} — 데모 환율 사용`);
  }
  if (successful === 0 && previous) {
    return {
      ...previous,
      stale: true,
      warning: failures.join(" | ")
    };
  }
  const payload = {
    source: failures.length ? "mixed" : "yahoo-chart",
    generatedAt: new Date().toISOString(),
    stale: failures.length > 0,
    warning: failures.join(" | ") || null,
    historyRange: SETTINGS.historyRange,
    series,
    fx
  };
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  const temporary = `${CACHE_PATH}.partial`;
  await fs.writeFile(temporary, JSON.stringify(payload), "utf8");
  await fs.rename(temporary, CACHE_PATH);
  return payload;
}

export async function getMarketData({ allowUpdate = false } = {}) {
  const cached = await readCache();
  if (cached) return cached;
  if (allowUpdate) {
    try {
      return await updateMarketData();
    } catch (error) {
      return demoMarket(error.message);
    }
  }
  return demoMarket("아직 시세 캐시가 없습니다. 업데이트 버튼을 눌러주세요.");
}

export { CACHE_PATH };
