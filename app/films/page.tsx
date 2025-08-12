import { createServerClient } from "@/lib/supabase/server"
import { FilmCard } from "@/components/film/film-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Film } from "lucide-react"

export default async function FilmsPage() {
  const supabase = createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get all published films
  const { data: films } = await supabase
    .from("films")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  // Get user's film access if logged in
  let userAccess: any[] = []
  if (user) {
    const { data: access } = await supabase
      .from("user_film_access")
      .select("film_id, access_type, expires_at")
      .eq("user_id", user.id)
    userAccess = access || []
  }

  // Check if user has access to each film
  const filmsWithAccess = films?.map((film) => {
    const access = userAccess.find((a) => a.film_id === film.id)
    const hasAccess =
      access &&
      (access.access_type === "purchase" ||
        (access.access_type === "rental" && new Date(access.expires_at) > new Date()))

    return {
      ...film,
      hasAccess: !!hasAccess,
    }
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Film className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-bold">Mbogiwood Films</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search films..." className="pl-10 bg-gray-900 border-gray-700 text-white" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="documentary">Documentary</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Films Grid */}
        {filmsWithAccess && filmsWithAccess.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filmsWithAccess.map((film) => (
              <FilmCard
                key={film.id}
                film={film}
                hasAccess={film.hasAccess}
                onWatch={() => {
                  // Navigate to watch page
                  window.location.href = `/watch/${film.id}`
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">No Films Available</h2>
            <p className="text-gray-400">Check back soon for new releases!</p>
          </div>
        )}
      </main>
    </div>
  )
}
