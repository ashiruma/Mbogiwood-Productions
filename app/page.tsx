import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Film, Play, Users, Award, Globe, Zap } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold">Mbogiwood</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white">
                Features
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white">
                Pricing
              </Link>
            </nav>
            <div className="flex space-x-4">
              {session ? (
                <Link href="/dashboard">
                  <Button className="bg-red-600 hover:bg-red-700">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-red-600 hover:bg-red-700">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Home of{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              African Cinema
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Stream, monetize, and collaborate on African films. A platform built for filmmakers, by filmmakers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Start Watching
              </Button>
            </Link>
            <Link href="/auth/signup?type=filmmaker">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-4 bg-transparent"
              >
                <Film className="mr-2 h-5 w-5" />
                Upload Your Film
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400">A complete ecosystem for African filmmakers and film lovers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <Play className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pay-to-View Streaming</h3>
              <p className="text-gray-400">
                Rent or purchase films with flexible pricing. Support filmmakers directly.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <Users className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Filmmaker Collaboration</h3>
              <p className="text-gray-400">
                Connect with other filmmakers, find co-production opportunities, and build your network.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <Award className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">90% Revenue Share</h3>
              <p className="text-gray-400">Keep 90% of your earnings. We believe in fair compensation for creators.</p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <Globe className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Payments</h3>
              <p className="text-gray-400">Accept payments via M-Pesa, Flutterwave, PayPal, and more.</p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <Zap className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-400">Track views, revenue, and audience engagement with detailed insights.</p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-gray-800">
              <Film className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Job Board</h3>
              <p className="text-gray-400">Find crew members, actors, and collaborators for your next project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Mbogiwood?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Whether you're a filmmaker looking to monetize your work or a film lover seeking authentic African stories,
            Mbogiwood is your platform.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Film className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-lg font-semibold">Mbogiwood</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Mbogiwood. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
