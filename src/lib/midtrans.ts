import midtransClient from "midtrans-client";

// Lazy init Midtrans Snap client to avoid build-time errors
let _midtransSnap: midtransClient.Snap | null = null;

export function getMidtransSnap(): midtransClient.Snap {
  if (!_midtransSnap) {
    _midtransSnap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    });
  }
  return _midtransSnap;
}

export const midtransSnap = getMidtransSnap();
