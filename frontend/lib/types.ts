export const DATASOURCE_TYPES: DatasourceType[] = [
  {
    type: "NOTION",
    name: "notion",
    description: "Install VecPot Slack app and search instantly with slack.",
    displayName: "Notion",
    configFields: `[{"name": "token", "input_type": "password", "label": "Notion Integration Token", "placeholder": "secret_AZefAeAZqsfDAZE"}]`,
  },
  {
    type: "GOOGLE_DRIVE",
    name: "google_drive",
    description: "Install VecPot Slack app and search instantly with slack.",
    displayName: "Google Drive",
    configFields: `[{"name": "json_str", "input_type": "textarea", "label": "JSON file content", "placeholder": "JSON file content"}]`,
  },
  {
    type: "JIRA_CLOUD",
    name: "jira_cloud",
    description: "Install VecPot Slack app and search instantly with slack.",
    displayName: "Jira Cloud",
    configFields: `[{"name": "url", "input_type": "text", "label": "Jira Cloud URL", "placeholder": "https://example.jira.com"}, {"name": "token", "input_type": "password", "label": "Personal API Token", "placeholder": "Personal API Token"}, {"name": "username", "input_type": "text", "label": "Username", "placeholder": "example.user@email.com"}]`,
  },
  {
    type: "CONFLUENCE_CLOUD",
    name: "confluence_cloud",
    description: "Install VecPot Slack app and search instantly with slack.",
    displayName: "Confluence Cloud",
    configFields: `[{"name": "url", "input_type": "text", "label": "Confluence URL", "placeholder": "https://example.confluence.com"}, {"name": "token", "input_type": "password", "label": "Personal API Token", "placeholder": "Personal API Token"}, {"name": "username", "input_type": "text", "label": "Username", "placeholder": "example.user@email.com"}]`,
  },
  {
    type: "SLACK",
    name: "slack",
    description: "Install VecPot Slack app and search instantly with slack.",
    displayName: "Slack",
    configFields: `[{"name": "token", "input_type": "text", "label": "Bot User OAuth Token", "placeholder": "Bot User OAuth Token"}]`,
  },
]

export type SupportedDatasourceType =
  | "NOTION"
  | "SLACK"
  | "GOOGLE_DRIVE"
  | "JIRA_CLOUD"
  | "CONFLUENCE_CLOUD"

export type User = {
  id: string
  email: string
  name: string
  organizations: Organization[]
}

export type Organization = {
  id: number
  title: string
  type: "PERSONAL" | "TEAM"
  data_source: ConnectedDatasource[]
}

export type DatasourceType = {
  type: SupportedDatasourceType
  name: string
  description: string
  displayName: string
  configFields: string
}

export type DatasourceTypeConfigField = {
  name: string
  input_type: string
  label: string
  placeholder: string
}

export type ConnectedDatasource = {
  id: number
  source_type: SupportedDatasourceType
  config: string
  last_indexed_at: string
  created_at: string
}
