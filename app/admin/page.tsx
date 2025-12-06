"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";

// ---------- Types ----------
type AssetClass = "GOLD" | "FOREX" | "CRYPTO";

type Bias =
  | "Strong Bullish"
  | "Bullish"
  | "Neutral"
  | "Bearish"
  | "Strong Bearish";

interface AdminSignal {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number | null;
  ema: number | null;
  rsi: number | null;
  macd: number | null;
  macdSignal: number | null;
  bias: Bias;
  entry: number | null;
  tp: number | null;
  sl: number | null;
  createdAt: string;
}

interface SignalsApiResponse {
  success: boolean;
  signals: AdminSignal[];
  error?: string;
}

// ---------- Admin emails ----------
const ADMIN_EMAILS: string[] = ["hazemabomoghdeb2@gmail.com"];

// ---------- Helpers ----------
const formatNumber = (value: number | null, digits: number = 4): string =>
  value !== null ? value.toFixed(digits) : "—";

const calcRR = (entry: number | null, tp: number | null, sl: number | null): string => {
  if (entry === null || tp === null || sl === null) return "—";
  const reward = Math.abs(tp - entry);
  const risk = Math.abs(entry - sl);
  if (risk === 0) return "—";
  const ratio = reward / risk;
  return ratio.toFixed(2) + " : 1";
};

const biasColor = (bias: Bias): string => {
  switch (bias) {
    case "Strong Bullish":
      return "text-emerald-300";
    case "Bullish":
      return "text-emerald-400";
    case "Bearish":
      return "text-red-400";
    case "Strong Bearish":
      return "text-red-300";
    default:
      return "text-gray-300";
  }
};

const biasPillColor = (bias: Bias): string => {
  switch (bias) {
    case "Strong Bullish":
    case "Bullish":
      return "bg-emerald-900/40 border-emerald-500/70";
    case "Bearish":
    case "Strong Bearish":
      return "bg-red-900/40 border-red-500/70";
    default:
      return "bg-zinc-900/60 border-zinc-600/70";
  }
};

