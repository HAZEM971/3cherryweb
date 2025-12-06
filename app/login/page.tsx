"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link"; // **تم استيراد Link من next/link**

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول بنجاح 🎉");

      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      
      // عرض رسالة خطأ عامة للمستخدم لأسباب أمنية
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-xl w-full max-w-md text-white shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">تسجيل الدخول</h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <div>
          <label className="block mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-slate-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">كلمة المرور</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-slate-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* **الرابط الجديد: استعادة كلمة المرور** */}
        <Link
          href="/forgot-password"
          className="w-full text-yellow-300 text-sm mt-3 hover:underline block text-center"
        >
          Forgot Password?
        </Link>
        {/* ------------------------------------ */}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold"
        >
          {loading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>

        {/* **تم تغيير الرابط الموجود ليعود لإنشاء الحساب** */}
        <p className="text-center text-sm text-gray-300">
          ليس لديك حساب؟ <Link href="/register" className="text-red-400">إنشاء حساب</Link>
        </p>
        {/* ------------------------------------ */}
      </form>
    </div>
  );
}