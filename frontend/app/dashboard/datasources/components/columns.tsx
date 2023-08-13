"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistance } from "date-fns"

import DatasourceIcons from "@/components/DatasourceIcons"
import { ConnectedDatasource, SupportedDatasourceType } from "@/lib/types"

import { DatasourceDetails } from "./DatasourceDetails"
import { DeleteDatasource } from "./DeleteDatasource"

export const columns: ColumnDef<ConnectedDatasource>[] = [
  {
    accessorKey: "source_type",
    header: "Source",
    cell: ({ row }) => {
      const name = row.getValue("source_type") as SupportedDatasourceType

      return (
        <div className="flex items-center">
          <DatasourceIcons sourceType={name} className="mr-2 h-6 w-6" />
          <span className="mr-2 font-bold">{name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "last_indexed_at",
    header: "Last Indexed At",
    cell: ({ row }) => {
      const last_indexed_at = row.getValue("last_indexed_at") as string

      return (
        <span>{`${formatDistance(new Date(last_indexed_at), Date.now())} ago`}</span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Connected At",
    cell: ({ row }) => {
      const created_at = row.getValue("created_at") as string

      return (
        <span>{`${formatDistance(new Date(created_at), Date.now())} ago`}</span>
      )
    },
  },
  {
    accessorKey: "config",
    header: "Details",
    cell: ({ row }) => {
      const config = row.getValue("config") as string
      const sourceType = row.getValue("source_type") as SupportedDatasourceType

      return <DatasourceDetails config={config} sourceType={sourceType} />
    },
  },
  {
    accessorKey: "id",
    header: "Disconnect",
    cell: ({ row }) => {
      const datasourceId = row.getValue("id") as number

      return <DeleteDatasource id={datasourceId} />
    },
  },
]
