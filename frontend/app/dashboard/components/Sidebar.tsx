import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { BarChart2, Database, File, Home, Mail } from "lucide-react"
import { useOnClickOutside } from "usehooks-ts"

import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
  })

  const currentPath = usePathname()

  useEffect(() => {
    if (setOpen && currentPath) {
      setOpen(false)
    }
  }, [currentPath])

  const buttonVariant = (targetPath: string): "secondary" | "ghost" => {
    if (currentPath === targetPath) {
      return "secondary"
    }

    return "ghost"
  }

  return (
    <div
      ref={ref}
      className={clsx({
        "bg-background": true,
        "border-r": true,
        "flex flex-col justify-betweeen": true,
        "md:w-full md:sticky md:top-16 md:z-0 top-0 z-20 fixed": true,
        "md:h-[calc(100vh_-_64px)] h-full w-[300px]": true,
        "transition-transform .3s ease-in-out md:translate-x-0": true,
        "-translate-x-full": !open,
      })}
    >
      <div className="top-0 md:sticky md:top-16">
        <div className="space-y-4 py-4">
          <div className="border-b px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              General
            </h2>
            <div className="space-y-1">
              <Link href="/dashboard" passHref>
                <Button
                  variant={buttonVariant("/dashboard")}
                  size="sm"
                  className="w-full justify-start"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Overview
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-b px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Management
            </h2>
            <div className="space-y-1">
              <Link href="/dashboard/datasources" passHref>
                <Button
                  variant={buttonVariant("/dashboard/datasources")}
                  size="sm"
                  className="w-full justify-start"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Datasources
                </Button>
              </Link>
              <Link href="/dashboard/statistics" passHref>
                <Button
                  variant={buttonVariant("/dashboard/statistics")}
                  size="sm"
                  className="w-full justify-start"
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Statistics
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-b px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Others
            </h2>
            <div className="space-y-1">
              <Link href="/dashboard/datasources" passHref>
                <Button
                  variant={buttonVariant("/dashboard/datasources")}
                  size="sm"
                  className="w-full justify-start"
                >
                  <File className="mr-2 h-4 w-4" />
                  Docs
                </Button>
              </Link>
              <Link href="/dashboard/statistics" passHref>
                <Button
                  variant={buttonVariant("/dashboard/statistics")}
                  size="sm"
                  className="w-full justify-start"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
