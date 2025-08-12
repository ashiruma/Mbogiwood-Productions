import type { PaymentProvider, PaymentParams, PaymentResult, PaymentVerification, WebhookResult } from "./types"

export class MpesaProvider implements PaymentProvider {
  name = "mpesa" as const
  private consumerKey: string
  private consumerSecret: string
  private baseUrl = "https://sandbox.safaricom.co.ke" // Use production URL in production

  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY!
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET!
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64")

    const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    const data = await response.json()
    return data.access_token
  }

  async processPayment(params: PaymentParams): Promise<PaymentResult> {
    try {
      if (!params.phone) {
        return {
          success: false,
          transactionId: "",
          error: "Phone number is required for M-Pesa payments",
        }
      }

      const accessToken = await this.getAccessToken()
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -3)
      const password = Buffer.from(`174379${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64")

      const payload = {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(params.amount),
        PartyA: params.phone,
        PartyB: "174379",
        PhoneNumber: params.phone,
        CallBackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mpesa`,
        AccountReference: `MBOGIWOOD_${params.filmId}`,
        TransactionDesc: `Payment for film ${params.transactionType}`,
      }

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.ResponseCode === "0") {
        return {
          success: true,
          transactionId: data.CheckoutRequestID,
          reference: data.MerchantRequestID,
        }
      }

      return {
        success: false,
        transactionId: "",
        error: data.ResponseDescription || "M-Pesa payment failed",
      }
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        error: "M-Pesa processing error",
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -3)
      const password = Buffer.from(`174379${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64")

      const payload = {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: transactionId,
      }

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.ResponseCode === "0") {
        return {
          success: true,
          status: "completed",
          amount: data.Amount || 0,
          currency: "KES",
          reference: data.MpesaReceiptNumber,
        }
      }

      return {
        success: false,
        status: data.ResultCode === "1032" ? "pending" : "failed",
        amount: 0,
        currency: "KES",
        reference: "",
        error: data.ResultDesc,
      }
    } catch (error) {
      return {
        success: false,
        status: "failed",
        amount: 0,
        currency: "KES",
        reference: "",
        error: "Verification failed",
      }
    }
  }

  async handleWebhook(payload: any): Promise<WebhookResult> {
    try {
      const body = payload.body.Body

      if (body.stkCallback.ResultCode === 0) {
        return {
          success: true,
          transactionId: body.stkCallback.CheckoutRequestID,
          status: "completed",
        }
      }

      return {
        success: true,
        transactionId: body.stkCallback.CheckoutRequestID,
        status: "failed",
      }
    } catch (error) {
      return { success: false, error: "Webhook processing failed" }
    }
  }
}
