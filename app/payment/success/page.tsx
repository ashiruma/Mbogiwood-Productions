"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Film } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending")
  const [filmTitle, setFilmTitle] = useState("")

  const transactionId = searchParams.get("transaction_id")
  const paypalOrderId = searchParams.get("token") // PayPal returns token parameter

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId && !paypalOrderId) {
        setPaymentStatus("failed")
        setIsVerifying(false)
        return
      }

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: transactionId || paypalOrderId,
          }),
        })

        const data = await response.json()

        if (data.success && data.status === "completed") {
          setPaymentStatus("success")
          // Get film details if available
          if (data.filmTitle) {
            setFilmTitle(data.filmTitle)
          }
        } else {
          setPaymentStatus("failed")
        }
      } catch (error) {
        setPaymentStatus("failed")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [transactionId, paypalOrderId])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Verifying Payment</h2>
            <p className="text-gray-400 text-center">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {paymentStatus === "success" ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <Film className="h-16 w-16 text-red-600" />
            )}
          </div>
          <CardTitle className="text-white">
            {paymentStatus === "success" ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {paymentStatus === "success"
              ? "Your payment has been processed successfully."
              : "There was an issue processing your payment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentStatus === "success" ? (
            <>
              {filmTitle && (
                <div className="text-center">
                  <p className="text-white">You now have access to:</p>
                  <p className="font-semibold text-red-400">{filmTitle}</p>
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Link href="/dashboard">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Go to Dashboard</Button>
                </Link>
                <Link href="/films">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  >
                    Browse More Films
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-300 text-center">
                Your payment could not be processed. Please try again or contact support if the issue persists.
              </p>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => router.back()} className="w-full bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  >
                    Contact Support
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
