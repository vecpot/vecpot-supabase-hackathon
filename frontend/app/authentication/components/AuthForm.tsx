"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useSupabase } from "@/app/supabase-provider"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function hasAccessTokenInHash(url: string) {
  // Get the part of the URL after the "#" symbol
  const hash = url.split("#")[1]

  if (!hash) {
    // If there's no hash, return false as there's no access_token
    return false
  }

  // Extract the query parameters from the hash
  const params = new URLSearchParams(hash)

  // Check if the "access_token" parameter is provided
  return params.has("access_token")
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false)

  useEffect(() => {
    const currentURL = window.location.href
    const hasAccessToken = hasAccessTokenInHash(currentURL)

    if (hasAccessToken) {
      setIsRedirecting(true)
    }
  }, [])

  function signInWithGithub() {
    setIsGithubLoading(true)

    supabase.auth
      .signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_OAUTH_REDIRECT,
        },
      })
      .then(({ data, error }) => {
        if (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Please refresh and try again.",
          })
        }
      })
      .catch()
  }

  function signInWithGoogle() {
    setIsGoogleLoading(true)

    supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_OAUTH_REDIRECT,
        },
      })
      .then(({ data, error }) => {
        if (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Please refresh and try again.",
          })
        }
      })
      .catch()
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading}
        onClick={signInWithGoogle}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isGithubLoading}
        onClick={signInWithGithub}
      >
        {isGithubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  )
}
