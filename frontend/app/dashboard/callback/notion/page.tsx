"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { useOrganization } from "../../contexts/useUser"

const clientId = "0145e441-8f96-40ea-8485-bbc46afcd3a7"
const clientSecret = "secret_qEoobZXzLziDJzEB3Lg2I1MV2hAhdOS1LdLmGNCrwm"
const BASE64_ENCODED_ID_AND_SECRET = Buffer.from(
  `${clientId}:${clientSecret}`
).toString("base64")

export type SearchParams = {
  code?: string
  state?: string
}

type Props = {
  searchParams: SearchParams
}

export default function NotionCallbackPage({ searchParams }: Props) {
  const { toast } = useToast()
  const { code, state } = searchParams
  const { currentOrganization, refreshCurrentOrganization } = useOrganization()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  async function handleRedirectedCode(code: string, organizationId: number) {
    try {
      const res = await fetch("/api/datasource/notion", {
        method: "post",
        body: JSON.stringify({
          code,
          organization_id: organizationId,
        }),
      })

      if (res.status !== 200) throw Error("Notion Connection Failed")

      await refreshCurrentOrganization()
      toast({
        title: "Notion connected!.",
      })
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please refresh and try again.",
      })
    } finally {
      router.replace("/dashboard")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!code || state === "error") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please refresh and try again.",
      })
      return
    }
    if (currentOrganization?.id && !isLoading) {
      setIsLoading(true)
      handleRedirectedCode(code, currentOrganization?.id)
    }
  }, [code, currentOrganization])

  return (
    <div className="flex flex-col items-center h-full justify-center">
      <p className="mb-4 text-lg font-bold">Connecting to Notion</p>
      <p className="mb-4">Please wait...</p>
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
    </div>
  )
}
