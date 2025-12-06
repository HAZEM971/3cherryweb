"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
