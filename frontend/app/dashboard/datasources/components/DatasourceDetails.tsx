import { useEffect, useState } from "react"

import {
  DATASOURCE_TYPES,
  DatasourceTypeConfigField,
  SupportedDatasourceType,
} from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

interface DatasourceDetailsProps {
  config: string
  sourceType: SupportedDatasourceType
}

export function DatasourceDetails({
  config,
  sourceType,
}: DatasourceDetailsProps) {
  const [configFields, setConfigFields] =
    useState<DatasourceTypeConfigField[]>()
  const connectedConfig = JSON.parse(config)

  useEffect(() => {
    const matchedType = DATASOURCE_TYPES.filter(
      (TYPE) => TYPE.type === sourceType
    )[0]

    if (matchedType) {
      setConfigFields(
        JSON.parse(matchedType.configFields) as DatasourceTypeConfigField[]
      )
    }
  }, [sourceType])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Connection Details</SheetTitle>
          <SheetDescription>
            Credentials for data source connection.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {configFields?.map((config) => {
            const inputElement =
              config.input_type === "textarea" ? (
                <Textarea
                  readOnly
                  value={connectedConfig[config.name]}
                  disabled={true}
                  id={config.name}
                  name={config.name}
                  placeholder={config.placeholder}
                />
              ) : (
                <Input
                  readOnly
                  value={connectedConfig[config.name]}
                  disabled={true}
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
        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
