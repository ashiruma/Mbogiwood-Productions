import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { PaymentOrchestrator } from "@/lib/payment-orchestrator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get("verif-hash")

    // Verify webhook signature
    if (signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const orchestrator = new PaymentOrchestrator()
    const result = await orchestrator.handleWebhook("flutterwave", { body })

    if (result.success && result.transactionId) {
      const supabase = createServerClient()

      // Find transaction by provider transaction ID
      const { data: transaction } = await supabase
        .from("transactions")
        .select("*")
        .eq("provider_transaction_id", result.transactionId)
        .single()

      if (transaction) {
        // Update transaction status
        await supabase.from("transactions").update({ status: result.status }).eq("id", transaction.id)

        if (result.status === "completed") {
          // Grant film access
          const expiresAt =
            transaction.transaction_type === "rental" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null

          await supabase.from("user_film_access").upsert({
            user_id: transaction.user_id,
            film_id: transaction.film_id,
            access_type: transaction.transaction_type,
            expires_at: expiresAt,
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Flutterwave webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
