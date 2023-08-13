"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { formatDistance } from "date-fns"

import { DATASOURCE_TYPES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

import { useSupabase } from "../supabase-provider"
import Datasource from "./components/Datasource"
import { SearchBar } from "./components/SearchBar"
import { useOrganization } from "./contexts/useUser"

interface DocumentStats {
  total_documents: number
  documents_added_today: number
}

interface DatasourceStats {
  total_datasources: number
  last_indexed_at?: string
}

// TODO : Check below
export const revalidate = 0

export default function DashboardPage() {
  const { supabase } = useSupabase()
  const { currentOrganization } = useOrganization()
  const [documentStats, setDocumentStats] = useState<DocumentStats>()
  const [datasourceStats, setDatasourceStats] = useState<DatasourceStats>()

  useEffect(() => {
    async function fetchStats() {
      if (currentOrganization?.id) {
        const { data, error } = await supabase.rpc("get_document_stats", {
          target_organization_id: currentOrganization.id,
        })

        if (data?.length && !error) {
          setDocumentStats(data[0] as DocumentStats)
        }
      }
    }
    fetchStats()
  }, [currentOrganization?.id, supabase])

  useEffect(() => {
    if (!currentOrganization) return

    setDatasourceStats({
      total_datasources: currentOrganization.data_source.length,
      last_indexed_at:
        currentOrganization.data_source.length > 0
          ? currentOrganization.data_source[0].last_indexed_at
          : undefined,
    })
  }, [currentOrganization])

  const DatasourceStats = useCallback(() => {
    if (datasourceStats) {
      if (datasourceStats.total_datasources === 0) {
        return (
          <>
            <div className="text-2xl font-bold">
              {datasourceStats.total_datasources.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Add datasource to get started
            </p>
          </>
        )
      } else {
        return (
          <>
            <div className="text-2xl font-bold">
              {datasourceStats.total_datasources.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {`Synced ${formatDistance(
                new Date(datasourceStats.last_indexed_at ?? Date.now()),
                Date.now()
              )} ago`}
            </p>
          </>
        )
      }
    }

    return <Skeleton className="h-12 w-full" />
  }, [datasourceStats])

  return (
    <div>
      {currentOrganization && currentOrganization?.data_source.length > 0 && (
        <div className="mb-8">
          <div className="my-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Start searching
            </h2>
          </div>
          <div className="my-4">
            <SearchBar type="large" />
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Datasources
            </CardTitle>
            <Link href="/dashboard/datasources" passHref>
              <Button variant="ghost" size="icon">
                <Icons.arrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>{DatasourceStats()}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loaded Documents
            </CardTitle>
            <Link href="/dashboard/statistics" passHref>
              <Button variant="ghost" size="icon">
                <Icons.arrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {documentStats ? (
              <>
                <div className="text-2xl font-bold">
                  {documentStats.total_documents.toLocaleString()}
                </div>
                <p className="text-muted-foreground text-xs">
                  +{documentStats.documents_added_today.toLocaleString()} today
                </p>
              </>
            ) : (
              <Skeleton className="h-12 w-full" />
            )}
          </CardContent>
        </Card>
      </div>
      <div className="my-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Getting Started
        </h2>
        <p className="text-muted-foreground text-sm">
          Connect your datasource.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DATASOURCE_TYPES.map((type) => (
          <Datasource type={type} />
        ))}
      </div>
    </div>
  )
}
