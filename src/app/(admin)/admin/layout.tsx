import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/layout/admin-layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Gatekeeper: verify session on the server
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
