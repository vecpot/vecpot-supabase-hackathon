import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/lib/database.types"

import { Response } from "../../common"

function isValidDateFormat(dateString: string): boolean {
  var dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/

  if (dateFormatRegex.test(dateString)) {
    var year = parseInt(dateString.substring(0, 4))
    var month = parseInt(dateString.substring(5, 7))
    var day = parseInt(dateString.substring(8, 10))

    if (
      year >= 1000 &&
      year <= 9999 &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      return true
    }
  }

  return false
}

// TODO : Add permission check
export async function GET(request: Request) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { searchParams } = new URL(request.url)
  const organization_id = searchParams.get("organization_id")
  const start_date = searchParams.get("start_date")
  const end_date = searchParams.get("end_date")

  if (organization_id === null || start_date === null || end_date === null)
    return Response.BadRequest()

  const target_organization_id = Number.parseInt(organization_id)

  if (Number.isNaN(target_organization_id)) return Response.BadRequest()

  if (!isValidDateFormat(start_date) || !isValidDateFormat(end_date))
    return Response.BadRequest()

  const { data, error } = await supabase.rpc("get_document_count_by_day", {
    target_organization_id,
    start_date,
    end_date,
  })

  if (error) {
    return Response.InternalError()
  }

  return NextResponse.json(data)
}
