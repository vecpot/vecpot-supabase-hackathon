import Link from "next/link"

import { DatasourceType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import DatasourceIcons from "@/components/DatasourceIcons"
import { Icons } from "@/components/icons"

import ConnectDatasource from "./ConnectDatasource"

interface DatasourceProps {
  type: DatasourceType
}

export default function Datasource({ type }: DatasourceProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DatasourceIcons sourceType={type.type} className="mr-2 h-6 w-6" />
            <span className="mr-2 font-bold">{type.displayName}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Icons.info />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 text-sm">{type.description}</p>
        <ConnectDatasource datasourceType={type} />
      </CardContent>
    </Card>
  )
}
