"use client"

import { createContext, useContext, useMemo, useState } from "react"

import { mapToOrganization, mapToUser } from "@/lib/mapper"
import { Organization, User } from "@/lib/types"
import { useSupabase } from "@/app/supabase-provider"

type UserContextType = {
  user?: User
  setUser: (user: User) => void
  initUser: () => void
  deleteTeamAccount: (organizationId: number) => void
  currentOrganization?: Organization
  refreshCurrentOrganization: () => void
  setCurrentOrganizationId: (id: number) => void
  deleteDatasource: (datasourceId: number) => void
}

export const UserContext = createContext<UserContextType>({
  setUser: () => {},
  initUser: () => {},
  deleteTeamAccount: () => {},
  refreshCurrentOrganization: () => {},
  setCurrentOrganizationId: () => {},
  deleteDatasource: () => {},
})

type UserContextProviderProps = {
  children: React.ReactNode
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const { supabase } = useSupabase()

  const [user, setUser] = useState<User>()
  const [currentOrganizationId, setCurrentOrganizationId] = useState<number>()

  // TODO : Add fallback
  const currentOrganization = useMemo(() => {
    if (!currentOrganizationId) return

    return user?.organizations.filter(
      (organization) => organization.id === currentOrganizationId
    )[0]
  }, [user, currentOrganizationId])

  async function initUser() {
    const { data: user_data } = await supabase.auth.getUser()
    const user_id = user_data.user?.id

    const { data: organizations_data } = await supabase
      .from("organization")
      .select(
        `
          id,
          title,
          type,
          user_organization!inner ( user_id ),
          data_source (id, type_id, config, last_indexed_at, created_at)
          `
      )
      .eq("user_organization.user_id", user_id)
      .eq("is_deleted", false)

    if (user_data.user && organizations_data) {
      const user = mapToUser(user_data.user)

      const organizations = organizations_data.map((organization) =>
        mapToOrganization(organization)
      )
      user.organizations = organizations

      setUser(user)

      // set current organization
      try {
        const _organizationId = localStorage.getItem("CURRENT_ORG")
        if (!_organizationId) throw Error()

        const organizationId = Number.parseInt(_organizationId)
        if (Number.isNaN(organizationId)) throw Error()

        setCurrentOrganizationId(organizationId)
      } catch (e) {
        setCurrentOrganizationId(organizations[0].id)
      }
    }
  }

  async function refreshCurrentOrganization() {
    if (!user) return

    const { data: organization_data } = await supabase
      .from("organization")
      .select(
        `
          id,
          title,
          type,
          user_organization!inner ( organization_id, user_id ),
          data_source (id, type_id, config, last_indexed_at, created_at)
          `
      )
      .eq("user_organization.organization_id", currentOrganizationId)
      .eq("is_deleted", false)
      .limit(1)
      .single()

    if (!organization_data) return

    let organizations = [...user.organizations]
    organizations = organizations.map((organization) => {
      if (organization.id === currentOrganizationId) {
        return {
          ...mapToOrganization(organization_data),
        }
      }
      return organization
    })

    setUser({
      ...user,
      organizations,
    })
  }

  function deleteTeamAccount(organizationId: number) {
    if (!user) return

    let isDeleted: boolean = false
    let organizations = [...user.organizations]
    organizations = organizations.filter((organization) => {
      if (organization.type === "TEAM" && organization.id === organizationId) {
        isDeleted = true
        return false
      }

      return true
    })

    if (isDeleted) {
      setCurrentOrganizationId(user.organizations[0].id)
    }

    setUser({
      ...user,
      organizations,
    })
  }

  function deleteDatasource(datasourceId: number) {
    if (!user) return
    let organizations = [...user.organizations]
    organizations = organizations.map((organization) => {
      if (organization.id === currentOrganizationId) {
        const datasources = organization.data_source.filter(
          (source) => source.id !== datasourceId
        )
        return {
          ...organization,
          data_source: datasources,
        }
      }

      return organization
    })

    setUser({
      ...user,
      organizations,
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        currentOrganization,
        setUser,
        initUser,
        deleteTeamAccount,
        refreshCurrentOrganization,
        setCurrentOrganizationId: (target) => {
          localStorage.setItem("CURRENT_ORG", JSON.stringify(target))
          setCurrentOrganizationId(target)
        },
        deleteDatasource,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const { user, initUser, setUser } = useContext(UserContext)

  return { user, initUser, setUser }
}

export function useOrganization() {
  const {
    currentOrganization,
    setCurrentOrganizationId,
    refreshCurrentOrganization,
    deleteDatasource,
    deleteTeamAccount,
  } = useContext(UserContext)

  return {
    currentOrganization,
    setCurrentOrganizationId,
    refreshCurrentOrganization,
    deleteDatasource,
    deleteTeamAccount,
  }
}
