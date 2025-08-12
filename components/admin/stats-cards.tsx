import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Film, DollarSign, Eye } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalUsers: number
    totalFilms: number
    totalRevenue: number
    totalViews: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-gray-400">Active platform users</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Films</CardTitle>
          <Film className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalFilms.toLocaleString()}</div>
          <p className="text-xs text-gray-400">Published films</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-gray-400">Platform revenue</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-gray-400">Film views</p>
        </CardContent>
      </Card>
    </div>
  )
}
