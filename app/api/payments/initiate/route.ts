import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { PaymentOrchestrator } from "@/lib/payment-orchestrator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filmId, transactionType, paymentProvider, currency = "USD" } = body

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Get film details
    const { data: film } = await supabase.from("films").select("*").eq("id", filmId).eq("status", "published").single()

    if (!film) {
      return NextResponse.json({ error: "Film not found" }, { status: 404 })
    }

    // Check if user already has access
    const { data: existingAccess } = await supabase
      .from("user_film_access")
      .select("*")
      .eq("user_id", user.id)
      .eq("film_id", filmId)
      .single()

    if (
      existingAccess &&
      (existingAccess.access_type === "purchase" ||
        (existingAccess.access_type === "rental" && new Date(existingAccess.expires_at!) > new Date()))
    ) {
      return NextResponse.json({ error: "You already have access to this film" }, { status: 400 })
    }

    // Calculate amount based on transaction type
    let amount = 0
    if (transactionType === "rental") {
      amount = film.rental_price || 0
    } else if (transactionType === "purchase") {
      amount = film.purchase_price || 0
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Invalid transaction type or price" }, { status: 400 })
    }

    // Create pending transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        film_id: filmId,
        transaction_type: transactionType,
        amount,
        currency,
        payment_provider: paymentProvider,
        status: "pending",
      })
      .select()
      .single()

    if (transactionError) {
      return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
    }

    // Initialize payment with provider
    const orchestrator = new PaymentOrchestrator()
    const paymentParams = {
      amount,
      currency,
      email: user.email!,
      phone: profile.phone,
      filmId,
      userId: user.id,
      transactionType,
      metadata: {
        transactionId: transaction.id,
      },
    }

    const result = await orchestrator.processPayment(
      paymentProvider || orchestrator.getRecommendedProvider(currency),
      paymentParams,
      ["flutterwave", "paypal"], // Fallback providers
    )

    if (result.success) {
      // Update transaction with provider details
      await supabase
        .from("transactions")
        .update({
          provider_transaction_id: result.transactionId,
        })
        .eq("id", transaction.id)

      return NextResponse.json({
        success: true,
        transactionId: transaction.id,
        paymentUrl: result.paymentUrl,
        providerTransactionId: result.transactionId,
      })
    }

    // Update transaction as failed
    await supabase.from("transactions").update({ status: "failed" }).eq("id", transaction.id)

    return NextResponse.json({ error: result.error }, { status: 400 })
  } catch (error) {
    console.error("Payment initiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
