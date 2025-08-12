export interface PaymentProvider {
  name: "mpesa" | "flutterwave" | "paypal"
  processPayment(params: PaymentParams): Promise<PaymentResult>
  verifyPayment(transactionId: string): Promise<PaymentVerification>
  handleWebhook(payload: any): Promise<WebhookResult>
}

export interface PaymentParams {
  amount: number
  currency: string
  email: string
  phone?: string
  filmId: string
  userId: string
  transactionType: "rental" | "purchase" | "subscription"
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  paymentUrl?: string
  reference?: string
  error?: string
}

export interface PaymentVerification {
  success: boolean
  status: "completed" | "pending" | "failed"
  amount: number
  currency: string
  reference: string
  error?: string
}

export interface WebhookResult {
  success: boolean
  transactionId?: string
  status?: "completed" | "failed"
  error?: string
}
