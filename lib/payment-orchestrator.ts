import { FlutterwaveProvider } from "./payment-providers/flutterwave"
import { MpesaProvider } from "./payment-providers/mpesa"
import { PaypalProvider } from "./payment-providers/paypal"
import type { PaymentProvider, PaymentParams, PaymentResult } from "./payment-providers/types"

export class PaymentOrchestrator {
  private providers: Map<string, PaymentProvider> = new Map()

  constructor() {
    this.providers.set("flutterwave", new FlutterwaveProvider())
    this.providers.set("mpesa", new MpesaProvider())
    this.providers.set("paypal", new PaypalProvider())
  }

  async processPayment(
    providerName: string,
    params: PaymentParams,
    fallbackProviders: string[] = [],
  ): Promise<PaymentResult> {
    // Try primary provider
    const provider = this.providers.get(providerName)
    if (provider) {
      const result = await provider.processPayment(params)
      if (result.success) {
        return result
      }
    }

    // Try fallback providers
    for (const fallbackName of fallbackProviders) {
      const fallbackProvider = this.providers.get(fallbackName)
      if (fallbackProvider) {
        const result = await fallbackProvider.processPayment(params)
        if (result.success) {
          return result
        }
      }
    }

    return {
      success: false,
      transactionId: "",
      error: "All payment providers failed",
    }
  }

  async verifyPayment(providerName: string, transactionId: string) {
    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`)
    }

    return provider.verifyPayment(transactionId)
  }

  async handleWebhook(providerName: string, payload: any) {
    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`)
    }

    return provider.handleWebhook(payload)
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  // Get recommended provider based on user location/currency
  getRecommendedProvider(currency: string, country?: string): string {
    if (currency === "KES" || country === "KE") {
      return "mpesa"
    }

    if (["NGN", "GHS", "UGX", "TZS"].includes(currency)) {
      return "flutterwave"
    }

    return "paypal" // Default for international payments
  }
}
