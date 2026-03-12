"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, User, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "@/app/sidebar-context"
import { useAuth } from "@/app/auth-context"
import { useLanguage } from "@/app/language-context"
import { useState, useLayoutEffect } from "react"
import { NotificationBell } from "@/components/dashboard/notifications/NotificationBell"

export function Navbar() {
  const { toggleMobileSidebar, isCollapsed, toggleSidebar } = useSidebar()
  const { user, logout, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
  }

  if (!mounted || loading) {
    return (
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-red-900 to-red-800 shadow-lg">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden text-amber-100 hover:text-white p-2 rounded-lg hover:bg-red-700/50 transition-colors"
                aria-label="Toggle sidebar menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md flex items-center justify-center text-red-900 font-bold text-sm shadow-md">
                  HM
                </div>
                <span className="font-serif font-bold text-amber-100 hidden sm:inline text-lg">{t("app.name")}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-red-900 to-red-800 shadow-lg">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Menu Icon, Collapse Toggle, and Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile sidebar trigger */}
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden text-amber-100 hover:text-white p-2 rounded-lg hover:bg-red-700/50 transition-colors"
              aria-label="Toggle sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Desktop collapse / expand trigger */}
            <button
              onClick={toggleSidebar}
              className="hidden md:inline-flex items-center justify-center text-amber-100 hover:text-white p-2 rounded-lg hover:bg-red-700/50 transition-colors"
              aria-label="Collapse or expand sidebar"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md flex items-center justify-center text-red-900 font-bold text-sm shadow-md">
                HM
              </div>
              <span className="font-serif font-bold text-amber-100 hidden sm:inline text-lg">{t("app.name")}</span>
            </Link>
          </div>

          {/* Right Side - Notifications + User Info or Login */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            {user ? (
              <>
                <div className="flex items-center gap-2 text-amber-100 text-sm hidden sm:flex">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-amber-100 hover:text-white px-3 py-2 rounded-lg hover:bg-red-700/50 transition-colors"
                  title={t("nav.logout")}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("nav.logout")}</span>
                </button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="text-amber-100 hover:text-white hover:bg-red-800">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
