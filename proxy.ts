import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function proxy(request: NextRequest) {
  void getSessionCookie(request)
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
