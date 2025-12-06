"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        جاري التحميل...
      </div>
    );

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden p-6">

      {/* 🎨 خلفية فاخرة "Gold Glow + Cherry Mist" */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]"></div>
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#F5C56C22] blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#D4224622] blur-3xl rounded-full"></div>

      {/* المحتوى */}
      <div className="relative z-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#FFD700] to-[#D42246] bg-clip-text text-transparent drop-shadow-lg">
            لوحة التحكم
          </h1>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D42246] to-[#A31533] text-white font-bold shadow-[0_0_15px_#D4224655] hover:scale-105 transition"
          >
            تسجيل خروج
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-[#0A0A0A]/70 border border-[#FFD70033] p-6 rounded-2xl shadow-[0_0_25px_#FFD70022] mb-10 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">معلومات حسابك</h2>

          <p className="text-gray-300 text-lg mb-1">
            <strong className="text-[#FFD700]">الاسم:</strong> {user?.displayName}
          </p>
          <p className="text-gray-300 text-lg">
            <strong className="text-[#FFD700]">البريد الإلكتروني:</strong> {user?.email}
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Signals */}
          <a
            href="/signals"
            className="group bg-[#0A0A0A]/60 border border-[#FFD70022] p-6 rounded-2xl shadow-[0_0_15px_#FFD70011] hover:border-[#FFD70066] hover:shadow-[0_0_25px_#FFD70055] transition-all backdrop-blur-md hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-[#FFD700] mb-2 group-hover:tracking-wide transition">
              📈 توصيات التداول
            </h3>
            <p className="text-gray-300">
              توصيات ذكية مدعومة بتحليل AI.
            </p>
          </a>

          {/* Gold Analysis */}
          <a
            href="/gold"
            className="group bg-[#0A0A0A]/60 border border-[#FFD70022] p-6 rounded-2xl shadow-[0_0_15px_#FFD70011] hover:border-[#FFD70066] hover:shadow-[0_0_25px_#FFD70055] transition-all backdrop-blur-md hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-[#FFD700] mb-2 group-hover:tracking-wide transition">
              🥇 تحليل الذهب
            </h3>
            <p className="text-gray-300">
              تحديث فوري كل 15 دقيقة.
            </p>
          </a>

          {/* Academy Register */}
          <a
            href="/academy"
            className="group bg-[#0A0A0A]/60 border border-[#FFD70022] p-6 rounded-2xl shadow-[0_0_15px_#FFD70011] hover:border-[#FFD70066] hover:shadow-[0_0_25px_#FFD70055] transition-all backdrop-blur-md hover:scale-105"
          >
            <h3 className="text-2xl font-bold text-[#FFD700] mb-2 group-hover:tracking-wide transition">
              🎓 طلب تدريب
            </h3>
            <p className="text-gray-300">
              قم بإرسال مستواك وهدفك وسيتم التواصل معك.
            </p>
          </a>

        </div>

        {/* About Button */}
        <div className="mt-12 text-center">
          <a
            href="/about"
            className="px-10 py-3 rounded-xl border border-[#FFD70066] text-[#FFD700] font-bold hover:bg-[#FFD70022] hover:scale-105 transition-all"
          >
            من نحن
          </a>
        </div>

      </div>
    </main>
  );
}
