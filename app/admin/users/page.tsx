import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, UserCheck, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default async function UsersPage() {
  const supabase = createServerClient()

  // Get all users with their profiles
  const { data: users } = await supabase
    .from("users")
    .select(
      `
      *,
      filmmaker_profiles(verification_status)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400">Manage platform users and their accounts</p>
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
                <Input placeholder="Search users..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="viewer">Viewers</SelectItem>
                <SelectItem value="filmmaker">Filmmakers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Users ({users?.length || 0})</CardTitle>
          <CardDescription className="text-gray-400">All registered platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Joined</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} className="border-gray-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {user.full_name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{user.full_name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.user_type === "admin" ? "default" : "secondary"}
                      className={
                        user.user_type === "admin"
                          ? "bg-red-600 text-white"
                          : user.user_type === "filmmaker"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-white"
                      }
                    >
                      {user.user_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-600 text-white border-green-600">
                        Active
                      </Badge>
                      {user.user_type === "filmmaker" && user.filmmaker_profiles && (
                        <Badge
                          variant="outline"
                          className={
                            user.filmmaker_profiles.verification_status === "verified"
                              ? "bg-green-600 text-white border-green-600"
                              : user.filmmaker_profiles.verification_status === "pending"
                                ? "bg-yellow-600 text-white border-yellow-600"
                                : "bg-gray-600 text-white border-gray-600"
                          }
                        >
                          {user.filmmaker_profiles.verification_status}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <UserCheck className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <UserX className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
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
