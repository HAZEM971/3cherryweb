import { NextResponse } from "next/server";

// نجبره يكون Dynamic وبدون كاش
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ================= TYPES =================

interface Pair {
  symbol: string;
  name: string;
  assetClass: "GOLD" | "FOREX" | "CRYPTO";
}

interface YahooCandleResponse {
  chart: {
    result: {
      indicators: {
        quote: {
          close: (number | null)[];
        }[];
      };
    }[];
  };
}

interface MACDResult {
  macd: number | null;
  signal: number | null;
}

interface SignalOutput extends Pair {
  price: number | null;
  ema: number | null;
  rsi: number | null;
  macd: number | null;
  macdSignal: number | null;
  bias: string;
  entry: number | null;
  tp: number | null;
  sl: number | null;
  createdAt: string;
}

interface APIResponse {
  success: boolean;
  signals: SignalOutput[];
}

// ================= SETTINGS =================

const PAIRS: Pair[] = [
  { symbol: "XAUUSD=X", name: "Gold vs USD", assetClass: "GOLD" },
  { symbol: "EURUSD=X", name: "Euro vs USD", assetClass: "FOREX" },
  { symbol: "GBPUSD=X", name: "British Pound vs USD", assetClass: "FOREX" },
  { symbol: "BTC-USD", name: "Bitcoin vs USD", assetClass: "CRYPTO" },
];

// ================= HELPERS =================

async function fetchYahoo(symbol: string): Promise<number[] | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=15m&range=1d`;

    const res = await fetch(url, { cache: "no-store" });
    const json = (await res.json()) as YahooCandleResponse;

    const result = json.chart.result?.[0];
    const closes = result?.indicators?.quote?.[0]?.close;

    if (!closes || !Array.isArray(closes)) return null;

    return closes.filter((x): x is number => typeof x === "number");
  } catch (e) {
    console.error("YAHOO ERROR =>", e);
    return null;
  }
}

function calculateRSI(closes: number[]): number | null {
  if (closes.length < 15) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < 15; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += -diff;
  }

  const rs = losses === 0 ? (gains > 0 ? 100 : 0) : gains / losses;
  return 100 - 100 / (1 + rs);
}

function calculateEMA(closes: number[], period: number): number | null {
  if (closes.length < period) return null;

  const k = 2 / (period + 1);

  let initialSum = 0;
  for (let i = 0; i < period; i++) {
    initialSum += closes[i];
  }
  let ema = initialSum / period;

  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }

  return ema;
}

function calculateMACD(closes: number[]): MACDResult {
  if (closes.length < 50) return { macd: null, signal: null };

  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);

  if (ema12 === null || ema26 === null) {
    return { macd: null, signal: null };
  }

  const macd = ema12 - ema26;
  const signal = macd * 0.8;

  return { macd, signal };
}

function computeBias(
  rsi: number | null,
  macd: number | null,
  signal: number | null
): string {
  if (rsi === null || macd === null || signal === null) return "Neutral";

  const diff = macd - signal;

  if (diff > 0 && rsi > 60) return "Strong Bullish";
  if (diff > 0 && rsi >= 50) return "Bullish";

  if (diff < 0 && rsi < 40) return "Strong Bearish";
  if (diff < 0 && rsi <= 50) return "Bearish";

  return "Neutral";
}

interface LevelsResult {
  entry: number | null;
  tp: number | null;
  sl: number | null;
}

function computeLevels(price: number, bias: string): LevelsResult {
  const tpMove = price * 0.004;
  const slMove = price * 0.002;

  if (bias.includes("Bullish")) {
    return { entry: price, tp: price + tpMove, sl: price - slMove };
  }

  if (bias.includes("Bearish")) {
    return { entry: price, tp: price - tpMove, sl: price + slMove };
  }

  return { entry: price, tp: null, sl: null };
}

// ================= MAIN API =================

export async function GET() {
  const output: SignalOutput[] = [];

  for (const pair of PAIRS) {
    const closes = await fetchYahoo(pair.symbol);

    if (!closes || closes.length < 10) {
      output.push({
        ...pair,
        price: null,
        ema: null,
        rsi: null,
        macd: null,
        macdSignal: null,
        bias: "Neutral",
        entry: null,
        tp: null,
        sl: null,
        createdAt: new Date().toISOString(),
      });
      continue;
    }

    const price = closes.at(-1) ?? null;
    const ema = calculateEMA(closes, 50);
    const rsi = calculateRSI(closes);
    const { macd, signal } = calculateMACD(closes);
    const bias = computeBias(rsi, macd, signal ?? null);
    const { entry, tp, sl } =
      price !== null ? computeLevels(price, bias) : { entry: null, tp: null, sl: null };

    output.push({
      ...pair,
      price,
      ema,
      rsi,
      macd,
      macdSignal: signal ?? null,
      bias,
      entry,
      tp,
      sl,
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json<APIResponse>({ success: true, signals: output });
}
