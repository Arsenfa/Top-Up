export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { invoiceNumber, email } = await request.json();

    if (!invoiceNumber || !email) {
      return NextResponse.json(
        { success: false, error: "Nomor invoice dan email wajib diisi." },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");
    const order = await prisma.order.findUnique({
      where: { invoiceNumber: invoiceNumber.trim() },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Nomor invoice tidak terdaftar." },
        { status: 404 }
      );
    }

    if (order.customerEmail.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Alamat email tidak cocok dengan pesanan ini." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order check API failed:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan sistem internal." },
      { status: 500 }
    );
  }
}
