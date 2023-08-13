import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { useOrganization } from "../../contexts/useUser"

export default function DeleteTeamAccount() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { deleteTeamAccount, currentOrganization } = useOrganization()

  async function onClick() {
    if (!currentOrganization) return

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/organization?organization_id=${currentOrganization.id}`,
        {
          method: "DELETE",
        }
      )

      if (res.status !== 200) throw Error()

      deleteTeamAccount(currentOrganization.id)
      toast({
        title: "Team Account Deleted.",
      })
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please refresh and try again.",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your team
            account and related datas from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive" onClick={onClick} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
