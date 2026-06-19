import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/layout/admin-layout-client";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
