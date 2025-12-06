"use client";

import { useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const router = useRouter();

  const oobCode = search.get("oobCode");

  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleReset = async () => {
    setMsg("");
    setStatus("idle");

    if (!password || !confirm) {
      setMsg("⚠ Please fill both fields.");
      setStatus("error");
      return;
    }

    if (password !== confirm) {
      setMsg("❌ Passwords do not match.");
      setStatus("error");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode!, password);
      setStatus("success");
      setMsg("✅ Your password has been reset successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setMsg("❌ Invalid or expired link.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4 relative text-white">
      {/* GOLD EFFECT */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[90px]"></div>

      <div className="relative z-10 w-full max-w-md bg-[#0B0B0B] border border-[#FFD70044] p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
          Create New Password
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-6">
          Enter your new password below.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-3 rounded-xl bg-black border border-zinc-700 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-xl bg-black border border-zinc-700 text-white"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold hover:scale-105 transition"
        >
          Reset Password
        </button>

        {msg && (
          <p
            className={`mt-4 text-center ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </main>
  );
}
