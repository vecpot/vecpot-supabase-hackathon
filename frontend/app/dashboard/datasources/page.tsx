"use client"

import { useEffect, useState } from "react"

import { ConnectedDatasource } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import { useOrganization } from "../contexts/useUser"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export default function TokensPage() {
  const { toast } = useToast()
  const [data, setData] = useState<ConnectedDatasource[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { currentOrganization } = useOrganization()

  useEffect(() => {
    if (!currentOrganization) return

    const { data_source } = currentOrganization
    if (data_source) {
      setData(data_source)
    }
  }, [currentOrganization])

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Connected Datasources
        </h2>
      </div>
      <Card>
        <CardContent className="pt-6">
          {data && (
            <DataTable
              columns={columns}
              pagination={false}
              data={data}
              isLoading={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
