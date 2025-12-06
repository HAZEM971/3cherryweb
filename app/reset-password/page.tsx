import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const oobCodeParam = searchParams.oobCode;
  const oobCode =
    typeof oobCodeParam === "string" ? oobCodeParam : Array.isArray(oobCodeParam) ? oobCodeParam[0] : null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm oobCode={oobCode} />
    </Suspense>
  );
}
