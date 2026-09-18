export const SYMBOLS = [
  { symbol: "NVDA", name: "NVIDIA", currency: "USD", market: "NASDAQ" },
  { symbol: "000660.KS", name: "SK hynix", currency: "KRW", market: "KRX" },
  { symbol: "AAPL", name: "Apple", currency: "USD", market: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft", currency: "USD", market: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon", currency: "USD", market: "NASDAQ" }
];

export const SETTINGS = {
  initialCash: 10_000,
  sleeveCash: 2_000,
  feeRate: 0.001,
  flyCount: 4,
  flyViewDays: [40, 70, 100, 130],
  historyRange: "5y",
  riskBaseExposure: 0.75,
  riskMinimumRebalanceDays: 3,
  interval: "1d"
};

export const FX_SYMBOL = "KRW=X";
