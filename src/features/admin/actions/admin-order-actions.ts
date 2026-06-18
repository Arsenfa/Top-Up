"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const validStatuses = ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "EXPIRED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Status transaksi tidak valid." };
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: "Transaksi tidak ditemukan." };
    }

    const dataToUpdate: any = { status };
    if (status === "SUCCESS" && !order.paidAt) {
      dataToUpdate.paidAt = new Date();
      dataToUpdate.completedAt = new Date();
    }

    await prisma.order.update({
      where: { id: orderId },
      data: dataToUpdate,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/order/${order.invoiceNumber}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Terjadi kesalahan saat memperbarui status transaksi." };
  }
}
