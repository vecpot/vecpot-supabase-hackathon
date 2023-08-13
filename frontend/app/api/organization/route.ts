import { cookies, headers } from "next/headers"
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/lib/database.types"

import { Response } from "../common"

// TODO : Extract common logic
export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  })
  const { data: session_data } = await supabase.auth.getSession()

  if (session_data.session === null) {
    return Response.UnAuthorized()
  }

  const res = await request.json()
  const { title } = res

  if (!title) {
    return Response.BadRequest()
  }

  const { data: new_organization, error } = await supabase
    .from("organization")
    .insert({
      title,
      type: "TEAM",
    })
    .select()

  if (!new_organization && error) {
    return Response.InternalError()
  }
  await supabase.from("user_organization").insert({
    user_id: session_data.session.user.id,
    organization_id: new_organization[0].id,
  })

  return Response.Success()
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  })
  const { data: session_data } = await supabase.auth.getSession()

  const { searchParams } = new URL(request.url)
  const organization_id = searchParams.get("organization_id")

  if (organization_id === null) return Response.BadRequest()

  const { data: organization_user, error: organization_user_error } =
    await supabase
      .from("user_organization")
      .select()
      .eq("organization_id", organization_id)
      .select()

  if (organization_user_error) {
    return Response.InternalError()
  }

  if (organization_user[0].user_id !== session_data.session?.user.id) {
    return Response.UnAuthorized()
  }

  const { data, error } = await supabase
    .from("organization")
    .update({
      is_deleted: true,
    })
    .eq("id", organization_id)
    .select()

  if (error) {
    return Response.InternalError()
  }

  return Response.Success()
}
