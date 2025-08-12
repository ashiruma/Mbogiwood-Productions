import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-800 max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-white">Payment Cancelled</CardTitle>
          <CardDescription className="text-gray-400">You cancelled the payment process.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-center">
            No charges were made to your account. You can try again anytime or browse our other films.
          </p>
          <div className="flex flex-col space-y-2">
            <Link href="/films">
              <Button className="w-full bg-red-600 hover:bg-red-700">Browse Films</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
