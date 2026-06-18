import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login Admin — TopUpKu",
  description: "Portal masuk administrator untuk pengelolaan layanan TopUpKu.",
};

export default async function LoginPage() {
  const session = await getSession();

  // Redirect to admin if already authenticated
  if (session && session.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-bg-secondary/20 to-bg-primary relative overflow-hidden px-4">
      {/* Background radial highlight */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
