"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useSupabase } from "../supabase-provider"
import Navbar from "./components/Navbar"
import { SearchCommand } from "./components/SearchCommand"
import Sidebar from "./components/Sidebar"
import { useSearch } from "./contexts/useSearch"
import { useUser } from "./contexts/useUser"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCommandOpen, setIsCommandOpen } = useSearch()
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const { initUser } = useUser()
  const { supabase } = useSupabase()
  const router = useRouter()
  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        router.replace("/authentication")
      }

      if (data.session === null) {
        router.replace("/authentication")
      }
    }
    getSession()
    initUser()
  }, [])

  useEffect(() => {
    const down = (e: any) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="grid min-h-screen grid-rows-header bg-background">
      <Navbar onMenuButtonClick={() => setShowSidebar((prev) => !prev)} />
      <div className="grid md:grid-cols-sidebar">
        <Sidebar open={showSidebar} setOpen={(open) => setShowSidebar(open)} />
        <div className="p-4">{children}</div>
        <SearchCommand />
      </div>
    </div>
  )
}
