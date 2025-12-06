"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleReset = async () => {
    setMessage("");
    setStatus("idle");

    if (!email.trim()) {
      setMessage("⚠ Please enter your email.");
      setStatus("error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 A reset link has been sent to your email.");
      setStatus("success");
    } catch {
      setMessage("❌ Failed to send reset link. Check your email.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative">

      {/* GOLD GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-[#0A0A0A] border border-[#FFD70033] p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#FFD700] to-[#D42246] bg-clip-text text-transparent text-center">
          Reset Password
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Enter your email to receive a password reset link.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 rounded-xl bg-black border border-zinc-700 text-white focus:border-yellow-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold hover:scale-105 transition"
        >
          Send Reset Link
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-yellow-400 hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
