"use client"

import { useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

import { useOrganization, useUser } from "../contexts/useUser"
import DeleteTeamAccount from "./components/DeleteTeamAccount"

export default function SettingsPage() {
  const { user } = useUser()
  const { currentOrganization } = useOrganization()

  const getTableRow = useCallback(() => {
    if (user === undefined) {
      return (
        <TableRow>
          <TableCell className="h-24 w-full text-center">
            <div className="flex items-center justify-center">
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          </TableCell>
        </TableRow>
      )
    }

    return (
      <TableRow>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell>Admin</TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
    )
  }, [user])

  return (
    <div className="w-full">
      <div className="grid grid-cols-2">
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="email">Account Title</Label>
              <Input disabled={true} value={currentOrganization?.title} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Members</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button disabled={true} variant="outline">
                      Invite User
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to library</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{getTableRow()}</TableBody>
              </Table>
            </CardContent>
          </Card>
          {currentOrganization?.type === "TEAM" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                  Delete Team Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Your Account and related datas will be deleted permanently
                </p>
                <DeleteTeamAccount />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
