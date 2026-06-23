declare module "midtrans-client" {
  export interface MidtransTransactionParameter {
    transaction_details: { order_id: string; gross_amount: number };
    item_details?: Array<{ id: string; price: number; quantity: number; name: string }>;
    customer_details?: { first_name?: string; email?: string; phone?: string };
    enabled_payments?: string[];
    credit_card?: { secure?: boolean };
    [key: string]: unknown;
  }

  export interface MidtransTransactionStatus {
    transaction_status: string;
    fraud_status?: string;
    payment_type?: string;
    transaction_id?: string;
    settlement_time?: string;
    [key: string]: unknown;
  }

  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    createTransaction(parameter: MidtransTransactionParameter): Promise<{
      token: string;
      redirect_url: string;
    }>;
    transaction: {
      status(orderId: string): Promise<MidtransTransactionStatus>;
    };
  }
}
