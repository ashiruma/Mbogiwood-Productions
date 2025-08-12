import type { PaymentProvider, PaymentParams, PaymentResult, PaymentVerification, WebhookResult } from "./types"

export class PaypalProvider implements PaymentProvider {
  name = "paypal" as const
  private clientId: string
  private clientSecret: string
  private baseUrl = process.env.NODE_ENV === "production" ? "https://api.paypal.com" : "https://api.sandbox.paypal.com"

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID!
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const data = await response.json()
    return data.access_token
  }

  async processPayment(params: PaymentParams): Promise<PaymentResult> {
    try {
      const accessToken = await this.getAccessToken()

      const payload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `MBOGIWOOD_${params.filmId}_${params.userId}`,
            amount: {
              currency_code: params.currency,
              value: params.amount.toFixed(2),
            },
            description: `Mbogiwood Film ${params.transactionType}`,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancel`,
          brand_name: "Mbogiwood",
          user_action: "PAY_NOW",
        },
      }

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.status === "CREATED") {
        const approveLink = data.links.find((link: any) => link.rel === "approve")

        return {
          success: true,
          transactionId: data.id,
          paymentUrl: approveLink?.href,
          reference: data.id,
        }
      }

      return {
        success: false,
        transactionId: "",
        error: "PayPal order creation failed",
      }
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        error: "PayPal processing error",
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${transactionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await response.json()

      if (data.status === "COMPLETED") {
        const amount = Number.parseFloat(data.purchase_units[0].amount.value)

        return {
          success: true,
          status: "completed",
          amount,
          currency: data.purchase_units[0].amount.currency_code,
          reference: data.id,
        }
      }

      return {
        success: false,
        status: data.status === "CANCELLED" ? "failed" : "pending",
        amount: 0,
        currency: "USD",
        reference: data.id,
        error: `PayPal order status: ${data.status}`,
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
      const event = payload.body

      if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
        return {
          success: true,
          transactionId: event.resource.id,
          status: "completed",
        }
      }

      return {
        success: true,
        transactionId: event.resource.id,
        status: "pending",
      }
    } catch (error) {
      return { success: false, error: "Webhook processing failed" }
    }
  }
}
