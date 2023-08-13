import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { api } from "../../api"
import { useOrganization } from "../../contexts/useUser"

interface DeleteDatasourceProps {
  id: number
}

export function DeleteDatasource({ id }: DeleteDatasourceProps) {
  const { toast } = useToast()
  const { deleteDatasource } = useOrganization()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleOnClick() {
    setDeleteLoading(true)
    try {
      const res = await api.delete(`/data-sources/${id}`)
      toast({
        title: "Datasource disconnected.",
      })
      deleteDatasource(id)
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please refresh and try again.",
      })
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <AlertDialog open={showDeleteDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
          Disconnect
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently disconnect your
            datasource and remove related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction disabled={deleteLoading} onClick={handleOnClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
