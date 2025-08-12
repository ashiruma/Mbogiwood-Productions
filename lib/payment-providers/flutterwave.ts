import type { PaymentProvider, PaymentParams, PaymentResult, PaymentVerification, WebhookResult } from "./types"

export class FlutterwaveProvider implements PaymentProvider {
  name = "flutterwave" as const
  private publicKey: string
  private secretKey: string
  private baseUrl = "https://api.flutterwave.com/v3"

  constructor() {
    this.publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY!
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY!
  }

  async processPayment(params: PaymentParams): Promise<PaymentResult> {
    try {
      const payload = {
        tx_ref: `mbogiwood_${Date.now()}_${params.userId}`,
        amount: params.amount,
        currency: params.currency,
        redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
        customer: {
          email: params.email,
          phone_number: params.phone,
        },
        customizations: {
          title: "Mbogiwood Film Payment",
          description: `Payment for film access - ${params.transactionType}`,
          logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        },
        meta: {
          filmId: params.filmId,
          userId: params.userId,
          transactionType: params.transactionType,
        },
      }

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.status === "success") {
        return {
          success: true,
          transactionId: data.data.id,
          paymentUrl: data.data.link,
          reference: payload.tx_ref,
        }
      }

      return {
        success: false,
        transactionId: "",
        error: data.message || "Payment initialization failed",
      }
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        error: "Payment processing error",
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      })

      const data = await response.json()

      if (data.status === "success" && data.data.status === "successful") {
        return {
          success: true,
          status: "completed",
          amount: data.data.amount,
          currency: data.data.currency,
          reference: data.data.tx_ref,
        }
      }

      return {
        success: false,
        status: data.data.status === "failed" ? "failed" : "pending",
        amount: data.data.amount || 0,
        currency: data.data.currency || "USD",
        reference: data.data.tx_ref || "",
        error: data.message,
      }
    } catch (error) {
      return {
        success: false,
        status: "failed",
        amount: 0,
        currency: "USD",
        reference: "",
        error: "Verification failed",
      }
    }
  }

  async handleWebhook(payload: any): Promise<WebhookResult> {
    try {
      // Verify webhook signature
      const signature = payload.headers["verif-hash"]
      const expectedSignature = process.env.FLUTTERWAVE_WEBHOOK_SECRET

      if (signature !== expectedSignature) {
        return { success: false, error: "Invalid signature" }
      }

      const event = payload.body
      if (event.event === "charge.completed" && event.data.status === "successful") {
        return {
          success: true,
          transactionId: event.data.id,
          status: "completed",
        }
      }

      return {
        success: true,
        transactionId: event.data.id,
        status: event.data.status === "failed" ? "failed" : "pending",
      }
    } catch (error) {
      return { success: false, error: "Webhook processing failed" }
    }
  }
}
