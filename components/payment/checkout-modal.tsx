"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Smartphone, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  film: {
    id: string
    title: string
    poster_url?: string
    rental_price?: number
    purchase_price?: number
  }
  onPaymentSuccess: () => void
}

export function CheckoutModal({ isOpen, onClose, film, onPaymentSuccess }: CheckoutModalProps) {
  const [transactionType, setTransactionType] = useState<"rental" | "purchase">("rental")
  const [paymentProvider, setPaymentProvider] = useState<string>("")
  const [phone, setPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const amount = transactionType === "rental" ? film.rental_price : film.purchase_price

  const handlePayment = async () => {
    if (!paymentProvider) {
      setError("Please select a payment method")
      return
    }

    if (paymentProvider === "mpesa" && !phone) {
      setError("Phone number is required for M-Pesa payments")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filmId: film.id,
          transactionType,
          paymentProvider,
          phone: paymentProvider === "mpesa" ? phone : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.paymentUrl) {
          // Redirect to payment provider
          window.open(data.paymentUrl, "_blank")
        }

        // Start polling for payment verification
        const pollPayment = async () => {
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transactionId: data.transactionId,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.status === "completed") {
            onPaymentSuccess()
            onClose()
          } else if (verifyData.status === "failed") {
            setError("Payment failed. Please try again.")
          } else {
            // Continue polling
            setTimeout(pollPayment, 3000)
          }
        }

        // Start polling after a short delay
        setTimeout(pollPayment, 2000)
      } else {
        setError(data.error || "Payment initiation failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Film Access</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your access type and payment method for "{film.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Film Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
            <div className="w-16 h-24 bg-gray-700 rounded overflow-hidden">
              {film.poster_url && (
                <img
                  src={film.poster_url || "/placeholder.svg"}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{film.title}</h3>
              <p className="text-sm text-gray-400">African Cinema</p>
            </div>
          </div>

          {/* Transaction Type */}
          <div className="space-y-3">
            <Label>Access Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTransactionType("rental")}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  transactionType === "rental"
                    ? "border-red-600 bg-red-600/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Rent</span>
                  <Badge variant="outline" className="bg-green-600 text-white border-green-600">
                    7 days
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-1">${film.rental_price?.toFixed(2)}</p>
              </button>

              <button
                onClick={() => setTransactionType("purchase")}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  transactionType === "purchase"
                    ? "border-red-600 bg-red-600/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Buy</span>
                  <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
                    Forever
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-1">${film.purchase_price?.toFixed(2)}</p>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <Select value={paymentProvider} onValueChange={setPaymentProvider}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Choose payment method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="flutterwave">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card Payment (Flutterwave)
                  </div>
                </SelectItem>
                <SelectItem value="mpesa">
                  <div className="flex items-center">
                    <Smartphone className="mr-2 h-4 w-4" />
                    M-Pesa
                  </div>
                </SelectItem>
                <SelectItem value="paypal">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    PayPal
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number for M-Pesa */}
          {paymentProvider === "mpesa" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="254XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">${amount?.toFixed(2)}</span>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || !paymentProvider}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount?.toFixed(2)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
