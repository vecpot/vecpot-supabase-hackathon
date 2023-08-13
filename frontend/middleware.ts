import { NextResponse, URLPattern, type NextRequest } from "next/server"
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

const PROTECTED_ROUTES = [new URLPattern({ pathname: "/dashboard/*" })]

function isProtectedRoutes(url: string) {
  for (const route of PROTECTED_ROUTES) {
    if (route.test(url)) {
      return true
    }
  }
  return false
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res })
  const { data: session_data } = await supabase.auth.getSession()

  if (req.nextUrl.pathname === "/") {
    if (session_data.session === null) {
      return NextResponse.redirect(new URL("/authentication", req.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  if (session_data.session === null && isProtectedRoutes(req.url)) {
    return NextResponse.redirect(new URL("/authentication", req.url))
  }

  return res
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
