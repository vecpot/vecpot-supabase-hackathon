"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Icons } from "@/components/icons"

type ChartData = {
  date: string
  document_count: number
}

interface OverviewProps {
  organizationId: number | undefined
  dateRange: DateRange | undefined
}

export function Overview({ organizationId, dateRange }: OverviewProps) {
  const [isLoading, setIsLoading] = useState<boolean>()
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        if (!organizationId || !dateRange || !dateRange.from || !dateRange.to)
          throw Error()

        const start_date = format(dateRange.from, "yyyy-MM-dd")
        const end_date = format(dateRange.to, "yyyy-MM-dd")
        const res = await fetch(
          `/api/datasource/stats?organization_id=${organizationId}&start_date=${start_date}&end_date=${end_date}`
        )
        const data = await res.json()
        setData(data)
      } catch (e) {
      } finally {
        setIsLoading(false)
      }
    }

    if (organizationId) fetchData()
  }, [dateRange, organizationId])

  const ChartResult = useMemo(() => {
    if (data.length > 0) {
      return (
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar dataKey="document_count" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      )
    }

    return (
      <div className="flex items-center justify-center h-100 text-sm p-6">
        No results.
      </div>
    )
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={550}>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
        </div>
      ) : (
        ChartResult
      )}
    </ResponsiveContainer>
  )
}
