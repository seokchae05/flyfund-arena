export const SYMBOLS = [
  { symbol: "NVDA", name: "NVIDIA", currency: "USD", market: "NASDAQ" },
  { symbol: "AAPL", name: "Apple", currency: "USD", market: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft", currency: "USD", market: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon", currency: "USD", market: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet", currency: "USD", market: "NASDAQ" },
  { symbol: "META", name: "Meta", currency: "USD", market: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla", currency: "USD", market: "NASDAQ" },
  { symbol: "000660.KS", name: "SK hynix", currency: "KRW", market: "KRX" }
];

export const SETTINGS = {
  initialCash: 100_000,
  sleeveCash: 12_500,
  feeRate: 0.001,
  flyCount: 4,
  flyViewDays: [40, 70, 100, 130],
  historyRange: "5y",
  riskBaseExposure: 0.75,
  riskMinimumRebalanceDays: 3,
  riskMinimumExposure: 0.5,
  riskMaximumExposure: 0.95,
  riskMaximumStockWeight: 0.25,
  interval: "1d"
};

export const FX_SYMBOL = "KRW=X";
