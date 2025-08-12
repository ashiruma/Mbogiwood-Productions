import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions"
import { Film, LogOut, User } from "lucide-react"
import { PaymentHistory } from "@/components/payment/payment-history"

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold">Mbogiwood</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">{profile?.full_name || user.email}</span>
              </div>
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-xl text-gray-400 mb-8">
            Hello {profile?.full_name || user.email}! You're now part of the Mbogiwood community.
          </p>
        </div>

        <div className="space-y-8">
          <PaymentHistory />

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
            <p className="text-gray-400 mb-6">
              Your account is set up and ready to go. The platform is currently under development, and more features
              will be available soon.
            </p>

            <div className="space-y-4">
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-2">Coming Soon:</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• Film browsing and streaming</li>
                  <li>• Payment integration</li>
                  <li>• Filmmaker tools and analytics</li>
                  <li>• Job board and collaboration features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
