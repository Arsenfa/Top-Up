/**
 * Maps Midtrans transaction_status + fraud_status to internal order status.
 * Shared between webhook handler and status polling endpoint.
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): string {
  if (
    transactionStatus === "settlement" ||
    (transactionStatus === "capture" && fraudStatus === "accept")
  ) {
    return "SUCCESS";
  }
  if (transactionStatus === "pending") {
    return "PENDING";
  }
  if (["deny", "expire", "cancel", "failure"].includes(transactionStatus)) {
    return "EXPIRED";
  }
  return "PENDING"; // fallback for unknown statuses
}
