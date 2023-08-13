import { useCallback, useEffect, useRef, useState } from "react"

import { getNotionAuthURL } from "@/lib/oauth"
import {
  ConnectedDatasource,
  DatasourceType,
  DatasourceTypeConfigField,
} from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { api } from "../api"
import { useOrganization } from "../contexts/useUser"

interface ConnectDatasourceProps {
  datasourceType: DatasourceType
}

export default function ConnectDatasource({
  datasourceType,
}: ConnectDatasourceProps) {
  const { toast } = useToast()
  const { currentOrganization } = useOrganization()

  const [connectLoading, setConnectLoading] = useState(false)
  const [showConnectDialog, setShowConnectDialog] = useState<boolean>(false)
  const [connectedDatasource, setConnectedDatasource] =
    useState<ConnectedDatasource>()

  const configFields: DatasourceTypeConfigField[] = JSON.parse(
    datasourceType.configFields
  )
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(
    []
  )
  const handleClick = useCallback(() => {
    if (datasourceType.type === "NOTION") {
      window.location.href = getNotionAuthURL()
      return
    }
    setShowConnectDialog(true)
  }, [datasourceType])

  useEffect(() => {
    if (currentOrganization) {
      const _connectedDatasource = currentOrganization.data_source.filter(
        (source) => source.source_type === datasourceType.type
      )[0]

      if (_connectedDatasource) {
        setConnectedDatasource(_connectedDatasource)
      }
    }
  }, [currentOrganization, datasourceType])

  async function connectDatasource() {
    const hasAllInput =
      inputRefs.current.filter((ref) => ref !== null && ref.value === "")
        .length === 0

    if (!hasAllInput) return

    let config: Record<string, string> = {}

    for (const inputRef of inputRefs.current) {
      if (inputRef !== null) {
        config[inputRef?.name] = inputRef.value
      }
    }

    config["namespace"] = `${currentOrganization?.id}`

    const payload = {
      name: datasourceType.name,
      config: config,
    }

    setConnectLoading(true)
    try {
      const res = await api.post(
        `/data-sources?organization_id=${currentOrganization?.id}`,
        payload
      )
      // TODO : Validate res
      setShowConnectDialog(false)
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please check configuration and try again.",
      })
    } finally {
      setConnectLoading(false)
    }
  }

  function cancelConnect() {
    setConnectLoading(false)
    setShowConnectDialog(false)
  }

  return (
    <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
      <Button
        disabled={connectedDatasource !== undefined}
        variant={"default"}
        onClick={handleClick}
      >
        {connectedDatasource !== undefined ? (
          <Icons.check className="mr-2 h-4 w-4" />
        ) : (
          <Icons.plusSquare className="mr-2 h-4 w-4" />
        )}
        {connectedDatasource !== undefined ? "Connected" : "Connect"}
      </Button>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Connect New Datasource</DialogTitle>
          <DialogDescription>
            Add a token to use SDK or send API request
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            {configFields.map((config, idx) => {
              const inputElement =
                config.input_type === "textarea" ? (
                  <Textarea
                    ref={(el) => (inputRefs.current[idx] = el)}
                    onClick={() => {
                      inputRefs.current[idx]?.focus()
                    }}
                    id={config.name}
                    name={config.name}
                    placeholder={config.placeholder}
                  />
                ) : (
                  <Input
                    ref={(el) => (inputRefs.current[idx] = el)}
                    onClick={() => {
                      inputRefs.current[idx]?.focus()
                    }}
                    id={config.name}
                    name={config.name}
                    placeholder={config.placeholder}
                    type={config.input_type}
                  />
                )

              return (
                <div className="space-y-2">
                  <Label htmlFor="name">{config.label}</Label>
                  {inputElement}
                </div>
              )
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={cancelConnect}>
            Cancel
          </Button>
          <Button
            onClick={connectDatasource}
            disabled={connectLoading}
            type="submit"
          >
            {connectLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
