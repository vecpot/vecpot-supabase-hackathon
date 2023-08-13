"use client"

import { LogOut, PlusCircle, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useSupabase } from "@/app/supabase-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAvatarFallback } from "@/lib/format"

import { useUser } from "../contexts/useUser"

export function UserNav() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { user } = useUser()

  const signOut = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    await supabase.auth.signOut()
    router.push("/authentication")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>{formatAvatarFallback(user.name)}</AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user ? user.name : ""}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user ? user.email : ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/profile" passHref>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          {/* <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem> */}
          <Link href="/dashboard/setting" passHref>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
