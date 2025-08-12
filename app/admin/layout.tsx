import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("users").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <div className="flex">
        <aside className="hidden w-64 border-r border-gray-800 bg-black md:block">
          <AdminSidebar />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
