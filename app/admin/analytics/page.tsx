"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, Eye, DollarSign, Film } from "lucide-react"

// Mock data for charts - in real app, this would come from Supabase
const mockData = {
  monthlyRevenue: [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 25000 },
    { month: "Jun", revenue: 28000 },
  ],
  topFilms: [
    { title: "The Last Kingdom", views: 15420, revenue: 8500 },
    { title: "Nollywood Dreams", views: 12300, revenue: 6800 },
    { title: "Lagos Stories", views: 9800, revenue: 5200 },
    { title: "African Sunrise", views: 8500, revenue: 4100 },
    { title: "Desert Tales", views: 7200, revenue: 3600 },
  ],
  userGrowth: [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1450 },
    { month: "Mar", users: 1680 },
    { month: "Apr", users: 1920 },
    { month: "May", users: 2180 },
    { month: "Jun", users: 2450 },
  ],
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Platform performance and insights</p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$45,231</div>
            <p className="text-xs text-green-400">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,450</div>
            <p className="text-xs text-green-400">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">53,240</div>
            <p className="text-xs text-green-400">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Published Films</CardTitle>
            <Film className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">127</div>
            <p className="text-xs text-green-400">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Monthly Revenue</CardTitle>
            <CardDescription className="text-gray-400">Revenue trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between space-x-2">
              {mockData.monthlyRevenue.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center space-y-2">
                  <div
                    className="bg-red-600 rounded-t w-12 transition-all hover:bg-red-500"
                    style={{
                      height: `${(data.revenue / 30000) * 250}px`,
                    }}
                  />
                  <span className="text-xs text-gray-400">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">User Growth</CardTitle>
            <CardDescription className="text-gray-400">New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between space-x-2">
              {mockData.userGrowth.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center space-y-2">
                  <div
                    className="bg-blue-600 rounded-t w-12 transition-all hover:bg-blue-500"
                    style={{
                      height: `${(data.users / 3000) * 250}px`,
                    }}
                  />
                  <span className="text-xs text-gray-400">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Films */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Top Performing Films</CardTitle>
          <CardDescription className="text-gray-400">Films with highest views and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.topFilms.map((film, index) => (
              <div key={film.title} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{film.title}</p>
                    <p className="text-sm text-gray-400">{film.views.toLocaleString()} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">${film.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
