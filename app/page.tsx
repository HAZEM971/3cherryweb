export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-6">

      {/* خلفية ذهبية متوهجة */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F5C56C22] blur-3xl rounded-full"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-[#D4224622] blur-3xl rounded-full"></div>

      {/* المحتوى */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center max-w-3xl mx-auto">

        {/* الشعار النصي */}
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#F5C56C] to-[#D42246] bg-clip-text text-transparent drop-shadow-xl">
          3CHERRY<span className="text-[#F5C56C]">FX</span>
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
          منصة تداول فاخرة تجمع بين 
          <span className="text-[#F5C56C] font-semibold"> الدقة الذهبية </span>
          و
          <span className="text-[#D42246] font-semibold"> طاقة Cherry </span>  
          مع نظام احترافي يعتمد على الذكاء الاصطناعي لتقديم توصيات وتحليلات عالية الجودة.
        </p>

        {/* زرّان رئيسيان */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">

          <a
            href="/login"
            className="px-10 py-4 rounded-xl text-black font-bold text-lg bg-gradient-to-r from-[#F5C56C] to-[#E2B24D] shadow-[0_0_20px_#F5C56C55] hover:scale-105 transition-all"
          >
            تسجيل الدخول
          </a>

          <a
            href="/register"
            className="px-10 py-4 rounded-xl border border-[#F5C56C] text-[#F5C56C] font-bold text-lg hover:bg-[#F5C56C33] hover:scale-105 transition-all"
          >
            إنشاء حساب
          </a>

        </div>

        {/* سطر سفلي */}
        <p className="mt-12 text-sm text-gray-500 tracking-wide">
          منذ لحظة دخولك… أنت داخل منظومة تداول فاخرة.
        </p>

      </section>
    </main>
  );
}
