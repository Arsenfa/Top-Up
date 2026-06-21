export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
  serverKey: string
): boolean {
  const input = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash("sha512").update(input).digest("hex");
  return hash === signatureKey;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { error: "Payload parameters missing." },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isValid = verifySignature(order_id, status_code, gross_amount, signature_key, serverKey);

    if (!isValid) {
      console.error(`Invalid signature key for order ID: ${order_id}`);
      return NextResponse.json({ error: "Invalid signature verified." }, { status: 403 });
    }

    const { prisma } = await import("@/lib/prisma");
    const order = await prisma.order.findUnique({
      where: { invoiceNumber: order_id },
    });

    if (!order) {
      console.error(`Order not found for invoice ID: ${order_id}`);
      return NextResponse.json({ error: "Order not found in system." }, { status: 404 });
    }

    let orderStatus = "PENDING";
    let paidAt: Date | null = null;
    let completedAt: Date | null = null;

    if (transaction_status === "settlement" ||
       (transaction_status === "capture" && fraud_status === "accept")) {
      orderStatus = "SUCCESS";
      paidAt = new Date();
      completedAt = new Date();
    } else if (transaction_status === "pending") {
      orderStatus = "PENDING";
    } else if (["deny", "expire", "cancel", "failure"].includes(transaction_status)) {
      orderStatus = "EXPIRED";
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: orderStatus,
        paymentMethod: payment_type || order.paymentMethod,
        midtransTransactionId: transaction_id || order.midtransTransactionId,
        midtransResponse: JSON.stringify(body),
        paidAt: paidAt || order.paidAt,
        completedAt: completedAt || order.completedAt,
      },
    });

    console.log(`Order ${order_id} successfully updated to status: ${orderStatus}`);

    return NextResponse.json({ success: true, message: "Webhook processed." });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal processing error." }, { status: 500 });
  }
}
