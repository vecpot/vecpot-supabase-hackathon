import { NextResponse } from "next/server"

const UnAuthorized = () =>
  NextResponse.json(
    {
      message: "UnAuthorized",
    },
    {
      status: 401,
    }
  )

const BadRequest = () =>
  NextResponse.json(
    {
      message: "Bad Request",
    },
    {
      status: 400,
    }
  )

const InternalError = () =>
  NextResponse.json(
    {
      message: "Internal Server Error",
    },
    { status: 500 }
  )

const Success = () =>
  NextResponse.json(
    {
      message: "Success",
    },
    {
      status: 200,
    }
  )


export const Response = {
  UnAuthorized,
  BadRequest,
  InternalError,
  Success
}
