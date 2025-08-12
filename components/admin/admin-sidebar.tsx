"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Users,
  Film,
  BarChart3,
  Settings,
  Shield,
  DollarSign,
  Briefcase,
  Menu,
  Home,
  UserCheck,
  AlertTriangle,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Films",
    href: "/admin/films",
    icon: Film,
  },
  {
    title: "Filmmaker Verification",
    href: "/admin/verification",
    icon: UserCheck,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: DollarSign,
  },
  {
    title: "Job Postings",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Content Moderation",
    href: "/admin/moderation",
    icon: Shield,
  },
  {
    title: "System Reports",
    href: "/admin/reports",
    icon: AlertTriangle,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">Admin Panel</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-800",
                    pathname === item.href && "bg-gray-800 text-white",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileAdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent border-gray-700">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col bg-black border-gray-800">
        <ScrollArea className="flex-1">
          <AdminSidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
