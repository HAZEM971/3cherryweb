"use client";

import { useEffect, useMemo, useState } from "react";

type AssetClass = "GOLD" | "FOREX" | "CRYPTO";

interface Signal {
  symbol: string;
  name: string;
  assetClass: AssetClass;
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

interface SignalsResponse {
  success: boolean;
  signals: Signal[];
}

// من هو VIP الآن؟ (يمكنك لاحقًا ربطه مع Firebase)
const isVipUser: boolean = false;

// ما هي الإشارات التي نعتبرها VIP؟
function isVipSignal(signal: Signal): boolean {
  const vipSymbols = ["XAUUSD", "BTCUSD", "BTC-USD"];
  if (vipSymbols.includes(signal.symbol.toUpperCase())) return true;
  if (signal.assetClass === "GOLD") return true;
  return false;
}

// لون البايس
function biasColorClass(bias: string): string {
  if (bias.includes("Strong Bullish")) return "text-emerald-300";
  if (bias.includes("Bullish")) return "text-emerald-400";
  if (bias.includes("Strong Bearish")) return "text-red-300";
  if (bias.includes("Bearish")) return "text-red-400";
  return "text-gray-300";
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<AssetClass | "ALL">("ALL");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/signals", { cache: "no-store" });
        const json = (await res.json()) as SignalsResponse;
        setSignals(json.signals);
      } catch (error) {
        console.error("Failed to load signals", error);
        setSignals([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
    const intervalId = window.setInterval(load, 30 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const filteredSignals = useMemo(() => {
    if (tab === "ALL") return signals;
    return signals.filter((s) => s.assetClass === tab);
  }, [signals, tab]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* الخلفيات */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-yellow-500/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-red-500/20 blur-[160px] rounded-full" />

      <div className="relative z-20 max-w-6xl mx-auto">
        {/* العنوان */}
        <header className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              3CHERRYFX – VIP Signals Board
            </span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Mixed FREE & VIP signals powered by AI. Free users see full details for
            standard signals, while VIP trades are partially locked with premium levels
            (Entry, TP, SL).
          </p>
          <p className="text-xs text-yellow-400">
            Auto-refresh every 30 minutes • Data source: Yahoo Finance
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {(["ALL", "GOLD", "FOREX", "CRYPTO"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key === "ALL" ? "ALL" : (key as AssetClass))}
              className={`px-4 md:px-6 py-2 rounded-xl border text-sm md:text-base transition-all ${
                tab === key || (tab === "ALL" && key === "ALL")
                  ? "border-yellow-400 text-yellow-300 bg-yellow-400/10 shadow-lg shadow-yellow-500/20"
                  : "border-gray-600 text-gray-300 hover:border-yellow-400"
              }`}
            >
              {key === "ALL" ? "All" : key}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400 mt-8 animate-pulse">
            Loading live VIP & Free signals...
          </p>
        )}

        {/* No data */}
        {!loading && filteredSignals.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No signals available at the moment.
          </p>
        )}

        {/* Cards */}
        {!loading && filteredSignals.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {filteredSignals.map((s) => {
              const vip = isVipSignal(s);
              const locked = vip && !isVipUser;

              return (
                <article
                  key={`${s.symbol}-${s.createdAt}`}
                  className="relative bg-black/70 border border-yellow-500/25 rounded-2xl p-6 shadow-xl shadow-black/70 hover:shadow-yellow-500/35 transition-all backdrop-blur-xl overflow-hidden"
                >
                  {/* شارة VIP / FREE */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <span className="px-3 py-1 text-[10px] uppercase rounded-full border border-gray-500 text-gray-300">
                      {s.assetClass}
                    </span>
                    <span
                      className={`px-3 py-1 text-[10px] font-semibold uppercase rounded-full ${
                        vip
                          ? "bg-gradient-to-r from-red-600 to-yellow-500 text-black"
                          : "bg-emerald-900/60 text-emerald-300 border border-emerald-500/50"
                      }`}
                    >
                      {vip ? "VIP Signal" : "Free Signal"}
                    </span>
                  </div>

                  {/* رأس الكرت */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-yellow-400">
                      {s.symbol}
                    </h2>
                    <p className="text-sm text-gray-400">{s.name}</p>
                  </div>

                  {/* Bias + وقت التحديث */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-4">
                    <p className="text-sm text-gray-300">
                      Bias:{" "}
                      <span className={`font-semibold ${biasColorClass(s.bias)}`}>
                        {s.bias}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Updated:{" "}
                      <span className="text-gray-300">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {/* ENTRY / TP / SL */}
                  <div className="grid grid-cols-3 gap-3 text-center mb-5">
                    <div className="border border-gray-600 rounded-xl py-3 bg-black/40">
                      <p className="text-xs text-gray-400 mb-1">ENTRY</p>
                      <p className="font-semibold text-sm md:text-base">
                        {locked
                          ? "••••"
                          : s.entry !== null
                          ? s.entry.toFixed(4)
                          : "—"}
                      </p>
                    </div>
                    <div className="border border-emerald-600 rounded-xl py-3 bg-black/40">
                      <p className="text-xs text-emerald-400 mb-1">TAKE PROFIT</p>
                      <p className="font-semibold text-sm md:text-base text-emerald-300">
                        {locked
                          ? "••••"
                          : s.tp !== null
                          ? s.tp.toFixed(4)
                          : "—"}
                      </p>
                    </div>
                    <div className="border border-red-600 rounded-xl py-3 bg-black/40">
                      <p className="text-xs text-red-400 mb-1">STOP LOSS</p>
                      <p className="font-semibold text-sm md:text-base text-red-300">
                        {locked
                          ? "••••"
                          : s.sl !== null
                          ? s.sl.toFixed(4)
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* المؤشرات */}
                  <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-gray-300 mb-3">
                    <p>RSI: {s.rsi !== null ? s.rsi.toFixed(2) : "—"}</p>
                    <p>MACD: {s.macd !== null ? s.macd.toFixed(4) : "—"}</p>
                    <p>
                      Signal:{" "}
                      {s.macdSignal !== null ? s.macdSignal.toFixed(4) : "—"}
                    </p>
                    <p>EMA(50): {s.ema !== null ? s.ema.toFixed(4) : "—"}</p>
                  </div>

                  {/* طبقة قفل VIP لو المستخدم ليس VIP */}
                  {locked && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
                      <p className="text-yellow-300 font-semibold mb-2 text-sm md:text-base">
                        VIP Levels Locked
                      </p>
                      <p className="text-gray-400 text-xs md:text-sm mb-4">
                        Upgrade your 3CHERRYFX plan to unlock full Entry / TP / SL
                        for this premium signal.
                      </p>
                      <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-red-500 text-black font-semibold text-sm hover:scale-105 transition-transform">
                        Request VIP Access
                      </button>
                    </div>
                  )}
                </article>
            );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