// ========== MAIN COMPONENT ==========
export default function AdminPage(): JSX.Element {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [signals, setSignals] = useState<AdminSignal[]>([]);
  const [loadingSignals, setLoadingSignals] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [assetFilter, setAssetFilter] = useState<AssetClass | "ALL">("ALL");
  const [biasFilter, setBiasFilter] = useState<Bias | "ALL">("ALL");

  // ---------- Check admin ----------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      const email = currentUser.email?.toLowerCase() ?? "";
      const allowed = ADMIN_EMAILS.includes(email);
      setIsAdmin(allowed);
      setCheckingAdmin(false);
    });

    return () => unsubscribe();
  }, [router]);

  // ---------- Fetch signals ----------
  const fetchSignals = async (): Promise<void> => {
    try {
      setLoadingSignals(true);
      setError(null);

      const res = await fetch("/api/signals");
      if (!res.ok) {
        setError(`API error: ${res.status}`);
        setLoadingSignals(false);
        return;
      }

      const json = (await res.json()) as SignalsApiResponse;

      if (!json.success) {
        setError(json.error ?? "Unknown error from signals API");
        setLoadingSignals(false);
        return;
      }

      setSignals(json.signals);
      setLastUpdated(new Date());
    } catch  {
      setError("Failed to load signals (network/server error).");
    } finally {
      setLoadingSignals(false);
    }
  };

  useEffect(() => {
    void fetchSignals();

    const intervalId = setInterval(() => {
      void fetchSignals();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(intervalId);
  }, []);

  // ---------- Derived data ----------
  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const byAsset =
        assetFilter === "ALL" ? true : s.assetClass === assetFilter;
      const byBias = biasFilter === "ALL" ? true : s.bias === biasFilter;
      return byAsset && byBias;
    });
  }, [signals, assetFilter, biasFilter]);

  const biasStats = useMemo(() => {
    const initialCounts: Record<Bias, number> = {
      "Strong Bullish": 0,
      Bullish: 0,
      Neutral: 0,
      Bearish: 0,
      "Strong Bearish": 0,
    };
    for (const s of signals) {
      initialCounts[s.bias] += 1;
    }
    return initialCounts;
  }, [signals]);

  // ---------- Admin guards ----------
  if (checkingAdmin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">Checking admin access…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-red-900/25 border border-red-600/60 p-8 rounded-2xl shadow-xl shadow-red-900/60">
          <h1 className="text-2xl font-bold text-red-400 mb-3">Access Denied</h1>
          <p className="text-gray-200 text-sm mb-4">
            This area is restricted to 3CHERRYFX admins only.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 rounded-xl bg-zinc-900 border border-zinc-600 text-sm text-gray-100 hover:bg-zinc-800 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-4 md:px-8 py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-yellow-500/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-red-500/20 blur-[160px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              3CHERRYFX – Admin Signals Monitor
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl">
              Read-only monitoring for fully automated AI signals (Gold, Forex, Crypto).
              No manual input required. Updated automatically every 30 minutes.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Logged in as:{" "}
              <span className="text-yellow-300">{user?.email ?? "Unknown"}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <button
              onClick={() => void fetchSignals()}
              disabled={loadingSignals}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-400/60 text-sm font-semibold text-yellow-300 bg-black/60 hover:bg-yellow-500/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              <RefreshCcw
                className={`w-4 h-4 ${loadingSignals ? "animate-spin" : ""}`}
              />
              {loadingSignals ? "Refreshing…" : "Refresh now"}
            </button>
            <p className="text-xs text-gray-400">
              Last update:{" "}
              {lastUpdated
                ? lastUpdated.toLocaleString("en-GB")
                : "Not loaded yet"}
            </p>
          </div>
        </header>

        {/* Stats Bar */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/80 border border-yellow-500/40 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Total Active Pairs</p>
            <p className="text-2xl font-bold text-yellow-300 mt-1">
              {signals.length}
            </p>
          </div>

          <div className="bg-black/80 border border-emerald-500/30 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Bullish (incl. Strong)</p>
            <p className="text-xl font-bold text-emerald-300 mt-1">
              {biasStats.Bullish + biasStats["Strong Bullish"]}
            </p>
          </div>

          <div className="bg-black/80 border border-red-500/30 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Bearish (incl. Strong)</p>
            <p className="text-xl font-bold text-red-300 mt-1">
              {biasStats.Bearish + biasStats["Strong Bearish"]}
            </p>
          </div>

          <div className="bg-black/80 border border-zinc-600/40 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Neutral</p>
            <p className="text-xl font-bold text-gray-200 mt-1">
              {biasStats.Neutral}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAssetFilter("ALL")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                assetFilter === "ALL"
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-black/70 border-zinc-700 text-gray-300 hover:border-yellow-400/60"
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setAssetFilter("GOLD")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                assetFilter === "GOLD"
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-black/70 border-zinc-700 text-gray-300 hover:border-yellow-400/60"
              }`}
            >
              Gold
            </button>
            <button
              onClick={() => setAssetFilter("FOREX")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                assetFilter === "FOREX"
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-black/70 border-zinc-700 text-gray-300 hover:border-yellow-400/60"
              }`}
            >
              Forex
            </button>
            <button
              onClick={() => setAssetFilter("CRYPTO")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                assetFilter === "CRYPTO"
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-black/70 border-zinc-700 text-gray-300 hover:border-yellow-400/60"
              }`}
            >
              Crypto
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Bias filter:</label>
            <select
              value={biasFilter}
              onChange={(e) => setBiasFilter(e.target.value as Bias | "ALL")}
              className="bg-black/70 border border-zinc-700 rounded-lg text-xs px-3 py-1.5 text-gray-200 focus:outline-none focus:border-yellow-400"
            >
              <option value="ALL">All</option>
              <option value="Strong Bullish">Strong Bullish</option>
              <option value="Bullish">Bullish</option>
              <option value="Neutral">Neutral</option>
              <option value="Bearish">Bearish</option>
              <option value="Strong Bearish">Strong Bearish</option>
            </select>
          </div>
        </section>

        {/* Errors */}
        {error && (
          <div className="bg-red-900/40 border border-red-600/70 text-red-100 text-sm rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* Signals Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSignals.map((s) => {
            const rr = calcRR(s.entry, s.tp, s.sl);
            const isBull =
              s.bias === "Bullish" || s.bias === "Strong Bullish";
            const isBear =
              s.bias === "Bearish" || s.bias === "Strong Bearish";

            return (
              <article
                key={s.symbol}
                className="bg-black/80 border border-yellow-500/20 rounded-2xl p-5 shadow-[0_0_25px_rgba(0,0,0,0.7)] hover:shadow-[0_0_35px_rgba(250,204,21,0.3)] transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-2xl font-extrabold text-yellow-300">
                      {s.symbol}
                    </h2>
                    <p className="text-xs text-gray-400">{s.name}</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Updated:{" "}
                      {new Date(s.createdAt).toLocaleString("en-GB")}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-zinc-900 border border-zinc-600 text-gray-200 uppercase tracking-wide">
                      {s.assetClass}
                    </span>
                    <div
                      className={`text-[11px] px-3 py-1 rounded-full border inline-flex items-center gap-1 ${biasPillColor(
                        s.bias
                      )}`}
                    >
                      <span className={biasColor(s.bias)}>{s.bias}</span>
                      {isBull && (
                        <TrendingUp className="w-3 h-3 text-emerald-300" />
                      )}
                      {isBear && (
                        <TrendingDown className="w-3 h-3 text-red-300" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Entry / TP / SL */}
                <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                  <div className="bg-zinc-950/80 border border-zinc-700 rounded-xl p-3 text-center">
                    <p className="text-gray-400 mb-1">ENTRY</p>
                    <p className="font-semibold text-gray-100">
                      {formatNumber(s.entry)}
                    </p>
                  </div>
                  <div className="bg-emerald-950/70 border border-emerald-500/60 rounded-xl p-3 text-center">
                    <p className="text-gray-300 mb-1">TAKE PROFIT</p>
                    <p className="font-semibold text-emerald-300">
                      {formatNumber(s.tp)}
                    </p>
                  </div>
                  <div className="bg-red-950/70 border border-red-500/60 rounded-xl p-3 text-center">
                    <p className="text-gray-300 mb-1">STOP LOSS</p>
                    <p className="font-semibold text-red-300">
                      {formatNumber(s.sl)}
                    </p>
                  </div>
                </div>

                {/* Indicators */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-200 mb-3">
                  <p>
                    Price:{" "}
                    <span className="text-gray-100">
                      {formatNumber(s.price, 4)}
                    </span>
                  </p>
                  <p>
                    EMA(50):{" "}
                    <span className="text-gray-100">
                      {formatNumber(s.ema, 4)}
                    </span>
                  </p>
                  <p>
                    RSI:{" "}
                    <span className="text-gray-100">
                      {formatNumber(s.rsi, 2)}
                    </span>
                  </p>
                  <p>
                    MACD / Signal:{" "}
                    <span className="text-gray-100">
                      {formatNumber(s.macd, 4)} /{" "}
                      {formatNumber(s.macdSignal, 4)}
                    </span>
                  </p>
                </div>

                {/* RR */}
                <div className="flex items-center justify-between text-[11px] mt-1 pt-2 border-t border-zinc-800">
                  <p className="text-gray-400">
                    R:R Ratio:{" "}
                    <span className="text-yellow-300 font-semibold">
                      {rr}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    Auto-generated • Read-only
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        {filteredSignals.length === 0 && !loadingSignals && !error && (
          <p className="text-center text-gray-400 text-sm">
            No signals match current filters.
          </p>
        )}
      </div>
    </main>
  );
}
