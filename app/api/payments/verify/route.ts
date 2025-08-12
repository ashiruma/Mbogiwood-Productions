import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { PaymentOrchestrator } from "@/lib/payment-orchestrator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId } = body

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get transaction
    const { data: transaction } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .eq("user_id", user.id)
      .single()

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.status === "completed") {
      return NextResponse.json({ success: true, status: "completed" })
    }

    // Verify payment with provider
    const orchestrator = new PaymentOrchestrator()
    const verification = await orchestrator.verifyPayment(
      transaction.payment_provider,
      transaction.provider_transaction_id,
    )

    // Update transaction status
    await supabase.from("transactions").update({ status: verification.status }).eq("id", transactionId)

    if (verification.status === "completed") {
      // Grant film access
      const expiresAt =
        transaction.transaction_type === "rental"
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days for rental
          : null // Permanent for purchase

      await supabase.from("user_film_access").upsert({
        user_id: user.id,
        film_id: transaction.film_id,
        access_type: transaction.transaction_type,
        expires_at: expiresAt,
      })

      // Distribute revenue (90% to filmmaker, 10% platform fee)
      const filmakerRevenue = transaction.amount * 0.9
      // In a real app, you would queue this for payout processing

      return NextResponse.json({
        success: true,
        status: "completed",
        accessGranted: true,
      })
    }

    return NextResponse.json({
      success: true,
      status: verification.status,
      error: verification.error,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
