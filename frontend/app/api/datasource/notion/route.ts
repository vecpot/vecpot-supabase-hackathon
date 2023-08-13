import { cookies, headers as requestHeaders } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import axios from "axios"

import { Database } from "@/lib/database.types"
import { api } from "@/app/dashboard/api"

import { getCacheKey, setCacheKey } from "../../cache"
import { Response } from "../../common"

const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID ?? ""
const clientSecret = process.env.NEXT_PUBLIC_NOTION_SECRET_ID ?? ""
const notionRedirectURL = process.env.NEXT_PUBLIC_NOTION_REDIRECT_URI ?? ""
const BASE64_ENCODED_ID_AND_SECRET = Buffer.from(
  `${clientId}:${clientSecret}`
).toString("base64")

export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers: requestHeaders,
    cookies,
  })
  const { data: session_data } = await supabase.auth.getSession()

  if (session_data.session === null) {
    return Response.UnAuthorized()
  }

  const req = await request.json()
  const { code, organization_id } = req

  if (!code || !organization_id) {
    return Response.BadRequest()
  }

  // check code
  if (getCacheKey(code)) return Response.Success()

  setCacheKey(code)

  // get notion access_token
  const data = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: notionRedirectURL,
  }

  const headers = {
    Authorization: `Basic ${BASE64_ENCODED_ID_AND_SECRET}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  }

  const res = await axios.post("https://api.notion.com/v1/oauth/token", data, {
    headers,
  })
  const { access_token } = res.data

  if (!access_token) {
    return Response.InternalError()
  }

  const payload = {
    name: "notion",
    config: {
      token: access_token,
      namespace: organization_id,
    },
  }

  let created_id = 0
  try {
    const res = await api.post("/data-sources", payload)
    created_id = res.data
  } catch (e) {
    return Response.InternalError()
  }

  return NextResponse.json(
    {
      id: created_id,
    },
    { status: 200 }
  )
}
