export function getNotionAuthURL() {
  const client_id = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID ?? ""
  const redirect_uri = process.env.NEXT_PUBLIC_NOTION_REDIRECT_URI ?? ""

  return `https://api.notion.com/v1/oauth/authorize?client_id=${client_id}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}`
}
