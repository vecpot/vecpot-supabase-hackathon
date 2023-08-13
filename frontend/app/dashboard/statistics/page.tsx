"use client"

import { useState } from "react"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useOrganization } from "../contexts/useUser"
import { CalendarDateRangePicker } from "./components/date-range-picker"
import { Overview } from "./components/overview"

function getFirstDayOfLastMonth() {
  var currentDate = new Date()
  var year = currentDate.getFullYear()
  var month = currentDate.getMonth()
  var firstDay = new Date(year, month - 1, 1)

  return firstDay
}

export default function StatisticsPage() {
  const { currentOrganization } = useOrganization()
  const [date, setDate] = useState<DateRange | undefined>({
    from: getFirstDayOfLastMonth(),
    to: addDays(getFirstDayOfLastMonth(), 30),
  })

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Statistics</h2>
        <Button variant="outline">Sync Now</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="mb-4">Loaded Documents</CardTitle>
            <CalendarDateRangePicker date={date} setDate={setDate} />
          </CardHeader>
          <CardContent className="pl-2">
            {currentOrganization && (
              <Overview
                organizationId={currentOrganization.id}
                dateRange={date}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploaded Documents</CardTitle>
          </CardHeader>
          {/* <CardContent className="pl-2">
            <DataTable columns={columns} data={data} isLoading={isLoading} />
            <div className="flex justify-end py-4">
              <Link href="/dashboard/history" passHref>
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardContent> */}
        </Card>
      </div>
    </div>
  )
}
