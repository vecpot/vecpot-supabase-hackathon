import { User as SupabaseUser } from "@supabase/auth-helpers-nextjs"

import { Database } from "./database.types"
import {
  ConnectedDatasource,
  Organization,
  SupportedDatasourceType,
  User,
} from "./types"

type FetchedOrganizationType =
  Database["public"]["Tables"]["organization"]["Row"]
type FetchedDatasourceType = Database["public"]["Tables"]["data_source"]["Row"]

export function mapToOrganization(target: { [x: string]: any }): Organization {
  const _organization = target as FetchedOrganizationType & {
    data_source: FetchedDatasourceType[]
  }
  const organization: Organization = {
    id: _organization.id,
    title: _organization.title,
    type: _organization.type ?? "PERSONAL",
    data_source: _organization.data_source
      .map((source) => mapToConnectedDatasource(source))
      .filter((source) => source !== null) as ConnectedDatasource[],
  }
  return organization
}

export function mapDatasourceTypeId(
  type_id: number | null
): SupportedDatasourceType | null {
  if (type_id) {
    switch (type_id) {
      case 1:
        return "NOTION"
      case 3:
        return "GOOGLE_DRIVE"
      case 4:
        return "SLACK"
      case 6:
        return "CONFLUENCE_CLOUD"
      case 9:
        return "JIRA_CLOUD"
    }
  }

  return null
}

export function mapToConnectedDatasource(
  target: FetchedDatasourceType
): ConnectedDatasource | null {
  const source_type = mapDatasourceTypeId(target.type_id)
  const { id, last_indexed_at, created_at, config } = target
  if (source_type && last_indexed_at && created_at && config) {
    return {
      id,
      source_type,
      config,
      last_indexed_at,
      created_at,
    }
  }

  return null
}

export function mapToUser(_user: SupabaseUser): User {
  const user: User = {
    id: _user.id,
    email: _user.email ?? "",
    name: _user.user_metadata.name,
    organizations: [],
  }
  return user
}

type Group = {
  label: string
  organizations: Organization[]
}

type Groups = Group[]

export function mapToGroup(organizations: Organization[] | undefined): Groups {
  if (organizations === undefined) return []

  const personal: Group = {
    label: "Personal Account",
    organizations: [],
  }

  const team: Group = {
    label: "Teams",
    organizations: [],
  }

  for (const organization of organizations) {
    const { type } = organization

    if (type === "PERSONAL") {
      personal.organizations.push(organization)
    } else if (type === "TEAM") {
      team.organizations.push(organization)
    }
  }

  return [personal, team]
}
