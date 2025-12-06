"use client";

import { useState, FormEvent } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// ---------------------
// Type Definitions
// ---------------------
interface AcademyLead {
  level: string;
  goal: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  createdAt: Date;
}

// ---------------------
// Component
// ---------------------
export default function AcademyPage() {
  const router = useRouter();

  // State
  const [level, setLevel] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Form Submit Handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const newLead: AcademyLead = {
      level,
      goal,
      userId: auth.currentUser?.uid ?? null,
      name: auth.currentUser?.displayName ?? null,
      email: auth.currentUser?.email ?? null,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "academy_leads"), newLead);

      setSuccess(true);
      setLevel("");
      setGoal("");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch (error) {
      console.error("Error saving academy lead:", error);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden p-6 flex items-center justify-center">

      {/* فخامة الخلفيات السينمائية */}
      <div className="absolute top-0 left-0 w-[650px] h-[650px] bg-[#FFD70022] blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4224622] blur-3xl rounded-full"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl bg-[#0A0A0A]/80 backdrop-blur-2xl border border-[#FFD70033] p-10 rounded-3xl shadow-[0_0_35px_#FFD70033]">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide
                       bg-gradient-to-r from-[#FFD700] to-[#D42246] bg-clip-text text-transparent drop-shadow-xl">
          التسجيل في أكاديمية 3CHERRYFX
        </h1>

        {/* Success message */}
        {success && (
          <div className="text-center p-4 mb-6 rounded-xl bg-[#101010] border border-[#FFD70066] shadow-[0_0_20px_#FFD70055] text-[#FFD700] text-lg font-semibold">
            ⭐ تم إرسال طلبك بنجاح!  
            <br />
            سيتم التواصل معك قريبًا.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Level */}
          <div>
            <label className="text-gray-300 mb-2 block text-lg font-medium">
              ما هو مستواك الحالي؟
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-black border border-[#333]
                         text-gray-200 focus:border-[#FFD700] outline-none transition"
            >
              <option value="">اختر مستواك</option>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="text-gray-300 mb-2 block text-lg font-medium">
              ما هو هدفك من التدريب؟
            </label>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              className="w-full h-32 p-3 rounded-xl bg-black border border-[#333]
                         text-gray-200 focus:border-[#FFD700] outline-none resize-none transition"
              placeholder="أخبرنا عن هدفك حتى نصمم لك برنامج تدريب مناسب…"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-black text-xl font-bold
                       bg-gradient-to-r from-[#FFD700] to-[#E2B24D]
                       shadow-[0_0_20px_#FFD70066] hover:scale-105 transition-transform"
          >
            {loading ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </form>

        {/* Back to Dashboard */}
        <p className="text-center mt-6 text-gray-400 text-lg">
          <a href="/dashboard" className="text-[#FFD700] hover:underline">
            ← العودة إلى لوحة التحكم
          </a>
        </p>
      </div>
    </main>
  );
}
