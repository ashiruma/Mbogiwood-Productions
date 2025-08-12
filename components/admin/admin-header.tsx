import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Film, LogOut, User } from "lucide-react"
import { signOut } from "@/lib/actions"
import { MobileAdminSidebar } from "./admin-sidebar"
import Link from "next/link"

export async function AdminHeader() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("users").select("*").eq("id", user?.id).single()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/admin" className="mr-6 flex items-center space-x-2">
            <Film className="h-6 w-6 text-red-600" />
            <span className="hidden font-bold sm:inline-block text-white">Mbogiwood Admin</span>
          </Link>
        </div>
        <MobileAdminSidebar />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/admin" className="flex items-center space-x-2 md:hidden">
              <Film className="h-6 w-6 text-red-600" />
              <span className="font-bold text-white">Admin</span>
            </Link>
          </div>
          <nav className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name || ""} />
                    <AvatarFallback className="bg-gray-800 text-white">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-white">{profile?.full_name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="text-white hover:bg-gray-800">
                    <User className="mr-2 h-4 w-4" />
                    <span>User Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form action={signOut} className="w-full">
                    <button type="submit" className="flex w-full items-center text-white hover:bg-gray-800">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
