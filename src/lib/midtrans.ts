import midtransClient from "midtrans-client";

// Lazy initialization to avoid build-time errors when env vars not available
let _midtransSnap: midtransClient.Snap | null = null;

export function getMidtransSnap(): midtransClient.Snap {
  if (!_midtransSnap) {
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;

    // Validate required environment variables
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY environment variable is not set");
      throw new Error("Midtrans configuration error: Server key missing");
    }

    if (!clientKey) {
      console.error("MIDTRANS_CLIENT_KEY environment variable is not set");
      throw new Error("Midtrans configuration error: Client key missing");
    }

    _midtransSnap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey,
    });

    console.log(`Midtrans initialized in ${isProduction ? "production" : "sandbox"} mode`);
  }
  return _midtransSnap;
}
