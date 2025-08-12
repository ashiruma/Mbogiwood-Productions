import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default async function FilmsPage() {
  const supabase = createServerClient()

  // Get all films with filmmaker information
  const { data: films } = await supabase
    .from("films")
    .select(
      `
      *,
      filmmaker_profiles(
        id,
        users(full_name, email)
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Film Management</h1>
        <p className="text-gray-400">Review and manage all films on the platform</p>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search films..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="documentary">Documentary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Films Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Films ({films?.length || 0})</CardTitle>
          <CardDescription className="text-gray-400">All films submitted to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Film</TableHead>
                <TableHead className="text-gray-300">Filmmaker</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Views</TableHead>
                <TableHead className="text-gray-300">Revenue</TableHead>
                <TableHead className="text-gray-300">Submitted</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {films?.map((film) => (
                <TableRow key={film.id} className="border-gray-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-12 w-20 rounded overflow-hidden bg-gray-800">
                        {film.poster_url ? (
                          <Image
                            src={film.poster_url || "/placeholder.svg"}
                            alt={film.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Eye className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{film.title}</p>
                        <p className="text-sm text-gray-400">{film.genre?.join(", ") || "No genre"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{film.filmmaker_profiles?.users?.full_name || "Unknown"}</p>
                      <p className="text-sm text-gray-400">{film.filmmaker_profiles?.users?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        film.status === "published" ? "default" : film.status === "review" ? "secondary" : "outline"
                      }
                      className={
                        film.status === "published"
                          ? "bg-green-600 text-white"
                          : film.status === "review"
                            ? "bg-yellow-600 text-white"
                            : film.status === "draft"
                              ? "bg-gray-600 text-white"
                              : "bg-red-600 text-white"
                      }
                    >
                      {film.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{film.view_count?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-gray-300">
                    ${((film.rental_price || 0) + (film.purchase_price || 0)).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-300">{new Date(film.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {film.status === "review" && (
                          <>
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
