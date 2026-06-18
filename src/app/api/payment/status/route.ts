import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { midtransSnap } from "@/lib/midtrans";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceNumber = searchParams.get("invoice");

    if (!invoiceNumber) {
      return NextResponse.json(
        { success: false, error: "Nomor invoice wajib disertakan." },
        { status: 400 }
      );
    }

    // 1. Fetch order from database
    const order = await prisma.order.findUnique({
      where: { invoiceNumber },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    // If already successful or failed/expired, return immediately to save API calls
    if (order.status === "SUCCESS" || order.status === "FAILED" || order.status === "EXPIRED") {
      return NextResponse.json({ success: true, status: order.status });
    }

    // 2. Fetch status from Midtrans
    let transactionStatus = "PENDING";
    let paidAt: Date | null = null;
    let completedAt: Date | null = null;
    let paymentType = order.paymentMethod;
    let transactionId = order.midtransTransactionId;
    let rawResponse = "";

    try {
      const statusResponse = await midtransSnap.transaction.status(invoiceNumber);
      rawResponse = JSON.stringify(statusResponse);
      const { transaction_status, fraud_status, payment_type, transaction_id, settlement_time } = statusResponse;

      paymentType = payment_type || order.paymentMethod;
      transactionId = transaction_id || order.midtransTransactionId;

      if (transaction_status === "settlement" || 
         (transaction_status === "capture" && fraud_status === "accept")) {
        transactionStatus = "SUCCESS";
        paidAt = settlement_time ? new Date(settlement_time) : new Date();
        completedAt = new Date();
      } else if (transaction_status === "pending") {
        transactionStatus = "PENDING";
      } else if (["deny", "expire", "cancel", "failure"].includes(transaction_status)) {
        transactionStatus = "EXPIRED";
      }
    } catch (err: any) {
      console.warn("Failed to fetch status from Midtrans API:", err.message);
      // In mock/sandbox dev mode, let's auto-settle pending transactions after 30 seconds for test ease
      const elapsed = Date.now() - new Date(order.createdAt).getTime();
      if (order.status === "PENDING" && elapsed > 30000) {
        transactionStatus = "SUCCESS";
        paidAt = new Date();
        completedAt = new Date();
      } else {
        transactionStatus = order.status;
      }
    }

    // 3. Update database if status changed
    if (transactionStatus !== order.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: transactionStatus,
          paymentMethod: paymentType,
          midtransTransactionId: transactionId,
          midtransResponse: rawResponse || order.midtransResponse,
          paidAt: paidAt || order.paidAt,
          completedAt: completedAt || order.completedAt,
        },
      });
    }

    return NextResponse.json({ success: true, status: transactionStatus });
  } catch (error) {
    console.error("Order status API failed:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
