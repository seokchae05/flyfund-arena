import { hashText, mulberry32, normal } from "./random.mjs";

const REGION_NAMES = [
  "시각엽", "버섯체", "중심복합체", "후각엽", "측각", "상부중앙뇌",
  "하부중앙뇌", "식도하부", "하행뉴런", "운동게이트", "보상회로", "회피회로"
];

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values) {
  const average = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - average) ** 2))) || 1;
}

export function marketFeatures(bars, index) {
  const close = bars[index].adjustedClose;
  const ret = (lookback) => index >= lookback ? close / bars[index - lookback].adjustedClose - 1 : 0;
  const window = bars.slice(Math.max(0, index - 19), index + 1);
  const returns = window.slice(1).map((bar, i) => bar.adjustedClose / window[i].adjustedClose - 1);
  const closes = window.map((bar) => bar.adjustedClose);
  const volumes = window.map((bar) => Math.log1p(bar.volume));
  const volumeZ = (Math.log1p(bars[index].volume) - mean(volumes)) / standardDeviation(volumes);
  return [
    Math.tanh(ret(1) * 18),
    Math.tanh(ret(5) * 8),
    Math.tanh(ret(20) * 4),
    Math.tanh(standardDeviation(returns) * 35),
    Math.tanh((close / mean(closes) - 1) * 12),
    Math.tanh(volumeZ / 3)
  ];
}

function makeWeights(random, rows, columns, scale = 1) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => normal(random) * scale)
  );
}

function dot(weights, vector) {
  return weights.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));
}

export class FlyProxy {
  constructor(seed, symbol, shuffled = false) {
    this.seed = seed;
    this.symbol = symbol;
    const random = mulberry32(seed ^ hashText(symbol) ^ (shuffled ? 0x5a5a5a5a : 0));
    this.state = Array(48).fill(0);
    this.input = makeWeights(random, 48, 6, 0.42);
    this.recurrent = Array.from({ length: 48 }, (_, i) => ({
      from: shuffled ? Math.floor(random() * 48) : (i * 7 + 11) % 48,
      weight: normal(random) * 0.18
    }));
    this.buy = Array.from({ length: 48 }, () => normal(random));
    this.sell = Array.from({ length: 48 }, () => normal(random));
    this.memory = Array(6).fill(0);
  }

  step(features, reward = 0) {
    const previousMemory = [...this.memory];
    this.memory = this.memory.map((value, index) =>
      Math.max(-0.35, Math.min(0.35, value * 0.96 + reward * features[index] * 0.035))
    );
    const sensory = features.map((value, index) => value + this.memory[index]);
    const projected = dot(this.input, sensory);
    const previous = this.state;
    this.state = projected.map((value, index) => {
      const edge = this.recurrent[index];
      return Math.tanh(value + previous[index] * 0.68 + previous[edge.from] * edge.weight);
    });
    const buy = mean(this.state.map((value, index) => value * this.buy[index]));
    const sell = mean(this.state.map((value, index) => value * this.sell[index]));
    const difference = buy - sell;
    const confidence = Math.min(1, Math.abs(difference) * 2.8);
    const action = confidence < 0.17 ? "HOLD" : difference > 0 ? "BUY" : "SELL";
    const regions = REGION_NAMES.map((name, index) => ({
      name,
      activity: Math.round(mean(this.state.slice(index * 4, index * 4 + 4).map(Math.abs)) * 100)
    }));
    const memorySignal = mean(this.memory);
    const memoryMagnitude = mean(this.memory.map(Math.abs));
    const memoryChange = mean(this.memory.map((value, index) => Math.abs(value - previousMemory[index])));
    return {
      action,
      confidence,
      difference,
      buyDrive: buy,
      sellDrive: sell,
      memorySignal,
      memoryMagnitude,
      memoryChange,
      regions
    };
  }
}

export const proxyDisclosure = {
  id: "fly-proxy-v1",
  label: "대시보드 프록시",
  actualConnectome: false,
  note: "현재 Windows 실행판의 신경 출력은 UI·백테스트 검증용 결정론적 프록시입니다. 공식 MaleCNS 엔진으로 가장하지 않습니다."
};
