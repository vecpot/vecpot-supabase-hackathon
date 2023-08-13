import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/lib/database.types"

import { Response } from "../common"

export async function GET(request: Request) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  })
  const { data: session_data } = await supabase.auth.getSession()
  if (session_data.session === null) {
    return Response.UnAuthorized()
  }

  const { searchParams } = new URL(request.url)
  const organization_id = searchParams.get("organization_id")

  if (organization_id === null) return Response.BadRequest()

  const { data, error } = await supabase.from("data_source").select()

  if (error) {
    return Response.InternalError()
  }

  return NextResponse.json(data)
}
