"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useUser } from "../contexts/useUser"

export default function ProfilePage() {
  const { user } = useUser()

  return (
    <div className="w-full">
      <div className="grid grid-cols-2">
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="Email"
                disabled={true}
                value={user?.email}
              />
              <Label htmlFor="email">User Name</Label>
              <Input
                type="name"
                placeholder="User Name"
                disabled={true}
                value={user?.name}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">
                Delete Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Your Account and related datas will be deleted permanently
              </p>
              <Button variant={"destructive"}>Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
