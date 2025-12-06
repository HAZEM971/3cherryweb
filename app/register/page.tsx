"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React from 'react'; // يجب استيراد React لاستخدام React.FormEvent

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // تم استبدال (e: any) بـ (e: React.FormEvent)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // إنشاء المستخدم
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // تعديل الاسم
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // حفظ بيانات المستخدم داخل Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        // ملاحظة: يفضل استخدام serverTimestamp() لـ createdAt لضمان دقة وقت الخادم
        createdAt: new Date(),
        isAdmin: false,
      });

      router.push("/dashboard");

    } catch (error) { // تم إزالة : any واستخدام فحص النوع
      if (error instanceof Error) {
        setErrorMsg(error.message);
        console.error("Registration Error:", error.message);
      } else {
        setErrorMsg("حدث خطأ غير متوقع أثناء التسجيل.");
        console.error("Unknown Registration Error:", error);
      }
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">

      {/* خلفيات الحلم الذهبي */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#F5C56C22] blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4224622] blur-3xl rounded-full"></div>

      {/* صندوق التسجيل */}
      <div className="relative z-10 w-full max-w-md bg-[#0A0A0A]/80 backdrop-blur-xl border border-[#FFD70033] p-8 rounded-2xl shadow-[0_0_25px_#FFD70022]">

        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#FFD700] to-[#D42246] bg-clip-text text-transparent">
          إنشاء حساب جديد
        </h1>

        {errorMsg && (
          <p className="text-red-400 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="text-gray-300">الاسم الكامل</label>
            <input
              className="w-full p-3 rounded-lg bg-black border border-[#444] text-gray-200 focus:border-[#FFD700] outline-none"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-300">البريد الإلكتروني</label>
            <input
              className="w-full p-3 rounded-lg bg-black border border-[#444] text-gray-200 focus:border-[#FFD700] outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-300">كلمة المرور</label>
            <input
              className="w-full p-3 rounded-lg bg-black border border-[#444] text-gray-200 focus:border-[#FFD700] outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#E2B24D] text-black font-bold hover:scale-105 transition-all"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-4">
          لديك حساب؟  
          <a href="/login" className="text-[#FFD700] hover:underline">سجّل الدخول</a>
        </p>
      </div>

    </main>
  );
}