"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSessionFromCookies, requireAdmin } from "@/lib/auth";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    // CRITICAL: Verify admin authentication
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const session = getSessionFromCookies(cookieHeader);
    
    const authCheck = await requireAdmin(session);
    if (!authCheck.success) {
      console.error(`Unauthorized order update attempt by user: ${session?.userId || "unknown"}`);
      return { success: false, error: authCheck.error };
    }

    const validStatuses = ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "EXPIRED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Status transaksi tidak valid." };
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: "Transaksi tidak ditemukan." };
    }

    const dataToUpdate: Prisma.OrderUpdateInput = { status };
    if (status === "SUCCESS" && !order.paidAt) {
      dataToUpdate.paidAt = new Date();
      dataToUpdate.completedAt = new Date();
    }

    await prisma.order.update({
      where: { id: orderId },
      data: dataToUpdate,
    });

    // Audit log: Record who made the change
    if (session) {
      console.log(`Admin ${session.userId} (${session.email}) updated order ${order.invoiceNumber} to status: ${status}`);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/order/${order.invoiceNumber}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Terjadi kesalahan saat memperbarui status transaksi." };
  }
}

export async function simulatePayment(orderId: string) {
  try {
    // CRITICAL: Only allow in development environment
    if (process.env.NODE_ENV !== "development") {
      console.error(`Payment simulation attempted in ${process.env.NODE_ENV} environment`);
      return { success: false, error: "Payment simulation only available in development" };
    }

    // Still require admin auth even in development
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const session = getSessionFromCookies(cookieHeader);
    
    const authCheck = await requireAdmin(session);
    if (!authCheck.success) {
      return { success: false, error: authCheck.error };
    }

    return await updateOrderStatus(orderId, "SUCCESS");
  } catch (error) {
    console.error("Payment simulation failed:", error);
    return { success: false, error: "Payment simulation failed." };
  }
}
