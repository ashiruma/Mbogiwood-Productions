import { createServerClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = createServerClient()

  // Get dashboard statistics
  const [
    { count: totalUsers },
    { count: totalFilms },
    { data: transactions },
    { count: totalViews },
    { data: recentFilms },
    { data: pendingVerifications },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("films").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("transactions").select("amount").eq("status", "completed"),
    supabase.from("film_views").select("*", { count: "exact", head: true }),
    supabase
      .from("films")
      .select("id, title, status, created_at, filmmaker_profiles(user_id, users(full_name))")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("filmmaker_profiles")
      .select("id, users(full_name, email), created_at")
      .eq("verification_status", "pending")
      .limit(5),
  ])

  const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

  const stats = {
    totalUsers: totalUsers || 0,
    totalFilms: totalFilms || 0,
    totalRevenue,
    totalViews: totalViews || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your Mbogiwood platform</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Films */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Films</CardTitle>
            <CardDescription className="text-gray-400">Latest film submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFilms?.length ? (
                recentFilms.map((film) => (
                  <div key={film.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{film.title}</p>
                      <p className="text-sm text-gray-400">
                        by {film.filmmaker_profiles?.users?.full_name || "Unknown"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          film.status === "published" ? "default" : film.status === "review" ? "secondary" : "outline"
                        }
                        className={
                          film.status === "published"
                            ? "bg-green-600 text-white"
                            : film.status === "review"
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-600 text-white"
                        }
                      >
                        {film.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No films yet</p>
              )}
            </div>
            <div className="mt-4">
              <Link href="/admin/films">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View All Films
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Pending Verifications</CardTitle>
            <CardDescription className="text-gray-400">Filmmaker verification requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications?.length ? (
                pendingVerifications.map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{verification.users?.full_name}</p>
                      <p className="text-sm text-gray-400">{verification.users?.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-yellow-600 text-white">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No pending verifications</p>
              )}
            </div>
            <div className="mt-4">
              <Link href="/admin/verification">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Review Verifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/admin/films?status=review">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Eye className="mr-2 h-4 w-4" />
                Review Films
              </Button>
            </Link>
            <Link href="/admin/verification">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Filmmakers
              </Button>
            </Link>
            <Link href="/admin/moderation">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <XCircle className="mr-2 h-4 w-4" />
                Content Moderation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
