"use client"

import * as React from "react"
import { useState } from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { formatAvatarFallback } from "@/lib/format"
import { mapToGroup } from "@/lib/mapper"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

import { useOrganization, useUser } from "../contexts/useUser"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const { user, initUser } = useUser()
  const { currentOrganization, setCurrentOrganizationId } = useOrganization()

  async function createNewTeam() {
    if (!inputRef.current) return

    const teamName = inputRef.current.value
    setCreateLoading(true)
    await fetch("/api/organization", {
      method: "post",
      body: JSON.stringify({ title: teamName }),
    })
    await initUser()
    setCreateLoading(false)
    setShowNewTeamDialog(false)
  }

  return (
    <>
      {currentOrganization !== undefined ? (
        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                role="combobox"
                aria-expanded={open}
                aria-label="Select a team"
                className={cn("w-[200px] justify-between", className)}
              >
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${currentOrganization.title}.png`}
                    alt={currentOrganization.title}
                  />
                  <AvatarFallback>
                    {formatAvatarFallback(currentOrganization.title)}
                  </AvatarFallback>
                </Avatar>
                {currentOrganization.title}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search team..." />
                  <CommandEmpty>No team found.</CommandEmpty>
                  {mapToGroup(user?.organizations).map((group) => (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.organizations.map((organization) => (
                        <CommandItem
                          key={organization.id}
                          onSelect={() => {
                            setCurrentOrganizationId(organization.id)
                            setOpen(false)
                          }}
                          className="text-sm"
                        >
                          <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${organization.title}.png`}
                              alt={organization.title}
                            />
                            <AvatarFallback>
                              {formatAvatarFallback(organization.title)}
                            </AvatarFallback>
                          </Avatar>
                          {organization.title}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              currentOrganization &&
                                currentOrganization.id === organization.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
                <CommandSeparator />
                <CommandList>
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false)
                          setShowNewTeamDialog(true)
                        }}
                      >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Team
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create team</DialogTitle>
              <DialogDescription>
                Add a new team to manage products and customers.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team name</Label>
                  <Input ref={inputRef} id="name" placeholder="Acme Inc." />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewTeamDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={createNewTeam}
                disabled={createLoading}
              >
                {createLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Skeleton className="h-8 w-[150px]" />
      )}
    </>
  )
}
