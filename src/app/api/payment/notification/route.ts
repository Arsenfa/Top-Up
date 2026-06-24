export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { mapMidtransStatus } from "@/lib/midtrans-status";

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
  serverKey: string
): boolean {
  const input = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash("sha512").update(input).digest("hex");
  // Constant-time comparison to prevent timing side-channel
  if (hash.length !== signatureKey.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signatureKey));
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

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY not configured");
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }
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

    // Idempotency: skip if already in terminal state
    if (order.status === "SUCCESS" || order.status === "FAILED" || order.status === "EXPIRED") {
      return NextResponse.json({ success: true, message: "Order already in terminal state." });
    }

    const orderStatus = mapMidtransStatus(transaction_status, fraud_status);
    const paidAt = orderStatus === "SUCCESS" ? new Date() : null;
    const completedAt = orderStatus === "SUCCESS" ? new Date() : null;

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

    return NextResponse.json({ success: true, message: "Webhook processed." });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal processing error." }, { status: 500 });
  }
}
