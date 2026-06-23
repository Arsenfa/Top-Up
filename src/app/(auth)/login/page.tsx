import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login Admin - TopUpKu",
  description: "Portal masuk administrator untuk pengelolaan layanan TopUpKu.",
};

export default async function LoginPage() {
  const session = await getSession();

  // Redirect to admin if already authenticated
  if (session && session.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-primary px-4">
      <LoginForm />
    </div>
  );
}
