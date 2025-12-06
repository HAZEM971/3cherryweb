"use client";

type Trend = "صاعد" | "هابط" | "عرضي";

interface GoldAnalysis {
  trend: Trend;
  sentiment: string; // نظرة عامة
  lastUpdate: string;
  supports: number[];
  resistances: number[];
  intradayIdea: string;
  riskNote: string;
}

const goldAnalysis: GoldAnalysis = {
  trend: "صاعد",
  sentiment:
    "الذهب يتحرك في اتجاه صاعد على الأطر القصيرة مع زخم شرائي قوي طالما السعر أعلى منطقة الدعم الرئيسية.",
  lastUpdate: "تم التحديث قبل 15 دقيقة تقريباً",
  supports: [2372, 2365, 2358],
  resistances: [2385, 2392, 2400],
  intradayIdea:
    "طالما الذهب أعلى 2372 يُمكن اعتبار أي هبوط نحو هذه المنطقة فرصة شراء مع أهداف قرب 2385 ثم 2392، مع وقف خسارة أسفل 2365.",
  riskNote:
    "هذا التحليل تعليمي/توجيهي وليس نصيحة استثمارية مباشرة. التداول على الذهب يحمل درجة عالية من المخاطر وقد يؤدي إلى خسارة رأس المال.",
};

function getTrendColor(trend: Trend) {
  switch (trend) {
    case "صاعد":
      return "text-emerald-400";
    case "هابط":
      return "text-red-400";
    case "عرضي":
      return "text-amber-300";
    default:
      return "text-gray-200";
  }
}

export default function GoldPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      {/* هيدر الصفحة */}
      <header className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">🥇 Gold PRO – تحليل الذهب</h1>
          <p className="text-gray-300">
            هذه صفحة تحليل مخصصة للذهب فقط. مستقبلاً سيتم ربطها بتحديث آلي كل
            15 دقيقة عبر ذكاء اصطناعي أو مزود بيانات حي.
          </p>
        </div>

        <a
          href="/dashboard"
          className="inline-block bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-700"
        >
          ← العودة للوحة التحكم
        </a>
      </header>

      <section className="max-w-4xl mx-auto space-y-6">
        {/* ملخص عام + الاتجاه */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">الوضع الحالي للذهب</h2>
              <p className="text-gray-400 text-sm">{goldAnalysis.lastUpdate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">الاتجاه العام</p>
              <p className={`text-2xl font-extrabold ${getTrendColor(goldAnalysis.trend)}`}>
                {goldAnalysis.trend}
              </p>
            </div>
          </div>

          <p className="text-gray-200 leading-relaxed">
            {goldAnalysis.sentiment}
          </p>
        </div>

        {/* مستويات الدعم والمقاومة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-3">📉 مستويات الدعم</h3>
            <ul className="space-y-2">
              {goldAnalysis.supports.map((level, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-slate-800 rounded-xl px-3 py-2"
                >
                  <span className="text-gray-300">دعم #{index + 1}</span>
                  <span className="font-bold">{level}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-3">📈 مستويات المقاومة</h3>
            <ul className="space-y-2">
              {goldAnalysis.resistances.map((level, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-slate-800 rounded-xl px-3 py-2"
                >
                  <span className="text-gray-300">مقاومة #{index + 1}</span>
                  <span className="font-bold">{level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* فكرة تداول اليوم */}
        <div className="bg-slate-900 border border-emerald-700/60 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl" />
          <h3 className="text-lg font-bold mb-3">💡 فكرة تداول اليوم على الذهب</h3>
          <p className="text-gray-200 leading-relaxed">{goldAnalysis.intradayIdea}</p>
        </div>

        {/* تحذير المخاطر */}
        <div className="bg-slate-900 border border-amber-600/60 rounded-2xl p-4">
          <h4 className="text-sm font-bold mb-2 text-amber-300">⚠️ تنبيه مهم</h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            {goldAnalysis.riskNote}
          </p>
        </div>
      </section>
    </main>
  );
}
